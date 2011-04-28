//game functions
//options:
//  blood: 1|-3
//usage:
//  $('#hp_bar').gaHP({blood: -1});
var hp_bar_width = 230;
var hp_full_point = 7.0;
$.fn.gaHP = function(options) {
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

//usage:
//  $('#playboard').gaHL('timer_name');
//  $('#playboard_border').gaHL('timer_name_2');
var GTimer = {};
$.fn.gaHL = function(timer) {
  var e = this;
  var pa = function() {
    e.animate({borderColor: '#E67591', opacity: .2}, 600).animate({borderColor: '#EB1A4E', opacity: 1}, 600)
  };

  if(GTimer[timer]) {
    clearTimeout(GTimer[timer]);
    e.css({borderColor: '#E67591'});
  }
  GTimer[timer] = setInterval(function(){pa()}, 2000);
}

//usage:
//  $('#map').gPlaceBox();
var gbox_html = "<div class='box' style='float: left;z-index: 3;width: 20px;height: 20px;'></div>";
$.fn.gPlaceBox = function() {
  var e = $('#box');
  var n = (720 * 360) / (20 * 20);
  for(var i = 0; i < n; i ++){
    e.append(gbox_html);
  }
  e.append("<div class='clear'></div>");
}