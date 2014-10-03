'use strict';

/* Controllers */

var dasboardControllers = angular.module('dashboardControllers', []);

dasboardControllers.controller('websocket', ['$scope', '$http', '$q', 'WSService', function ($scope, $http, $q, $wsservice) {

    $wsservice.registerCallback(function (message) {
        $scope.websocketdata = /*$scope.websocketdata +*/ message + '\n';
        $scope.$apply();

        var tmpData = [],
            lineValues = [];
        eval(message).forEach(function (each) {
            lineValues.push([each.item, each.count]);
        });
        tmpData.push({
            "key": "Twitter Languages",
            "values": lineValues
        });
        $scope.twitterdata = tmpData;
    });
    $scope.websocketdata = '';
    $scope.twitterdata = [];

}]);