describe('eventGridController', function() {
    var sut, scope, mockTabTrackingService, sampleEvents, tabChangedCallback;
    beforeEach(function() {
        angular.mock.module('vividSeats');
        sampleEvents = [
            {
                id: 1,
                venue: {
                    city: 'New York'
                }
            },
            {
                id: 2,
                venue: {
                    city: 'Boston'
                }
            },
        ];
            
        VividSeats = {
            eventService: {
                all: jasmine.createSpy().andCallFake(function (success, failure) {
                    success(sampleEvents);
                }),
                add: jasmine.createSpy(),
                update: jasmine.createSpy()
            }
        };
        
        mockTabTrackingService = {
            getCurrentTab: jasmine.createSpy().andReturn({
                filterMethod: undefined
            })
        };
        
        angular.mock.module(function($provide) {
            $provide.value('tabTrackingService', mockTabTrackingService);
        });

        angular.mock.inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            spyOn(scope, '$on').andCallFake(function (event, callback) {
                tabChangedCallback = callback;
            });
            sut = $controller('eventGridController', {
                $scope: scope
            });
        });
    });

    describe('initial state', function () {        
        it('should be subscribed to the tabChanged event', function () {
            expect(scope.$on.callCount).toBe(1);
        });     
    });
    
    describe('tabChanged event fired', function () {        
        it('should refresh the shown events', function () {
            VividSeats.eventService.all.reset()
            tabChangedCallback();
            expect(VividSeats.eventService.all.callCount).toBe(1);
        });     
    });
    
    describe('add method', function () {
        it('should create a new, empty model on the scope', function () {
            expect(scope.newEvent).not.toBeDefined();
            scope.add();
            expect(scope.newEvent).toBeDefined();
            expect(scope.newEvent.name).toBe('');
            expect(scope.newEvent.date).toBe('');
            expect(scope.newEvent.venue).toEqual({
                name: '',
                city: '',
                state: ''
            });
        });
    });
    
    describe('cancelAdd method', function () {
        it('should remove the new event model from the scope if it exists', function () {
            scope.add();
            expect(scope.newEvent).toBeDefined();
            scope.cancelAdd();
            expect(scope.newEvent).not.toBeDefined();
        });
    });
    
    describe('save method', function () {
        beforeEach(function () { 
            scope.add();
            scope.save();
        });
        
        it('should call add on the event service', function () {
            expect(VividSeats.eventService.add.callCount).toBe(1);
            var args = VividSeats.eventService.add.mostRecentCall.args;
            expect(args[0]).toBe(scope.newEvent);
            
        });
        
        it('should set the correct id on the new event model', function () {
            expect(scope.newEvent.id).toBe(133);
        });
        
        it('should set the correct id on the new event venue', function () {
            expect(scope.newEvent.venue.id).toBe(3245);
        });
        
        describe('one new event has been saved already and save is called again', function () {
            beforeEach(function () { 
                scope.add();
                scope.save();
            });
            it('should set the correct id on the new event model', function () {
                expect(scope.newEvent.id).toBe(134);
            });
            
            it('should set the correct id on the new event venue', function () {
                expect(scope.newEvent.venue.id).toBe(3246);
            });
        })
    });
    
    describe('update method', function () {
        beforeEach(function () { 
            this.dummyEvent = {
                rootEvent: {
                }
            }
            scope.update(this.dummyEvent);
        });
        
        it('should call update on the event service with the provided event\'s root event', function () {
            expect(VividSeats.eventService.update.callCount).toBe(1);
            var args = VividSeats.eventService.update.mostRecentCall.args;
            expect(args[0]).toBe(this.dummyEvent.rootEvent);
        });
    });
    
    describe('events', function () {
        it('should have the correct methods and data according to the defined wrapper object', function () {
                expect(scope.events[0].editing).toBe(false);
                expect(scope.events[1].editing).toBe(false);
                scope.events[0].toggleEdit();
                expect(scope.events[0].editing).toBe(true);
                expect(scope.events[1].editing).toBe(false);
        });
        
        describe('no filter', function () {
            it('should have the same events according to the data returned from the event service', function () {
                expect(scope.events.length).toBe(2);
                expect(scope.events[0].rootEvent).toBe(sampleEvents[0]);
                expect(scope.events[1].rootEvent).toBe(sampleEvents[1]);
            });    
        });
        
        describe('with filter', function () {
            beforeEach(function () {
                mockTabTrackingService.getCurrentTab = jasmine.createSpy().andReturn({
                        filterMethod: jasmine.createSpy().andCallFake(function() { return false })
                    });
            });
            it('should pass the event service events to the filter', function () {
                tabChangedCallback();
                expect(mockTabTrackingService.getCurrentTab().filterMethod.callCount).toBe(2);
                expect(mockTabTrackingService.getCurrentTab().filterMethod.calls[0].args[0]).toBe(sampleEvents[0]);
                expect(mockTabTrackingService.getCurrentTab().filterMethod.calls[1].args[0]).toBe(sampleEvents[1]);
            });    
            
            it('should be whatever values were returned from the filter', function () {
                tabChangedCallback();
                expect(scope.events.length).toBe(0);
            });    
        });
    });
});
