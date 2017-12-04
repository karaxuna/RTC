import { chain } from './utils';

class EventTarget {
    private _listeners = {};

    on = chain(function (type, listener) {
        if (typeof this._listeners[type] == 'undefined') {
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    });

    trigger = chain(function (type, data) {
        if (this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, data);
            }
        }
    });

    removeListener = chain(function (type, listener) {
        if (this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    });
}

export default EventTarget;
