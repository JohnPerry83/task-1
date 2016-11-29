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
