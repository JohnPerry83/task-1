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
