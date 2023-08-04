import axios from "axios";

class Request {
	constructor(config) {
		this.config = config;

		const { method, data, option = {} } = this.config;

		if (method.toLowerCase() === "get" || !method) {
			this.config.params = data;
			delete this.config.data;
		}

		this.source = axios.CancelToken.source();

		this._axios = axios.create({
			...option,
			cancelToken: this.source.token,
		});

		delete this.config.option;
	}

	send() {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await this._axios({
					...this.config,
				});

				if (res.status === 200) {
					resolve(res.data);
				} else {
					throw res.statusText;
				}
			} catch (error) {
				if (axios.isCancel(error) && this.config.cancel_tip) {
					resolve({
						request_is_cancel: true,
					});
				} else {
					reject(catchErrorHandle(error));
				}
			}
		});
	}

	cancel() {
		this.source.cancel();
	}
}

function catchErrorHandle(error, customErrorProperty = "message") {
	if (typeof error === "string") {
		return error;
	} else if (typeof error === "object") {
		if (Object.prototype.toString.call(error) === "[object Error]") {
			return error.message;
		} else if (error.errorFields) {
			return error.errorFields.length === 0
				? "未知错误"
				: error.errorFields[0].errors[0];
		} else if (error[customErrorProperty]) {
			return error[customErrorProperty];
		}  else {
			return JSON.stringify(error);
		}
	} else {
		return "未知错误";
	}
}

function getParam (paramName, url = window.location.href) {
	const questionMarkIndex = url.indexOf("?");

	if (questionMarkIndex !== -1) {
		const queryString = url.substring(questionMarkIndex + 1);
		const paramPairs = queryString.split("&");
		for (const paramPair of paramPairs) {
			const [key, value] = paramPair.split("=");
			if (key === paramName) {
				return decodeURIComponent(value);
			}
		}
	}

	return "";
};

function getTerminal() {
	var u = navigator.userAgent;
	var terminal = {
		mobile: !!u.match(/AppleWebKit.*Mobile.*/),
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
		iPhone: u.indexOf("iPhone") > -1,
		iPad: u.indexOf("iPad") > -1,
		weixin: u.indexOf("MicroMessenger") > -1,
		qq: u.match(/\sQQ/i) == " qq",
	};

	return terminal;
}

function dateFormate(fmt, date) {
	date = date instanceof Date ? date : new Date();
	var o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"H+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		S: date.getMilliseconds(),
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
			);
		}
	}
	return fmt;
}

function getEndTime(endDate, startTime) {
	var startTime = startTime || +new Date();
	var endTime = new Date(endDate).getTime();
	var t = endTime - startTime;
	var d = 0,
		h = 0,
		m = 0,
		s = 0;
	var data = {};
	if (t >= 0) {
		d = Math.floor(t / 1000 / 3600 / 24);
		h = Math.floor((t / 1000 / 60 / 60) % 24);
		m = Math.floor((t / 1000 / 60) % 60);
		s = Math.floor((t / 1000) % 60);
	}
	data = {
		str: d + "天" + h + "时" + m + "分" + s + "秒",
		day: d,
		hour: h,
		min: m,
		sec: s,
	};
	return data;
}

function Base64Encode(input) {
	var _keyStr =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
		output =
			output +
			_keyStr.charAt(enc1) +
			_keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) +
			_keyStr.charAt(enc4);
	}

	function utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
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

//base64解密
function Base64Decode(input) {
	var _keyStr =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
			} else if (c > 191 && c < 224) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(
					((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
				);
				i += 3;
			}
		}
		return string;
	}

	return output;
}

function throttle(fn, wait) {
	var timer = null;
	return function () {
		var context = this;
		var args = arguments;
		if (!timer) {
			timer = setTimeout(function () {
				fn.apply(context, args);
				timer = null;
			}, wait);
		}
	};
}

function debounce(func, wait, immediate) {
	var timer;

	return function () {
		var context = this;
		var args = arguments;

		if (timer) clearTimeout(timer);
		if (immediate) {
			var callNow = !timer;
			timer = setTimeout(function () {
				timer = null;
			}, wait);

			if (callNow) func.apply(context, args);
		} else {
			timer = setTimeout(function () {
				func.apply(context, args);
			}, wait);
		}
	};
}

export {
	Request,
	catchErrorHandle,
	getParam,
	getTerminal,
	dateFormate,
	getEndTime,
	Base64Encode,
	Base64Decode,
	throttle,
	debounce,
};
