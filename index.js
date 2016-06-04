var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var Path = require('./models/path');

mongoose.connect('mongodb://localhost/collaborative-whiteboard');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static('node_modules'));

io.on('connection', function(socket) {
	console.log('User connected');

	Path.find({}, function(err, paths) {
		if (err) throw err;

		paths.forEach(function(item) {
			socket.emit('drawPath', item);
		});
	});

	socket.on('drawPath', function(data) {
		console.log('drawPath received');

		var newPath = new Path ({
			strokeWidth: data.strokeWidth,
			stroke: data.stroke,
			path: data.path
		});

		newPath.save(function(err, path) {
			if (err) throw err;
			console.log('Path saved!');
			socket.broadcast.emit('drawPath', path);
		});
  	});

  	socket.on('clearWhiteboard', function() {
		console.log('clearWhiteboard received');
		socket.broadcast.emit('clearWhiteboard');
		
		Path.remove({}, function(err) {
			if (err) throw err;
			console.log('Collection removed!');
		});
  	});
});

http.listen(3000, function() {
	console.log('Listening on *:3000');
});