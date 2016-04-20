/**
 * Useful functions collection
 */

/* The following comment tell gulp-jshint variable define is defined in another file. */ 
/* global define */
define({
	getUrlParam : function(name, ignoreCase) {
		var r = '';

		r = (function(name) {
			var pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');

			if (ignoreCase === true) {
				pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			}
			return location.search.substr(1).match(pattern);
		})(name);
		if (r != null) {
			return unescape(r[2]);
		}

		return '';
	}
});