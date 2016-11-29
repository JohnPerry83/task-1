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
