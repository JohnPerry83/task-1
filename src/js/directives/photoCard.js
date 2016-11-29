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

