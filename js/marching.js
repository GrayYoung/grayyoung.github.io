/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	var setting = {
		html5Mode : false
	};

	require([ 'app/model/requests', 'angular', 'animate', 'route', 'sanitize', 'bootstrap' ], function(requests) {
		var marching = angular.module('Marching', [ 'ngAnimate', 'ngRoute', 'ngSanitize', 'ui.bootstrap' ]);

		marching.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			//$rootScope.setting = setting;

			$routeProvider.when('/', {
				templateUrl : '/partials/host.html',
				controller : 'PreviewController'
			}).when('/home', {
				templateUrl : '/partials/host.html',
				controller : 'PreviewController'
			}).when('/media/:type?', {
				templateUrl : '/partials/media.html',
				controller : 'MediaController',
				controllerAs: 'media'
			}).when('/:categories/blog/:blog', {
				templateUrl : '/partials/detail.html',
				controller : 'PreviewController'
			}).otherwise({
				templateUrl : '/partials/error404.html',
				controller : 'ErrorCtrl'
			});

			$locationProvider.html5Mode(setting.html5Mode);
		} ]);
		marching.controller('NavigationController', function($rootScope, $scope, $http) {
			$rootScope.setting = setting;

			$http.get(requests.navigation).success(function(data) {
				$rootScope.navigation = data;
			});

			$scope.isEmpty = function(data) {
				return angular.equals(data, {});
			}
		});
		require([ 
			'app/controller/preview',
			'app/controller/media'
		], function(preview, media) {
			marching.controller('PreviewController', preview);
			marching.controller('MediaController', media);
			angular.bootstrap(document, [ 'Marching' ]);
		});

	});
});