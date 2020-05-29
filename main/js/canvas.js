function createVariables_canvas(){
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
