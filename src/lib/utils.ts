export function generateGuid() {
    let S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

export function merge(a, b, excludeInstances) {
    var copy = {};
    if (typeof excludeInstances === 'undefined') {
        excludeInstances = [Array, HTMLElement];
    }

    this.extend(copy, a, excludeInstances);
    this.extend(copy, b, excludeInstances);
    return copy;
}

export function extend(a, b, excludeInstances) {
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
}

export function findOne(ar, query, fn) {
    for (var i = 0; i < ar.length; i++) {
        var a = ar[i];
        var m = matchesQuery(a, query);
        if (m) {
            if (fn) fn(a, i);
            return a;
        }
    }
}

export function matchesQuery(obj, query) {
    switch (typeof query) {
        case 'object':
            var _r = (function _f(_obj, _query) {
                for (var prop in _query) {
                    var qprop = _query[prop];
                    var oprop = _obj[prop];
                    if (typeof qprop === 'object')
                        return _f(oprop, qprop);
                    else if (oprop !== qprop)
                        return false;
                }
            })(obj, query)
            return _r !== false;;
        case 'function':
            return query(obj);
    }
}

export function contains(ar, obj, query) {
    for (var i = 0; i < ar.length; i++) {
        var a = ar[i];
        if (equalsObject(a, obj, query))
            return true;
    }
    return false;
}

export function equalsObject(obj1, obj2, query) {
    query = query || {};
    for (var prop in query) {
        if (obj1[prop] !== obj2[prop])
            return false;
    }
    return true;
}

export function union(ar1, ar2, query?, fn?) {
    var results = [];
    for (var i = 0; i < ar1.length; i++)
        results.push(ar1[i]);
    for (var i = 0; i < ar2.length; i++) {
        var isNotInAr1 = !contains(ar1, ar2[i], query);
        if (isNotInAr1)
            results.push(ar2[i]);
    };
    if (fn) fn(results);
    return results;
}

export function each(ar, fn) {
    for (var i = 0; i < ar.length; i++)
        if (fn(ar[i], i))
            break;
}

export function chain(fn) {
    return function (...args) {
        fn.apply(this, args);
        return this;
    };
}

export function getUserMedia(...args) {
    if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia.apply(navigator.mediaDevices, args);
    }

    return new Promise((resolve, reject) => {
        navigator.getUserMedia.call(navigator, args[0], function (stream) {
            resolve(stream);
        }, function (err) {
            reject(err);
        });
    });
}
