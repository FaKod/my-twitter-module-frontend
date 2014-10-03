'use strict';

/* App Module */

var dashboardApp = angular.module('dashboardApp', [
    'ngRoute',
    'dashboardControllers',
    'dashboardServices',
    'nvd3ChartDirectives',
    'ui.bootstrap'
]);

dashboardApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/dashboard', {
                templateUrl: 'partials/dashboard.html'
            }).
            otherwise({
                redirectTo: '/dashboard'
            });
    }]);
