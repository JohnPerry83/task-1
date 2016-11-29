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