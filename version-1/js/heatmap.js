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
