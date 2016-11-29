var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);

myApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/home.html', 
                controller: 'ApiController'
            }).
            when('home', {
                templateUrl: 'views/home.html',
                controller: 'ApiController'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }
]);

myApp.controller('ApiController', ['$http', 'flickrApi', function ($http, flickrApi) {
        
    var vm = this;
    vm.items = [];

    function success(items) {
        vm.items = items;
    }

    function error(err) {
        console.log('There was an error:', err);
    }

    flickrApi.getImages().then(success, error);
}]);

// myApp.controller('navController', ['$scope', function ($scope) {
//     $scope.navItems = [
//         { 
//             name: 'Home',
//             url: '/#/'
//          },
//         { 
//             name: 'About',
//             url: '/#about'
//         },
//         { 
//             name: 'Projects',
//             url: '/#projects'
//         },
//         { 
//             name: 'Contact',
//             url: '/#contact'
//         }
//     ]
// }]);

myApp.directive('photoCard', ['cookieService', function (cookieService) {
    return {
        restrict: 'AEC',
        template: `
            <div class="c-photo__img">
                <img class="c-photo__img" src="{{item.media.m}}"  />
            </div>
            <div class="c-photo__details">
                <div class="c-photo__like-btn">
                    <i class="c-icon c-icon--unselected fa fa-heart-o" aria-hidden="true"></i>
                    <i class="c-icon c-icon--selected fa fa-heart" aria-hidden="true"></i>
                </div>
            </div>`
        ,
        link: function (scope, element, attrs) {
            // Check if a cookie exists using the elements index attribute (e.g photo-0, photo-1) 
            // If it does, give it the selected class
            if (cookieService.getCookieData('photo-' + attrs.index)) {
                element.addClass('selected');
            };

            scope._handleClick = function () {
                var cookieKey = element.attr('id');
                element.toggleClass('selected');
                
                scope.selected = element.hasClass('selected') ? true : false;
                
                if (scope.selected) {
                    cookieService.setCookieData(cookieKey)
                } else {
                    cookieService.clearCookieData(cookieKey)
                }
            }
        }   
    }
}]);


myApp.factory('cookieService', [ '$cookies', function ($cookies) {
        
        var imgId = '';

        return {
            setCookieData: function(imgId) {
                imgId = imgId;
                $cookies.put(imgId, true);
            },
            getCookieData: function(imgId) {
                imgId = $cookies.get(imgId);
                return imgId;
            },
            clearCookieData: function(imgId) {
                $cookies.remove(imgId);
                imgId = '';
            }
        }
    }
]);

myApp.factory('flickrApi', ['$http', '$q', function ($http, $q) {
    
    var tags = 'london';
    var url = "http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=JSON_CALLBACK&tags=" + tags;
    

    return {
        getImages: function () {
            var dfd = $q.defer();

            $http.jsonp(url).success(function (data) {
                dfd.resolve(data.items);
            }).catch(function (err) {
                dfd.reject(err);
            });

            return dfd.promise;
        }
    }
    
}]);