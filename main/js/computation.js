function createVariables_computation(){
  coordinates_x = []; coordinates_y = [];
  velocities_x = []; velocities_y = [];

  num = 60; density = 40; particles_age = [];
  particles_pos_x = []; particles_pos_y = [];
  particles_vel_x = []; particles_vel_y = [];

  xScale = null; yScale = null;
  xMap = null; yMap = null;
  xRange = 10; yRange = 10;
}

// ************************************************************************************** //

function createCoordinates(){
  xScale = d3.scaleLinear().domain([-xRange, xRange]).range([0, canvas_width]);
  yScale = d3.scaleLinear().domain([-yRange, yRange]).range([0, canvas_height]);

  var temp_num = 2*density*xRange;
  temp_x_scale = d3.scaleLinear().domain([0, temp_num-1]).range([-xRange, xRange]);
  coordinates_x = d3.range(temp_num*temp_num).map((d, i) => { return temp_x_scale(i%temp_num) });

  var temp_num = 2*density*yRange;
  temp_y_scale = d3.scaleLinear().domain([0, temp_num-1]).range([yRange, -yRange]);
  coordinates_y = d3.range(temp_num*temp_num).map((d, i) => { return temp_y_scale(parseInt(i/temp_num)) });

  coordinate_to_array_index_in_x = d3.scaleLinear().domain([-xRange, xRange]).range([0, temp_num-1]);
  coordinate_to_array_index_in_y = d3.scaleLinear().domain([yRange, -yRange]).range([0, temp_num-1]);

  particles_age = d3.range(num*num);
  particles_age = particles_age.map(d => { return math.randomInt(100) });
  particles_pos_x = particles_age.map(d => { return math.random(-xRange, xRange) });
  particles_pos_y = particles_age.map(d => { return math.random(-yRange, yRange) });
}

// ************************************************************************************** //

function createVelocityArray(){
  var x = coordinates_x;
  var y = coordinates_y;

  velocities_x = eval(xFunc_parsed);
  velocities_y = eval(yFunc_parsed);

  x = velocities_x; y = velocities_y;

  var temp_x = parsing(xFunc), temp_y = parsing(yFunc);
  var func = 'numeric.sqrt( numeric.add(numeric.pow(' +temp_x+ ',2), numeric.pow(' +temp_y+ ',2)) )';
  var data_array = eval(func);
}

function calculateParticleVelocities(){
  var x = particles_pos_x;
  var y = particles_pos_y;

  particles_vel_x = eval(xFunc_parsed);
  particles_vel_y = eval(yFunc_parsed);
}

// ************************************************************************************** //
