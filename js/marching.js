/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	var setting = {
		html5Mode : false
	};

	require([ 'app/model/requests', 'angular', 'animate', 'route', 'bootstrap' ], function(requests) {
		var marching = angular.module('Marching', [ 'ngAnimate', 'ngRoute', 'ui.bootstrap' ]);

		marching.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			//$rootScope.setting = setting;

			$routeProvider.when('/', {
				templateUrl : '/partials/host.html',
				controller : 'PreviewController'
			}).when('/home', {
				templateUrl : '/partials/host.html',
				controller : 'PreviewController'
			}).when('/:categories', {
				templateUrl : '/partials/previews.html',
				controller : 'PreviewController'
			}).when('/:categories*/blog/:blog', {
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

		marching.controller('PreviewController', function($rootScope, $scope, $http) {
			$http.get(requests.blogs).success(function(data) {
				$scope.previews = data.items;
			});

			$rootScope.getDeepPath = function(categories) {
				var path = '';

				if(angular.isDefined(categories) && categories.length > 0) {
					(function(cIndex, navigation) {
						if(cIndex < categories.length && navigation.children[ categories[ cIndex ] ]) {
							path += navigation.children[ categories[ cIndex ] ].path;
							arguments.callee((cIndex + 1), navigation.children[ categories[ cIndex ] ]);
						}
					})(0, $rootScope.navigation);
				}

				return path;
			}
		});

		angular.bootstrap(document, ['Marching']);
	});
});