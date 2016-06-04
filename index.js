var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var paths = [];

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static('node_modules'));

io.on('connection', function(socket) {
	console.log('User connected');

	paths.forEach(function(item) {
	    socket.emit('drawPath', item);
	});

	socket.on('drawPath', function(data) {
		console.log('drawPath received');
		paths.push(data);
    	socket.broadcast.emit('drawPath', data);
  	});

  	socket.on('clearWhiteboard', function() {
		console.log('clearWhiteboard received');
		paths.length = 0
    	socket.broadcast.emit('clearWhiteboard');
  	});
});

http.listen(3000, function() {
	console.log('Listening on *:3000');
});