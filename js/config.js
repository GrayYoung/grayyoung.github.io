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
		messages : 'angular-messages.min',
		animate : 'angular-animate.min'
	},
	shim : {
		route : [ 'angular' ],
		messages : [ 'angular' ],
		animate : [ 'angular' ]
	},
	map : {
	},
	waitSeconds : 0
});