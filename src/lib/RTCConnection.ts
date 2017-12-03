import { merge, generateGuid, each, chain } from './utils';
import EventTarget from './EventTarget';

class RTCConnection extends EventTarget {
    options;
    id: string;
    streams: MediaStream[];
    candidates: RTCIceCandidate[];
    pc: RTCPeerConnection;

    static defaultOptions = {
        evname: 'rtcdata'
    };

    constructor(options, streams) {
        super();
        var self = this;
        
        self.options = merge(RTCConnection.defaultOptions, options || {}, [Array]);
        self.id = generateGuid();
        self.streams = streams;

        var candidates = self.candidates = [];
        var pc = self.pc = new RTCPeerConnection(self.options.servers);

        // Data channels
        pc.addEventListener('datachannel', function (e: any) {
            e.channel.addEventListener('open', function () {
                console.log('channel opened: ', e.channel);
                self.trigger('channel', e.channel);
            });
        });

        pc.createDataChannel('dataChannel').addEventListener('message', function (e) {
            console.log('data received: ', e);
            self.trigger('data', e);
        });

        // Add local streams
        if (streams) {
            each(streams, function (stream) {
                pc.addStream(stream);
            });
        }

        // Listen for remote streams
        pc.addEventListener('addstream', function (e) {
            self.trigger('streams', {
                streams: [e.stream]
            });
        });

        pc.ontrack = function (e) {
            self.trigger('streams', e);
        };

        // Listen for ice candidates
        pc.addEventListener('icecandidate', function (e) {
            if (e.candidate) {
                candidates.push(e.candidate);
            }
            else {
                self.trigger('icegatheringcomplete');
            }
        });

        // Listen for connection close
        pc.addEventListener('iceconnectionstatechange', function (e) {
            if (pc.iceConnectionState === 'disconnected') {
                self.trigger('closed');
            }
        });

        pc.addEventListener('close', function (e) {
            console.log('closed');
            self.trigger('closed');
        });
    }

    close = chain(function () {
        var self = this;
        self.pc.close();
        self.trigger('closed');
    });
}

export default RTCConnection;
