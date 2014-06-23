'use strict';

angular.module('vividSeats')
.directive('tab', function() {
    return {
        restrict: 'A',
        template: "<span ng-class='{activeTab:isActiveTab(tab),inactiveTab:!isActiveTab(tab)}'" +
                        "ng-click='tabClick(tab)'>" + 
                        "{{tab.name}}" +
                        "</span>"
    };
});