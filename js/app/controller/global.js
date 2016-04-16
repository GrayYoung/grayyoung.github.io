/**
 * Global Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests', 'jquery', 'bootstrap', 'browser' ], function(requests, $) {
	$(document).ready(function() {
		$('#progressBar').toggleClass('loading', false);
		if($.browser.msie) {
			$('#tip-browser').removeClass('hidden');
		} else {
			$('#tip-browser').remove();
		}
	});

	(function(i, s, o, g, r, a, m) {
		i['GoogleAnalyticsObject'] = r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1 * new Date();
		a = s.createElement(o), m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

	ga('create', 'UA-51330074-5', 'auto');
	ga('require', 'linkid');
	ga('send', 'pageview');
});
