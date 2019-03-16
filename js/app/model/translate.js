/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global define */
define([ 'jquery' ], function($) {
	return function(params, callback) {
		return $.post('https://translation.googleapis.com/language/translate/v2', {
			key: 'AIzaSyBECsgJK9qsTirYdxvaPWfOywXxiwdYe5k',
			format: 'text',
			model: 'nmt',
			source: params.from,
			target: params.to,
			q: params.query
		}, function(result) {
			callback({
				translated: result.data.translations[0].translatedText
			});
		});
	};
});