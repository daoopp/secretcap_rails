//game functions
//options:
//  blood: 1|-3
var hp_bar_width = 230;
var hp_full_point = 7.0;
$.fn.gHP = function(options) {
  var setting = {
    blood: 0
  };
  var opt = $.extend(setting, options);

  var h = parseInt(this.attr('hp')) + opt.blood;
  if(h <= 0)
    h = 0
  else if(h >= hp_full_point)
    h = hp_full_point;
  this.animate({
    'width': "+" + ((hp_bar_width / hp_full_point) * h)
    }).attr('hp', h);
}