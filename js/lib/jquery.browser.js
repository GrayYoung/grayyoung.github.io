/**
 * jQuery.Utilities - Browser
 * Version: 1.1.9
 * Author: Gray Young
 * 
 * Copyright 2016 Released under the MIT license.
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([ 'jquery' ], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {
	/* Override and enhance jQuery.browser */
	$.uaMatch = function(ua) {
		ua = ua.toLowerCase();
		/* msie -> trident */
		var match = /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(opr)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(ua) || ua.indexOf('compatible') < 0 && ua.indexOf('trident') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
		var deviceM = /(mobile)/.exec(ua), operationM = /(windows|mac|android)/.exec(ua);

		return {
			browser : match[1] ? match[1] : '',
			version : match[2] ? match[2] : '0',
			device : deviceM ? deviceM[1] : '',
			operation : operationM ? operationM[1] : ''
		};
	};

	matched = $.uaMatch(navigator.userAgent);
	browser = {};

	if (matched.browser) {
		browser[(matched.browser == 'trident' ? 'msie' : matched.browser == 'opr' ? 'opera' : matched.browser)] = true;
		browser[matched.operation] = true;
		browser[matched.device] = true;
		browser.version = parseInt(matched.version, 10);
		browser.oVersion = matched.version;
	}

	if (browser.chrome || (browser.opera && parseInt(browser.version, 10) >= 15)) {
		browser.webkit = true;
	} else if (browser.webkit) {
		browser.safari = true;
	}

	$.browser = browser;
}));