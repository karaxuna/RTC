import * as io from 'socket.io-client';
import RTCPeer from '@lib/RTCPeer';
import Bash from './components/Bash';
import './index.scss';

var socket = io.connect();
var peer;
var videoElement = document.getElementById('video') as HTMLVideoElement;
var bash = new Bash(document.getElementById('bash'));

bash.on('stdin', function (command) {
    log(command);
    let args = command.split(' ');

    if (args[0] === 'connect') {
        if (!args[1]) {
            return log('Peer socket id is missing.');
        }

        connect(args[1]);
    }
    else {
        log('Unknown command.');
    }
});

function log(...args) {
    let texts = args.map(arg => {
        if (typeof arg === 'string') {
            return arg;
        }

        if (arg.stack) {
            return arg.stack;
        }

        if (arg.name) {
            return arg.name;
        }
    });

    bash.write(texts + '\n');
    bash.write('> ');
}

if (location.hostname !== 'localhost' && location.protocol !== 'https:') {
    log('You must use secure protocol (https) to access webRTC features.');
}

let getUserMedia = navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) :
    function (constraints) {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia.call(navigator, constraints, function (stream) {
                resolve(stream);
            }, function (err) {
                reject(err);
            });
        })
    };

socket.on('connect', function () {
    peer = new RTCPeer({}, socket);
    log('My socket id: ' + socket.id);
    log('Type `connect <id>` to connect to peer');

    peer.on('offer', function (data) {
        getUserMedia({ audio: true, video: true }).then(function (stream) {
            peer.accept(data, [stream], function (err, con) {
                con.on('streams', function (e) {
                    var video = document.createElement('video');
                    video.src = URL.createObjectURL(e.streams[0]);
                    video.autoplay = true;
                    log(video);
                }).on('channel', function () {
                    con.on('data', function (e) {
                        log('data received', e.data);
                    });
                });
            });
        }, function () {
            peer.reject(data, function () {
                log('you rejected connection');
            });
        });
    });
});

async function connect(to) {
    log('Connecting to peer with id: ' + to);

    try {
        let stream = await getUserMedia({
            audio: true,
            video: true
        });

        peer.offer(to, [stream], function (err, con) {
            if (err) {
                log(err.message);
            }
            else {
                con.on('streams', function (e) {
                    videoElement.src = URL.createObjectURL(e.streams[0]);
                }).on('rejected', function () {
                    log('peer rejected connection');
                }).on('accepted', function () {
                    log('peer accepted connection');
                }).on('channel', function (channel) {
                    channel.send('hello friend');
                    log('data sent');
                }).on('offerfailed', function (e) {
                    log(e.err);
                });
            }
        });
    }
    catch (err) {
        log(err);
    }
}
