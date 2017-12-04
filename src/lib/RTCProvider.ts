import { merge, chain } from './utils';
import EventTarget from './EventTarget';

class RTCProvider extends EventTarget {
    options;
    socket;

    static defaultOptions = {
        evname: 'rtcdata'
    };

    constructor(options, socket) {
        super();

        this.options = merge(RTCProvider.defaultOptions, options || {}, [Array]);
        this.socket = socket;

        // Listen for incoming events
        socket.on(this.options.evname, (data) => {
            this.trigger(data.type, {
                data: data.data,
                from: data.from
            });
        });
    }

    send = chain(function (type, to, data, callback) {
        var self = this;
        self.socket.emit(self.options.evname, { type: type, to: to, data: data }, callback);
    });
}

export default RTCProvider;
