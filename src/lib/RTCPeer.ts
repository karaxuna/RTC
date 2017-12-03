import { chain, merge, findOne, each, union } from './utils';
import EventTarget from './EventTarget';
import RTCProvider from './RTCProvider';
import RTCConnection from './RTCConnection';

class RTCPeer extends EventTarget {
    options;
    provider: RTCProvider;
    connections: RTCConnection[] = [];

    static defaultOptions = {
        
    };

    constructor(options, socket) {
        super();
        options = this.options = merge(RTCPeer.defaultOptions, options || {}, [Array]);
        let provider = this.provider = new RTCProvider({}, socket);

        provider.on('accepted', (e) => {
            let data = e.data;
            findOne(this.connections, { id: data.offererConnectionId }, (con) => {
                con.remoteId = data.recipientConnectionId;
                con.pc.setRemoteDescription(new RTCSessionDescription(data.description));

                each(data.candidates, (candidate) => {
                    con.pc.addIceCandidate(new RTCIceCandidate(candidate));
                });

                con.trigger('accepted', e);
            });
        });

        provider.on('rejected', (e) => {
            let data = e.data;
            findOne(this.connections, { id: data.offererConnectionId }, (con) => {
                con.close();
                con.trigger('rejected', e);
            });
        });

        provider.on('stop', (e) => {
            findOne(this.connections, { remoteId: e.data.id }, (con) => {
                con.close()
            });
        });

        provider.on('offer', (e) => {
            this.trigger('offer', e);
        });
    }

    offer = chain(function (to, streams, callback) {
        let self = this;
        let con = new RTCConnection({}, streams);
        self.addConnection(con);
        callback(null, con);

        con.pc.createOffer(function (description) {
            con.on('icegatheringcomplete', function () {
                let data = {
                    description: description,
                    candidates: con.candidates,
                    connectionId: con.id
                };

                self.provider.send('offer', to, data, function (err) {
                    if (err) {
                        con.close()
                        con.trigger('offerfailed', { err: err, offer: data });
                    } else
                        con.trigger('offersucceeded', { con: con, offer: data });
                });
            });
            con.pc.setLocalDescription(description);
        }, function (err) {
            con.trigger('offerfailed', { err: err });
        });
    });

    accept = chain(function (offer, streams, callback) {
        let self = this;
        let con = new RTCConnection({}, streams);
        self.addConnection(con);
        callback(null, con);

        con.pc.setRemoteDescription(new RTCSessionDescription(offer.data.description));
        each(offer.data.candidates, function (candidate) {
            con.pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        con.pc.createAnswer(function (localDescription) {
            con.on('icegatheringcomplete', function () {
                let data = {
                    description: localDescription,
                    candidates: con.candidates,
                    offererConnectionId: offer.data.connectionId,
                    recipientConnectionId: con.id
                };

                self.provider.send('accepted', offer.from, data, function (err) {
                    if (err)
                        con.trigger('acceptfailed', { err: err, answer: data });
                    else
                        con.trigger('acceptsucceeded', { con: con, answer: data });
                });
            });
            con.pc.setLocalDescription(localDescription);
        }, function (err) {
            con.trigger('acceptfailed', { err: err });
        });
    });

    reject = chain(function (offer, callback) {
        let self = this;

        self.provider.send('rejected', offer.from, { offererConnectionId: offer.data.connectionId }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    });

    addConnection = chain(function (con) {
        let self = this;
        self.connections.push(con);

        con.on('closed', function () {
            let streams = union(
                con.pc.getLocalStreams(),
                con.pc.getRemoteStreams()
            );

            each(streams, function (stream) {
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            });

            self.connections.splice(self.connections.indexOf(con), 1);
        });
    });

    stopConnection = chain(function (con, to, callback) {
        let self = this;

        self.provider.send('stop', { to: to, id: con.id }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                con.close();
                callback(null);
            }
        });
    });
}

export default RTCPeer;
