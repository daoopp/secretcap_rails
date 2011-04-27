(function($){
  //Common Interface
  //Controll all the animation frame, the smaller the smoother, but that will cost more CPU.
  $.fx.interval = 8;

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


//Poison Game Data
var GD = {
  playground_width: 980,
  current_player: null,
  lobbies: [],
  rooms: [],
  friends: [],
  cards: [],
  players: [],

  rooms_paginate: {
    total_pages: null,
    per_page: 6,
    current_page: 1,
    next_page: 1,
    previous_page: 1
  },

  current_round: 0,
  round_points: {1: {}, 2: {}, 3: {}, 4: {}},
  round_results: {1: null, 2: null, 3: null, 4: null},
  final_result: null,

  cards_dir: '/images/cards',
  card_suffix: '.png',

  characters: [
    {icon: '1_t1', name: '1 name', desp: '1 desp'},
    {icon: '2_m1', name: '2 name', desp: '2 desp'},
    {icon: '3_l1', name: '3 name', desp: '3 desp'},
    {icon: '4_s1', name: '4 name', desp: '4 desp'},
    {icon: '5_b1', name: '5 name', desp: '5 desp'},
    {icon: '6_w1', name: '6 name', desp: '6 desp'},
    {icon: '7_o1', name: '7 name', desp: '7 desp'}
  ],
  current_character: {icon: null, name: null, html: null},

  style_goto_game: function(){
    $('#play_bg').css('background', 'rgb(166,197,47)');
  },
  style_goto_main: function(){
    $('#play_bg').css('background', 'url(/images/playground_home_bg.png) no-repeat 10px 0');
  },

  //Templates
  templates: [
    $.template('player_points', "<span class='blue_points'>${b}</span><span class='purple_points'>${p}</span>" +
        "<span class='red_points'>${r}</span><span class='green_points'>${g}</span>"),
      
    $.template('round_points_board', "<tr><td align='center' valign='middle'><span class='rpi_no'>{{html no}}</span></td>" +
      "<td align='left' valign='middle'><span class='rpi_player'>{{html player}}</span></td>" +
      "<td align='center' valign='middle'><span class='rpi_b'>{{html b}}</span></td>" +
      "<td align='center' valign='middle'><span class='rpi_p'>{{html p}}</span></td>" +
      "<td align='center' valign='middle'><span class='rpi_r'>{{html r}}</span></td>" +
      "<td align='center' valign='middle'><span class='rpi_g'>{{html g}}</span></td>" +
      "<td></td>" +
      "<td align='center' valign='middle'><span class='rpi_total'>${total}</span></td></tr>" ),

    $.template('characters_list', '<li><div class="char_bg"><img src="/images/characters/${icon}.png" class="small_char_icon" icon="${icon}" name="${name}" desp="{{html desp}}" /></div></li>')
  ]
}

//Card Class
function CA() {
  //Init variable
  this.name; //r1 ...
  this.player; //here
  this.player_pos;

  this.size = "";  //"" or "s"
  this.dom_id; // "card" + player_id + name, this will be HTML id attribute
  this.src; // img src
  this.position = {
    x: null,
    y: null
  } //CSS top, left position
  this.rect = {
    width: null,
    height: null
  },


  this._init = function(params) {
    if(params.player.id == GD.current_player.id) {
      this.size = "";
      this.rect = {
        width: 75,
        height: 101
      };
    } else {
      this.size = "s";
      this.rect = {
        width: 53,
        height: 72
      };
    }

    this.name = params.name
    this.player = params.player;
    this.player_pos = params.player_pos;
    this.dom_id = 'card_' + this.name + '_' + (GD.cards.length + 1);
    this.src = GD.cards_dir + '/' + this.name + this.size + GD.card_suffix;
  }

  this.to_s = function() {
    var c = this.size == "" ? 'card_big' : 'card_small';
    return "<div player_pos='" + this.player_pos +  "' name='" + this.name + "' class='card " + c + "' id='" + this.dom_id +
    "' style='background: url(" + this.src + ")'></div>";
  }

  this._init(arguments[0]);
}
//Player Class
function PR() {
  //Init variable
  this.name; //String, player name
  this.uuid;
  this.sex;
  this.level;
  this.xp;
  this.arch;
  this.nature;
  this.friends;
  this.role;
  this.status;

  this.zone_id;
  this.room_no = null;
  this.id; //Inetger, room id: 1,2,3,4; this will be set when go to room
  this.dom_id; //HTML id
  this.position = {
    x: null,
    y: null
  }; //CSS position
  this.role; //Integer
  this.skills = []; //Skill Ids, when use a skill, delete skill id

  this._init = function(params) {
    //this.id = params.id;
    this.uuid = params.uuid;
    this.name = params.name;
    this.sex = params.sex;
    this.level = params.level;
    this.xp = params.xp;
    this.arch = params.arch;
    this.nature = params.nature;
    this.friends = params.friends;
    this.role = params.role;
    this.status = params.status;
    this.id = params.id;
  //this.dom_id = "player_" + this.id
  }

  this.to_s = function() {
    var status_class = 'null';
    switch(this.status) {
      case 1:
        status_class = 'Off';
        break;
      case 2:
        status_class = 'Wat';
        break;
      case 3:
        status_class = 'On';
        break;
      default:
        status_class = 'Off';
    }
    return "<div class='one_friend friend_online' user_name='" + this.name + "'>" +
    "<span class='friend_sex'><img src='/images/sex_" + this.sex + ".png' /></span>" +
    "<span class='friend_status'>" + status_class + "</span>" +
    "<span class='friend_name'>" + this.name + "</span></div>";
  }

  this.current_room = function() {
    return GD.rooms.filter(function(room, i){ return room.id == GD.current_player.room_no })[0];
  }

  this._init(arguments[0]);
}

//lobby class
function LB() {
  //instance variables
  this.id;
  this.name;
  this.room_no;
  this.player_no;

  this.dom_id;

  this._init = function(params) {
    this.id = params.id;
    this.name = params.name;
    this.room_no = params.room_no;
    this.player_no = params.player_no;

    this.dom_id = "zone_" + this.id;
  }

  this.to_s = function() {
    return "<div id='" + this.dom_id + "' class='one_lobby' zone_id='" + this.id + "'><div class='one_lobby_inner'>" + this.name + "</div></div>"
  }

  this._init(arguments[0]);
}

//room class
function RM() {
  //instance variables
  this.id;
  this.no;
  this.name;
  this.owner;
  this.status;
  this.player_no;
  this.total_player_no = 4;
  this.zone_id;

  this._init = function(params) {
    this.id = params.id;
    this.no = params.no;
    this.name = params.name;
    this.owner = params.owner;
    this.player_no = params.player_no;
    this.status = params.status;
    this.zone_id = params.zone_id;
  }

  this.to_s = function() {
    var ii, si;
    if (this.player_no < this.total_player_no)
      ii = "/images/room_not_full.png";
    else
      ii = "/images/room_full.png";
    if (this.status == 1)
      si = "/images/room_waiting.png";
    else
      si = "/images/room_playing.png";
    
    return "<div class='one_room' room_no='" + this.id + "'>" +
    "<div class='room_no'>" + this.no + "</div>" +
    "<div class='room_name'>" + this.name + "</div>" +
    //"<div class='room_sex'>" + thisM</div>
    "<div class='room_icon'><img src='" + ii + "'/></div>" +
    "<div class='room_status'><img src='" + si + "'/></div>" +
    "<div class='room_current_player_no'>" + this.player_no + "</div>" +
    '<div class="room_slash">/</div>' +
    "<div class='room_total_player_no'>" + this.total_player_no + "</div>" +
    "</div>";
  }

  this._init(arguments[0]);
}

var GameNotice = {
  board: null,
  c: function() {
    $('#' + GameNotice.board).html('');
  } ,
  n: function(msg) {
    $('#' + GameNotice.board).animate({'opacity': 1}).append('<p>' + msg + '</p>').scrollTop(9999);
    $.timer(3000, function(){$('#' + GameNotice.board).animate({'opacity': .2})});
  }
}

var GameMessage = {
  board: 'notice_board',
  n: function(msg, fade) {
    fade = fade != undefined ? fade : true;
    $('#' + GameMessage.board).css('opacity', 0).animate({'opacity': 1}).html(msg);
    if(fade) $.timer(3000, function(){$('#' + GameMessage.board).animate({'opacity': 0})});
  }
}

//DOM and event init
$(document).ready(function(){
})