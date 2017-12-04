RTC.js ([Demo](https://karaxuna-rtc.herokuapp.com/))
==
[1]: http://karaxuna-rtc.ap01.aws.af.cm/


Simplified peer connection using webRTC
==

**Creating peer:**

```javascript
var socket = io.connect();
var peer = new RTCPeer({}, socket);
```
    
**Connecting:**

```javascript
navigator.getUserMedia({ audio: true, video: true }, function (stream) {
    peer.offer(to, [stream], function (err, con) {
        if (err)
            console.error(err);
        else
            con.on('streams', function (e) {
                video.src = URL.createObjectURL(e.streams[0]);
            }).on('rejected', function () {
                console.log('peer rejected connection');
            });
    });
}, function(err){
    console.error(err);
});
```
    
**Accepting connection:**

```javascript
peer.on('offer', function(data){
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
        peer.accept(data, [stream], function (err, con) {
            con.on('streams', function (e) {
                video.src = URL.createObjectURL(strmArgs.streams[0]);
            });
        });
    }, function () {
        peer.reject(data, function () {
            console.log('you rejected connection');
        });
    });
});
```

**DataChannel:**
  
  send:

```javascript
con.on('channel', function (channel) {
    channel.send('hello friend');
});
```

  receive:

```javascript
con.on('channel', function () {
    con.on('data', function (e) {
        console.log(e.data);
    });
});
```
    
**RTCPeer**

Events:

  - `offer` - received offer;
  
Methods:

  - `offer(to: string, streams: [MediaStream], callback)` - create offer;
  - `accept(offer, streams: [MediaStream], callback)` - accept offer;
  - `reject(offer, callback)` - reject offer;
  - `stopConnection(con: RTCConnection, to: string, callback)` - stop connection (send notification to peer);
    
**RTCConnection**

Events:

  - `accepted` - offer accepted by remote peer;
  - `rejected` - offer rejected by remote peer;
  - `icegatheringcomplete` - gathering local ice candidates completed;
  - `offerfailed` - failed to send offer;
  - `offersucceeded` - offer sent;
  - `acceptfailed` - sending answer about accepting offer failed;
  - `acceptsucceeded` - sent answer about accepting offer;
  - `closed` - connection closed (triggers automatically when `iceConnectionState === 'disconnected'`);
  - `streams` - remote stream ready;
  - `channel` - DataChannel ready;
  - `data` - DataChannel received data;

Methods:

  - `close()` - close connection;
  - `send(data: string)` - send data through DataChannel;
