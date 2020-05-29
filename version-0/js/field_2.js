var canvas = d3.select("canvas"),
    canvas_width = parseInt(canvas.attr('width')),
    canvas_height = parseInt(canvas.attr('height')),
    ctx = canvas.node().getContext("2d"),
    svg = d3.select("svg"),
    mode = 2;

var num = 60, particles = null,
    dt = 0.005, time_btwn_frames = 1000/15, // 15 fps
    max_age = 100, timer = null,
    velocity_scale = 2;

// var clr = d3.rgb(35, 35, 145),
var clr = d3.rgb(255, 255, 255),
    bkg_opacity = 0,
    bkg_clr = "rgb(" +clr.r+ ", " +clr.g+ ", " +clr.b+ ")",
    bkg_clr_with_opacity = "rgba(" +clr.r+ ", " +clr.g+ ", " +clr.b+ "," +bkg_opacity+ ")",
    stroke_clr = "rgb(255, 255, 255)",
    lineWidth = 3;

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

  particles = []; x = []; y = [];

  canvas.styles({ 'background': bkg_clr });
  ctx.fillStyle = bkg_clr_with_opacity;
  ctx.fillRect(0, 0, canvas_width, canvas_height);

  ctx.fillStyle = bkg_clr_with_opacity; // for fading curves
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke_clr;

  d3.select('#tex_code').html("\\( V = " +xFunc_display+ " \\widehat{i} + " +yFunc_display+ " \\widehat{j} \\)").styles({ "color": "black" });
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  if(timer){ timer.stop(); }
  timer = d3.interval(draw, time_btwn_frames); // timer.stop() // timer.restart(draw, time_btwn_frames)

  drawVectors();
};
reset();

svg.on("click", function(){
  x.push( xMap.invert( d3.event.offsetX ) );
  y.push( yMap.invert( d3.event.offsetY ) );
  // particles.push( "rgb(" +math.randomInt(255)+ "," +math.randomInt(255)+ "," +math.randomInt(255)+ ")" );
  particles.push( d3.schemeCategory10[ math.randomInt(10) ] )
})

/***********************************************************************************************/

function draw(){
  ctx.fillRect(0, 0, canvas_width, canvas_height);
  getVelocity();

  x.forEach((d,i) => {
    ctx.beginPath();
    ctx.strokeStyle = particles[i];
    ctx.moveTo(xMap(x[i]), yMap(y[i]));
    x[i] += velocity_scale*vel_x[i]*dt;
    y[i] += velocity_scale*vel_y[i]*dt;
    ctx.lineTo(xMap(x[i]), yMap(y[i]));
    ctx.stroke();
  })
};

/***********************************************************************************************/

function setupSVG(){
  svg.styles({ opacity: 0.3 })
  var g = svg.append("g").attrs({ "transform": "translate(" +0.5*canvas_width+ "," +0.5*canvas_height+ ")" }).styles({ "fill": "white", "stroke": "white" });
  g.append("g").call( d3.axisBottom( d3.scaleLinear().domain([-xRange, xRange]).range([-0.5*canvas_width, 0.5*canvas_width]) ) );
  g.append("g").call( d3.axisLeft( d3.scaleLinear().domain([yRange, -yRange]).range([-0.5*canvas_height, 0.5*canvas_height]) ) );
  g.selectAll("line").styles({ "stroke": "gray" });
  g.selectAll(".domain").styles({ "stroke": "gray" });
  var temp_attr = { 'data-toggle': "popover", 'data-html': true, 'title': 'Hint <a href="#" class="close" data-dismiss="alert">&times;</a>', 'data-content': "Click on the canvas to create particles." };
  g.append("circle").attrs({cx: 0, cy: 0, r: 0, id: "popover"}).attrs(temp_attr);

  var defs = svg.append("defs");
  defs.append("marker").attrs({ id: "arrow", viewBox: "0 -5 10 10", refX: 5, refY: 0, markerWidth: 4, markerHeight: 4, orient: "auto" })
      .append("path").attrs({ d: 'M 0,-5 L 10,0 L 0,5' }).styles({ "fill": "blue", "stroke": "none" });
      // .append("path").attrs({ d: 'M 0,-5 L 10,0 L 0,5' }).styles({ "fill": "white", "stroke": "none" });
}

/***********************************************************************************************/

function drawVectors(){
  var n = 30;
  var tempScale_x = d3.scaleLinear().domain([0, n]).range([-xRange, xRange]);
  var tempScale_y = d3.scaleLinear().domain([0, n]).range([yRange, -yRange]);
  var x = d3.range(n*n).map((d,i) => { return tempScale_x(Math.round(i%n)) });
  var y = d3.range(n*n).map((d,i) => { return tempScale_y(Math.floor(i/n)) });
  var vel_x = eval(xFunc_parsed);
  var vel_y = eval(yFunc_parsed);
  var vel_r = numeric.sqrt( numeric.add(numeric.pow(vel_x, 2), numeric.pow(vel_y, 2)) );
  var vel_angle = numeric.atan( vel_y, vel_x );
  var lenScale = d3.scaleLinear().domain([0,math.max(vel_r)]).range([0,canvas_width/(n-1)]);

  d3.selectAll(".vector").remove();
  for(var i = 0; i < vel_x.length; i++){
    svg.append("line")
      .attrs({ class: "vector", 'marker-end': "url(#arrow)", x1: xMap(x[i]), y1: yMap(y[i]), x2: xMap(x[i])+lenScale(vel_x[i]), y2: yMap(y[i])-lenScale(vel_y[i]) })
      .styles({ "stroke": "steelblue", "stroke-width": 2 });
  }
}
