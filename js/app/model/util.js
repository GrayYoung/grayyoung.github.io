/**
 * Useful functions collection
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define({
	hasEvent : function(type, events) {
		var tmp = /^([^.]*)(?:\.(.+)|)$/.exec( type ) || [];
		var typeT = origType = tmp[1];
		
		return events ? events[typeT] ? (function() {
			var breakFct = false;
			var namespace = ( tmp[2] || '' ).split( '.' ).sort().join('.');
			
			$.each(events[typeT], function(i, e) {
				if(e.namespace === namespace) {
					breakFct = true;
					return false;
				}
			});
			return breakFct;
		})() ? true : false : false : false;
	},
	getUrlParam : function(name, ignoreCase) {
		var r = '';
		function getRegExp(name) {
			var pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			if (ignoreCase === true) {
				pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			}
			return window.location.search.substr(1).match(pattern);
		}
		r = getRegExp(name);
		if (r != null) {
			return unescape(r[2]);
		}
		return '';
	},
	setCookie : function(cname, cvalue, exdays, domain) {
		var tempCookieStr = cname + '=' + cvalue + ';';
		if (exdays && exdays != '') {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = 'expires=' + d.toGMTString();
			tempCookieStr += expires + ';';
		}
		tempCookieStr += 'path=/;'
		if (domain && domain != '') {
			tempCookieStr += domain + ';';
		}
		document.cookie = tempCookieStr;
	},
	getCookie : function(cname) {
		var name = cname + '=';
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = $.trim(ca[i]);
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}
});