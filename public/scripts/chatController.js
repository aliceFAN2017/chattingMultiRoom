'use strict';

var app = angular.module('chatApp', []);

/* Services */
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

/* Controllers */
app.controller('chatCtrl', function ($scope, socket) {
  $scope.rooms = [];
  $scope.users = [];
  $scope.current_user = '';
  socket.on('connect', function () { });
  socket.on('updatechat', function (username, data) {
    var user = {};
    user.username = username;
    user.message = data;
    user.date = new Date().getTime();
    user.image = 'http://dummyimage.com/250x250/000/fff&text=' + username.charAt(0).toUpperCase();
    $scope.users.push(user);
  });

  socket.on('roomcreated', function (data) {
    $scope.rooms.push(data.room);
    socket.emit('adduser', data);
  });

  $scope.createRoom = function (data) {
    $scope.current_user = data.username;
    socket.emit('createroom', data);
  }

  $scope.joinRoom = function (data) {
    $scope.current_user = data.username;
    socket.emit('adduser', data);
  }

  $scope.send = function (message) {
    socket.emit('sendchat', message);
  }
});