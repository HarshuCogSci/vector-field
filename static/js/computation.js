var xFunc = 'sin(y)', yFunc = 'sin(x)',
    xFunc_display = xFunc, yFunc_display = yFunc,
    xFunc_parsed = null, yFunc_parsed = null,
    xRange = 10, yRange = 10, density = 40;

var x_particles = null, y_particles = null,
    x = null, y = null,
    vel_x = null, vel_y = null;

var presets = [
  { name: 'Default Preset', x: 'sin(y)', y: 'sin(x)' },
  { name: 'Butterfly', x: 'sin(x)', y: 'sin(y)' },
  { name: 'Spiral', x: '-y+x', y: 'x+y' },
  { name: 'Meandering Rivers', x: '-sin(y)+1', y: 'sin(x)' },
  { name: 'Parabolas', x: 'x', y: 'x^2' },
  { name: 'Rotation', x: '-y', y: 'x' },
  { name: 'Source', x: 'x', y: 'y' },
]

/***********************************************************************************************/

function parseFunction(){
  xFunc_display = xFunc; yFunc_display = yFunc;
  xFunc_parsed = parsing(xFunc); yFunc_parsed = parsing(yFunc);
}

function getVelocity(){
  vel_x = eval(xFunc_parsed); vel_y = eval(yFunc_parsed);
}

/***********************************************************************************************/

function compute_data_arrays(){
  xFunc_display = xFunc; yFunc_display = yFunc;

  x_particles = d3.range(2*xRange*density+1).map((d,i) => { return -xRange + (i/density) }),
  y_particles = d3.range(2*yRange*density+1).map((d,i) => { return -yRange + (i/density) }),
  x = x_particles.map((dx,i) => { return y_particles.map((dy,j) => { return dx }) }),
  y = x_particles.map((dx,i) => { return y_particles.map((dy,j) => { return dy }) });

  vel_x = eval(parsing(xFunc));
  vel_y = eval(parsing(yFunc));
}

/***********************************************************************************************/

function parsing(str){
  var temp_obj = math.parse(str);
  var command = recursion(temp_obj);
  return command
}

function recursion(obj){
  if(obj.content != undefined){ return '(' +recursion(obj.content)+ ')' };
  if(obj.fn == undefined){ return obj.value != undefined ? obj.value : obj.name }
  if(obj.fn.name == 'sin'){ return 'numeric.sin(' +obj.args[0].name+ ')' } // math.sin
  if(obj.fn.name == 'cos'){ return 'numeric.cos(' +obj.args[0].name+ ')' } // math.cos
  if(obj.fn.name == 'tan'){ return 'numeric.tan(' +obj.args[0].name+ ')' } // math.tan
  if(obj.fn != undefined){

    if(obj.fn == 'multiply'){ return 'numeric.mul(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.mutiply
    if(obj.fn == 'add'){ return 'numeric.add(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add
    if(obj.fn == 'divide'){ return 'numeric.div(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add
    if(obj.fn == 'subtract'){ return 'numeric.sub(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add
    if(obj.fn == "unaryMinus"){ if(obj.args[0].valueType == "number"){ return (-1*parseFloat(obj.args[0].value)) } else { return 'numeric.mul(-1,' +obj.args[0].name+ ')' } }
    if(obj.fn == "unaryPlus"){ if(obj.args[0].valueType == "number"){ return (1*parseFloat(obj.args[0].value)) } else { return 'numeric.mul(1,' +obj.args[0].name+ ')' } }
    if(obj.fn == 'pow'){ return 'numeric.pow(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add

  }
}

/***********************************************************************************************/

// Other functions and operations need to be added
// function createCommand(str){
//   str = str.replace("sin", "math.sin");
//   str = str.replace("cos", "math.cos");
//   str = str.replace("tan", "math.tan");
//   str = recursive_product( str.split('*') );
//   // str = recursive_addition( str.split('+') );
//   // str = recursive_addition( str.split('-') );
//   // console.log(str);
//   return str
//   // var temp_func = math.parse(str);
//   // return temp_func._toString();
// }
//
// function recursive_addition(array){
//   var temp_code = "";
//   if(array.length > 2){ temp_code = recursive_addition(array.splice(1)) }
//   if(array.length == 2){ temp_code = array[1] }
//   if(array.length == 1){ return array[0] }
//   return 'math.add(' +array[0]+ ',' +temp_code+ ')';
// }
//
// function recursive_product(array){
//   var temp_code = "";
//   if(array.length > 2){ temp_code = recursive_product(array.splice(1)) }
//   if(array.length == 2){ temp_code = array[1] }
//   if(array.length == 1){ return array[0] }
//   return 'math.multiply(' +array[0]+ ',' +temp_code+ ')';
// }
