describe('tabController', function() {
    var sut, scope, rootScope, mockTabTrackingService;
    beforeEach(function() {
        angular.mock.module('vividSeats');
        
        mockTabTrackingService = {
            updateCurrentTab: jasmine.createSpy()
        };
        
        angular.mock.module(function($provide) {
            $provide.value('startingTabId', 1);
            $provide.value('tabTrackingService', mockTabTrackingService);
        });

        spyOn(history, 'pushState');
        
        angular.mock.inject(function($rootScope, $controller) {
            rootScope = $rootScope;
            spyOn(rootScope, '$broadcast');
            scope = $rootScope.$new();
            sut = $controller('tabController', {
                $scope: scope
            });
        });
    });

    describe('initial state', function () {
        describe('active tab', function () {
            it('should match the tab indicated by the injected startingTabId ', function () {
                expect(scope.isActiveTab(scope.tabs[0])).toBe(true);
                expect(scope.isActiveTab(scope.tabs[1])).toBe(false);
            });
        });
        
    });
    
    describe('tabs', function () {
        beforeEach(function () {
            this.sampleEvents = [{
                    id: 1,
                    date: '2014-01-15T10:30:00',
                    venue: {
                        city: 'New York'
                    }
                },
                {
                    id: 2,
                    date: '2014-01-16T14:00:00',
                    venue: {
                        city: 'Boston'
                    }},
            ];
        });
        it('should have the correct number of tabs available', function() {
            expect(scope.tabs.length).toBe(3);
        });
        
        describe('All Events tab', function () {
            beforeEach(function () {
                this.tabUnderTest = scope.tabs[0];
            });
            
            it('should have the correct id', function() {
                expect(this.tabUnderTest.id).toBe(1);
            });
            
            it('should have the correct name', function() {
                expect(this.tabUnderTest.name).toBe('All Events');
            });
            
            it('should have the correct filter method', function() {
                var filteredSampleEvents = this.sampleEvents.filter(this.tabUnderTest.filterMethod);
                expect(filteredSampleEvents.length).toBe(2);
                expect(filteredSampleEvents[0].id).toBe(1);
                expect(filteredSampleEvents[1].id).toBe(2);
            });
        });
        
        describe('Upcoming Events tab', function () {
            beforeEach(function () {
                this.tabUnderTest = scope.tabs[1];
            });
            
            it('should have the correct id', function() {
                expect(this.tabUnderTest.id).toBe(2);
            });
            
            it('should have the correct name', function() {
                expect(this.tabUnderTest.name).toBe('Upcoming Events');
            });
            
            it('should have the correct filter method', function() {
                var filteredSampleEvents = this.sampleEvents.filter(this.tabUnderTest.filterMethod);
                expect(filteredSampleEvents.length).toBe(1);
                expect(filteredSampleEvents[0].id).toBe(1);
            });
        });
        
        describe('Local Events tab', function () {
            beforeEach(function () {
                this.tabUnderTest = scope.tabs[2];
            });
            
            it('should have the correct id', function() {
                expect(this.tabUnderTest.id).toBe(3);
            });
            
            it('should have the correct name', function() {
                expect(this.tabUnderTest.name).toBe('Local Events');
            });
            
            it('should have the correct filter method', function() {
                var filteredSampleEvents = this.sampleEvents.filter(this.tabUnderTest.filterMethod);
                expect(filteredSampleEvents.length).toBe(1);
                expect(filteredSampleEvents[0].id).toBe(1);
            });
        });
    })
    
    
    
    describe('tab click handler', function () {
        it('should push the new active tab to the tab tracking service', function () {
            
            mockTabTrackingService.updateCurrentTab.reset();
            scope.tabClick(scope.tabs[1]);
            expect(mockTabTrackingService.updateCurrentTab.callCount).toBe(1);
            expect(mockTabTrackingService.updateCurrentTab.mostRecentCall.args[0]).toBe(scope.tabs[1]);
        });
        
        it('should push the new active tab meta data into the browser state history', function () {
            history.pushState.reset();
            scope.tabClick(scope.tabs[1]);
            var mostRecentArgs = history.pushState.mostRecentCall.args;
            
            expect(history.pushState.callCount).toBe(1);
            expect(mostRecentArgs[0]).toEqual({id: 2});
            expect(mostRecentArgs[1]).toBe('Tab 2');
            expect(mostRecentArgs[2]).toBe('?tab=2');
        });
        
        it('should broadcast a tabChanged event', function () {
            rootScope.$broadcast.reset();
            scope.tabClick(scope.tabs[1]);
            expect(rootScope.$broadcast.callCount).toBe(1);
            expect(rootScope.$broadcast.mostRecentCall.args[0]).toBe('tabChanged');
        });
        
        describe('active tab', function () {
            it('should match the most recently clicked tab indicated by the injected startingTabId ', function () {
                scope.tabClick(scope.tabs[1]);
                expect(scope.isActiveTab(scope.tabs[0])).toBe(false);
                expect(scope.isActiveTab(scope.tabs[1])).toBe(true);
            });
        });
    });
});
