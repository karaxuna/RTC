(function(global){
    'use strict'

    // browser compatibility
    var RTCPeerConnection = global.mozRTCPeerConnection || global.webkitRTCPeerConnection || global.RTCPeerConnection;
    var RTCSessionDescription = global.mozRTCSessionDescription || global.RTCSessionDescription;
    var RTCIceCandidate = global.mozRTCIceCandidate || global.RTCIceCandidate;




    // utils
    var _utils = {
        generateGuid: function () {
    
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
    
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        },
    
        merge: function (a, b, excludeInstances) {
            var copy = {};
            if(typeof excludeInstances === 'undefined'){
                excludeInstances = [Array, HTMLElement];
            }
            
            this.extend(copy, a, excludeInstances);
            this.extend(copy, b, excludeInstances);
            return copy;
        },
    
        extend: function (a, b, excludeInstances) {
            for (var prop in b)
                if (b.hasOwnProperty(prop)) {
                    var isInstanceOfExcluded = false;
                    if (excludeInstances)
                        for (var i = 0; i < excludeInstances.length; i++)
                            if (b[prop] instanceof excludeInstances[i])
                                isInstanceOfExcluded = true;
    
                    if (typeof b[prop] === 'object' && !isInstanceOfExcluded) {
                        a[prop] = a[prop] !== undefined ? a[prop] : {};
                        this.extend(a[prop], b[prop], excludeInstances);
                    } else
                        a[prop] = b[prop];
                }
        },

        findOne: function(ar, query, fn){
            for(var i = 0; i < ar.length; i++){
                var a = ar[i];
                var m = _utils.matchesQuery(a, query);
                if(m) {
                    if(fn) fn(a, i);
                    return a;
                }
            }
        },

        matchesQuery: function(obj, query){
            switch(typeof query){
                case 'object':
                    var _r = (function _f(_obj, _query){
                        for(var prop in _query){
                            var qprop = _query[prop];
                            var oprop = _obj[prop];
                            if(typeof qprop === 'object')
                                return _f(oprop, qprop);
                            else if(oprop !== qprop)
                                return false;
                        }
                    })(obj, query)
                    return _r !== false;;
                case 'function':
                    return query(obj);
            }
        },

        contains: function(ar, obj, query){
            for(var i = 0; i < ar.length; i++){
                var a = ar[i];
                if(_utils.equalsObject(a, obj, query))
                    return true;
            }
            return false;
        },

        equalsObject: function(obj1, obj2, query){
            query = query || {};
            for(var prop in query){
                if(obj1[prop] !== obj2[prop])
                    return false;
            }
            return true;
        },

        union: function(ar1, ar2, query, fn){
            var results = [];
            for(var i = 0; i < ar1.length; i++)
                results.push(ar1[i]);
            for (var i = 0; i < ar2.length; i++) {
                var isNotInAr1 = !_utils.contains(ar1, ar2[i], query);
                if(isNotInAr1)
                    results.push(ar2[i]);
            };
            if(fn) fn(results);
            return results;
        },

        each: function(ar, fn){
            for(var i = 0; i < ar.length; i++)
                if(fn(ar[i], i))
                    break;
        },

        chain: function(fn){
            return function(){
                fn.apply(this, arguments);
                return this;
            };
        }
    };



    // EventTarget
    (function(){
        // constructor
        var EventTarget = global.EventTarget = function(){
            var self = this;
            self._listeners = {};
        };

        // proto
        EventTarget.prototype = {
            constructor: EventTarget,

            on: _utils.chain(function(type, listener){
                if (typeof this._listeners[type] == "undefined"){
                    this._listeners[type] = [];
                }

                this._listeners[type].push(listener);
            }),

            trigger: _utils.chain(function(type, data){
                if (this._listeners[type] instanceof Array){
                    var listeners = this._listeners[type];
                    for (var i=0, len=listeners.length; i < len; i++){
                        if(data instanceof Array)
                            listeners[i].apply(this, data);
                        else
                            listeners[i].call(this, data);
                    }
                }
            }),

            removeListener: _utils.chain(function(type, listener){
                if (this._listeners[type] instanceof Array){
                    var listeners = this._listeners[type];
                    for (var i=0, len=listeners.length; i < len; i++){
                        if (listeners[i] === listener){
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                }
            })
        };
    })();




    // provider
    (function(){
        var defaultOptions = {
            evname: 'rtcdata'
        };

        // constructor
        var RTCProvider = global.RTCProvider = function(options, socket){

            var self = this;
            options = self.options = _utils.merge(defaultOptions, options || {}, [Array]);
            self.socket = socket;
            EventTarget.call(self);

            // listen for incoming events
            socket.on(self.options.evname, function(data){
                self.trigger(data.type, { data: data.data, from: data.from });
            });
        };

        _utils.extend(RTCProvider.prototype = new EventTarget(), {
            constructor: RTCProvider,

            send: _utils.chain(function(type, to, data, callback){
                var self = this;
                self.socket.emit(self.options.evname, { type: type, to: to, data: data }, callback);
            })
        });
    })();




    // Peer
    (function(){
        // default options
        var defaultOptions = {
            
        };

        // constructor
        var RTCPeer = global.RTCPeer = function(options, socket){
            var self = this;
            self.options = _utils.merge(defaultOptions, options || {}, [Array]);
            var provider = self.provider = new RTCProvider({}, socket);
            var connections = self.connections = [];
            EventTarget.call(self);

            provider.on('accepted', function (e){
                var data = e.data;
                _utils.findOne(connections, { id: data.offererConnectionId }, function(con){
                    con.remoteId = data.recipientConnectionId;
                    con.pc.setRemoteDescription(new RTCSessionDescription(data.description));

                    _utils.each(data.candidates, function(candidate){
                        con.pc.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                    con.trigger('accepted', e);
                });
            });

            provider.on('rejected', function(e){
            	var data = e.data;
                _utils.findOne(connections, { id: data.offererConnectionId }, function(con){
                    con.close();
                    con.trigger('rejected', e);
                });
            });

            provider.on('stop', function (e){
                _utils.findOne(connections, { remoteId: e.data.id }, function(con){
                    con.close()
                });
            });

            provider.on('offer', function (e){
                self.trigger('offer', e);
            });
        };

        // proto
        _utils.extend(RTCPeer.prototype = new EventTarget(), {
            constructor: RTCPeer,

            offer: _utils.chain(function(to, streams, callback){
                var self = this;
                var con = new RTCConnection({}, streams);
                self.addConnection(con);
                callback(null, con);

                con.pc.createOffer(function(description){
                    con.on('icegatheringcomplete', function(){
                        var data = {
                            description: description,
                            candidates: con.candidates,
                            connectionId: con.id
                        };

                        self.provider.send('offer', to, data, function(err){
                            if(err) {
                                con.close()
                                con.trigger('offerfailed', { err: err, offer: data });
                            } else
                                con.trigger('offersuccessed', { con: con, offer: data });
                        });
                    });
                    con.pc.setLocalDescription(description);
                }, function(err){
                    con.trigger('offerfailed', { err: err });
                });
            }),

            accept: _utils.chain(function(offer, streams, callback){
                var self = this;
                var con = new RTCConnection({}, streams);
                self.addConnection(con);
                callback(null, con);

                con.pc.setRemoteDescription(new RTCSessionDescription(offer.data.description));
                _utils.each(offer.data.candidates, function(candidate){
                    con.pc.addIceCandidate(new RTCIceCandidate(candidate));
                });

                con.pc.createAnswer(function(localDescription){
                    con.on('icegatheringcomplete', function(){
                        var data = {
                            description: localDescription,
                            candidates: con.candidates,
                            offererConnectionId: offer.data.connectionId,
                            recipientConnectionId: con.id
                        };

                        self.provider.send('accepted', offer.from, data, function(err){
                            if(err)
                                con.trigger('acceptfailed', { err: err, answer: data });
                            else
                                con.trigger('acceptsuccessed', { con: con, answer: data });
                        });
                    });
                    con.pc.setLocalDescription(localDescription);
                }, function(err){
                    con.trigger('acceptfailed', { err: err });
                });
            }),

			reject: _utils.chain(function(offer, callback){
                var self = this;

                self.provider.send('rejected', offer.from, { offererConnectionId: offer.data.connectionId }, function(err){
                    if(err)
                        callback(err);
                    else
                        callback(null);
                });
            }),

            addConnection: _utils.chain(function(con){
                var self = this;
                self.connections.push(con);
                con.on('closed', function(){
                    var streams = _utils.union(con.pc.getLocalStreams(), con.pc.getRemoteStreams());
                    _utils.each(streams, function(stream){ stream.stop(); });
                    self.connections.splice(self.connections.indexOf(con), 1);
                });
            }),

            stopConnection: _utils.chain(function(con, to, callback){
                var self = this;
                self.provider.send('stop', { to: to, id: con.id }, function(err){
                    if(err)
                        callback(err);
                    else {
                        con.close();
                        callback(null);
                    }
                });
            })

        }, [Array]);
    })();




    // Connection
    (function(){
        // default options
        var defaultOptions = {
            servers: {"iceServers": [{"url": "stun:stun.l.google.com:19302"}/*, {"url":"turn:my_username@<turn_server_ip_address>", "credential":"my_password"}*/]},
            allowDataChannels: true
        };

        // constructor
        var RTCConnection = global.RTCConnection = function(options, streams){
            var self = this;
            self.options = _utils.merge(defaultOptions, options || {}, [Array]);
            self.id = _utils.generateGuid();
            self.streams = streams;
            var candidates = self.candidates = [];
            var pc = self.pc =  new RTCPeerConnection(self.options.servers, { optional: [{ RtpDataChannels: self.options.allowDataChannels }] });
            EventTarget.call(self);

            // data channels
            var dataChannel = self.dataChannel = pc.createDataChannel('dataChannel', { reliable: false });

            dataChannel.addEventListener('message', function(event){
                self.trigger('data', event);
            });

            dataChannel.addEventListener('open', function(){
                self.trigger('channel', event);
            });

            // add local streams
            if(streams)
                _utils.each(streams, function(stream){
                    pc.addStream(stream);
                });

            // listen for remote streams
            pc.addEventListener('addstream', function(event){
                self.trigger('stream', event);
            });

            // listen for ice candidates
            pc.addEventListener('icecandidate', function (event) {
                if(event.candidate){
                    candidates.push(event.candidate);
                } else
                    self.trigger('icegatheringcomplete');
            });

            // listen for connection close
            pc.addEventListener('iceconnectionstatechange', function(e){
                if(pc.iceConnectionState === 'disconnected')
                    self.trigger('closed');
            });

            pc.addEventListener('close', function(e){
                console.log('closed');
                self.trigger('closed');
            });
        };

        // proto
        _utils.extend(RTCConnection.prototype = new EventTarget(), {
            constructor: RTCConnection,
            
            close: _utils.chain(function(){
                var self = this;
                self.pc.close();
                self.trigger('closed');
            }),

            send: _utils.chain(function(data){
                var self = this;
                self.dataChannel.send(data);
            })
        }, [Array]);
    })();

})(window);