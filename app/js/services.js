'use strict';

/* Services */

var dashboardServices = angular.module('dashboardServices', ['ngResource']);

dashboardServices.factory('WSService', ['$q', '$rootScope', function ($q, $rootScope) {
    // We return this object to anything injecting our service
    var Service = {};
    // simple callbacks without request
    var cbNoRequest = [];
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket

    var ws = new WebSocket("ws://localhost:8080/language-topk");

    ws.onopen = function () {
        console.log("Socket has been opened!");
    };

    ws.onmessage = function (message) {
        listener(message.data);
    };

    ws.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    ws.onclose = function (closeEvent) {
        console.log('WebSocket Close ');
        console.log(closeEvent);
    };

    function sendRequest(request) {
        var defer = $q.defer();
        var callbackId = getCallbackId();
        callbacks[callbackId] = {
            time: new Date(),
            cb: defer
        };
        request.callback_id = callbackId;
        console.log('Sending request', request);
        ws.send(JSON.stringify(request));
        return defer.promise;
    }

    function listener(data) {
        var messageObj = data;
        //console.log("Received data from websocket: ", messageObj);
        // If an object exists with callback_id in our callbacks object, resolve it
        if (callbacks.hasOwnProperty(messageObj.callback_id)) {
            console.log(callbacks[messageObj.callback_id]);
            $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
            delete callbacks[messageObj.callbackID];
        }
        angular.forEach(cbNoRequest, function (cb) {
            cb(messageObj);
        });
    }

    // This creates a new callback ID for a request

    function getCallbackId() {
        currentCallbackId += 1;
        if (currentCallbackId > 10000) {
            currentCallbackId = 0;
        }
        return currentCallbackId;
    }

    Service.registerCallback = function (cb) {
        cbNoRequest.push(cb);
    };

    return Service;
}]);
