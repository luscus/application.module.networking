/* jshint node:true */
/* global require */
'use strict';

var loader = require('package.loader');
var merge  = require('node.extend');
var base   = require('socket.base');


var PROTOCOL_PREFIX = 'socket.protocol.';
var CONNECTOR_PREFIX = 'socket.connector.';


exports.apply = function apply (_app) {
  _app.net            = {};
  _app.net.parent     = _app;
  _app.net._sockets   = {};
  _app.net._protocols = loader.loadFromRoot(/^socket\.protocol\..*/);
  _app.net._connectors = loader.loadFromRoot(/^socket\.connector\..*/);
  _app.net._topology  = {};

  _app.net.generateId = base.generateId;

  _app.net.addService = function addService (serviceName, sockets, hosts) {

    if (!this._topology[serviceName]) {
      this._topology[serviceName] = {};
    }

    this._topology[serviceName].hosts = hosts;

    this._topology[serviceName].sockets = {};

    sockets.forEach(function socketIterator (socket) {
      socket.host = hosts;

      this._topology[serviceName].sockets[socket.name] = socket;
    });
  };

  _app.net.loadTopology = function loadTopology (topology) {
    this._topology = topology;
  };

  _app.net.getServiceConfigByName = function getServiceConfigByName (serviceName) {
    serviceName = serviceName || this.parent.name;

    if (this._topology[serviceName]) {
      return this._topology[serviceName];
    }
    else {
      throw new Error('Unknown service "' + serviceName +'"...');
    }
  };

  _app.net.getSocketConfigByName = function getSocketConfigByName (socketName, serviceName) {
    var config = this.getServiceConfigByName(serviceName);

    if (config.sockets[socketName]) {
      return config.sockets[socketName];
    }
    else {
      throw new Error('Unknown socket "'+socketName+'" for "' + serviceName +'"\n  - available sockets: '+Object.keys(config.sockets));
    }
  };

  _app.net.useConnector    = function useConnector (socketConfig) {
    var connector = _app.net._connectors[CONNECTOR_PREFIX + socketConfig.connector](socketConfig);
    this._sockets[socketConfig.name] = connector;

    return connector;
  };

  _app.net.connectTo    = function connectTo (socketName, serviceName, socketAlias) {
    var targetConfig  = this.getSocketConfigByName(socketName, serviceName);
    var socketConfig  = merge(true, {}, targetConfig);
    var protocol      = require(PROTOCOL_PREFIX + socketConfig.protocol);

    socketConfig.pattern = base.tools.pattern.getPair(socketConfig.pattern);
    socketConfig.service = serviceName;

    var socket        = protocol(socketConfig);

    if (socketAlias) {
      this._sockets[socketAlias] = socket;
    }
    else {
      this._sockets[socket.id]  = socket;
    }

    socket.connect(targetConfig);

    return socket;
  };

  _app.net.listenOn    = function listenOn (socketConfig) {
    var protocol      = require(PROTOCOL_PREFIX + socketConfig.protocol);

    var socket        = protocol(socketConfig);

    this._sockets[socket.id] = socket;

    return socket;
  };

  return _app;
};