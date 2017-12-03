var http = require('http');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config.js');
var config = require('./config');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server)
var isProduction = config.NODE_ENV === 'production';

if (isProduction) {
    app.use(express.static(webpackConfig.output.path));
}
else {
    var compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        inline: true,
        quiet: false,
        noInfo: true,
        stats: { colors: true },
        historyApiFallback: true
    }));

    app.use('*', function (req, res, next) {
        var filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, function (err, result) {
            if (err) {
                return next(err);
            }

            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    });

    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
}

server.listen(config.PORT, '0.0.0.0', function (err) {
    if (err) {
        console.log('Error starting server' + err);
    }
    else {
        console.log('Server started on port ' + config.PORT);
    }
});

var users = {};
io.sockets.on('connection', function (socket) {
    users[socket.id] = socket;

    socket.on('rtcdata', function (data, callback) {
        data.from = socket.id;
        var user = users[data.to];
        if (user) {
            user.emit('rtcdata', data, callback);
        }
        else {
            callback('user not found');
        }
    });

    socket.on('disconnect', function () {
        delete users[socket.id];
    });
});
