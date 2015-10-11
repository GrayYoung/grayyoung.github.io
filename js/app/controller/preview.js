/**
 * Preview Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests' ], function(requests) {
	var mController = function($rootScope, $scope, $http) {
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
		};
	};

	mController.$inject = [ '$rootScope', '$scope', '$http' ];

	return mController;
});