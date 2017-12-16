import * as io from 'socket.io-client';
import RTCPeer from '@lib/RTCPeer';
import Bash from './components/Bash';
import './index.scss';

var socket = io.connect();
var peer;
var bash = new Bash(document.getElementById('bash'));

bash.on('stdin', (command) => {
    log(command);
    let args = command.split(' ');

    if (args[0] === 'connect') {
        if (!args[1]) {
            return log('Peer socket id is missing.');
        }

        connect(args[1]);
    }
    else if (args[0] === 'enumerate') {
        socket.emit('enumerate', {}, ({ ids }) => {
            ids.forEach(id => log(id));
        });
    }
    else if (args[0] === 'help') {
        log('Type `connect <id>` to connect to peer.');
        log('Type `enumerate` to list all connected sockets.');
    }
    else {
        log('Unknown command.');
    }
});

function log(...args) {
    let items = args.map(item => {
        if (item instanceof Error) {
            return item.name + '\n' + item.stack;
        }

        return item;
    });

    items.forEach(item => {
        bash.write(item);
        bash.write('\n');
    });

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

window.URL = window.URL || (window as any).webkitURL;

function addVideo(stream) {
    try {
        let video = document.createElement('video');
        //video.src = URL.createObjectURL(stream);
        video.srcObject = stream;
        video.autoplay = true;
        log(video);

        if (confirm('Play video?')) {
            video.play();
        }
    }
    catch (err) {
        log(err);
    }
}

var constraints = {
    audio: false,
    video: true
};

socket.on('connect', () => {
    peer = new RTCPeer({}, socket);
    log(`Welcome, your id is: "${socket.id}".\nType \`connect <id>\` to connecto to peer.\nType \`enumerate\` to list connected socket ids.`);

    peer.on('offer', (data) => {
        getUserMedia(constraints).then((stream) => {
            peer.accept(data, [stream], (err, con) => {
                con.on('streams', (e) => {
                    addVideo(e.streams[0]);
                }).on('channel', () => {
                    con.on('data', e => {
                        log('data received', e.data);
                    });
                });
            });
        }, () => {
            peer.reject(data, () => {
                log('you rejected connection');
            });
        });
    });
});

async function connect(to) {
    log('Connecting to peer with id: ' + to);

    try {
        let stream = await getUserMedia(constraints);

        peer.offer(to, [stream], (err, con) => {
            if (err) {
                log(err.message);
            }
            else {
                con.on('streams', e => {
                    addVideo(e.streams[0]);
                }).on('rejected', () => {
                    log('peer rejected connection');
                }).on('accepted', () => {
                    log('peer accepted connection');
                }).on('channel', (channel) => {
                    channel.send('hello friend');
                    log('data sent');
                }).on('offerfailed', (e) => {
                    log(e.err);
                });
            }
        });
    }
    catch (err) {
        log(err);
    }
}
