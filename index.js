'use strict';

var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Serves the client.
app.use(express.static(path.join(__dirname, 'public')));

// Use only websocket protocol.
io.set('transports', [ 'websocket' ]);
io.on('connection', function(socket) {
  console.log('New connection', socket.id);
});

// Let's play a game !
var game = require('./game');
game.start(io);

http.listen(3000, function() {
  console.log('listening on *:3000');
});
