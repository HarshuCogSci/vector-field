// ************************************************************************************** //

function createVariables_parsing(){
  xFunc = '-sin(y)'; yFunc = 'sin(x)';
  xFunc_display = xFunc; yFunc_display = yFunc;
  xFunc_parsed = null; yFunc_parsed = null;
}

// ************************************************************************************** //

function parseFunction(){
  xFunc_display = xFunc; yFunc_display = yFunc;
  xFunc_parsed = parsing(xFunc); yFunc_parsed = parsing(yFunc);
}

function parsing(str){
  var temp_obj = math.parse(str);
  var command = recursion(temp_obj);
  return command
}

function recursion(obj){
  if(obj.content != undefined){ return '(' +recursion(obj.content)+ ')' };
  if(obj.fn == undefined){ return obj.value != undefined ? obj.value : obj.name };
  if(obj.fn.name == 'sin'){ return 'numeric.sin(' +recursion(obj.args[0])+ ')' }; // math.sin
  if(obj.fn.name == 'cos'){ return 'numeric.cos(' +recursion(obj.args[0])+ ')' }; // math.cos
  if(obj.fn.name == 'tan'){ return 'numeric.tan(' +recursion(obj.args[0])+ ')' }; // math.tan
  if(obj.fn != undefined){

    if(obj.fn == 'multiply'){ return 'numeric.mul(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.mutiply
    if(obj.fn == 'add'){ return 'numeric.add(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add
    if(obj.fn == 'divide'){ return 'numeric.div(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add
    if(obj.fn == 'subtract'){ return 'numeric.sub(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add
    if(obj.fn == "unaryMinus"){ return 'numeric.mul(-1, ' +recursion(obj.args[0])+ ')' };
    if(obj.fn == "unaryPlus"){ return 'numeric.mul(1, ' +recursion(obj.args[0])+ ')' };
    if(obj.fn == 'pow'){ return 'numeric.pow(' +recursion(obj.args[0])+ ',' +recursion(obj.args[1])+ ')' }; // math.add

  }
}

// ************************************************************************************** //
