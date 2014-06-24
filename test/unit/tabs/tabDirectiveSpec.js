'use strict';

angular.module('vividSeats')
.directive('tab', function() {
    return {
        restrict: 'A',
        template: "<span ng-class='{activeTab:isActiveTab(tab),inactiveTab:!isActiveTab(tab)}'" +
                        "ng-click='tab.click()'>" + 
                        "{{tab.name}}" +
                        "</span>"
    };
});