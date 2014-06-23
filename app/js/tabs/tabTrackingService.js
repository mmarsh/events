'use strict';

angular.module('vividSeats')
.service('tabTrackingService', [function() {
    var currentTab;
    this.updateCurrentTab = function(tab) {
        currentTab = tab;
    }
    
    this.getCurrentTab = function () {
        return currentTab;
    }
}]);