var canvas = d3.select("#canvas_1"),
    canvas_width = parseInt(canvas.attr('width')),
    canvas_height = parseInt(canvas.attr('height')),
    ctx = canvas.node().getContext("2d"),
    mode = 1;

var image = ctx.createImageData(canvas_width, canvas_height);

var num = 60, particles = null,
    dt = 0.005, time_btwn_frames = 1000/15, // 15 fps
    max_age = 100, timer = null,
    velocity_scale = 5;

var clr = d3.rgb(35, 35, 145),
    bkg_opacity = 0.1,
    bkg_clr = "rgb(" +clr.r+ ", " +clr.g+ ", " +clr.b+ ")",
    bkg_clr_with_opacity = "rgba(" +clr.r+ ", " +clr.g+ ", " +clr.b+ "," +bkg_opacity+ ")",
    stroke_clr = "rgb(255, 255, 255)",
    lineWidth = 0.6;

var x_len = null, y_len = null,
    xMap = null, yMap = null,
    xScale = null, yScale = null;

/***********************************************************************************************/

function reset(){
  parseFunction();

  xScale = d3.scaleLinear().domain([-xRange, xRange]).range([0, x_len]);
  yScale = d3.scaleLinear().domain([-yRange, yRange]).range([0, y_len]);

  xMap = d3.scaleLinear().domain([-xRange, xRange]).range([0, canvas_width]);
  yMap = d3.scaleLinear().domain([yRange, -yRange]).range([0, canvas_height]);

  particles = d3.range(num*num);
  particles = particles.map(d => { return math.randomInt(100) });
  x = particles.map(d => { return math.random(-xRange, xRange) });
  y = particles.map(d => { return math.random(-yRange, yRange) });

  canvas.styles({ 'background': bkg_clr });
  ctx.fillStyle = bkg_clr;
  ctx.fillRect(0, 0, canvas_width, canvas_height);

  ctx.fillStyle = bkg_clr_with_opacity; // for fading curves
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke_clr;

  d3.select('#tex_code').html("\\( V = " +xFunc_display+ " \\widehat{i} + " +yFunc_display+ " \\widehat{j} \\)");
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  heatmap();
  if(timer){ timer.stop(); }
  timer = d3.interval(draw, time_btwn_frames); // timer.stop() // timer.restart(draw, time_btwn_frames)
};
reset();

/***********************************************************************************************/

function draw(){
  ctx.fillRect(0, 0, canvas_width, canvas_height);
  getVelocity();

  particles.forEach((d,i) => {
    particles[i]++;

    ctx.beginPath();
    ctx.moveTo(xMap(x[i]), yMap(y[i]));
    x[i] += velocity_scale*vel_x[i]*dt;
    y[i] += velocity_scale*vel_y[i]*dt;
    ctx.lineTo(xMap(x[i]), yMap(y[i]));
    ctx.stroke();

    if(x[i] > xRange || x[i] < -xRange || y[i] > yRange || y[i] < -yRange || particles[i] > max_age){
      x[i] = math.random(-xRange, xRange);
      y[i] = math.random(-yRange, yRange);
      particles[i] = math.randomInt(100);
    }
  })
};

/***********************************************************************************************/

function heatmap(){
  var color = d3.scaleLinear().range([d3.rgb(255,255,255,0.1), d3.rgb(0,255,0, 0.5)]);

  var temp_num = canvas_width;
  var data_array = new d3.range(temp_num*temp_num);
  var x = data_array.map(d => { return xMap.invert(parseInt(d%temp_num)) });
  var y = data_array.map(d => { return yMap.invert(parseInt(d/temp_num)) });
  var func = math.derivative( xFunc, 'y' ).toString() +'-'+  math.derivative( yFunc, 'x' ).toString();
  data_array = eval(parsing(func));

  color.domain([0, d3.max(data_array)]);
  if(data_array.length == undefined){
    color.domain([0, data_array]).range([d3.rgb(255,255,255,0.1), d3.rgb(0,200,0, 0.4)]);
    data_array = x.map(d => { return data_array });
  }

  var k = 0, l = 0;
  for (var j = 0; j < canvas_height; ++j) {
    for (var i = 0; i < canvas_width; ++i) {
      var c = d3.rgb(color(data_array[k]));
      image.data[l + 0] = c.r;
      image.data[l + 1] = c.g;
      image.data[l + 2] = c.b;
      image.data[l + 3] = c.opacity*255;
      ++k; l += 4;
    }
  }

  d3.select("#canvas_2").node().getContext('2d').putImageData(image, 0, 0);
}
