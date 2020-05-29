function createVariables_visual(){
  canvas = d3.select("#canvas_1");
  canvas_width = parseInt(canvas.attr('width'));
  canvas_height = parseInt(canvas.attr('height'));
  ctx = canvas.node().getContext("2d");
  svg = d3.select("svg");

  image = ctx.createImageData(canvas_width, canvas_height);

  clr = d3.rgb(35, 35, 145);
  bkg_opacity = 0.05;
  bkg_clr = "rgb(" +clr.r+ ", " +clr.g+ ", " +clr.b+ ")";
  bkg_clr_with_opacity = "rgba(" +clr.r+ ", " +clr.g+ ", " +clr.b+ "," +bkg_opacity+ ")";
  stroke_clr = "rgb(255, 255, 255)";
  lineWidth = 1;

  dt = 0.005;
  fps = 15; time_btwn_frames = 1000/fps;
  max_age = 200;
  timer = null;
  velocity_scale = 3;
}

// ************************************************************************************** //

function resetCanvas(){
  canvas.styles({ 'background': bkg_clr });
  ctx.fillStyle = bkg_clr;
  ctx.fillRect(0, 0, canvas_width, canvas_height);

  ctx.fillStyle = bkg_clr_with_opacity; // for fading curves
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke_clr;

  d3.select('#tex_code').html("\\( V = " +xFunc_display+ " \\widehat{i} + " +yFunc_display+ " \\widehat{j} \\)");
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  // createVelocityArray();

  if(timer){ timer.stop(); }
  timer = d3.interval(draw, time_btwn_frames);

  createHeatmap();
}

// ************************************************************************************** //

function draw(){
  if(animation){
    ctx.fillRect(0, 0, canvas_width, canvas_height);

    calculateParticleVelocities();
    temp_next_step_position_x = numeric.add(particles_pos_x, numeric.mul(particles_vel_x, velocity_scale*dt));
    temp_next_step_position_y = numeric.add(particles_pos_y, numeric.mul(particles_vel_y, velocity_scale*dt));
    particles_age.forEach((d,i) => {
      particles_age[i]++;

      ctx.beginPath();
      ctx.moveTo(xScale(particles_pos_x[i]), yScale(particles_pos_y[i]));
      ctx.lineTo(xScale(temp_next_step_position_x[i]), yScale(temp_next_step_position_y[i]));
      ctx.stroke();

      if(temp_next_step_position_x[i] > xRange || temp_next_step_position_x[i] < -xRange || temp_next_step_position_y[i] > yRange || temp_next_step_position_y[i] < -yRange || particles_age[i] > max_age){
        temp_next_step_position_x[i] = math.random(-xRange, xRange);
        temp_next_step_position_y[i] = math.random(-yRange, yRange);
        particles_age[i] = math.randomInt(100);
      }
    })

    particles_pos_x = temp_next_step_position_x;
    particles_pos_y = temp_next_step_position_y;
  }
}

// ************************************************************************************** //

function createHeatmap(){
  var color = d3.scaleLinear().range([d3.rgb(255,255,255,0), d3.rgb(0,255,0, 0.5)]);

  var temp_num = canvas_width;
  var data_array = d3.range(temp_num*temp_num).map(d => { return 0; });
  var x = data_array.map((d, i) => { return xScale.invert(parseInt(i%temp_num)) });
  var y = data_array.map((d, i) => { return yScale.invert(parseInt(i/temp_num)) });

  if(backgroundEncoding == 'mag'){
    var temp_x = parsing(xFunc), temp_y = parsing(yFunc);
    var func = 'numeric.sqrt( numeric.add(numeric.pow(' +temp_x+ ',2), numeric.pow(' +temp_y+ ',2)) )';
    data_array = eval(func);
  }

  if(backgroundEncoding == 'div'){
    var func = math.derivative( xFunc, 'x' ).toString() +'+'+  math.derivative( yFunc, 'y' ).toString();
    data_array = eval(parsing(func));
  }

  if(backgroundEncoding == 'curl'){
    var func = math.derivative( xFunc, 'y' ).toString() +'-'+  math.derivative( yFunc, 'x' ).toString();
    data_array = eval(parsing(func));
  }

  // Check if data_array is an array or not
  if(typeof(data_array) == 'number'){
    var num = data_array;
    data_array = d3.range(temp_num*temp_num).map(d => { return num; });
  }

  var temp_range = d3.extent(data_array);
  color.domain(temp_range);

  if(temp_range[0] == temp_range[1]){
    color.range([ d3.rgb(255,255,255,0), d3.rgb(255,255,255,0) ]);
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

  createColorScale(data_array);
}

// ************************************************************************************** //

function createColorScale(data_array){
  var data_extent = d3.extent(data_array);
  d3.selectAll('#scale_g').remove();
  if(backgroundEncoding == 'none'){ return };

  // Background rectangle
  var scale_g = d3.select('svg').append('g').attrs({ id: 'scale_g', transform: 'translate(' +750+ ',' +10+ ')' });
  scale_g.append('rect').attrs({ width: 200, height: 100 }).styles({ 'fill': 'white', 'stroke': 'black', 'opacity': 1 });

  // Heading
  scale_g.append('text').attrs({ x: 100, y: 20 }).styles({ 'dominant-baseline': 'middle', 'text-anchor': 'middle' }).text('Color Scale');

  // Adding Background Blue bar
  var scale_width = 150;
  var scale_start_g = scale_g.append('g').attrs({ 'transform': 'translate(' +25+ ',' +40+ ')' });
  scale_start_g.append('rect').attrs({ width: scale_width, height: 10 }).styles({ 'fill': d3.rgb(35, 35, 145) });

  // Adding the color gradient over the blue bar
  var num_divisions = 80, dl = scale_width/num_divisions;
  var coordinate_to_color_scale = d3.scaleLinear().domain([0, num_divisions-1]).range([d3.rgb(255,255,255,0), d3.rgb(0,255,0, 0.5)]);
  if(data_extent[0] == data_extent[1]){ coordinate_to_color_scale.range([ d3.rgb(255,255,255,0), d3.rgb(255,255,255,0) ]); }
  for(var i = 0; i < num_divisions; i++){
    scale_start_g.append('rect').attrs({ x: i*dl, y: 0, width: dl, height: 10 }).styles({ fill: coordinate_to_color_scale(i), stroke: 'none' });
  }

  // Adding the extreme values
  scale_start_g.append('text').attrs({ x: 0, y: 25 }).styles({ 'dominant-baseline': 'middle', 'text-anchor': 'middle' }).text(  parseFloat(data_extent[0].toFixed(1)) );
  scale_start_g.append('text').attrs({ x: scale_width, y: 25 }).styles({ 'dominant-baseline': 'middle', 'text-anchor': 'middle' }).text( parseFloat(data_extent[1].toFixed(1)) );
}
