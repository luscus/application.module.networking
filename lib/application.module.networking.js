/* jshint node:true */
/* global require */
'use strict';

var loader = require('package.loader');


exports.apply = function apply (_app) {
  _app.net            = {};
  _app.net._sockets   = {};
  _app.net._protocols = loader.loadFromRoot(/^socket\.protocol\..*/);
  _app.net._topology  = {};

  _app.net.connect    = function connect (serviceName, socketName) {

  };

  _app.net.addService = function addService (serviceName, sockets, hosts) {

    if (!_app.net._topology[serviceName]) {
      _app.net._topology[serviceName] = {};
    }

    _app.net._topology[serviceName].hosts = hosts;

    _app.net._topology[serviceName].sockets = {};

    sockets.forEach(function socketIterator (socket) {
      socket.host = hosts;

      _app.net._topology[serviceName].sockets[socket.name] = socket;
    });
  };

  _app.net.connect    = function connect (serviceConfig) {

  };

  return _app;
};