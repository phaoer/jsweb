;
! function (win) {
    "use strict";
    var JsWeb = function () {
        this.moduleUrl = null;
        this.url = null;
    };

    JsWeb.prototype.req = function (url, opthion, callback) {
        // opthion:
        // method
        // data
        // dataType
        // withCookie
        var setting = {
            url: url,
            type: opthion.method,
            data: opthion.data,
            dataType: opthion.dataType,
            success: function (res) {
                callback.call(win, res);
            }
        };

        errorCallback && (setting.error = function(a, b, c){ errorCallback.call(win, a.statusText); });

        opthion.dataType == "jsonp" && (opthion.jsonp = "callback");

        opthion.withCookie && (setting.crossDomain = true) && (setting.xhrFields = { withCredentials: true });

        $.ajax(setting);
    }

    JsWeb.prototype.getParam = function () {
        var Url = window.location.href;
        var u, g, StrBack = '';
        if (arguments[arguments.length - 1] == "#")
            u = Url.split("#");
        else
            u = Url.split("?");
        if (u.length == 1) g = '';
        else g = u[1];

        if (g != '') {
            var gg = g.split("&");
            var MaxI = gg.length;
            var str = arguments[0] + "=";
            for (var xm = 0; xm < MaxI; xm++) {
                if (gg[xm].indexOf(str) == 0) {
                    StrBack = gg[xm].replace(str, "");
                    break;
                }
            }
        }
        return StrBack;
    }

    JsWeb.prototype.Base64Encode = function (input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = utf8Encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }

        function utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
        return output;
    }

    JsWeb.prototype.Base64Decode = function (input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = utf8Decode(output);

        function utf8Decode(utftext) {
            var string = "";
            var i = 0;
            var c = 0,
                c1 = 0,
                c2 = 0;
            c = c1 = c2;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }

        return output;
    }

    JsWeb.prototype.dateFormate = function (fmt, date) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    JsWeb.prototype.getTerminal = function () {
        var u = navigator.userAgent;
        var terminal = {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
            iPhone: u.indexOf("iPhone") > -1,
            iPad: u.indexOf("iPad") > -1,
            weixin: u.indexOf("MicroMessenger") > -1,
            qq: u.match(/\sQQ/i) == " qq"
        };

        return terminal;
    }

    JsWeb.prototype.use = function (mod, callback) {
        var that = this,
            head = document.getElementsByTagName('head')[0],
            node = document.createElement('script'),
            mod = typeof mod === 'string' ? [mod] : mod,
            modName = mod[0];

        this.moduleUrl = window.location.protocol + ".../module/";

        switch (modName) {   //special
            case "layui":
                modName = "layui/layui";
                break;
            default:
                break;
        }

        this.url = this.moduleUrl + modName + ".js";

        if (!mod[0]) {
            callback.apply(_jsweb);
            return;
        }

        node.async = true;
        node.charset = 'utf-8';
        node.src = this.url;

        head.appendChild(node);

        if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !(typeof opera !== 'undefined' && opera.toString() === '[object Opera]')) {
            node.attachEvent('onreadystatechange', function (e) {
                loaded(e);
            });
        } else {
            node.addEventListener('load', function (e) {
                loaded(e);
            }, false);
        }

        function loaded(e) {
            var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/;
            if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
                mod.length > 1 ? that.use(mod.slice(1), callback) : (typeof callback === 'function' && callback.apply(_jsweb));
            }
        }
    };

    win._jsweb = new JsWeb();
}(window);