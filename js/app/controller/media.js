/**
 * Media Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests' ], function(requests, $) {
	var mController = function($rootScope, $scope, $http) {
		$http.get(requests.media).success(function(data) {
			$scope.imdbHost = data.imdbHost;
			$scope.previews = data.items;
			$scope.more = data.more;

			angular.forEach($scope.previews, function(preview, index) {
				if(preview.imdb) {
					$http({
						url : data.imdbHost,
						type : 'get',
						params : {
							i : preview.imdb,
							plot : 'full',
							r : 'json'
						}
					}).then(function(response) {
						$scope.previews[ index ] = response.data;
					}, function(response) {
					});
				}
			});
		});
	};

	mController.$inject = [ '$rootScope', '$scope', '$http' ];

	return mController;
});