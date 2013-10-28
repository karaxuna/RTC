RTC.js ([demo][1])
==
[1]: http://karaxuna-rtc.ap01.aws.af.cm/


Simplified peer connection using webRTC
==

**Creating peer:**

    var socket = io.connect();
    var peer = new RTCPeer({}, socket);
    
**Connecting:**

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
    
**Accepting connection:**

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

**DataChannel:**
  
  send:

    con.on('channel', function(){
      con.send('hello friend');
    });

  receive:

    con.on('channel', function(){
      con.on('data', function(e){
        console.log(e.data);
      });
    });
    
Todo list:
  1. Improve documentation;
  2. Improve performance;
