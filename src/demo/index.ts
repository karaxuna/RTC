import * as io from 'socket.io-client';
import RTCPeer from '@lib/RTCPeer';
import { getUserMedia } from '@lib/utils';
import Console from './components/Console';
import './index.scss';

var socket = io.connect();
var peer;
var bash = new Console();
document.getElementById('bash').appendChild(bash.element);

async function execute(command) {
    return new Promise(async (resolve, reject) => {
        let args = command.split(' ');

        if (args[0] === 'connect') {
            if (!args[1]) {
                bash.log('Peer socket id is missing.');
            }

            connect(args[1]).then(() => {
                resolve();
            });
        }
        else if (args[0] === 'enumerate') {
            socket.emit('enumerate', {}, ({ ids }) => {
                if (ids.length) {
                    ids.forEach(id => bash.log(id));
                }
                else {
                    bash.log('No connected sockets found.');
                }
                resolve();
            });
        }
        else {
            bash.log('Unknown command.');
            resolve();
        }
    });
}

if (location.hostname !== 'localhost' && location.protocol !== 'https:') {
    bash.log('You must use secure protocol (https) to access webRTC features.');
}

function createVideo(stream) {
    let container = document.createElement('div');

    let toggleSound = document.createElement('button');
    toggleSound.type = 'button';
    toggleSound.innerText = 'Unmute';
    container.appendChild(toggleSound);

    toggleSound.addEventListener('click', e => {
        if (video.muted) {
            video.muted = false;
            toggleSound.innerText = 'Mute';
        }
        else {
            video.muted = true;
            toggleSound.innerText = 'Unmute';
        }
    });

    let video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = true;
    container.appendChild(video);

    return container;
}

function addVideo(stream) {
    try {
        let video = createVideo(stream);
        bash.writeLine(video);
    }
    catch (err) {
        bash.writeLine(err);
    }
}

let startCmdCycle = async () => {
    let command;
    while (command = await bash.readLine()) {
        await execute(command);
    }
};

var constraints = {
    audio: false,
    video: true
};

socket.on('connect', async () => {
    peer = new RTCPeer({}, socket);

    bash.log(`Welcome, your id is: "${socket.id}".`);
    bash.log('Type \`connect <id>\` to connecto to peer.');
    bash.log('Type \`enumerate\` to list connected socket ids.')
    startCmdCycle();

    peer.on('offer', async (data) => {
        let stream;

        try {
            stream = await getUserMedia(constraints);
        }
        catch (err) {
            return peer.reject(data, () => {
                bash.log('you rejected connection');
            });
        }

        let accept = await bash.ask('Accept connection?');

        if (accept) {
            peer.accept(data, [stream], (err, con) => {
                con.on('streams', (e) => {
                    addVideo(e.streams[0]);
                }).on('channel', () => {
                    con.on('data', e => {
                        bash.log('data received', e.data);
                    });
                });
            });
        }
        else {
            peer.reject(data, () => {
                bash.log('you rejected connection');
            });
        }
    });
});

async function connect(to) {
    bash.log('Connecting to peer with id: ' + to);

    try {
        let stream = await getUserMedia(constraints);

        peer.offer(to, [stream], (err, con) => {
            if (err) {
                bash.log(err.message);
            }
            else {
                con.on('streams', e => {
                    addVideo(e.streams[0]);
                }).on('rejected', () => {
                    bash.log('peer rejected connection');
                }).on('accepted', () => {
                    bash.log('peer accepted connection');
                }).on('channel', (channel) => {
                    channel.send('hello friend');
                    bash.log('data sent');
                }).on('offerfailed', (e) => {
                    bash.log(e.err);
                });
            }
        });
    }
    catch (err) {
        bash.log(err);
    }
}
