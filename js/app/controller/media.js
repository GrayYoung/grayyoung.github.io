/**
 * Media Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests' ], function(requests, $) {
	var mController = function($rootScope, $scope, $http, $routeParams, $window) {
		$scope.more = requests.media;
		$scope.previews = [];
		$scope.loading = false;

		angular.element($window).bind('scroll', function() {
			var cl = document.getElementById('containerListing');

			if(!$scope.more) {
				angular.element($window).unbind('scroll');

				return false;
			}
			if(!$scope.loading && (cl.offsetHeight + cl.offsetTop < ($window.scrollY || $window.pageYOffset) + $window.innerHeight)) {
				$scope.loading = true;
				$http.get($scope.more).success(function(data) {
					$scope.imdbHost = data.imdbHost || $scope.imdbHost;
					$scope.more = data.more;

					if($routeParams.type) {
						for(var i = 0; i < data.items.length; i++) {
							var preview = data.items[ i ];
			
							if(!(new RegExp($routeParams.type, 'i').test(preview.Type))) {
								data.items.splice(i, 1);
								--i;
								continue;
							}
						}
					}
					if(data.items.length === 0) {
						$scope.loading = false;
						angular.element($window).triggerHandler('scroll');

						return false;
					}
					angular.forEach(data.items, function(preview, index) {
						if(preview.imdbID) {
							$http({
								url : 'http://www.omdbapi.com/',
								type : 'get',
								params : {
									i : preview.imdbID,
									plot : 'short' || 'full',
									r : 'json'
								}
							}).then(function(response) {
								$scope.previews.push(response.data);
								if(index === data.items.length - 1) {
									$scope.loading = false;
								}
							}, function(response) {
								if(index === data.items.length - 1) {
									$scope.loading = false;
								}
							});
						}
					});
				});
			}
		}).triggerHandler('scroll');
	};

	mController.$inject = [ '$rootScope', '$scope', '$http', '$routeParams', '$window' ];

	return mController;
});