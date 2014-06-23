'use strict';

var app = angular.module('vividSeats', []);
var tabId = window.location.search.split('=')[1];
app.value('startingTabId', parseInt(tabId));

