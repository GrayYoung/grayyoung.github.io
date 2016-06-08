/**
 * Useful functions collection
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define({
	getUrlParam: function(name, ignoreCase) {
		var r = '';

		r = (function(name) {
			var pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', ignoreCase ? 'i' : '');

			return location.search.substr(1).match(pattern);
		})(name);
		if (r != null) {
			return decodeURIComponent(r[2]);
		}

		return '';
	},
	throttle: function(method, context, interval) {
		if(typeof interval != 'number') {
			interval = 100;
		}
		clearTimeout(method.timeoutId);
		method.timeoutId = setTimeout(function() {
			method.call(context);
		}, interval);
	}
});