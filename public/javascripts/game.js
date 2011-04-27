(function($){
  $('#emotion_btn').mouseover(function(){
    $(this).css('background', 'url(/images/game/emotion_btn.png) no-repeat left center');
  })
  .mousedown(function(){
    $(this).css('background', 'url(/images/game/emotion_btn.png) no-repeat left bottom');
  })
  .mouseup(function(){
    $(this).css('background', 'url(/images/game/emotion_btn.png) no-repeat left center');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/game/emotion_btn.png) no-repeat left top');
  })
  $('#skill_btn').mouseover(function(){
    $(this).css('background', 'url(/images/game/skill_btn.png) no-repeat left center');
  })
  .mousedown(function(){
    $(this).css('background', 'url(/images/game/skill_btn.png) no-repeat left bottom');
  })
  .mouseup(function(){
    $(this).css('background', 'url(/images/game/skill_btn.png) no-repeat left center');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/game/skill_btn.png) no-repeat left top');
  })

  //Three buckets
  $('.bucket').mouseover(function(){
    $(this).css('backgroundPosition', 'left bottom');
  })
  .mouseout(function(){
    $(this).css('backgroundPosition', 'left top');
  })

  //Prepare btn
  $('#enter_prepare').mouseover(function(){
    $(this).css('background', 'url(/images/game/status_ready_btn.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/game/status_ready_btn.png) no-repeat left top');
  })
  .click(function(){
    rq.prepare_to_start();
  })

  //Game start btn
  $('#game_start').mouseover(function(){
    $(this).css('background', 'url(/images/game/game_start_btn.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/game/game_start_btn.png) no-repeat left top');
  })
  .click(function(){
    rq.game_start({room: GD.current_player.current_room().id});
  })

  //Round points score board page.
  $('#round_points_board_close').click(function(){
    clearSecondSpringBox();
  })
  .mouseover(function(){
    $(this).css('background', 'url(/images/game/round_points_close_bg.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/game/round_points_close_bg.png) no-repeat left top');
  })

  //Show final result.
  $('#final_result_btn').mouseover(function(){
    $(this).css('backgroundPosition', 'left bottom');
  })
  .mouseout(function(){
    $(this).css('backgroundPosition', 'left top');
  })
  .click(function(){
    //Show the box
    if(current_second_spring_box != '#final_points_board') {
      //clear second spring box
      clearSecondSpringBox();
      var ax = (GD.playground_width - $('#final_points_board').width()) / 2;
      $('#final_points_board').aSpringShow({
        x: ax,
        ty: 80
      });
      current_second_spring_box = '#final_points_board';
    }
    $('#game').triggerHandler('show_final_result');
  })

  //Continue game btn
  $('#continue_game_btn').mouseover(function(){
    $(this).css('backgroundPosition', 'left bottom');
  })
  .mouseout(function(){
    $(this).css('backgroundPosition', 'left top');
  })
  .click(function(){
    clearSecondSpringBox();
    $('#game').triggerHandler('show_start_game');
  })

  //Back to lobby and exit room btn
  $('#back_to_zone_btn').mouseover(function(){
    $(this).css('backgroundPosition', 'left bottom');
  })
  .mouseout(function(){
    $(this).css('backgroundPosition', 'left top');
  })
  .click(function(){
    rq.leave_room();
    $('.goto_lobby').triggerHandler('click');
    GD.style_goto_main();
  })

  $('#game_menu_quit').click(function(){
    $('#back_to_zone_btn').triggerHandler('click');
  })
  
  //game global variable
  var self_card_margin = 22;
  var self_selected_card = null;
  var card_origin = {
    x: $('#game').width() / 2,
    y: $('#game').height() / 2
  };
  var player_self_card_origin = {
    x: 350,
    y: 450
  };

  //Other players' cards position configuration.
  var other_players_cards_gap = {
    x: 60,
    y: 5
  };
  var other_players_card_margin = 10;

  function otherPlayersCardsDispatch(pos) {
    //Other players cards origin point.
    var pos_card_origin = {
      x: $('#' + pos).position().left + other_players_cards_gap.x + 16,
      y: $('#' + pos).position().top + other_players_cards_gap.y - 11
    };
    
    for(var i = 0; i < 12; i++) {
      //Here player: "2pos" means nothing, we will not use it right now.
      var c = new CA({player: pos, name: "card_back", size: "", player_pos: pos});
      GD.cards.push(c);
      $.aMoveOpy($(c.to_s()).appendTo('#game'), {
        fx: card_origin.x,
        fy: card_origin.y,
        tx: pos_card_origin.x + other_players_card_margin * i,
        ty: pos_card_origin.y,
        speed: 'slow',
        effect: 'easeOutSine',
        to: 1
      })
    }
  }

  var player_id_to_dom_id = {
    '1': {
      '1': 'player_self_pos',
      '2': 'player_2_pos',
      '3': 'player_3_pos',
      '4': 'player_4_pos'
    },
    '2': {
      '1': 'player_4_pos',
      '2': 'player_self_pos',
      '3': 'player_2_pos',
      '4': 'player_3_pos'
    },
    '3': {
      '1': 'player_3_pos',
      '2': 'player_4_pos',
      '3': 'player_self_pos',
      '4': 'player_2_pos'
    },
    '4': {
      '1': 'player_2_pos',
      '2': 'player_3_pos',
      '3': 'player_4_pos',
      '4': 'player_self_pos'
    }
  };
  
  $('#game').bind('self_dispatch_cards', function(event, rsp){
    //Save current round.
    GD.current_round = rsp.data.round;
    //Clear game cache data.
    $('#game').triggerHandler('clear_game_data');

    $.each(rsp.data.cards.split(","), function(k, i){
      var c = new CA({player: GD.current_player, name: i, player_pos: 'player_self_pos'});
      GD.cards.push(c);
      $.aMoveOpy($(c.to_s()).appendTo('#game'), {
        fx: card_origin.x,
        fy: card_origin.y,
        tx: player_self_card_origin.x + self_card_margin * k,
        ty: player_self_card_origin.y,
        speed: 'slow',
        effect: 'easeOutSine',
        to: 1
      })
    })

    $('#game_start').hide();
  })
  .bind('clear_game_data', function(){
    //First, we need to hide the score board if player didn't close the board.
    clearSecondSpringBox();
    //Clear bucket cards.
    $('.bucket_card').remove();
    //Reset bucket cards' counter.
    $('.bucket_cards').html('');
    //Remove all cards from page.
    $('.card').remove();
    //Clear GameMessage board.
    GameMessage.n('');
    //Reset poison points number to 0;
    $('.poisons_points span').html('0');
    //Reset round points.
    GD.round_points[GD.current_round] = {};

    $('#game_start').hide();
  })
  .bind('second_dispatch_cards', function(){
    otherPlayersCardsDispatch('player_2_pos');
  })
  .bind('third_dispatch_cards', function(){
    otherPlayersCardsDispatch('player_3_pos');
  })
  .bind('fourth_dispatch_cards', function(){
    otherPlayersCardsDispatch('player_4_pos');
  })
  .bind('save_player_info', function(event, data){
    $.each(data.users, function(i, u){
      GD.players.push(new PR(u))
    })
  })
  .bind('create_player_dom', function(event, data){
    //create other players' DOM.
    //create different player's DOM according to different player's id (player.id) in this game.
    //revise: Here we just create player's DOM in a random place, maybe we need to create player's DOM
    //according to  player's id in the future.

    $.each(data.users, function(k, user){
      var pos = player_id_to_dom_id[GD.current_player.id.toString()][user.id.toString()];
      if(pos != undefined && $('#' + pos).html().empty()) {
        //Include poison points DOM, role DOM
        var p = GD.players.filter(function(player, i){ return player.name == user.name })[0];
        $('#' + pos).html("<div class='player_role_bg_small'><img src='/images/characters/" + p.role + ".png' class='game_other_char_icon' /></div>" +
        '<div class="poisons_points" id="' + pos + '_poison_points">' +
        "<span class='blue_points'>0</span><span class='purple_points'>0</span>" +
        "<span class='red_points'>0</span><span class='green_points'>0</span>" + '</div>');
        //save player DOM id.
        if(p) p.dom_id = pos;
        GameNotice.n(user.name + ' 加入游戏');
      }
    })
  })
  .bind('player_offline', function(event, user){
    //TODO, delete player DOM.
    var p = GD.players.filter(function(player, i){ return player.name == user })[0];
    if(p) $('#' + p.dom_id).html('');

    //delete offline player from global players.
    GD.players = GD.players.filter(function(player, i){ return player.name != user });
    GameNotice.n(user + " 下线了");
  })
  .bind('change_owner', function(event, rsp){
    GD.current_player.current_room().owner = rsp.data.owner;
    $('#game').triggerHandler('player_offline', rsp.data.user);
    GameMessage.n(rsp.data.owner + " 成为了新的房主");
  })
  .bind('prepare_to_start', function(event, rsp){
    //If it's current play start the game, hide the prepare button.
    if(GD.current_player.name == rsp.data)
      $('#enter_prepare').hide();
    GameNotice.n(rsp.data + ' 进入准备状态!');
  })
  .bind('show_start_game', function(){
    if(GD.current_player.current_room().owner == GD.current_player.name) {
      $('#game_start').show();
      GameMessage.n('你可以开始游戏了!', false);
    }
  })
  .bind('show_chose_green_card_pos', function(){
    GameMessage.n('请选择绿色卡片的出牌位置!');
  })
  .bind('start_countdown', function(event, rsp){
    //Start count down.
    //TODO, manybe we need to detect which player is failure in last round,
    //and he or she can click starting the game button and also be the first to discard card.
    if(GD.current_player.current_room().owner == GD.current_player.name)
      countdown('player_self_pos_countdown');
    //else
    //  countdown(GD.players.filter(function(player, i){ return player.name == GD.current_player.current_room().owner })[0].dom_id + "_countdown");
  })
  .bind('loop_countdown', function(event, rsp){
    //TODO, Move card to bucket.
    //Self's card remove
    if(parseInt(rsp.data.user) == GD.current_player.id) {
      //Didn't reach timeout.
      if(last_discard_card) {
        last_discard_card.remove();
        last_discard_card = null;
      } else {
        //Times up auto card, chose a card from current turn player and remove it.
        $('[class*="card_big"][name="' + rsp.data[rsp.data.user] + '"]').last().remove();
      }
    } else {
      //Other players' card remove
      $('div[player_pos="' + player_id_to_dom_id[GD.current_player.id.toString()][rsp.data.user.toString()] + '"]').last().remove();
    }

    //If this is green card and have selected bucket.
    var bc = (/^g/.test(rsp.data[rsp.data.user]) && rsp.data.position) ? rsp.data.position : rsp.data[rsp.data.user].substring(0, 1);
    //Get the bucket DOM id
    var bucket_id = $('div[class="bucket"][name="' + bc + '"]').attr('id') + '_cards';
    
    //Append to bucket.
    $('#game').triggerHandler('insert_bucket_card', {bucket_id: bucket_id, bc: bc, card: rsp.data[rsp.data.user]});
    
    var i = parseInt(rsp.data.user) == 4 ? "1" : (parseInt(rsp.data.user) + 1).toString();

    //If all players' cards is over, in other words, if the round is over we don't need to start the count down.
    //We can't do this logic in the server end currently.
    if($('div[player_pos]').length > 0)
      countdown(player_id_to_dom_id[GD.current_player.id.toString()][i] + "_countdown");
    else
      //Hide the current cowndown(currently its 0)
      $(player_id_to_dom_id[GD.current_player.id.toString()][i] + "_countdown").hide();
  })
  .bind('be_poisoned', function(event, rsp){
    var bc = (rsp.data.position && rsp.data.position != "") ? rsp.data.position : rsp.data.card.substring(0, 1);
    //Get the bucket DOM id
    var bucket_id = $('div[class="bucket"][name="' + bc + '"]').attr('id') + '_cards';
    $('div[class*="bucket_card"][bucket="' + bc + '"]').remove();

    //Update bucket cards.
    $('#' + bucket_id).html('');
    $('#game').triggerHandler('insert_bucket_card', {bucket_id: bucket_id, bc: bc, card: rsp.data.card});

    //TODO, Show poison points.
    $('#game').triggerHandler('refresh_poison_points', rsp.data);
  })
  //Generate bucket card html
  .bind('insert_bucket_card', function(event, data){
    var mrleft = 15;
    $('#game').append('<div class="card card_small bucket_card" bucket="' + data.bc + '" style="left: ' +
      ($('#' + data.bucket_id).position().left + $('#' + data.bucket_id).children().length * mrleft) + 'px; top: ' +
      $('#' + data.bucket_id).position().top + 'px; background: url(/images/cards/' + data.card + 's.png)"></div>');
    //Just use for cards number count.
    $('#' + data.bucket_id).append("<p></p>");
  })
  //Generate total poison points html
  .bind('generate_poison_points_html', function(event, data){
    
  })
  //Refresh poison points when player be poisoned.
  .bind('refresh_poison_points', function(event, data){
    //Get current poisoned player's poison display DOM id
    var pos = player_id_to_dom_id[GD.current_player.id.toString()][data.user_id.toString()] + '_poison_points';
    try{ var g = data.now_poison.match(/green=(\d+)/)[1] } catch(err) { g = 0 }
    try{ var r = data.now_poison.match(/red=(\d+)/)[1] } catch(err) { r = 0 }
    try{ var b = data.now_poison.match(/blue=(\d+)/)[1] } catch(err) { b = 0 }
    try{ var p = data.now_poison.match(/yellow=(\d+)/)[1] } catch(err) { p = 0 }
    
    //Save player points.
    //if(!GD.round_points[GD.current_round]) GD.round_points[GD.current_round] = {};
    GD.round_points[GD.current_round][data.user_id.toString()] = {g: g, r: r, b: b, p: p};

    $('#' + pos).html("<span class='blue_points'>" + b + "</span>" +
      "<span class='purple_points'>" + p + "</span>" +
    "<span class='red_points'>" + r + "</span>" +
  "<span class='green_points'>" + g + "</span>");
  })
  //Round is over
  .bind('show_points_board', function(event, rsp){
    if(GD.current_round < 4) {
      GameMessage.n('等待房主开始第 ' + (GD.current_round + 1) + ' 轮游戏!', false);
      
      $('#final_result_btn').hide();
      $('#round_points_board_close').show();
    } else {
      //Show the button of showing final result.
      $('#final_result_btn').show();
      $('#round_points_board_close').hide();
      //It's the final result response, so we need to save the final result.
      GD.final_result = rsp.data.final_result;
    }
    
    if(current_second_spring_box != '#round_points_board') {
      //clear second spring box
      clearSecondSpringBox();
      var ax = (GD.playground_width - $('#round_points_board').width()) / 2;
      $('#round_points_board').aSpringShow({
        x: ax,
        ty: 80
      });
      current_second_spring_box = '#round_points_board';
    }

    //Save result to round_results and show board.
    GD.round_results[GD.current_round] = rsp.data.result;
    $('#game').triggerHandler('show_format_points', GD.current_round);
    $('#game_start').show();
  })
  .bind('show_final_result', function(event){
    var rest = [];

    //Here we will use round_points_board template, so we need to mirror the round number to poison color
    //in order to show the template.
    var mirror = {
      1: 'b',
      2: 'p',
      3: 'r',
      4: 'g'
    }

    //Get one player's all rounds points
    var all_points = function(player) {
      var total = 0;
      for(var round in GD.round_results) {
        var re = new RegExp(player.id + "=(\\d+)");
        try{ var pt = GD.round_results[round].match(re)[1] } catch(err) { pt = 'N/A' };
        player[mirror[parseInt(round)]] = pt;
        total += parseInt(pt);
      }
      player['total'] = total;
      return player;
    }

    for(var id in GD.round_results) {
      var p = {id: id};
      if(GD.current_player.id.toString() == id.toString())
        p['player'] = GD.current_player.name;
      else
        p['player'] = GD.players.filter(function(player, i){ return player.id.toString() == id.toString() })[0].name;

      rest.push(all_points(p));
    }

    //sort by total
    rest.sort(function(m, n){ return parseInt(m['total']) > parseInt(n['total']) });
    $.each(rest, function(k, v){ v['no'] = k + 1 });
    
    var header = $('#final_points_inner_t tr').first();
    $('#final_points_inner_t').html(header).append($.tmpl('round_points_board', rest));
  })
  .bind('show_format_points', function(event, round){
    var p = GD.round_points[round];
    var max = {r: [], b: [], p: []};
    for(var c in p) {
      for(var i in max) {
          max[i].push(parseInt(p[c][i]));
      }
    }

    var detect_max = function(max_v){
      var m = max_v.max();
      return $.grep(max_v, function(v, k){ return v == m }).length != 1 ? false : m;
    }

    for(c in max) {
      max[c] = detect_max(max[c]);
    }

    var rest = [];
    for(var id in p) {
      var r = {};
      if(id.toString() == GD.current_player.id.toString())
        r['player'] = "<u><b>" + GD.current_player.name + "</b></u>";
      else
        r['player'] = GD.players.filter(function(player, i){ return player.id.toString() == id.toString() })[0].name;
      for(c in p[id]) {
        if(max[c] && parseInt(p[id][c]) >= parseInt(max[c]))
          r[c] = "<span style='border:1px solid white;text-decoration:line-through'>" + p[id][c] + "<span>";
        else
          r[c] = p[id][c];
      }
      var re = new RegExp(id + "=(\\d+)");
      try{ var total = GD.round_results[round].match(re)[1] } catch(err) { total = 'N/A' }
      r['total'] = total;

      rest.push(r);
    }

    //sort by total
    rest.sort(function(m, n){ return parseInt(m['total']) > parseInt(n['total']) });
    $.each(rest, function(k, v){ v['no'] = k + 1 });

    $('#round_title').html(round + '/4 得分结果');
    var header = $('#round_points_inner_t tr').first();
    $('#round_points_inner_t').html(header).append($.tmpl('round_points_board', rest));
  })

  var current_selected_card = null;
  var current_selected_green_card_pos = null;
  var last_discard_card = null; //DOM element.
  $('.bucket').bind('click', function(event){
    current_selected_green_card_pos = $(event.currentTarget).attr('name');
  })

  //Currently, player can only click itself card, so we bind event to element class=card_big
  $('.card_big').live('click', function(event){
    var i = $(this).attr('id');
    if(self_selected_card != null && self_selected_card != i)
      $('#' + self_selected_card).animate({"top": "+=16"}, 'fast');
    if(self_selected_card != i)
      $(this).animate({"top": "-=16"}, 'fast');
    self_selected_card = i;

    current_selected_green_card_pos = null;
    current_selected_card = $(event.currentTarget);
  })

  $('#show_card').mouseover(function(){
    $(this).css('background', 'url(/images/game/show_card.png) no-repeat left bottom');
  })
  .mouseout(function(){
    $(this).css('background', 'url(/images/game/show_card.png) no-repeat left top');
  })
  .click(function(){
    if(!current_selected_card) {
      GameMessage.n('请选择你要出的卡牌!');
      return;
    }

    if(!/^g/.test(current_selected_card.attr('name'))) {
      rq.discard_card({card: current_selected_card.attr('name')});
      last_discard_card = current_selected_card;
    } else if(/^g/.test(current_selected_card.attr('name')) && current_selected_green_card_pos) {
      rq.discard_card({card: current_selected_card.attr('name'), pos: current_selected_green_card_pos});
      last_discard_card = current_selected_card;
    } else if(/^g/.test(current_selected_card.attr('name')) && !current_selected_green_card_pos) {
      $('#game').triggerHandler('show_chose_green_card_pos');
      return;
    }

    current_selected_card = null;
  })
})(jQuery)


var all_countdowns = ['player_self_pos_countdown', 'player_2_pos_countdown', 'player_3_pos_countdown', 'player_4_pos_countdown'];
var current_countdown_number = 30;
var current_countdown_pos;
var countdown_gap = 65;
var countdown_timer_handler;
function countdown(e) {
  $.each(all_countdowns, function(i, c){
    if(c != e)
      $('#' + c).hide();
  })
  
  current_countdown_pos = e;
  $('#' + e).show('fast');
  countdown_timer(current_countdown_number);
}
function countdown_timer(number) {
  //$('#' + current_countdown_pos).css('backgroundPosition', '50% -' + countdown_gap * number + 'px');

  $('#' + current_countdown_pos).css('backgroundPosition', '50% 100px')
  .css('fontSize', '22')
  .css('fontWeight', 'bold')
  .html(SNumber.number(number));
    
  if(number == 0) {
    GameNotice.n('times up');
  } else {
    if(countdown_timer_handler) $.clearTimer(countdown_timer_handler);
    countdown_timer_handler = $.timer(1000, function(){countdown_timer(number - 1)});
  }
}

$(document).ready(function(){
  //clear game message board content.
  GameNotice.board = 'message_board';
  GameNotice.c();
  $('#' + GameNotice.board).animate({'opacity': .2})
  .bind('mouseover', function(){
    $(this).animate({'opacity': 1});
  })
  .bind('mouseout', function(){
    $(this).animate({'opacity': .2});
  })
  .css({"overflowX": "hidden", "overflowY": "auto"})
})