// testing
var socketLib = require('../lib/application.module.networking.js'),
    service = {
      name: 'myService'
    };


socketLib(service);

console.log(service);

service.socket.on("close", function (m) { console.log(m); });



var socket = service.socket.connect({
  name: 'test',
  type: 'http',
  protocol: 'http',
  pattern: 'responder'
});

console.log(socket);
socket.on("connected", function (url, socket) {
  console.log('------------------------');
  console.log('host online: ', url);
  console.log('cluster: ', socket.cluster);
});

socket.on("disconnected", function (url, socket) {
  console.log('------------------------');
  console.log('host offline: ', url);
  console.log('cluster: ', socket.cluster);
});

socket.on("hanging", function (url, socket) {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log('host hanging: ', url);
  console.log('cluster: ', socket.cluster);
});

socket.on("error", function (error, url, socket) {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log('host error: ', url);
  console.log('error: ', error);
});

socket.on("message", function (data, url) {

  if(url==='tcp://0.0.0.0:22220') {
    //console.log(socket.connections[url].stats);
    null;
  }
});

socket.connect('tcp://0.0.0.0:11110');
socket.connect('tcp://0.0.0.0:22220');


var interval = 500;
setInterval(function() {

  var data = {
    timestamp: new Date().toISOString()
  };

  socket.send(data);
}, interval);
