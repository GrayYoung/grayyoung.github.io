/**
 * Default for the pages that don't need modules else.
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
require([ './config' ], function(config) {
	/* global define */
	require([ 'app/model/requests', 'angular' ], function(requests) {
		var marching = angular.module('Marching', []);

		marching.controller('NavigationController', function($scope, $http) {
			$http.get(requests.navigation).success(function(data) {
				console.log(data);
				$scope.navigation = data.items;
			});
		});

		angular.bootstrap(document, ['Marching']);
	});
});