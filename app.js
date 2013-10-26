var http      = require('http'),
    express   = require('express'),
    app       = express(),
    port      = process.env.PORT || 8080,
    ip        = process.env.IP || 'localhost',
    server    = app.listen(port, ip),
    io        = require('socket.io').listen(server),
    provider  = new (require('./provider'))(app, io);

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/example'));
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
    app.use(app.router);
});

app.get("/", function(req, res) {
    res.sendfile("./example/html/index.htm");
});