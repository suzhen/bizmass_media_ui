HOST_NAME = "http://42.96.149.194";

var app = angular.module('nufangBJ', ['ngRoute','ngAnimate', 'ngTouch',"com.2fdevs.videogular",
      "com.2fdevs.videogular.plugins.controls",
      "com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.buffering",
      "com.2fdevs.videogular.plugins.poster"]);



app.config(function($routeProvider) {
    $routeProvider.
      when('/categories/:categoryId', {
        templateUrl: '/partials/albums.html',
        controller: 'albumController'
      }).
      when('/contact',{
        templateUrl: "/partials/contact.html"
      }).
      otherwise({redirectTo: '/categories/6'});

});
 
function categoryController($scope,$http){
	URL=HOST_NAME+'/api/categories.json'
	$http({method: 'GET', url: URL}).
  	success(function(data, status, headers, config) {
         $scope.items = data["data"]
  	}).
    error(function(data, status, headers, config) {
    	alert("服务无法链接")
    });
}

function albumController($scope,$http,$routeParams,$rootScope){
  $scope.host = HOST_NAME;
	URL=HOST_NAME+'/api/categories/'+$routeParams["categoryId"]+'/albums'
	$http({method: 'GET', url: URL}).
  	success(function(data, status, headers, config) {
         $scope.items = data["data"];
  	}).
    error(function(data, status, headers, config) {
    	alert("服务无法链接");
    });

   $rootScope.$broadcast('hideVideoEvent');
   $rootScope.$broadcast('hideDetailEvent');
   
   $scope.open_modal=function(albumId,albumEffect){
      if(albumEffect=="photo"){
        $rootScope.$broadcast('showDetailEvent', albumId);
        $rootScope.$broadcast('hideVideoEvent');
      }else{
        $rootScope.$broadcast('showVideoEvent', albumId);
        $rootScope.$broadcast('hideDetailEvent');
      }
   } 
}


angular.module('nufangBJ').controller('PhotoController', function ($scope,$http,$rootScope) {
        $scope.slides = [];
        $scope.host = HOST_NAME;
        $scope.items = [];
        $scope.show = false;
        $scope.$on('showDetailEvent', function(event, albumid) {
              $scope.show = true;
              URL=HOST_NAME+'/api/albums/'+albumid+'/materials.json'
              $http({method: 'GET', url: URL}).
              success(function(data, status, headers, config) {
                   $scope.slides = data["data"];
                    $scope.showSlide = true;
              }).
              error(function(data, status, headers, config) {
                alert("服务无法链接")
              });
        });
        $scope.$on("hideDetailEvent", function(event) {
            $scope.show = false;
        })

        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
    })
    .animation('.slide-animation', function () {
        return {
             addClass: function (element, className, done) {
                 var scope = element.scope();

                if (className == 'ng-hide') {
                    var finishPoint = element.parent().width();
                    if(scope.direction !== 'right') {
                        finishPoint = -finishPoint;
                    }
                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
                }
                else {
                    done();
                }
             },
             removeClass: function (element, className, done) {
                 var scope = element.scope();

                 if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    var startPoint = element.parent().width();
                    if(scope.direction === 'right') {
                        startPoint = -startPoint;
                    }

                    TweenMax.set(element, { left: startPoint });
                    TweenMax.to(element, 0.5, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
             }
        };
    });

  'use strict';
  angular.module('nufangBJ').controller('VideoController',function ($scope, $sce,$http) {
    $scope.currentTime = 0;
    $scope.totalTime = 0;
    $scope.state = null;
    $scope.volume = 1;
    $scope.isCompleted = false;
    $scope.API = null;
    $scope.show = false;
    


    $scope.onPlayerReady = function(API) {
      $scope.API = API;
    };

    $scope.onCompleteVideo = function() {
      $scope.isCompleted = true;
    };

    $scope.onUpdateState = function(state) {
      $scope.state = state;
    };

    $scope.onUpdateTime = function(currentTime, totalTime) {
      $scope.currentTime = currentTime;
      $scope.totalTime = totalTime;
    };

    $scope.onUpdateVolume = function(newVol) {
      $scope.volume = newVol;
    };

    $scope.onUpdateSize = function(width, height) {
      $scope.config.width = width;
      $scope.config.height = height;
    };

    $scope.stretchModes = [
      {label: "None", value: "none"},
      {label: "Fit", value: "fit"},
      {label: "Fill", value: "fill"}
    ];

    $scope.config = {
      width: 740,
      height: 380,
      autoHide: false,
      autoHideTime: 3000,
      autoPlay: false,
      responsive: false,
      stretch: $scope.stretchModes[0],
      // sources: [
      //   {src: $sce.trustAsResourceUrl("http://0.0.0.0:4567/images/videogular.mp4"), type: "video/mp4"},
      //   // {src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
      //   // {src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}

      //   {src: $sce.trustAsResourceUrl("http://0.0.0.0:4567/images/VIDEO0035.mp4"), type: "video/mp4"}
      // ],
      transclude: true,
      theme: {
        url: "stylesheets/videogular_themes/default/videogular.css",
        playIcon: "&#xe000;",
        pauseIcon: "&#xe001;",
        volumeLevel3Icon: "&#xe002;",
        volumeLevel2Icon: "&#xe003;",
        volumeLevel1Icon: "&#xe004;",
        volumeLevel0Icon: "&#xe005;",
        muteIcon: "&#xe006;",
        enterFullScreenIcon: "&#xe007;",
        exitFullScreenIcon: "&#xe008;"
      }
      // ,
      // plugins: {
      //   poster: {
      //     url: "images/t1.jpg"//"images/videogular.png"
      //   }

      // }
    };


    $scope.$on('showVideoEvent', function(event, albumid) {
              $scope.show = true;
              URL=HOST_NAME+'/api/albums/'+albumid+'/materials.json'
              $http({method: 'GET', url: URL}).
              success(function(data, status, headers, config) {
                   sources = []
                   source = {}
                   source["src"] = $sce.trustAsResourceUrl(HOST_NAME+data["data"][0]["video"])
                   source["type"] = "video/mp4"
                   sources.push(source)
                   $scope.config["sources"] = sources
                   $scope.config["plugins"] = {"poster":{"url":HOST_NAME+data["data"][0]["poster"]}}
              }).
              error(function(data, status, headers, config) {
                alert("服务无法链接")
              });

    });
    $scope.$on("hideVideoEvent", function(event) {
            $scope.show = false;
    })

  }
);

