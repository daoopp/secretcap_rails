var current_spring_box;
var current_second_spring_box;
function clearSpringBox() {
  if(current_spring_box) {
    $.aMoveOpy(current_spring_box, {
      tx: 1000,
      to: 1
    });
    //clear second spring box
    clearSecondSpringBox();
    current_spring_box = null;
  }
}
function clearSecondSpringBox() {
  if(current_second_spring_box) {
    $.aMoveOpy(current_second_spring_box, {
      ty: 1000,
      to: 1
    });
    current_second_spring_box = null;
  }
}
function initPlayer(data) {
  var player = new PR(data);
  player.dom_id = 'player_self_pos';
  GD.current_player = player;
  if (!rq)
    rq = new RQ(GD.current_player.uuid);
  rq.user_online();
  //go to lobby, for debug game page, turn this to game
  $('.goto_lobby').triggerHandler('click');
  //$('#room').triggerHandler('goto_game', {
  //  room_no: 'test'
  //});

  //TODO, If have character, display the character icon
  //if(data.role){
  //
  //}
}

(function($){
  $('a, button').bind('click', function(){
    $(this).blur()
  });

  $('#login_btn').bind('click', function(){
    if(current_spring_box != '#loginbox') {
      clearSpringBox();
      var ax = ($('body').width() - $('#loginbox').width()) / 2;
      $('#loginbox').aSpringShow({
        x: ax,
        ty: 190
      });
      current_spring_box = '#loginbox';
    }
  })

  $('.signup_btn').bind('click', function(){
    if(current_spring_box != '#signupbox') {
      clearSpringBox();
      var ax = (GD.playground_width - $('#signupbox').width()) / 2;
      $('#signupbox').aSpringShow({
        x: ax,
        ty: 55
      });
      current_spring_box = '#signupbox';
    }
  })

  //Signin, signup init
  $('.login_name').poshytip({
    className: 'tip-green',
    content: "请输入用户名或Email",
    alignTo: 'target',
    alignX: 'inner-left',
    offsetX: 0,
    offsetY: 16
  })
  $('.login_password').poshytip({
    className: 'tip-green',
    content: "请输入密码",
    alignTo: 'target',
    alignX: 'inner-left',
    offsetX: 0,
    offsetY: 16
  })

  $('.signup_big').mouseover(function(){
    $(this).css('background', 'url(/images/signup.png) no-repeat left bottom')
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/signup.png) no-repeat left top')
  })

  $('.forgotpwd_btn').mouseover(function(){
    $(this).css('background', 'url(/images/forgot_pwd.png) no-repeat left bottom')
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/forgot_pwd.png) no-repeat left top')
  })
  .bind('click', function(){
    if(current_spring_box != '#forgotpwdbox') {
      clearSpringBox();
      var ax = (GD.playground_width - $('#forgotpwdbox').width()) / 2;
      $('#forgotpwdbox').aSpringShow({
        x: ax,
        ty: 90
      });
      current_spring_box = '#forgotpwdbox';
    }
  })

  //login
  $('.signin_btn').mouseover(function(){
    $(this).css('background', 'url(/images/signin.png) no-repeat left bottom')
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/signin.png) no-repeat left top')
  })
  .click(function(){
    $.ajax({
      url: '/sessions/create',
      type: 'POST',
      data: $('#login_form').serialize(),
      success: function(data) {
        initSetLoginData(true, data['data']);
        $('#s_container_handler').triggerHandler('connect');
      //set socket session;
      },
      error: function(data) {
        $('.signin_big').poshytip({
          className: 'tip-green',
          content: "用户名或者密码错误!",
          showOn: 'none',
          alignTo: 'target',
          offsetX: 20,
          offsetY: -40,
          alignX: 'left'
        }).poshytip('show');
        $.timer(2000, function(){
          $('.signin_big').poshytip('destroy')
        })
      }
    })
  })
  .bind('logged_in', function(){
    if(is_init_s())
      initPlayer(init_player_data);
  })

  $('.sex_checkbox').bind('click', function(event){
    if($(event.currentTarget).attr('id') == 'sex_checkbox1') {
      $('#sex_check_icon1').show();
      $('#sex_check_icon2').hide();
      $('#signup_h_sex').val(1);
    } else {
      $('#sex_check_icon2').show();
      $('#sex_check_icon1').hide();
      $('#signup_h_sex').val(2);
    }
  })

  //signup
  $('#signup_submit').mouseover(function(){
    $(this).css('background', 'url(/images/signup_btn.png) no-repeat left center');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/signup_btn.png) no-repeat left top');
  })
  .bind('click', function(){
    $.ajax({
      url: '/members/create',
      type: 'POST',
      dataType: 'json',
      data: $('#signup_form').serialize(),
      success: function(data) {
        if(data.status == 'ok') {
          initSetLoginData(true, data['data']);
          $('#s_container_handler').triggerHandler('connect');
        } else {
          $('#signup_submit').poshytip({
            className: 'tip-green',
            content: data['data'],
            showOn: 'none',
            alignTo: 'target',
            offsetX: 20,
            offsetY: -40,
            alignX: 'left'
          }).poshytip('show');
          $.timer(2000, function(){
            $('#signup_submit').poshytip('destroy')
          })
        }
      //set socket session;
      }
    })
  })

  //forgot password
  $('#get_pwd_btn').mouseover(function(){
    $(this).css('background', 'url(/images/signup_btn.png) no-repeat left center');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/signup_btn.png) no-repeat left top');
  })
  .bind('click', function(){
    $.ajax({
      url: '/forgot_pwd',
      type: 'POST',
      dataType: 'json',
      data: $('#forgot_pwd_form').serialize(),
      success: function(data) {
        if(data.status == 'ok') {
          alert(data['data']);
        } else {
          $('#get_pwd_btn').poshytip({
            className: 'tip-green',
            content: data['data'],
            showOn: 'none',
            alignTo: 'target',
            offsetX: 20,
            offsetY: -40,
            alignX: 'left'
          }).poshytip('show');
          $.timer(2000, function(){
            $('#get_pwd_btn').poshytip('destroy')
          })
        }
      //set socket session;
      }
    })
  })
  //////////////////////////////////////////////////
  //lobby
  $('.goto_lobby').bind('click', function(){
    if(current_spring_box != '#lobby') {
      clearSpringBox();
      var ax = (GD.playground_width - $('#lobby').width()) / 2
      $('#lobby').aSpringShow({
        x: ax,
        ty: 80
      });
      current_spring_box = '#lobby';
      //init lobby data
      rq.get_lobbies();
    }
  })
  .bind('insert_zones', function(){
    if(!GD.lobbies.empty()) {
      var h = [];
      $.each(GD.lobbies.sort(function(a, b){
        return a.id > b.id;
      }), function(k, l){
        h.push(l.to_s());
      })
      $('#lobby_list').html(h.join(''));
    }
  })
  .bind('refresh_zones', function(event, rsp){
    GD.lobbies = [];
    $.each(rsp.data.lobbies, function(k, v) {
      GD.lobbies.push(new LB({
        id: v.zone_id,
        name: v.zone_name,
        room_no: v.room,
        player_no: v.user
      }))
    });
    $(this).triggerHandler('insert_zones');
  })
  //zone bg
  $('.one_lobby').live('mouseover', function(){
    $(this).css('background', 'url(/images/zone_bg.png) no-repeat left bottom')
  })
  .live('mouseout', function(){
    $(this).css('background', 'url(/images/zone_bg.png) no-repeat left top')
  })
  .live('click', function(event){
    var zone_id = $(event.currentTarget).attr('zone_id');
    GD.current_player.zone_id = zone_id;
    rq.goto_zone({
      lobby_id: zone_id
    });
  })

  //member info
  $('.member_btn').bind('click', function(){
    $('#member_info_btn').show();
    $('#friends_list_btn').hide();
  })
  .bind('insert_member_info', function(){
    $('#member_detail_name').html(GD.current_player.name);
    $('#member_detail_sex').html(GD.current_player.sex);
    $('#member_detail_level').html(GD.current_player.level);
    $('#member_detail_nature').html(GD.current_player.nature);
    $('#member_detail_arch').html(GD.current_player.arch);
  })

  //friends list
  $('.friends_btn').bind('click', function(){
    $('#member_info_btn').hide();
    $('#friends_list_btn').show();
    if($('#friends_list_inner_con').html().empty()) rq.get_friends();
  })
  .bind('insert_friends', function(){
    var h = [];
    $.each(GD.friends.sort(function(f1){
      if(f1.status == 2) return true;
      if(f1.status == 3) return true;
      return true;
    }), function(k, f){
      h.push(f.to_s());
    })
    $('#friends_list_inner_con').html(h.join(''));
  })
  .bind('refresh_friends', function(event, rsp){
    GD.friends = [];
    $.each(rsp.data.friends, function(k, v) {
      GD.friends.push(new PR(v))
    });
    $(this).triggerHandler('insert_friends');
  })
  //friend bg
  var friend_drop_down_menu_top = 83;
  $('.one_friend').live('mouseover', function(event){
    //event.type; event.pageX
    $(this).addClass('friend_selected');
  })
  .live('mouseout', function(event){
    $(this).removeClass('friend_selected');
  })
  .live('click', function(event){
    //remove all first
    $(this).trigger('remove_drop_down');

    var n = $(this).attr('user_name');
    var m = "<div class='friend_drop_down' user_name='" + n + "'>" +
    "<a class='drop_down_invite' href='javascript: void(0);'>" + '邀请' + "</a>" +
    "<a class='drop_down_delete' href='javascript: void(0);'>" + '删除' + "</a>" +
    "<a class='drop_down_cancel' onclick='$(this).parent().remove();' href='javascript: void(0);'>" + '取消' + "</a></div>";
    //var m = $(this).triggerHandler('create_drop_down');
    $('.lobby_left').append($(m).css("top", friend_drop_down_menu_top+$(event.currentTarget).position().top));
  })
  .live('remove_drop_down', function(){
    //remove all drop down menu
    $('.friend_drop_down').remove();
  })
  //friend list scroll up
  var friends_list_scorll_thr = 42;
  var friends_show_num = 6;
  $('.friend_scroll_up').mouseover(function(){
    $(this).css('background', 'url(/images/up.png) no-repeat left center');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/up.png) no-repeat left top');
  })
  .mousedown(function(){
    $(this).css('background', 'url(/images/up.png) no-repeat left bottom');
  })
  .mouseup(function(){
    $(this).css('background', 'url(/images/up.png) no-repeat left center');
  })
  .click(function(){
    //remove all drop down menu
    $('.one_friend').trigger('remove_drop_down');
    
    var s = parseInt($('#friends_list_inner_con').css('margin-top'));
    if(GD.friends.length > friends_show_num && s < 0)
      $('#friends_list_inner_con').animate({
        "margin-top": friends_list_scorll_thr + s
      })
  })
  //friend list scroll down
  $('.friend_scroll_down').mouseover(function(){
    $(this).css('background', 'url(/images/down.png) no-repeat left center');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/down.png) no-repeat left top');
  })
  .mousedown(function(){
    $(this).css('background', 'url(/images/down.png) no-repeat left bottom');
  })
  .mouseup(function(){
    $(this).css('background', 'url(/images/down.png) no-repeat left center');
  })
  .click(function(){
    //remove all drop down menu
    $('.one_friend').trigger('remove_drop_down');
    
    var s = parseInt($('#friends_list_inner_con').css('margin-top'));
    if(GD.friends.length > friends_show_num &&
      Math.abs(s) < ((GD.friends.length - friends_show_num) * friends_list_scorll_thr))
      $('#friends_list_inner_con').animate({
        "margin-top": s - friends_list_scorll_thr
      })
  })

  //display role options box
  $('.select_role_btn').bind('click', function(){
    if(current_second_spring_box != '#char_select_box') {
      //clear second spring box
      clearSecondSpringBox();
      var ax = (GD.playground_width - $('#char_select_box').width()) / 2;
      $('#char_select_box').aSpringShow({
        x: ax,
        ty: 50
      });
      current_second_spring_box = '#char_select_box';
      $('#char_list ul').html('').append($.tmpl('characters_list', GD.characters));
    }
  })
  .mouseover(function(){
    $(this).css('background', 'url(/images/select_role_btn.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/select_role_btn.png) no-repeat left top');
  })

  //character box background
  $('.char_bg').live('mouseover', function(){
    $(this).css('backgroundPosition', 'left bottom');
  })
  .live('mouseout', function(){
    $(this).css('backgroundPosition', 'left top');
  })
  .live('click', function(event){
    var e = $(event.currentTarget).children();
    var h = '<img src="' + e.attr('src') + '"/>';
    $('#char_big_icon').html(h);
    $('#char_detail').html('<p><b>' + e.attr('name') + '</b></p>' +
      '<p><b>技能: </b>未开放</p>' + 
      '<p>' + e.attr('desp') + '</p>');
    GD.current_character = {icon: e.attr('icon'), name: e.attr('name'), html: h};
  })
  
  //confirm character
  $('.char_select_btn').mouseover(function(){
    $(this).css('backgroundPosition', 'left bottom');
  })
  .mouseout(function(){
    $(this).css('backgroundPosition', 'left top');
  })
  .click(function(){
    if(GD.current_character.icon) {
      clearSecondSpringBox();
      $('.current_role').html('');
      $(GD.current_character.html).attr('class', 'current_char_icon').appendTo('.current_role');
      rq.select_character({character: GD.current_character.icon});
    } else
      alert('请选择您的角色!')
  })
  
  //room list
  $('#room').bind('goto_rooms', function(){
    if(current_spring_box != '#room') {
      clearSpringBox();
      var ax = (GD.playground_width - $('#room').width()) / 2
      $('#room').aSpringShow({
        x: ax,
        ty: 60
      });
      current_spring_box = '#room';
    }
  })
  .bind('refresh_rooms', function(event, rsp){
    $(this).triggerHandler('goto_rooms');
    GD.rooms = [];
    $.each(rsp.data.rooms, function(k, r){
      GD.rooms.push(new RM(r));
    });
    $(this).triggerHandler('insert_rooms');
  })
  .bind('insert_rooms', function(event, btn){
    //firstly, clear rooms dom
    $('#room_list').html('');

    var page = 1;
    if($(btn).attr('page') == 'previous')
      page = GD.rooms_paginate.previous_page;
    else if($(btn).attr('page') == 'next')
      page = GD.rooms_paginate.next_page;
    
    $(GD.rooms.filter(function(room, i){return room.zone_id == GD.current_player.zone_id})).paginate({
      page: page,
      per_page: GD.rooms_paginate.per_page,
      callback: function(data){
        GD.rooms_paginate.current_page = data.current_page;
        GD.rooms_paginate.total_pages = data.total_pages;
        GD.rooms_paginate.next_page = data.next_page;
        GD.rooms_paginate.previous_page = data.previous_page;
        
        if(data.data.length != 0) {
          var h = [];
          $.each(data.data, function(k, r){
            h.push(r.to_s());
          })
          $('#room_list').html(h.join(''));
        }
      }
    })
  })
  .bind('goto_game', function(event, data){
    GD.players = [];
    GD.current_player.room_no = data.room_no;
    GD.current_player.id = data.user_id;
    if(GD.current_player.room_no) {
      GD.style_goto_game();
      if(current_spring_box != '#game') {
        clearSpringBox();
        var ax = (GD.playground_width - $('#game').width()) / 2
        $('#game').aSpringShow({
          x: ax,
          ty: 22
        });
        current_spring_box = '#game';

        //init player's data in game view: player's icon etc..
        $('#player_role_bg_big').html('<img src="' + '/images/characters/' + GD.current_character.icon + '.png" class="game_self_char_icon" />');
        //Clear game cache data.
        $('#game').triggerHandler('clear_game_data');
        
        GameMessage.n('*等待其他玩家加入游戏*', false);
      }
    }
  })
  .bind('join_room', function(event, rsp){
    $(this).triggerHandler('goto_game', rsp.data);
    
    //create joined players' info and DOM view
    $('#game').triggerHandler('save_player_info', rsp.data);
    $('#game').triggerHandler('create_player_dom', rsp.data);
  })
  .bind('add_new_room', function(event, rsp){
    //Because backend have a smal bug, when new room created, backend will send all rooms to front end,
    //so here need to purge all rooms, not just push the new one.
    GD.rooms = [];
    $.each(rsp.data.rooms, function(k, r){
      GD.rooms.push(new RM(r));
    });
    $(this).triggerHandler('insert_rooms');
  })
  .bind('delete_room', function(event, rsp){
    GD.rooms = $.grep(GD.rooms, function(room){
        return room.id != rsp.data.room;
    })
    $(this).triggerHandler('insert_rooms');
  })
  .bind('update_room', function(event, rsp){
  })
  
  //room bg hover
  $('.one_room').live('mouseover', function(){
    $(this).css('background', 'url(/images/room_bg.png) no-repeat left bottom');
  })
  .live('mouseout', function(){
    $(this).css('background', 'url(/images/room_bg.png) no-repeat left top');
  })
  .live('click', function(){
    if(GD.current_character.name)
      //join room sock
      rq.join_room({
        room_id: $(this).attr('room_no')
      })
    else
      alert('请先选择你要使用的游戏角色!');
  })
  //room nav btn
  $('.create_room').mouseover(function(){
    $(this).css('background', 'url(/images/create_room_bg.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/create_room_bg.png) no-repeat left top');
  }).click(function(){
    //Need to select character first.
    if(GD.current_character.name) {
      if(current_second_spring_box != '#new_room') {
        //clear second spring box
        clearSecondSpringBox();
        var ax = (GD.playground_width - $('#loginbox').width()) / 2;
        $('#new_room').aSpringShow({
          x: ax,
          ty: 150
        });
        current_second_spring_box = '#new_room';
        $('#input_room_name').focus();
      }
    } else
      alert('请先选择你要使用的游戏角色!');
  })
  $('.back_to_lobby').mouseover(function(){
    $(this).css('background', 'url(/images/back_to_lobby.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/back_to_lobby.png) no-repeat left top');
  })
  $('.quick_join').mouseover(function(){
    $(this).css('background', 'url(/images/quick_join_bg.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/quick_join_bg.png) no-repeat left top');
  })
  
  //room scroll
  $('#room_scroll_left').mouseover(function(){
    $(this).css('background', 'url(/images/room_up.png) no-repeat left center')
  })
  .mousedown(function(){
    $(this).css('background', 'url(/images/room_up.png) no-repeat left bottom')
  })
  .mouseup(function(){
    $(this).css('background', 'url(/images/room_up.png) no-repeat left center')
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/room_up.png) no-repeat left top')
  })
  .click(function(event){
    $('#room').triggerHandler('insert_rooms', event.currentTarget);
  })

  $('#room_scroll_right').mouseover(function(){
    $(this).css('background', 'url(/images/room_down.png) no-repeat left center')
  })
  .mousedown(function(){
    $(this).css('background', 'url(/images/room_down.png) no-repeat left bottom')
  })
  .mouseup(function(){
    $(this).css('background', 'url(/images/room_down.png) no-repeat left center')
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/room_down.png) no-repeat left top')
  })
  .click(function(event){
    $('#room').triggerHandler('insert_rooms', event.currentTarget);
  })

  //new room
  $('.new_room_btn').mouseover(function(){
    $(this).css('background', 'url(/images/new_room_btn.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/new_room_btn.png) no-repeat left top');
  })
  .click(function(){
    var r = $('#input_room_name').val();
    if(r.empty() || r.length > 15)
      alert('房间名字长度必须在2-15个字符之间!');
    else
      rq.create_room({
        room: r
      });
  })
  
  $('.new_room_cancel_btn').mouseover(function(){
    $(this).css('background', 'url(/images/new_room_cancel_btn.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/new_room_cancel_btn.png) no-repeat left top');
  })
  .click(function(){
    clearSecondSpringBox();
  })
})(jQuery)