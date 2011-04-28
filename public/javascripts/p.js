var current_map_ele = '#current_map';
var mapPoint = {
  x: 0,
  y: 0
};
var bodyPoint = {
  x: 0,
  y: 0
};
var mapOffset = {
  x: 0,
  y: 0
};
  
(function($){
  //Common Interface
  //Controll all the animation frame, the smaller the smoother, but that will cost more CPU.
  $.fx.interval = 8;

  //options:
  //  offsetX: Number,
  //  offsetY: Number
  $.fn.followMouse = function(options) {
    var setting = {
      offsetX: 0,
      offsetY: 0
    };
    var opt = $.extend(setting, options);

    this.css({
      'position': 'absolute',
      'top': (bodyPoint.y - this.height() / 2) + opt.offsetY + 'px',
      'left': (bodyPoint.x - this.width() / 2) + opt.offsetX + 'px',
      'display': 'block',
      'opacity': 1
    });
    return this;
  }

  //DOM:
  //  <div id="ele" style="width: 144px;height: 102px;display: none;" frames="fight01.png, fight02.png, fight03.png, fight01.png, fight02.png"></div>
  //options:
  //  frequency: 200(ms)
  //callback:
  //  function(this){}
  $.fn.playAnimate = function(options, callback) {
    var setting = {
      frequency: 200
    };
    var opt = $.extend(setting, options);
    var e = this;

    var play = function(frames) {
      if(frames.length > 0) {
        e.html("<img src='" + frames.shift() + "' />");
        setTimeout(function(){
          play(frames)
        }, opt.frequency);
      } else {
        if(callback)
          callback(e);
      }
    }

    play(this.attr('frames').split(','));
    return this;
  }

  //options:
  //  offsetX: Number,
  //  offsetY: Number,
  //  x: Number,
  //  y: Number
  $.fn.showInMap = function(options) {
    var setting = {
      offsetX: 0,
      offsetY: 0,
      x: 0,
      y: 0
    };
    var opt = $.extend(setting, options);

    this.css({
      'position': 'absolute',
      'top': (opt.y - this.height() / 2) + mapOffset.y + opt.offsetY + 'px',
      'left': (opt.x - this.width() / 2) + mapOffset.x + opt.offsetX + 'px',
      'display': 'block',
      'opacity': 1
    });
    return this;
  }

  //options:
  //  timeout: ms | 2000ms
  $.fn.delayHide = function(options) {
    var setting = {
      timeout: 2000
    };
    var opt = $.extend(setting, options);
    var e = this;

    $.timer(opt.timeout, function(){
      e.animate({
        'opacity': 0
      }, 600, "linear", function(){
        e.hide()
      });
    })
    return e;
  }

  //class method showInMap, insert an html direct into map
  //ex:
  //  $.showInMap("<div style='width: 100px;height: 50px;background: blue;'></div>", {x: 100, y: 300})
  //you can also use with delayHide():
  //  $.showInMap("<div style='width: 100px;height: 50px;background: blue;'></div>", {x: 100, y: 300}).delayHide()
  $.extend({
    showInMap: function(html, options) {
      var e = $(html);
      e.showInMap(options).appendTo('body');
      return e;
    }
  })

    
  var defaultAOptions = {
    speed: 'normal'
  };
  function aCheckOption(options) {
    if(options['x'] == undefined || options['y'] == undefined) {
      alert("A: need x and y");
      return false;
    } else
      return $.extend(defaultAOptions, options);
  }

  //Move
  $.fn.aMoveTo = function(options) {
    var opt = aCheckOption(options);
    var ox = this.position().left;
    var oy = this.position().top;
    this.css({
      "position": "absolute",
      "top": oy,
      "left": ox
    })
    .animate({
      "top": opt.y,
      "left": opt.x
    }, opt.speed, opt.effect || 'linear');
    return this;
  };

  //Move +=
  $.fn.aMoveOn = function(options) {
    var opt = aCheckOption(options);
    var ox = this.position().left;
    var oy = this.position().top;
    this.css({
      "position": "absolute",
      "top": oy,
      "left": ox
    })
    .animate({
      "top": opt.y + oy,
      "left": opt.x + ox
    }, opt.speed);
    return this;
  }

  //Easing
  //x will be always the same.
  //params: $(ele).aSpringShow({x: 200, fy: y, ty: y, speed: 2000})
  $.fn.aSpringShow = function(options) {
    this.css({
      "position": "absolute",
      "top": options.fy || 0,
      "left": options.x,
      "display": 'block',
      "opacity": .1
    })
    .animate({
      "top": options.ty,
      "opacity": 1
    }, options.speed || 'slow', 'easeOutBounce', function(){
      //$(this).css('left', options.x);
      });
    return this;
  }

  //params: tx[required]
  //        ty[required]
  $.extend({
    //Move and change opacity
    //$.aMoveDisp('#ele', {fx: 20, fy 30, tx: 40, ty: 30, fo: 1, to: 0, effect: 'linear'})
    aMoveOpy: function(element, options, callback) {
      var e = $(element);

      var setting = {
        fx: e.position().left,
        fy: e.position().top,
        fo: 1,
        to: 0,
        speed: 'slow',
        effect: 'linear'
      };
      var tx = options.tx == undefined ? setting.fx : options.tx;
      var ty = options.ty == undefined ? setting.fy : options.ty;

      var opt = $.extend(setting, options);
      e.css({
        "position": "absolute",
        "top": opt.fy,
        "left": opt.fx,
        "opacity": opt.fo
      })
      .animate({
        "top": ty ,
        "left": tx,
        "opacity": opt.to
      }, opt.speed, opt.effect, function(){
        if(callback)callback(e)
      })
    }
  })

  ///////////////////////////////
  //Data function
  //array paginate, need callback function
  //$(['a', 'b', 'c', 'd', 'e']).paginate({page: 3, per_page: 3, callback: function(e){alert(e)}})
  $.fn.paginate = function(params) {
    var defaultOption = {
      page: 1,
      per_page: 6
    }
    var options = $.extend(defaultOption, params);
    var page = options.page > 0 ? options.page - 1 : options.page;
    var page_count = options.page <= 0 ? 1 : options.page;
    var total_pages = Math.ceil($(this).length / options.per_page);
    options.callback({
      total_pages: total_pages,
      current_page: options.page,
      next_page: (options.page < total_pages ? options.page + 1 : 1), //TODO here may be -1
      previous_page: (options.page <= 1 ? 1 : options.page - 1),
      data: $(this).slice(page * options.per_page, page_count * options.per_page)
    });
  }
//Common Interface End
})(jQuery);

var GameNotice = {
  board: null,
  c: function() {
    $('#' + GameNotice.board).html('');
  } ,
  n: function(msg) {
    $('#' + GameNotice.board).animate({
      'opacity': 1
    }).append('<p>' + msg + '</p>').scrollTop(9999);
    $.timer(3000, function(){
      $('#' + GameNotice.board).animate({
        'opacity': .2
      })
    });
  }
}

var GameMessage = {
  board: 'notice_board',
  n: function(msg, fade) {
    fade = fade != undefined ? fade : true;
    $('#' + GameMessage.board).css('opacity', 0).animate({
      'opacity': 1
    }).html(msg);
    if(fade) $.timer(3000, function(){
      $('#' + GameMessage.board).animate({
        'opacity': 0
      })
    });
  }
}

//DOM and event init
$(document).ready(function(){
  })