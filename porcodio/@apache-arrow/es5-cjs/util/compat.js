"use strict";
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadableNodeStream = exports.isWritableNodeStream = exports.isReadableDOMStream = exports.isWritableDOMStream = exports.isFetchResponse = exports.isFSReadStream = exports.isFileHandle = exports.isUnderlyingSink = exports.isIteratorResult = exports.isArrayLike = exports.isArrowJSON = exports.isAsyncIterable = exports.isIterable = exports.isObservable = exports.isPromise = exports.isObject = exports.BigUint64ArrayAvailable = exports.BigUint64Array = exports.BigInt64ArrayAvailable = exports.BigInt64Array = exports.BigIntAvailable = exports.BigInt = void 0;
var tslib_1 = require("tslib");
var interfaces_1 = require("../io/interfaces");
/** @ignore */
var _a = tslib_1.__read((function () {
    var BigIntUnavailableError = function () { throw new Error('BigInt is not available in this environment'); };
    function BigIntUnavailable() { throw BigIntUnavailableError(); }
    BigIntUnavailable.asIntN = function () { throw BigIntUnavailableError(); };
    BigIntUnavailable.asUintN = function () { throw BigIntUnavailableError(); };
    return typeof BigInt !== 'undefined' ? [BigInt, true] : [BigIntUnavailable, false];
})(), 2), BigIntCtor = _a[0], BigIntAvailable = _a[1];
exports.BigInt = BigIntCtor;
exports.BigIntAvailable = BigIntAvailable;
/** @ignore */
var _b = tslib_1.__read((function () {
    var BigInt64ArrayUnavailableError = function () { throw new Error('BigInt64Array is not available in this environment'); };
    var BigInt64ArrayUnavailable = /** @class */ (function () {
        function BigInt64ArrayUnavailable() {
            throw BigInt64ArrayUnavailableError();
        }
        Object.defineProperty(BigInt64ArrayUnavailable, "BYTES_PER_ELEMENT", {
            get: function () { return 8; },
            enumerable: false,
            configurable: true
        });
        BigInt64ArrayUnavailable.of = function () { throw BigInt64ArrayUnavailableError(); };
        BigInt64ArrayUnavailable.from = function () { throw BigInt64ArrayUnavailableError(); };
        return BigInt64ArrayUnavailable;
    }());
    return typeof BigInt64Array !== 'undefined' ? [BigInt64Array, true] : [BigInt64ArrayUnavailable, false];
})(), 2), BigInt64ArrayCtor = _b[0], BigInt64ArrayAvailable = _b[1];
exports.BigInt64Array = BigInt64ArrayCtor;
exports.BigInt64ArrayAvailable = BigInt64ArrayAvailable;
/** @ignore */
var _c = tslib_1.__read((function () {
    var BigUint64ArrayUnavailableError = function () { throw new Error('BigUint64Array is not available in this environment'); };
    var BigUint64ArrayUnavailable = /** @class */ (function () {
        function BigUint64ArrayUnavailable() {
            throw BigUint64ArrayUnavailableError();
        }
        Object.defineProperty(BigUint64ArrayUnavailable, "BYTES_PER_ELEMENT", {
            get: function () { return 8; },
            enumerable: false,
            configurable: true
        });
        BigUint64ArrayUnavailable.of = function () { throw BigUint64ArrayUnavailableError(); };
        BigUint64ArrayUnavailable.from = function () { throw BigUint64ArrayUnavailableError(); };
        return BigUint64ArrayUnavailable;
    }());
    return typeof BigUint64Array !== 'undefined' ? [BigUint64Array, true] : [BigUint64ArrayUnavailable, false];
})(), 2), BigUint64ArrayCtor = _c[0], BigUint64ArrayAvailable = _c[1];
exports.BigUint64Array = BigUint64ArrayCtor;
exports.BigUint64ArrayAvailable = BigUint64ArrayAvailable;
/** @ignore */ var isNumber = function (x) { return typeof x === 'number'; };
/** @ignore */ var isBoolean = function (x) { return typeof x === 'boolean'; };
/** @ignore */ var isFunction = function (x) { return typeof x === 'function'; };
/** @ignore */
// eslint-disable-next-line @typescript-eslint/ban-types
exports.isObject = function (x) { return x != null && Object(x) === x; };
/** @ignore */
exports.isPromise = function (x) {
    return exports.isObject(x) && isFunction(x.then);
};
/** @ignore */
exports.isObservable = function (x) {
    return exports.isObject(x) && isFunction(x.subscribe);
};
/** @ignore */
exports.isIterable = function (x) {
    return exports.isObject(x) && isFunction(x[Symbol.iterator]);
};
/** @ignore */
exports.isAsyncIterable = function (x) {
    return exports.isObject(x) && isFunction(x[Symbol.asyncIterator]);
};
/** @ignore */
exports.isArrowJSON = function (x) {
    return exports.isObject(x) && exports.isObject(x['schema']);
};
/** @ignore */
exports.isArrayLike = function (x) {
    return exports.isObject(x) && isNumber(x['length']);
};
/** @ignore */
exports.isIteratorResult = function (x) {
    return exports.isObject(x) && ('done' in x) && ('value' in x);
};
/** @ignore */
exports.isUnderlyingSink = function (x) {
    return exports.isObject(x) &&
        isFunction(x['abort']) &&
        isFunction(x['close']) &&
        isFunction(x['start']) &&
        isFunction(x['write']);
};
/** @ignore */
exports.isFileHandle = function (x) {
    return exports.isObject(x) && isFunction(x['stat']) && isNumber(x['fd']);
};
/** @ignore */
exports.isFSReadStream = function (x) {
    return exports.isReadableNodeStream(x) && isNumber(x['bytesRead']);
};
/** @ignore */
exports.isFetchResponse = function (x) {
    return exports.isObject(x) && exports.isReadableDOMStream(x['body']);
};
/** @ignore */
exports.isWritableDOMStream = function (x) {
    return exports.isObject(x) &&
        isFunction(x['abort']) &&
        isFunction(x['getWriter']) &&
        !(x instanceof interfaces_1.ReadableInterop);
};
/** @ignore */
exports.isReadableDOMStream = function (x) {
    return exports.isObject(x) &&
        isFunction(x['cancel']) &&
        isFunction(x['getReader']) &&
        !(x instanceof interfaces_1.ReadableInterop);
};
/** @ignore */
exports.isWritableNodeStream = function (x) {
    return exports.isObject(x) &&
        isFunction(x['end']) &&
        isFunction(x['write']) &&
        isBoolean(x['writable']) &&
        !(x instanceof interfaces_1.ReadableInterop);
};
/** @ignore */
exports.isReadableNodeStream = function (x) {
    return exports.isObject(x) &&
        isFunction(x['read']) &&
        isFunction(x['pipe']) &&
        isBoolean(x['readable']) &&
        !(x instanceof interfaces_1.ReadableInterop);
};

//# sourceMappingURL=compat.js.map
