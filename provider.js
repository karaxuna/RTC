var Provider = module.exports = function(app, io){
	var self = this;
	var users = self.users = {};

	io.sockets.on('connection', function(socket){
		users[socket.id] = socket;

		socket.on('rtcdata', function(data, callback){
			data.from = socket.id;
			var user = users[data.to];
			if(user)
				user.emit('rtcdata', data, callback);
			else
				callback('user not found');
		});

		socket.on('disconnect', function(){
			delete users[socket.id];
		});
	});
};

