/**
 * Common requirejs config for all page modules.
 */

/*
 * The following comment tell gulp-jshint variable define is requirejs in
 * another file.
 */
/* global requirejs */
requirejs.config({
	baseUrl : 'js/lib',
	paths : {
		app : '../app',
		angular : 'angular',
		route : 'angular-route.min',
		resource : 'angular-resource.min',
		sanitize : 'angular-sanitize.min',
		messages : 'angular-messages.min',
		animate : 'angular-animate.min',
		touch : 'angular-touch.min',
		bootstrap : 'ui-bootstrap.min',
		masonry : 'masonry.pkgd.min',
		masonryDirective : 'angular-masonry-directive'
	},
	shim : {
		route : [ 'angular' ],
		resource : [ 'angular' ],
		sanitize : [ 'angular' ],
		messages : [ 'angular' ],
		animate : [ 'angular' ],
		touch : [ 'angular' ],
		bootstrap : [ 'angular' ],
		masonryDirective : [ 'angular', 'masonry' ]
	},
	map : {
	},
	waitSeconds : 0
});