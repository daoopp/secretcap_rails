var SNumber = {
  
  container: {
    1: '<div title="1" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left 0px;"></div>',
    2: '<div title="2" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -64px;"></div>',
    3: '<div title="3" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -126px;"></div>',
    4: '<div title="4" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -190px;"></div>',
    5: '<div title="5" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -253px;"></div>',
    6: '<div title="6" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -315px;"></div>',
    7: '<div title="7" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -379px;"></div>',
    8: '<div title="8" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -441px;"></div>',
    9: '<div title="9" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -504px;"></div>',
    0: '<div title="0" style="width: 28px;height: 34px;float: left;background: url(/images/number2.png) no-repeat left -567px;"></div>'
  },

  number: function(n, clear) {
    var html = "";
    var str = n.toString().split('');
    for(var i = 0; i < str.length; i ++) {
      html += SNumber.container[parseInt(str[i])];
    }
    return clear ? html + "<div style='height:0;width:0;clear:both;'></div>" : html;
  }
}