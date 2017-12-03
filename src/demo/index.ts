import * as io from 'socket.io-client';
import RTCPeer from '@lib/RTCPeer';

var socket = io.connect();
var peer;
var socketIdContainer = document.getElementById('socketIdContainer') as HTMLDivElement;
var videoElement = document.getElementById('video') as HTMLVideoElement;
var connectButton = document.getElementById('connect') as HTMLButtonElement;
var toInput = document.getElementById('to') as HTMLInputElement;
var logsContainer = document.getElementById('logs') as HTMLDivElement;

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

    var logElement = document.createElement('div');
    logElement.innerHTML = texts.join('<br/>');
    logsContainer.appendChild(logElement);
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

connectButton.addEventListener('click', function () {
    connect(toInput.value);
});

socket.on('connect', function () {
    peer = new RTCPeer({}, socket);
    socketIdContainer.textContent = socket.id;

    peer.on('offer', function (data) {
        getUserMedia({ audio: true, video: true }).then(function (stream) {
            peer.accept(data, [stream], function (err, con) {
                con.on('streams', function (e) {
                    videoElement.src = URL.createObjectURL(e.streams[0]);
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
