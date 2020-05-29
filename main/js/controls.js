// ************************************************************************************** //

function changeBackgroundEncoding(){
  backgroundEncoding = document.getElementById('background-encoding').value;
  reset();
}

function toggleAnimation(){
  animation = !animation;
}

function changeField_showPanel(){
  $("#x-field").each(function(){ this.value = xFunc_display; })
  $("#y-field").each(function(){ this.value = yFunc_display; })
  d3.select(".panel").styles({ "display": null });

  // reset();
}

// ************************************************************************************** //

function changeField_apply(){
  d3.select(".panel").styles({ "display": "none" });
  setTimeout(function(){
    xFunc = $("#x-field").val();
    yFunc = $("#y-field").val();
    reset();
  }, 10);
}

function changeField_close(){
  d3.select(".panel").styles({ "display": "none" });
}

// ************************************************************************************** //

function changeVelocityScale(){
  var temp_value = document.getElementById('velcoityScale').value;

  if(temp_value == 'slow'){ velocity_scale = 1; bkg_opacity = 0.025; }
  if(temp_value == 'medium'){ velocity_scale = 2; bkg_opacity = 0.05; }
  if(temp_value == 'fast'){ velocity_scale = 4; bkg_opacity = 0.05; }

  bkg_clr_with_opacity = "rgba(" +clr.r+ ", " +clr.g+ ", " +clr.b+ "," +bkg_opacity+ ")";
  ctx.fillStyle = bkg_clr_with_opacity; // for fading curves
}

// ************************************************************************************** //

function createPresets(){
  presets = [
    { name: 'Default Preset', x: 'sin(y)', y: 'sin(x)' },
    { name: 'Butterfly', x: 'sin(x)', y: 'sin(y)' },
    { name: 'Spiral', x: '-y+x', y: 'x+y' },
    { name: 'Meandering Rivers', x: '-sin(y)+1', y: 'sin(x)' },
    { name: 'Parabolas', x: 'x', y: 'x^2' },
    { name: 'Rotation', x: '-y', y: 'x' },
    { name: 'Source', x: 'x', y: 'y' },
  ]

  for(var i = 0; i < presets.length; i++){
    d3.select('#presets').append("option").attrs({ value: i, class: 'dropdown-item' }).html(presets[i].name);
   }

   $('#presets').on('change', function(){
     xFunc = presets[this.value].x;
     yFunc = presets[this.value].y;
     $("#x-field").each(function(){ this.value = xFunc; })
     $("#y-field").each(function(){ this.value = yFunc; })
   })
}

// ************************************************************************************** //

function createControls(){
  var FizzyText = function() {
    // this.backgroundEncoding = 'none';
    // this.heading = 'Controls';
    // this.message = 'dat.gui';
    // this.speed = 0.8;
    // this.displayOutline = false;
    // this.explode = function() {  };
    // Define render logic ...
  };

  // var text = new FizzyText();
  // var gui = new dat.GUI();
  // gui.add(text, 'Controls');
  // gui.add(text, 'message');
  // gui.add(text, 'speed', -5, 5);
  // gui.add(text, 'displayOutline');
  // gui.add(text, 'explode');

}
