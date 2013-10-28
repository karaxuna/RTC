var http      = require('http'),
    express   = require('express'),
    app       = express(),
    port      = process.env.PORT || 8080,
    ip        = process.env.IP || 'localhost',
    server    = app.listen(port, ip),
    io        = require('socket.io').listen(server),
    users     = {};

// settings
app.configure(function(){
    io.set('transports', ['xhr-polling', 'jsonp-polling']);
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
    app.use(app.router);
});

// serve html file
app.get("/", function(req, res) {
    res.sendfile("./public/html/index.htm");
});

// ws
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