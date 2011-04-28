//socket, will be init when loaded or user signin.
var s;
//init when user signin.
var rq;

(function($){
  // Host we are connecting to
  var host = 'www.cceebb.com';
  // Port we are connecting on
  var port = 8081;

  var is_debug = false;
  var debug_seq = 1;
  var max_debug_msg = 30;

  //socket response protocol
  var SPL = {
    RS_SUCCESS: 200,
    RS_FAILED: 400
  };

  s = new jsXMLSocket();
  // When the socket is added the to document
  s.onReady = function() {
    debug('socket bridge ready.');
    if(is_init_s())
      $('#s_container_handler').triggerHandler('connect');
  }

  // Connection attempt finished
  s.onConnect = function(success, error) {
    if(success) {
      s.send('init');
      debug('Connected.');
      $('.signin_btn').triggerHandler('logged_in');
    } else {
      debug('Connection failed.');
    }
  }

  // Server closed socket
  s.onClose = function() {
    debug('Server disconnected.');
  }

  // Received data in JSON format (from socket server)
  s.onData = function(data) {
    if(data.length != 0) {
      //data = data.substring(1, data.length);
      data = data.replace(/^[^\{]*/, '');
      parse(data);
    }
  }

  function debug(msg){
    if(is_debug) {
      if(debug_seq >= max_debug_msg) {
        $('#s_debug_info').html('');
        max_debug_msg = 0;
      }
      $('#s_debug_info').append((debug_seq++) + ": " + msg + "<br />");
    }
  }

  function parse(recv) {
    var jsonRsp;
    try {
      jsonRsp = $.evalJSON(recv);
    } catch(error) {
      //alert("Non json response: " + data.toString());
      debug("Non json response: " + recv.toString());
      return false;
    }

    if(is_debug && !$.browser.msie) console.log(jsonRsp);
    var cmd = parseInt(jsonRsp.cmd), status = parseInt(jsonRsp.status);
    switch(cmd) {
      case 501:
        debug('501: request not found!');
        break;
      //login
      case 1:
        debug('login success!');
        break;
      //online
      case 2:
        switch(status) {
          case 200:
            debug('online success!');
            break;
          case 400:
            debug("you already login");
            break;
        }
        break;
      //get zones
      case 3:
        $('.member_btn').triggerHandler('insert_member_info');
        $('.goto_lobby').triggerHandler('refresh_zones', jsonRsp);
        break;
      //get rooms
      case 4:
        $('#room').triggerHandler('refresh_rooms', jsonRsp);
        break;
      //goto zone
      case 6:
        switch(status) {
          case 200:
            rq.get_rooms({lobby_id: GD.current_player.zone_id});
            break;
          case 400:
            alert("zone is full!");
            break;
          case 401:
            alert('zone not exists!');
            break;
        }
        break;
      //get friends
      case 7:
        $('.friends_btn').triggerHandler('refresh_friends', jsonRsp);
        break;

      //create room
      case 60:
        switch(status) {
          case 200:
            $('#room').triggerHandler('goto_game', jsonRsp.data);
            break;
          //new room added
          case 201:
            $('#room').triggerHandler('add_new_room', jsonRsp);
            break;
          case 400:
            alert('该区房间已满，请更换大区再创建房间，或者您也可以加入其他未满的房间!');
            break;
          case 401:
            alert('房间名字长度必须在2-15个字符之间!');
            break;
        }
        break;
      //join room
      case 61:
        switch(status) {
          //join room success
          case 200:
            $('#room').triggerHandler('join_room', jsonRsp);
            break;
          case 201:
            //new user join, game could start
            $('#room').triggerHandler('join_room', jsonRsp);
            break;
          case 202:
            //new user join
            //set new player info and dom
            $('#game').triggerHandler('save_player_info', jsonRsp.data);
            $('#game').triggerHandler('create_player_dom', jsonRsp.data);
            break;
          case 400:
            alert("房间已满，请更换房间!");
            break;
          case 401:
            alert("你已经在一个房间中了!");
            break;
          case 402:
            alert("您要加入的房间不存在!");
            break;
        }
        break;
      case 62:
        switch(status) {
          case 200:
            $('#game').triggerHandler('player_offline', jsonRsp.data);
            break;
          case 400:
            $('#game').triggerHandler('change_owner', jsonRsp);
            break;
        }
        break;
      case 63:
        switch(status) {
          case 200:
            $('#game').triggerHandler('prepare_to_start', jsonRsp);
            break;
        }
        break;
      case 64:
        switch(status) {
          case 200:
            if(GD.current_player.current_room().owner == GD.current_player.name)
              return true;
            GameMessage.n('*等待 ' + GD.current_player.current_room().owner + ' 开始游戏*', false);
            break;
          case 201:
            $('#game').triggerHandler('show_start_game', jsonRsp);
            break;
        }
        break;
      //dispatch cards
      case 90:
        switch(status) {
          case 200:
            $('#game').triggerHandler('self_dispatch_cards', jsonRsp);
            $('#game').triggerHandler('second_dispatch_cards');
            $('#game').triggerHandler('third_dispatch_cards');
            $('#game').triggerHandler('fourth_dispatch_cards');
            $('#game').triggerHandler('start_countdown', jsonRsp);
            break;
          //not owner
          case 400:
            GameMessage.n('玩家数未满不能开始游戏!');
            break;
        }
        break;
      //Discard card.
      case 91:
        switch(status) {
          case 200:
            //TODO, countdown, remove card.
            $('#game').triggerHandler('loop_countdown', jsonRsp);
            GameNotice.n("player: " + jsonRsp.data.user + " card: " + jsonRsp.data[jsonRsp.data.user]);
            break;
        }
        break;
      //Round is over.
      case 93:
        switch(status) {
          case 200:
            $('#game').triggerHandler('show_points_board', jsonRsp);
            break;
        }
        break;
      //All rounds are over.
      case 94:
        switch(status) {
          case 200:
            $('#game').triggerHandler('show_points_board', jsonRsp);
            break;
        }
        break;
      //Be positioned.
      //format:
      //data: Object
      //  now_poison: "green=4,red=5,yellow=2"
      //  poison: "yellow=2"
      //  position: "" | "y"
      //  card: "r4"
      //  user: "shitou2"
      case 95:
        switch(status) {
          case 200:
            $('#game').triggerHandler('be_poisoned', jsonRsp);
            GameNotice.n("player: " + jsonRsp.data.user + " poison: " + jsonRsp.data.now_poison);
            break;
        }
        break;
      //Room destroy
      case 97:
        switch(status) {
          case 200:
            $('#room').triggerHandler('delete_room', jsonRsp);
            break;
        }
        break;
      default:
        debug("not found reponse handler: " + jsonRsp.cmd);
    }
  }


  //init
  $(document).ready(function() {
    // Setup our socket in the div with the id="socket"
    $('body').append("<div id='s_container_handler'></div><div id='s_container'></div>");

    $('#s_container_handler').bind('connect', function(){
      if(!s.connected) {
        s.connect(host, port);
        debug('Connecting to ' + host + ':' + port + '... ');
      } else
        debug('socket already connected!')
    })
    //for debug
    if(is_debug)
      $('body').append("<div id='s_debug_info' style='z-index: 4;color: white;font-size: 12px;position: fixed;top: 0;left: 0;width: 200px;background: transparent;border: 1px solid #333;'></div>");
    s.setup('s_container' ,'/javascripts/jsxmlsocket.swf');
  });
})(jQuery)


function RQ() {
  //instance variable
  this.player_uuid = null;

  this.qs = null;

  this._init = function(player_uuid) {
    this.player_uuid = player_uuid;
  };
  this._e = function(api_name, api_child, params) {
    var q = ["api_name=" + api_name, "api_child=" + api_child, "uuid=" + this.player_uuid];
    if(params) {
      $.each(params, function(k, v){
        q.push(k + "=" + v);
      })
    }
    this.qs = q.join('&');
    this._sd();
    this.qs = null;
    return this;
  }
  this._sd = function() {
    s.send(this.qs);
  }

  //RQs
  this.user_online = function() {
    this._e('user', 'online');
  }
  this.get_lobbies = function() {
    this._e('user', 'get_lobbies');
  }
  this.get_friends = function() {
    this._e('user', 'friends');
  }
  this.goto_zone = function(params) {
    this._e('user', 'goto_lobby', params);
  }
  this.get_rooms = function(params) {
    this._e('user', 'get_zone_rooms', params);
  }
  this.select_character = function(params) {
    this._e('user', 'select_character', params);
  }
  this.create_room = function(params) {
    this._e('user', 'create_room', params);
  }
  this.join_room = function(params) {
    this._e('user', 'join_room', params);
  }
  this.leave_room = function(params) {
    this._e('user', 'leave_room', params);
  }
  this.prepare_to_start = function(params) {
    this._e('user', 'prepare_to_start', params);
  }
  this.game_start = function(params) {
    this._e('user', 'game_start', params);
  }
  this.discard_card = function(params) {
    this._e('bc', 'discard_card', params);
  }


  //init
  if(arguments.length == 0)
    alert('RQ need uuid!');
  else
    this._init(arguments[0]);
}
