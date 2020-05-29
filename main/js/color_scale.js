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
