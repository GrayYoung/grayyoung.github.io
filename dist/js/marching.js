require(["./config"],function(config){var setting={html5Mode:!1};require(["app/model/requests","angular","animate","route","sanitize","bootstrap"],function(requests){var marching=angular.module("Marching",["ngAnimate","ngRoute","ngSanitize","ui.bootstrap"]);marching.config(["$routeProvider","$locationProvider",function($routeProvider,$locationProvider){$routeProvider.when("/",{templateUrl:"/partials/host.html",controller:"PreviewController"}).when("/home",{templateUrl:"/partials/host.html",controller:"PreviewController"}).when("/media/:type?",{templateUrl:"/partials/media.html",controller:"MediaController",controllerAs:"media"}).when("/:categories/blog/:blog",{templateUrl:"/partials/detail.html",controller:"PreviewController"}).otherwise({templateUrl:"/partials/error404.html",controller:"ErrorCtrl"});$locationProvider.html5Mode(setting.html5Mode)}]);marching.controller("NavigationController",function($rootScope,$scope,$http,$route){$rootScope.setting=setting;$http.get(requests.navigation).success(function(data){$rootScope.navigation=data});$scope.isEmpty=function(data){return angular.equals(data,{})};$rootScope.$on("$routeChangeStart",function(){angular.element(document.getElementById("progressBar")).addClass("loading")});$rootScope.$on("$routeChangeSuccess",function(){angular.element(document.getElementById("progressBar")).removeClass("loading")})});require(["app/controller/preview","app/controller/media"],function(preview,media){marching.controller("PreviewController",preview);marching.controller("MediaController",media);angular.bootstrap(document,["Marching"])})})});define("../marching",function(){});define("app/model/requests",{navigation:"data/navigation.json",blogs:"data/blogs.json",media:"data/media.json"});define("app/controller/preview",["app/model/requests"],function(requests){var mController=function($rootScope,$scope,$http){$http.get(requests.blogs).success(function(data){$scope.previews=data.items});$rootScope.getDeepPath=function(categories){var path="";angular.isDefined(categories)&&categories.length>0&&!function(cIndex,navigation){if(cIndex<categories.length&&navigation.children[categories[cIndex]]){path+=navigation.children[categories[cIndex]].path;arguments.callee(cIndex+1,navigation.children[categories[cIndex]])}}(0,$rootScope.navigation);return path}};mController.$inject=["$rootScope","$scope","$http"];return mController});define("app/controller/media",["app/model/requests"],function(requests,$){var mController=function($rootScope,$scope,$http,$routeParams,$window){$scope.more=requests.media;$scope.countPreview=0;$scope.loading=!1;angular.element($window).bind("scroll",function(){var cl=document.getElementById("containerListing");if(!$scope.more){angular.element($window).unbind("scroll");return!1}if(!$scope.loading&&cl.offsetHeight+cl.offsetTop<($window.scrollY||$window.pageYOffset)+$window.innerHeight){$scope.loading=!0;$http.get($scope.more,{cache:!1}).success(function(data){var elLContainer=angular.element(document.getElementById("containerListing")),createPreview=function(preview){var tImg=new Image;tImg.onload=function(){tImg=null};tImg.src=preview.Poster;return'<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 h-item h-review-aggregate"><figure class="thumbnail"><p class="p-category"><span class="text-capitalize">'+preview.Type+"</span>"+(preview.Genre?'<span ng-if="preview.Genre">: </span>':"")+'<span class="text-capitalize">'+(preview.Genre||"")+"</span></p><hr />"+(preview.Poster?"<img onerror=\"this.parentElement.style.backgroundImage = 'url("+preview.Poster+")'; this.parentElement.setAttribute('class', this.parentElement.getAttribute('class') + ' has-bg'); this.remove();\" class=\"center-block\" src=\""+preview.Poster+'" alt="Unavailable Photo" />':"")+'<figcaption><div class="caption"><h3 class="p-name"><strong>'+preview.Title+'</strong></h3><p><span class="text-muted">Director: </span><strong>'+(preview.Director||"N/A")+'</strong></p><p><span class="text-muted">Actors: </span><strong>'+(preview.Actors||"N/A")+'</strong></p><p class="p-summary"><span class="text-muted">Plot: </span>'+(preview.Plot||"N/A")+'</p><p class="p-rating">'+(preview.imdbRating?'<span style="width: '+preview.imdbRating+'em"><span class="p-count text-warning"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span></span>':"")+'<span class="p-votes">'+(preview.imdbRating?'<span class="text-success fa-lg">'+preview.imdbRating+"</span>":"")+(preview.imdbVotes?'<small class="text-muted">('+preview.imdbVotes+")</small>":"")+"</span></p></div></figcaption>"+(preview.imdbID?'<a class="u-url" target="_blank" ng-href="'+$scope.imdbHost+"title/"+preview.imdbID+'"><strong><i>Read more...</i></strong></a>':"")+"</figure></div>"};$scope.imdbHost=data.imdbHost||$scope.imdbHost;$scope.more=data.more;if($routeParams.type)for(var i=0;i<data.items.length;i++){var preview=data.items[i];if(new RegExp($routeParams.type,"i").test(preview.Type));else{data.items.splice(i,1);--i}}if(0===data.items.length){$scope.loading=!1;angular.element($window).triggerHandler("scroll");return!1}!function(index){var oneAfterOne=arguments.callee,preview=data.items[index];if(preview.imdbID)$http({url:"http://www.omdbapi.com/",type:"post",params:{i:preview.imdbID,plot:"short",r:"json"}}).then(function(response){elLContainer.append(createPreview(response.data));++$scope.countPreview;index===data.items.length-1?$scope.loading=!1:oneAfterOne(index+1)},function(response){elLContainer.append(createPreview(preview));++$scope.countPreview;index===data.items.length-1?$scope.loading=!1:oneAfterOne(index+1)});else{elLContainer.append(createPreview(preview));++$scope.countPreview;index===data.items.length-1?$scope.loading=!1:oneAfterOne(index+1)}}(0)})}}).triggerHandler("scroll")};mController.$inject=["$rootScope","$scope","$http","$routeParams","$window"];return mController});