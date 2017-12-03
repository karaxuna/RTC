import RTCPeer from '@lib/RTCPeer';
import * as io from 'socket.io-client';

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
                        alert('data received ' + e.data);
                    });
                });
            });
        }, function () {
            peer.reject(data, function () {
                alert('you rejected connection');
            });
        });
    });
});

function connect(to) {
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
        peer.offer(to, [stream], function (err, con) {
            if (err) {
                alert(err.message);
            }
            else {
                con.on('stream', function (e) {
                    videoElement.src = URL.createObjectURL(e.stream);
                }).on('rejected', function () {
                    alert('peer rejected connection');
                }).on('accepted', function () {
                    alert('peer accepted connection');
                }).on('channel', function (channel) {
                    channel.send('hello friend');
                    alert('data sent');
                }).on('offerfailed', function (e) {
                    alert(e.err.message);
                });
            }
        });
    }, function (err) {
        alert(err.message);
    });
}
