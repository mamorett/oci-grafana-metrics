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
exports.AsyncByteStream = exports.ByteStream = exports.AsyncByteQueue = void 0;
var tslib_1 = require("tslib");
var adapters_1 = require("./adapters");
var utf8_1 = require("../util/utf8");
var interfaces_1 = require("./interfaces");
var buffer_1 = require("../util/buffer");
var compat_1 = require("../util/compat");
/** @ignore */
var AsyncByteQueue = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncByteQueue, _super);
    function AsyncByteQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncByteQueue.prototype.write = function (value) {
        if ((value = buffer_1.toUint8Array(value)).byteLength > 0) {
            return _super.prototype.write.call(this, value);
        }
    };
    AsyncByteQueue.prototype.toString = function (sync) {
        if (sync === void 0) { sync = false; }
        return sync
            ? utf8_1.decodeUtf8(this.toUint8Array(true))
            : this.toUint8Array(false).then(utf8_1.decodeUtf8);
    };
    AsyncByteQueue.prototype.toUint8Array = function (sync) {
        var _this = this;
        if (sync === void 0) { sync = false; }
        return sync ? buffer_1.joinUint8Arrays(this._values)[0] : (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var buffers, byteLength, _a, _b, chunk, e_1_1;
            var e_1, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        buffers = [];
                        byteLength = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _a = tslib_1.__asyncValues(this);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _a.next()];
                    case 3:
                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                        chunk = _b.value;
                        buffers.push(chunk);
                        byteLength += chunk.byteLength;
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _c.call(_a)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, buffer_1.joinUint8Arrays(buffers, byteLength)[0]];
                }
            });
        }); })();
    };
    return AsyncByteQueue;
}(interfaces_1.AsyncQueue));
exports.AsyncByteQueue = AsyncByteQueue;
/** @ignore */
var ByteStream = /** @class */ (function () {
    function ByteStream(source) {
        if (source) {
            this.source = new ByteStreamSource(adapters_1.default.fromIterable(source));
        }
    }
    ByteStream.prototype[Symbol.iterator] = function () { return this; };
    ByteStream.prototype.next = function (value) { return this.source.next(value); };
    ByteStream.prototype.throw = function (value) { return this.source.throw(value); };
    ByteStream.prototype.return = function (value) { return this.source.return(value); };
    ByteStream.prototype.peek = function (size) { return this.source.peek(size); };
    ByteStream.prototype.read = function (size) { return this.source.read(size); };
    return ByteStream;
}());
exports.ByteStream = ByteStream;
/** @ignore */
var AsyncByteStream = /** @class */ (function () {
    function AsyncByteStream(source) {
        if (source instanceof AsyncByteStream) {
            this.source = source.source;
        }
        else if (source instanceof AsyncByteQueue) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromAsyncIterable(source));
        }
        else if (compat_1.isReadableNodeStream(source)) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromNodeStream(source));
        }
        else if (compat_1.isReadableDOMStream(source)) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromDOMStream(source));
        }
        else if (compat_1.isFetchResponse(source)) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromDOMStream(source.body));
        }
        else if (compat_1.isIterable(source)) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromIterable(source));
        }
        else if (compat_1.isPromise(source)) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromAsyncIterable(source));
        }
        else if (compat_1.isAsyncIterable(source)) {
            this.source = new AsyncByteStreamSource(adapters_1.default.fromAsyncIterable(source));
        }
    }
    AsyncByteStream.prototype[Symbol.asyncIterator] = function () { return this; };
    AsyncByteStream.prototype.next = function (value) { return this.source.next(value); };
    AsyncByteStream.prototype.throw = function (value) { return this.source.throw(value); };
    AsyncByteStream.prototype.return = function (value) { return this.source.return(value); };
    Object.defineProperty(AsyncByteStream.prototype, "closed", {
        get: function () { return this.source.closed; },
        enumerable: false,
        configurable: true
    });
    AsyncByteStream.prototype.cancel = function (reason) { return this.source.cancel(reason); };
    AsyncByteStream.prototype.peek = function (size) { return this.source.peek(size); };
    AsyncByteStream.prototype.read = function (size) { return this.source.read(size); };
    return AsyncByteStream;
}());
exports.AsyncByteStream = AsyncByteStream;
/** @ignore */
var ByteStreamSource = /** @class */ (function () {
    function ByteStreamSource(source) {
        this.source = source;
    }
    ByteStreamSource.prototype.cancel = function (reason) { this.return(reason); };
    ByteStreamSource.prototype.peek = function (size) { return this.next(size, 'peek').value; };
    ByteStreamSource.prototype.read = function (size) { return this.next(size, 'read').value; };
    ByteStreamSource.prototype.next = function (size, cmd) {
        if (cmd === void 0) { cmd = 'read'; }
        return this.source.next({ cmd: cmd, size: size });
    };
    ByteStreamSource.prototype.throw = function (value) { return Object.create((this.source.throw && this.source.throw(value)) || interfaces_1.ITERATOR_DONE); };
    ByteStreamSource.prototype.return = function (value) { return Object.create((this.source.return && this.source.return(value)) || interfaces_1.ITERATOR_DONE); };
    return ByteStreamSource;
}());
/** @ignore */
var AsyncByteStreamSource = /** @class */ (function () {
    function AsyncByteStreamSource(source) {
        var _this = this;
        this.source = source;
        this._closedPromise = new Promise(function (r) { return _this._closedPromiseResolve = r; });
    }
    AsyncByteStreamSource.prototype.cancel = function (reason) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.return(reason)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        }); });
    };
    Object.defineProperty(AsyncByteStreamSource.prototype, "closed", {
        get: function () { return this._closedPromise; },
        enumerable: false,
        configurable: true
    });
    AsyncByteStreamSource.prototype.read = function (size) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.next(size, 'read')];
                case 1: return [2 /*return*/, (_a.sent()).value];
            }
        }); });
    };
    AsyncByteStreamSource.prototype.peek = function (size) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.next(size, 'peek')];
                case 1: return [2 /*return*/, (_a.sent()).value];
            }
        }); });
    };
    AsyncByteStreamSource.prototype.next = function (size, cmd) {
        if (cmd === void 0) { cmd = 'read'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.source.next({ cmd: cmd, size: size })];
                case 1: return [2 /*return*/, (_a.sent())];
            }
        }); });
    };
    AsyncByteStreamSource.prototype.throw = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.source.throw;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.source.throw(value)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        result = (_a) || interfaces_1.ITERATOR_DONE;
                        this._closedPromiseResolve && this._closedPromiseResolve();
                        this._closedPromiseResolve = undefined;
                        return [2 /*return*/, Object.create(result)];
                }
            });
        });
    };
    AsyncByteStreamSource.prototype.return = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.source.return;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.source.return(value)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        result = (_a) || interfaces_1.ITERATOR_DONE;
                        this._closedPromiseResolve && this._closedPromiseResolve();
                        this._closedPromiseResolve = undefined;
                        return [2 /*return*/, Object.create(result)];
                }
            });
        });
    };
    return AsyncByteStreamSource;
}());

//# sourceMappingURL=stream.js.map
