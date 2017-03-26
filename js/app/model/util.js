/**
 * Useful functions collection
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define(function() {
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, patternPrice = /([^\w\.\,]?)([\d\.\,]+)/, match;
	var util = {
		sumPrice: function() {
			var currency = '$', price = 0.00, total = 0.00;

			for(var i in arguments) {
				match = patternPrice.exec(arguments[i]);
				if(match) {
					if(match[1]) {
						currency = match[1];
					}
					price = parseFloat(match[2].replace(',', ''));
					if(isNaN(price)) {
						price = 0.00;
					}
					total += price;
					match = null;
				}
			}

			return currency + total.toFixed(2);
		},
		getData: function(data) {
			if(data === 'true') {
				return true;
			}
			if(data === 'false') {
				return false;
			}
			if(data === 'null') {
				return null;
			}
			// Only convert to a number if it doesn't change the string
			if(data === +data + "") {
				return +data;
			}
			if(rbrace.test(data)) {
				return JSON.parse(data);
			}

			return data;
		},
		getUrlParam: function(name) {
			var pattern = new RegExp('(^|&)' + name + '=([^&]*)'), match;
	
			match = window.location.search.substr(1).match(pattern);
			if (match !== null) {
				return this.getData(decodeURIComponent(match[2]));
			}

			return '';
		},
		setUrlParam: function(name, value) {
			var query = location.search.replace(/^\?/, ''), 
				pattern = new RegExp('(^|&)(' + name + '=[^&]*)'), match;

			if(query) {
				match = query.match(pattern);
				if (match === null) {
					query = query + '&' + name + '=' + encodeURIComponent(value);
				} else {
					query = query.replace(pattern, '$1' + name + '=' + encodeURIComponent(value));
				}
			} else {
				query = name + '=' + encodeURIComponent(value);
			}

			history.replaceState(null, null, location.pathname + '?' + query);
		},
		removeUrlParam: function(name) {
			var query = location.search.replace(/^\?/, ''), 
				pattern = new RegExp('(^|&)(' + name + '=[^&]*)');

			query = query.replace(pattern, '');

			history.replaceState(null, null, location.pathname + '?' + query);
		},
		throttle: function(method, context, interval) {
			if(typeof interval !== 'number') {
				interval = 100;
			}
			clearTimeout(method.timeoutId);
			method.timeoutId = setTimeout(function() {
				method.call(context);
			}, interval);
		}
	};

	return util;
});