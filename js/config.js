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
		messages : 'angular-messages.min',
		animate : 'angular-animate.min',
		touch : 'angular-touch.min',
		bootstrap : 'ui-bootstrap.min'
	},
	shim : {
		route : [ 'angular' ],
		messages : [ 'angular' ],
		resource : [ 'angular' ],
		animate : [ 'angular' ],
		touch : [ 'angular' ],
		bootstrap : [ 'angular' ]
	},
	map : {
	},
	waitSeconds : 0
});