'use strict';

angular.module('vividSeats')
.controller('tabController', function($scope, $rootScope, startingTabId, tabTrackingService) {
    var activeTab;
    var getTabById = function(id) {
        for(var i = 0 ; i < $scope.tabs.length ; i++) {
            if($scope.tabs[i].id === id) {
                return $scope.tabs[i];
            }
        };
    };
    var changeActiveTab = function (tab) {
        activeTab = tab;        
        history.pushState({id: activeTab.id}, 'Tab '+ activeTab.id, "?tab=" + activeTab.id);
        tabTrackingService.updateCurrentTab(activeTab);
        $rootScope.$broadcast('tabChanged', activeTab);
    };
    
    window.onpopstate = function(event) {
        if(!event.state) {
            return;
        }
        var tabId = event.state.id;
        changeActiveTab(getTabById(tabId));
        $scope.$digest();
    };
    
    $scope.isActiveTab = function (tab){
        return activeTab.name === tab.name;
    }
    
    $scope.tabs = [
        {
            id: 1,
            name: 'All Events',
            filterMethod: function (event) { return true; }
        },
        {
            id: 2,
            name: 'Upcoming Events',
            filterMethod: function (event) { 
                return new Date(event.date) < new Date('2014-01-16T00:00:00'); 
            }
        },
        {
            id: 3,
            name: 'Local Events',
            filterMethod: function (event) { return event.venue.city === 'New York'; }
        },
        
    ];
    
    $scope.tabClick = function (tab) {
        changeActiveTab(tab);
    }
    
    changeActiveTab(getTabById(startingTabId));
});