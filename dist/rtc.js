!function(e){function n(e){delete installedChunks[e]}function t(e){var n=document.getElementsByTagName("head")[0],t=document.createElement("script");t.type="text/javascript",t.charset="utf-8",t.src=p.p+""+e+"."+O+".hot-update.js",n.appendChild(t)}function r(){return new Promise(function(e,n){if("undefined"==typeof XMLHttpRequest)return n(new Error("No browser support"));try{var t=new XMLHttpRequest,r=p.p+""+O+".hot-update.json";t.open("GET",r,!0),t.timeout=1e4,t.send(null)}catch(e){return n(e)}t.onreadystatechange=function(){if(4===t.readyState)if(0===t.status)n(new Error("Manifest request to "+r+" timed out."));else if(404===t.status)e();else if(200!==t.status&&304!==t.status)n(new Error("Manifest request to "+r+" failed."));else{try{var o=JSON.parse(t.responseText)}catch(e){return void n(e)}e(o)}}})}function o(e){var n=H[e];if(!n)return p;var t=function(t){return n.hot.active?(H[t]?H[t].parents.indexOf(e)<0&&H[t].parents.push(e):(w=[e],v=t),n.children.indexOf(t)<0&&n.children.push(t)):(console.warn("[HMR] unexpected require("+t+") from disposed module "+e),w=[]),p(t)};for(var r in p)Object.prototype.hasOwnProperty.call(p,r)&&"e"!==r&&Object.defineProperty(t,r,function(e){return{configurable:!0,enumerable:!0,get:function(){return p[e]},set:function(n){p[e]=n}}}(r));return t.e=function(e){function n(){C--,"prepare"===E&&(I[e]||f(e),0===C&&0===P&&u())}return"ready"===E&&c("prepare"),C++,p.e(e).then(n,function(e){throw n(),e})},t}function i(e){var n={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],_main:v!==e,active:!0,accept:function(e,t){if(void 0===e)n._selfAccepted=!0;else if("function"==typeof e)n._selfAccepted=e;else if("object"==typeof e)for(var r=0;r<e.length;r++)n._acceptedDependencies[e[r]]=t||function(){};else n._acceptedDependencies[e]=t||function(){}},decline:function(e){if(void 0===e)n._selfDeclined=!0;else if("object"==typeof e)for(var t=0;t<e.length;t++)n._declinedDependencies[e[t]]=!0;else n._declinedDependencies[e]=!0},dispose:function(e){n._disposeHandlers.push(e)},addDisposeHandler:function(e){n._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=n._disposeHandlers.indexOf(e);t>=0&&n._disposeHandlers.splice(t,1)},check:d,apply:l,status:function(e){if(!e)return E;D.push(e)},addStatusHandler:function(e){D.push(e)},removeStatusHandler:function(e){var n=D.indexOf(e);n>=0&&D.splice(n,1)},data:b[e]};return v=void 0,n}function c(e){E=e;for(var n=0;n<D.length;n++)D[n].call(null,e)}function a(e){return+e+""===e?+e:e}function d(e){if("idle"!==E)throw new Error("check() is only allowed in idle status");return m=e,c("check"),r().then(function(e){if(!e)return c("idle"),null;x={},I={},A=e.c,_=e.h,c("prepare");var n=new Promise(function(e,n){g={resolve:e,reject:n}});y={};return f(1),"prepare"===E&&0===C&&0===P&&u(),n})}function s(e,n){if(A[e]&&x[e]){x[e]=!1;for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(y[t]=n[t]);0==--P&&0===C&&u()}}function f(e){A[e]?(x[e]=!0,P++,t(e)):I[e]=!0}function u(){c("ready");var e=g;if(g=null,e)if(m)l(m).then(function(n){e.resolve(n)},function(n){e.reject(n)});else{var n=[];for(var t in y)Object.prototype.hasOwnProperty.call(y,t)&&n.push(a(t));e.resolve(n)}}function l(t){function r(e,n){for(var t=0;t<n.length;t++){var r=n[t];e.indexOf(r)<0&&e.push(r)}}if("ready"!==E)throw new Error("apply() is only allowed in ready status");t=t||{};var o,i,d,s,f,u={},l=[],h={},v=function(){console.warn("[HMR] unexpected require("+m.moduleId+") to disposed module")};for(var g in y)if(Object.prototype.hasOwnProperty.call(y,g)){f=a(g);var m;m=y[g]?function(e){for(var n=[e],t={},o=n.slice().map(function(e){return{chain:[e],id:e}});o.length>0;){var i=o.pop(),c=i.id,a=i.chain;if((s=H[c])&&!s.hot._selfAccepted){if(s.hot._selfDeclined)return{type:"self-declined",chain:a,moduleId:c};if(s.hot._main)return{type:"unaccepted",chain:a,moduleId:c};for(var d=0;d<s.parents.length;d++){var f=s.parents[d],u=H[f];if(u){if(u.hot._declinedDependencies[c])return{type:"declined",chain:a.concat([f]),moduleId:c,parentId:f};n.indexOf(f)>=0||(u.hot._acceptedDependencies[c]?(t[f]||(t[f]=[]),r(t[f],[c])):(delete t[f],n.push(f),o.push({chain:a.concat([f]),id:f})))}}}}return{type:"accepted",moduleId:e,outdatedModules:n,outdatedDependencies:t}}(f):{type:"disposed",moduleId:g};var j=!1,D=!1,P=!1,C="";switch(m.chain&&(C="\nUpdate propagation: "+m.chain.join(" -> ")),m.type){case"self-declined":t.onDeclined&&t.onDeclined(m),t.ignoreDeclined||(j=new Error("Aborted because of self decline: "+m.moduleId+C));break;case"declined":t.onDeclined&&t.onDeclined(m),t.ignoreDeclined||(j=new Error("Aborted because of declined dependency: "+m.moduleId+" in "+m.parentId+C));break;case"unaccepted":t.onUnaccepted&&t.onUnaccepted(m),t.ignoreUnaccepted||(j=new Error("Aborted because "+f+" is not accepted"+C));break;case"accepted":t.onAccepted&&t.onAccepted(m),D=!0;break;case"disposed":t.onDisposed&&t.onDisposed(m),P=!0;break;default:throw new Error("Unexception type "+m.type)}if(j)return c("abort"),Promise.reject(j);if(D){h[f]=y[f],r(l,m.outdatedModules);for(f in m.outdatedDependencies)Object.prototype.hasOwnProperty.call(m.outdatedDependencies,f)&&(u[f]||(u[f]=[]),r(u[f],m.outdatedDependencies[f]))}P&&(r(l,[m.moduleId]),h[f]=v)}var I=[];for(i=0;i<l.length;i++)f=l[i],H[f]&&H[f].hot._selfAccepted&&I.push({module:f,errorHandler:H[f].hot._selfAccepted});c("dispose"),Object.keys(A).forEach(function(e){!1===A[e]&&n(e)});for(var x,k=l.slice();k.length>0;)if(f=k.pop(),s=H[f]){var M={},L=s.hot._disposeHandlers;for(d=0;d<L.length;d++)(o=L[d])(M);for(b[f]=M,s.hot.active=!1,delete H[f],d=0;d<s.children.length;d++){var R=H[s.children[d]];R&&((x=R.parents.indexOf(f))>=0&&R.parents.splice(x,1))}}var T,S;for(f in u)if(Object.prototype.hasOwnProperty.call(u,f)&&(s=H[f]))for(S=u[f],d=0;d<S.length;d++)T=S[d],(x=s.children.indexOf(T))>=0&&s.children.splice(x,1);c("apply"),O=_;for(f in h)Object.prototype.hasOwnProperty.call(h,f)&&(e[f]=h[f]);var q=null;for(f in u)if(Object.prototype.hasOwnProperty.call(u,f)){s=H[f],S=u[f];var U=[];for(i=0;i<S.length;i++)T=S[i],o=s.hot._acceptedDependencies[T],U.indexOf(o)>=0||U.push(o);for(i=0;i<U.length;i++){o=U[i];try{o(S)}catch(e){t.onErrored&&t.onErrored({type:"accept-errored",moduleId:f,dependencyId:S[i],error:e}),t.ignoreErrored||q||(q=e)}}}for(i=0;i<I.length;i++){var G=I[i];f=G.module,w=[f];try{p(f)}catch(e){if("function"==typeof G.errorHandler)try{G.errorHandler(e)}catch(n){t.onErrored&&t.onErrored({type:"self-accept-error-handler-errored",moduleId:f,error:n,orginalError:e}),t.ignoreErrored||q||(q=n),q||(q=e)}else t.onErrored&&t.onErrored({type:"self-accept-errored",moduleId:f,error:e}),t.ignoreErrored||q||(q=e)}}return q?(c("fail"),Promise.reject(q)):(c("idle"),new Promise(function(e){e(l)}))}function p(n){if(H[n])return H[n].exports;var t=H[n]={i:n,l:!1,exports:{},hot:i(n),parents:(j=w,w=[],j),children:[]};return e[n].call(t.exports,t,t.exports,o(n)),t.l=!0,t.exports}var h=this.webpackHotUpdate;this.webpackHotUpdate=function(e,n){s(e,n),h&&h(e,n)};var v,g,y,_,m=!0,O="ef502750a1b353407b21",b={},w=[],j=[],D=[],E="idle",P=0,C=0,I={},x={},A={},H={};p.m=e,p.c=H,p.i=function(e){return e},p.d=function(e,n,t){p.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:t})},p.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return p.d(n,"a",n),n},p.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},p.p="/",p.h=function(){return O},o(31)(p.s=31)}({1:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(2),o=function(){function e(){this._listeners={},this.on=r.chain(function(e,n){void 0===this._listeners[e]&&(this._listeners[e]=[]),this._listeners[e].push(n)}),this.trigger=r.chain(function(e,n){if(this._listeners[e]instanceof Array)for(var t=this._listeners[e],r=0,o=t.length;r<o;r++)t[r].call(this,n)}),this.removeListener=r.chain(function(e,n){if(this._listeners[e]instanceof Array)for(var t=this._listeners[e],r=0,o=t.length;r<o;r++)if(t[r]===n){t.splice(r,1);break}})}return e}();n.default=o},2:function(e,n,t){"use strict";function r(){var e=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};return(e()+e()+"-"+e()+"-4"+e().substr(0,3)+"-"+e()+"-"+e()+e()+e()).toLowerCase()}function o(e,n,t){var r={};return void 0===t&&(t=[Array,HTMLElement]),this.extend(r,e,t),this.extend(r,n,t),r}function i(e,n,t){for(var r in n)if(n.hasOwnProperty(r)){var o=!1;if(t)for(var i=0;i<t.length;i++)n[r]instanceof t[i]&&(o=!0);"object"!=typeof n[r]||o?e[r]=n[r]:(e[r]=void 0!==e[r]?e[r]:{},this.extend(e[r],n[r],t))}}function c(e,n,t){for(var r=0;r<e.length;r++){var o=e[r];if(a(o,n))return t&&t(o,r),o}}function a(e,n){switch(typeof n){case"object":return!1!==function e(n,t){for(var r in t){var o=t[r],i=n[r];if("object"==typeof o)return e(i,o);if(i!==o)return!1}}(e,n);case"function":return n(e)}}function d(e,n,t){for(var r=0;r<e.length;r++){if(s(e[r],n,t))return!0}return!1}function s(e,n,t){t=t||{};for(var r in t)if(e[r]!==n[r])return!1;return!0}function f(e,n,t,r){for(var o=[],i=0;i<e.length;i++)o.push(e[i]);for(var i=0;i<n.length;i++){!d(e,n[i],t)&&o.push(n[i])}return r&&r(o),o}function u(e,n){for(var t=0;t<e.length&&!n(e[t],t);t++);}function l(e){return function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return e.apply(this,n),this}}Object.defineProperty(n,"__esModule",{value:!0}),n.generateGuid=r,n.merge=o,n.extend=i,n.findOne=c,n.matchesQuery=a,n.contains=d,n.equalsObject=s,n.union=f,n.each=u,n.chain=l},31:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(1);n.EventTarget=r.default;var o=t(6);n.RTCConnection=o.default;var i=t(8);n.RTCPeer=i.default;var c=t(7);n.RTCProvider=c.default},6:function(e,n,t){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])};return function(n,t){function r(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}();Object.defineProperty(n,"__esModule",{value:!0});var o=t(2),i=t(1),c=function(e){function n(t,r){var i=e.call(this)||this;i.close=o.chain(function(){var e=this;e.pc.close(),e.trigger("closed")});var c=i;c.options=o.merge(n.defaultOptions,t||{},[Array]),c.id=o.generateGuid(),c.streams=r;var a=c.candidates=[],d=c.pc=new RTCPeerConnection(c.options.servers);return d.addEventListener("datachannel",function(e){e.channel.addEventListener("open",function(){console.log("channel opened: ",e.channel),c.trigger("channel",e.channel)})}),d.createDataChannel("dataChannel").addEventListener("message",function(e){console.log("data received: ",e),c.trigger("data",e)}),r&&o.each(r,function(e){d.addStream(e)}),d.addEventListener("addstream",function(e){c.trigger("streams",{streams:[e.stream]})}),d.ontrack=function(e){c.trigger("streams",e)},d.addEventListener("icecandidate",function(e){e.candidate?a.push(e.candidate):c.trigger("icegatheringcomplete")}),d.addEventListener("iceconnectionstatechange",function(e){"disconnected"===d.iceConnectionState&&c.trigger("closed")}),d.addEventListener("close",function(e){console.log("closed"),c.trigger("closed")}),i}return r(n,e),n.defaultOptions={evname:"rtcdata"},n}(i.default);n.default=c},7:function(e,n,t){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])};return function(n,t){function r(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}();Object.defineProperty(n,"__esModule",{value:!0});var o=t(2),i=t(1),c=function(e){function n(t,r){var i=e.call(this)||this;return i.send=o.chain(function(e,n,t,r){var o=this;o.socket.emit(o.options.evname,{type:e,to:n,data:t},r)}),i.options=o.merge(n.defaultOptions,t||{},[Array]),i.socket=r,r.on(i.options.evname,function(e){i.trigger(e.type,{data:e.data,from:e.from})}),i}return r(n,e),n.defaultOptions={evname:"rtcdata"},n}(i.default);n.default=c},8:function(e,n,t){"use strict";var r=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)n.hasOwnProperty(t)&&(e[t]=n[t])};return function(n,t){function r(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}();Object.defineProperty(n,"__esModule",{value:!0});var o=t(2),i=t(1),c=t(7),a=t(6),d=function(e){function n(t,r){var i=e.call(this)||this;i.connections=[],i.offer=o.chain(function(e,n,t){var r=this,o=new a.default({},n);r.addConnection(o),t(null,o),o.pc.createOffer(function(n){o.on("icegatheringcomplete",function(){var t={description:n,candidates:o.candidates,connectionId:o.id};r.provider.send("offer",e,t,function(e){e?(o.close(),o.trigger("offerfailed",{err:e,offer:t})):o.trigger("offersucceeded",{con:o,offer:t})})}),o.pc.setLocalDescription(n)},function(e){o.trigger("offerfailed",{err:e})})}),i.accept=o.chain(function(e,n,t){var r=this,i=new a.default({},n);r.addConnection(i),t(null,i),i.pc.setRemoteDescription(new RTCSessionDescription(e.data.description)),o.each(e.data.candidates,function(e){i.pc.addIceCandidate(new RTCIceCandidate(e))}),i.pc.createAnswer(function(n){i.on("icegatheringcomplete",function(){var t={description:n,candidates:i.candidates,offererConnectionId:e.data.connectionId,recipientConnectionId:i.id};r.provider.send("accepted",e.from,t,function(e){e?i.trigger("acceptfailed",{err:e,answer:t}):i.trigger("acceptsucceeded",{con:i,answer:t})})}),i.pc.setLocalDescription(n)},function(e){i.trigger("acceptfailed",{err:e})})}),i.reject=o.chain(function(e,n){this.provider.send("rejected",e.from,{offererConnectionId:e.data.connectionId},function(e){n(e||null)})}),i.addConnection=o.chain(function(e){var n=this;n.connections.push(e),e.on("closed",function(){var t=o.union(e.pc.getLocalStreams(),e.pc.getRemoteStreams());o.each(t,function(e){e.getTracks().forEach(function(e){e.stop()})}),n.connections.splice(n.connections.indexOf(e),1)})}),i.stopConnection=o.chain(function(e,n,t){this.provider.send("stop",{to:n,id:e.id},function(n){n?t(n):(e.close(),t(null))})}),t=i.options=o.merge(n.defaultOptions,t||{},[Array]);var d=i.provider=new c.default({},r);return d.on("accepted",function(e){var n=e.data;o.findOne(i.connections,{id:n.offererConnectionId},function(t){t.remoteId=n.recipientConnectionId,t.pc.setRemoteDescription(new RTCSessionDescription(n.description)),o.each(n.candidates,function(e){t.pc.addIceCandidate(new RTCIceCandidate(e))}),t.trigger("accepted",e)})}),d.on("rejected",function(e){var n=e.data;o.findOne(i.connections,{id:n.offererConnectionId},function(n){n.close(),n.trigger("rejected",e)})}),d.on("stop",function(e){o.findOne(i.connections,{remoteId:e.data.id},function(e){e.close()})}),d.on("offer",function(e){i.trigger("offer",e)}),i}return r(n,e),n.defaultOptions={},n}(i.default);n.default=d}});
//# sourceMappingURL=rtc.js.map