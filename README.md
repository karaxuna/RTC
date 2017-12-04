RTC.js
==
[1]: http://karaxuna-rtc.ap01.aws.af.cm/


Simplified peer connection using webRTC ([Demo](https://karaxuna-rtc.herokuapp.com/))
==

**Creating peer:**

```javascript
var socket = io.connect();
var peer = new RTCPeer({}, socket);
```
    
**Connecting:**

```javascript
navigator.getUserMedia({ audio: true, video: true }, function(stream){
    peer.offer(to, [stream], function(err, con){
        if(err)
            console.error(err);
        else
            con.on('stream', function(strmArgs){
                video.src = URL.createObjectURL(strmArgs.stream);
            }).on('rejected', function(){
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
    navigator.getUserMedia({ audio: true, video: true }, function(stream){
        peer.accept(data, [stream], function(err, con){
            con.on('stream', function(strmArgs){
                video.src = URL.createObjectURL(strmArgs.stream);
            });
        });
    }, function(){
        peer.reject(data, function(){
            console.log('you rejected connection');
        });
    });
});
```

**DataChannel:**
  
  send:

```javascript
con.on('channel', function(){
    con.send('hello friend');
});
```

  receive:

```javascript
con.on('channel', function(){
    con.on('data', function(e){
        console.log(e.data);
    });
});
```
    
**RTCPeer**

Events:

  - `offer` - received offer;
  
Methods:

  - `offer(String: to, [MediaStream]: streams, function: callback)` - create offer;
  - `accept(Object: offer, [MediaStream]: streams, function: callback)` - accept offer;
  - `reject(Object: offer, function: callback)` - reject offer;
  - `stopConnection(RTCConnection: con, String: to, function: callback)` - stop connection (send notification to peer);
    
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
  - `stream` - remote stream ready;
  - `channel` - DataChannel ready;
  - `data` - DataChannel received data;

Methods:

  - `close()` - close connection;
  - `send(String: data)` - send data through DataChannel;

==

Todo list:
  1. Improve documentation;
  2. Add DataChannel FireFox support
