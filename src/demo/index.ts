import * as io from 'socket.io-client';
import RTCPeer from '@lib/RTCPeer';
import { log } from '@lib/logger';

var socket = io.connect();
var peer;
var socketIdContainer = document.getElementById('socketIdContainer') as HTMLDivElement;
var videoElement = document.getElementById('video') as HTMLVideoElement;
var connectButton = document.getElementById('connect') as HTMLButtonElement;
var toInput = document.getElementById('to') as HTMLInputElement;

connectButton.addEventListener('click', function () {
    connect(toInput.value);
});

socket.on('connect', function () {
    peer = new RTCPeer({}, socket);
    socketIdContainer.textContent = socket.id;

    peer.on('offer', function (data) {
        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
            peer.accept(data, [stream], function (err, con) {
                con.on('stream', function (strmArgs) {
                    videoElement.src = URL.createObjectURL(strmArgs.stream);
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

function connect(to) {
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
        peer.offer(to, [stream], function (err, con) {
            if (err) {
                log(err.message);
            }
            else {
                con.on('stream', function (e) {
                    videoElement.src = URL.createObjectURL(e.stream);
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
    }, function (err) {
        log(err);
    });
}
