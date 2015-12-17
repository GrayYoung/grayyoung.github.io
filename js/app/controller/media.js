/**
 * Media Controller
 * 
 */

/* The following comment tell gulp-jshint variable define is require in another file. */
/* global require */
define([ 'app/model/requests' ], function(requests, $) {
	var mController = function($rootScope, $scope, $http, $routeParams, $window) {
		$scope.more = requests.media;
		$scope.countPreview = 0;
		$scope.loading = false;

		angular.element($window).bind('scroll', function() {
			var cl = document.getElementById('containerListing');

			if(!$scope.more) {
				angular.element($window).unbind('scroll');

				return false;
			}
			if(!$scope.loading && (cl.offsetHeight + cl.offsetTop < ($window.scrollY || $window.pageYOffset) + $window.innerHeight)) {
				$scope.loading = true;
				$http.get($scope.more, {
					cache : false
				}).success(function(data) {
					var elLContainer = angular.element(document.getElementById('containerListing'));
					var createPreview = function(preview) {
						var tImg = new Image();

						tImg.onload = function () {
							tImg = null;
						};
						tImg.src = preview.Poster;

						return '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 h-item h-review-aggregate">'
						+ '<figure class="thumbnail"><p class="p-category"><span class="text-capitalize">' + preview.Type + '</span>'
						+ (preview.Genre ? '<span ng-if="preview.Genre">: </span>' : '') + '<span class="text-capitalize">' + (preview.Genre || '') + '</span></p>'
						+ '<hr />' + (preview.Poster ? '<img onerror="console.log(this); this.parent.parent.style.backgroundImage = \'url(' + preview.Poster + ')\'; this.remove();" class="center-block" src="' + preview.Poster + '" alt="Unavailable Photo" />' : '')
						+ '<figcaption><div class="caption"><h3 class="p-name"><strong>' + preview.Title + '</strong></h3>'
						+ '<p><span class="text-muted">Director: </span><strong>' + (preview.Director || 'N/A') + '</strong></p>'
						+ '<p><span class="text-muted">Actors: </span><strong>' + (preview.Actors || 'N/A') + '</strong></p>'
						+ '<p class="p-summary"><span class="text-muted">Plot: </span>' +( preview.Plot || 'N/A') + '</p>'
						+ '<p class="p-rating">' + (preview.imdbRating ? '<span style="width: ' + preview.imdbRating + 'em"><span class="p-count text-warning"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span></span>' : '')
						+ '<span class="p-votes">' + (preview.imdbRating ? '<span class="text-success fa-lg">' + preview.imdbRating + '</span>' : '')
						+ (preview.imdbVotes ? '<small class="text-muted">(' + preview.imdbVotes + ')</small>' : '') + '</span></p></div></figcaption>'
						+ (preview.imdbID ? '<a class="u-url" target="_blank" ng-href="' + $scope.imdbHost + 'title/' + preview.imdbID + '"><strong><i>Read more...</i></strong></a>' : '') + '</figure></div>';
					};

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
					(function(index) {
						var oneAfterOne = arguments.callee;
						var preview = data.items[ index ];

						if(preview.imdbID) {
							$http({
								url : 'http://www.omdbapi.com/',
								type : 'post',
								params : {
									i : preview.imdbID,
									plot : 'short' || 'full',
									r : 'json'
								}
							}).then(function(response) {
								elLContainer.append(createPreview(response.data));
								++$scope.countPreview;
								if(index === data.items.length - 1) {
									$scope.loading = false;
								} else {
									oneAfterOne(index + 1);
								}
							}, function(response) {
								elLContainer.append(createPreview(preview));
								++$scope.countPreview;
								if(index === data.items.length - 1) {
									$scope.loading = false;
								} else {
									oneAfterOne(index + 1);
								}
							});
						} else {
							elLContainer.append(createPreview(preview));
							++$scope.countPreview;
							if(index === data.items.length - 1) {
								$scope.loading = false;
							} else {
								oneAfterOne(index + 1);
							}
						}
					})(0);
				});
			}
		}).triggerHandler('scroll');
	};

	mController.$inject = [ '$rootScope', '$scope', '$http', '$routeParams', '$window' ];

	return mController;
});
