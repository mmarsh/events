'use strict';

angular.module('vividSeats')
.controller('eventGridController', function($scope, tabTrackingService) {
    var eventId = 133;
    var venueId = 3245;
      
    var displayError = function(errMsg) {
        $scope.errorMessage = errMsg;
        $scope.$digest();
    };

    var processEvents = function(events) {
        var newEvents = [];
        angular.forEach(events, function(event) {
            var newEvent = {};
            newEvent.rootEvent = event;
            newEvent.editing = false;
            newEvent.toggleEdit = function () {
                this.editing = !this.editing;
            }
            this.push(newEvent);
        }, newEvents);
        
        return newEvents;
    };

    var refreshEvents = function () {
        var filterMethod = tabTrackingService.getCurrentTab().filterMethod;
        VividSeats.eventService.all(function (events) {
            $scope.events = processEvents(filterMethod ? events.filter(filterMethod) : events);
            $scope.$digest();
            $scope.errorMessage = '';
        }, displayError);
    };
    
    $scope.$on('tabChanged', function () {
        refreshEvents();
    });

    $scope.remove = function (event) {
        if(window.confirm('Are you sure you want to remove this event?')) {
            VividSeats.eventService.remove(event.rootEvent, refreshEvents, displayError);
        }
    };

    $scope.update = function (event) {
        VividSeats.eventService.update(event.rootEvent, refreshEvents, displayError);
    };

    $scope.cancelAdd = function () {
        $scope.newEvent = undefined;
    }

    $scope.save = function () {
        $scope.newEvent.id = eventId++;
        $scope.newEvent.venue.id =  venueId++;
        VividSeats.eventService.add($scope.newEvent, function () {
            $scope.cancelAdd();
            refreshEvents();
        }, displayError);
    }

    $scope.add = function () {
        $scope.newEvent = {
            name: '',
            date: '',
            venue: {
                name: '',
                city: '',
                state: ''
            }
        }
    }
    
    refreshEvents();
});