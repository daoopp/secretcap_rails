Array.prototype.remove = function(s) {
  var i = this.indexOf(s);
  if(i != -1) 
    return this.splice(i, 1);
  else
    return this;
}
Array.prototype.empty = function() {
  if(this.length == 0)
    return true;
  else
    return false;
}
Array.prototype.max = function(){
  return Math.max.apply({},this)
}
Array.prototype.min = function(){
  return Math.min.apply({},this)
}
String.prototype.empty = function() {
  if(/^\s*$/.test(this))
    return true;
  else
    return false;
}

function is_ie6() {
    if(checkVersionIE8()) return false;
    return (jQuery.browser.msie && jQuery.browser.version < 7) ? true : false;
}
function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}
function checkVersionIE8() {
    var ver = getInternetExplorerVersion();
    if (ver > -1) {
        if (ver >= 8.0)
            return true;
    }
    return false;
}

function sp(e) {jQuery('#' + e).html("<img src='/images/loading.gif' border='0' />").show()}
function hp(e) {jQuery('#' + e).html("").hide()}

document.write("<style type='text/css'>.bbform_input_border_red{border: 1px solid red;}</style>");
var BBForm = {
    i: 0,

    //text
    textVal: function(id, error_msg) {
        var v = jQuery('#' + id.toString()).val();
        var status = v.match(/^\s*$/);
        BBForm.checkError(id, status, error_msg);
        return v;
    },
    //number
    numVal: function(id, error_msg) {
        var v = jQuery('#' + id.toString()).val();
        var status = v.match(/^[0-9\.]+$/);
        BBForm.checkError(id, !status, error_msg);
        return v;
    },
    //a-zA-Z0-9
    numEngVal: function(id, error_msg) {
        var v = jQuery('#' + id.toString()).val();
        var status = /^[a-zA-Z0-9]+$/.test(v);
        BBForm.checkError(id, !status, error_msg);
        return v;
    },
    //email
    emailVal: function(id, error_msg) {
        var v = jQuery('#' + id.toString()).val();
        var status = v.match(/^[a-zA-Z0-9\.\-\_]+@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]+$/);
        BBForm.checkError(id, !status, error_msg);
        return v;
    },
    //single select
    selectVal: function(id, error_msg, default_value) {
        var s = default_value || '';
        jQuery('#' + id.toString() + ' option').each(function(){
            if(jQuery(this).attr('selected'))
                s = jQuery(this).attr('value');
        })
        var ss = (s == default_value || s == '') ? true : false;
        BBForm.checkError(id, ss, error_msg);
        return s;
    },
    //value length
    lengthVal: function(id, error_msg, len, len2) {
        var v = jQuery('#' + id.toString()).val();
        var v2 = v.replace(/^[\s\n　]+|[\s\n　]+$/g, "");
        var status = (v2.length >= len && v2.length <= len2);
        BBForm.checkError(id, !status, error_msg);
        return v;
    },
    //date 2009-08-23
    dateVal: function(id, error_msg) {
        var v = jQuery('#' + id.toString()).val();
        var status = v.match(/^[1-9][0-9]{3}-[01][12]-[0-3][0-9]$/);
        BBForm.checkError(id, !status, error_msg);
        return v;
    },


    //private
    checkError: function(id, error, error_msg) {
        var e = jQuery('#' + id.toString() + '_error_msg');
        var ei = jQuery('#' + id.toString());
        if(error) {
            BBForm.i++;
            e.html(error_msg);
            BBForm.setBorderColor(ei);
        } else {
            e.html('');
            BBForm.clearBorderColor(ei);
        }
    },
    //set input border color
    setBorderColor: function(e) {
        e.css("border", "1px solid red");
    },
    clearBorderColor: function(e) {
        e.css("border", "1px solid black");
    }
}