/**
 * Global Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests', 'jquery', 'bootstrap' ], function(requests, $) {
	$(document).ready(function() {
		$('#progressBar').toggleClass('loading', false);
		if($('#containerListing').size() > 0) {
			require([ 'app/controller/media' ]);
		}
	});
});
