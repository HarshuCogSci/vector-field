var FizzyText = function(){
  this.message = 'Controls';
  this.num_particles = num;
  this.speed = 'medium';
  this.trailFading = bkg_opacity;
  this.lineWidth = lineWidth;

  this.background_color = bkg_clr;
  this.stroke_color = stroke_clr;
};

// var text = new FizzyText();
// var gui = new dat.GUI({ autoPlace: true });

/************************************************************************************/

function addControls(){
  // gui.add(text, 'message');

  // gui.add(text, 'num_particles').min(0).max(100).step(5).onChange(function(value){
  //   num = value; reset();
  // })

  // gui.add(text, 'speed', ['slow', 'medium', 'fast']).onChange(function(value){
  //   if(value == 'slow'){ dt = 0.005; time_btwn_frames = 80 };
  //   if(value == 'medium'){ dt = 0.005; time_btwn_frames = 50 };
  //   if(value == 'fast'){ dt = 0.005; time_btwn_frames = 30 };
  // })

  // gui.add(text, 'trailFading').min(0).max(0.1).step(0.01).onChange(function(value){
  //   var temp = d3.color(bkg_clr);
  //   bkg_opacity = value;
  //   bkg_clr_with_opacity = "rgba(" +temp.r+ "," +temp.g+ "," +temp.b+ "," +bkg_opacity+ ")";
  //   ctx.fillStyle = bkg_clr_with_opacity;
  // })

  // gui.add(text, 'lineWidth').min(0.1).max(3).step(0.1).onChange(function(value){
  //   lineWidth = value;
  //   ctx.lineWidth = lineWidth;
  // })

  // if(mode == 1){
  //   gui.addColor(text, 'background_color').onChange(function(value){
  //     bkg_clr = value;
  //     var temp = d3.color(bkg_clr);
  //     bkg_clr_with_opacity = "rgba(" +temp.r+ "," +temp.g+ "," +temp.b+ "," +bkg_opacity+ ")";
  //     ctx.fillStyle = bkg_clr_with_opacity;
  //   });
  // }
  //
  // gui.addColor(text, 'stroke_color').onChange(function(value){
  //   stroke_clr = value;
  //   ctx.strokeStyle = stroke_clr;
  // });

};
