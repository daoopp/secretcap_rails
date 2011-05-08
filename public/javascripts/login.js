var current_spring_box;
var current_second_spring_box;
function clearSpringBox() {
    if(current_spring_box) {
        $.aMoveOpy(current_spring_box, {
            tx: 2000,
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
    });

    $('#signup_btn').bind('click', function(){
        if(current_spring_box != '#signupbox') {
            clearSpringBox();
            var ax = ($('body').width() - $('#signupbox').width()) / 2;
            $('#signupbox').aSpringShow({
                x: ax,
                ty: 150
            });
            current_spring_box = '#signupbox';
        }
    });

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

    //login
    $('#signin_submit').click(function(){
        $.ajax({
            url: '/sessions/create',
            type: 'POST',
            data: $('#login_form').serialize(),
            success: function(data) {
                initSetLoginData(true, data['data']);
                $('#s_container_handler').triggerHandler('connect');
            //set socket session;
            alert('登陆成功');
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

    //signup
    $('#signup_submit').bind('click', function(){
        $.ajax({
            url: '/members/create',
            type: 'POST',
            dataType: 'json',
            data: $('#signup_form').serialize(),
            success: function(data) {
                if(data.status == 'ok') {
                    alert('注册成功');
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

})(jQuery)