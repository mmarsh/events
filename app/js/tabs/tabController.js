'use strict';

angular.module('vividSeats')
  .controller('tabController', function($scope, $rootScope, startingTabId, tabTrackingService) {
    var activeTab;
    $scope.getTabById = function(id) {
        for(var i = 0 ; i < $scope.tabs.length ; i++) {
            if($scope.tabs[i].id === id) {
                return $scope.tabs[i];
            }
        };
    };
    
    window.onpopstate = function(event) {
        var tabId = event.state.id;
        $scope.tabClick($scope.tabs.filter(function (tab) {
            return tab.id === tabId;
        })[0]);
    };
    
    $scope.isActiveTab = function (tab){
        return activeTab.name === tab.name;
    }
    
    $scope.tabs = [{
            id: 1,
            name: 'All Events',
            filterMethod: function (event) { return true; }
        },
        {
            id: 2,
            name: 'Events in New York',
            filterMethod: function (event) { return event.venue.city === 'New York'; }
        }];
    
    $scope.tabClick = function(tab) {
        activeTab = tab;
        history.pushState({id: activeTab.id}, 'Tab '+activeTab.id, "?tab=" + activeTab.id);
        tabTrackingService.updateCurrentTab(activeTab);
        $rootScope.$broadcast('tabChanged', activeTab);
    }
    
    $scope.tabClick($scope.getTabById(startingTabId));
});