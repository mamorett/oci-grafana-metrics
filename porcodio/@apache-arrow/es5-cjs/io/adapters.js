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
var tslib_1 = require("tslib");
var buffer_1 = require("../util/buffer");
/** @ignore */
exports.default = {
    fromIterable: function (source) {
        return pump(fromIterable(source));
    },
    fromAsyncIterable: function (source) {
        return pump(fromAsyncIterable(source));
    },
    fromDOMStream: function (source) {
        return pump(fromDOMStream(source));
    },
    fromNodeStream: function (stream) {
        return pump(fromNodeStream(stream));
    },
    // @ts-ignore
    toDOMStream: function (source, options) {
        throw new Error("\"toDOMStream\" not available in this environment");
    },
    // @ts-ignore
    toNodeStream: function (source, options) {
        throw new Error("\"toNodeStream\" not available in this environment");
    },
};
/** @ignore */
var pump = function (iterator) { iterator.next(); return iterator; };
/** @ignore */
function fromIterable(source) {
    function byteRange() {
        var _a;
        if (cmd === 'peek') {
            return buffer_1.joinUint8Arrays(buffers, size)[0];
        }
        _a = tslib_1.__read(buffer_1.joinUint8Arrays(buffers, size), 3), buffer = _a[0], buffers = _a[1], bufferLength = _a[2];
        return buffer;
    }
    var done, threw, buffers, buffer, cmd, size, bufferLength, it, e_1;
    var _a, _b, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                threw = false;
                buffers = [];
                bufferLength = 0;
                return [4 /*yield*/, null];
            case 1:
                // Yield so the caller can inject the read command before creating the source Iterator
                (_a = _d.sent(), cmd = _a.cmd, size = _a.size);
                it = buffer_1.toUint8ArrayIterator(source)[Symbol.iterator]();
                _d.label = 2;
            case 2:
                _d.trys.push([2, 9, 10, 11]);
                _d.label = 3;
            case 3:
                // read the next value
                (_b = isNaN(size - bufferLength) ?
                    it.next(undefined) : it.next(size - bufferLength), done = _b.done, buffer = _b.value);
                // if chunk is not null or empty, push it onto the queue
                if (!done && buffer.byteLength > 0) {
                    buffers.push(buffer);
                    bufferLength += buffer.byteLength;
                }
                if (!(done || size <= bufferLength)) return [3 /*break*/, 7];
                _d.label = 4;
            case 4: return [4 /*yield*/, byteRange()];
            case 5:
                (_c = _d.sent(), cmd = _c.cmd, size = _c.size);
                _d.label = 6;
            case 6:
                if (size < bufferLength) return [3 /*break*/, 4];
                _d.label = 7;
            case 7:
                if (!done) return [3 /*break*/, 3];
                _d.label = 8;
            case 8: return [3 /*break*/, 11];
            case 9:
                e_1 = _d.sent();
                (threw = true) && (typeof it.throw === 'function') && (it.throw(e_1));
                return [3 /*break*/, 11];
            case 10:
                (threw === false) && (typeof it.return === 'function') && (it.return(null));
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/, null];
        }
    });
}
/** @ignore */
function fromAsyncIterable(source) {
    return tslib_1.__asyncGenerator(this, arguments, function fromAsyncIterable_1() {
        function byteRange() {
            var _a;
            if (cmd === 'peek') {
                return buffer_1.joinUint8Arrays(buffers, size)[0];
            }
            _a = tslib_1.__read(buffer_1.joinUint8Arrays(buffers, size), 3), buffer = _a[0], buffers = _a[1], bufferLength = _a[2];
            return buffer;
        }
        var done, threw, buffers, buffer, cmd, size, bufferLength, it, _a, e_2, _b, _c;
        var _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    threw = false;
                    buffers = [];
                    bufferLength = 0;
                    return [4 /*yield*/, tslib_1.__await(null)];
                case 1: return [4 /*yield*/, _g.sent()];
                case 2:
                    // Yield so the caller can inject the read command before creating the source AsyncIterator
                    (_d = (_g.sent()), cmd = _d.cmd, size = _d.size);
                    it = buffer_1.toUint8ArrayAsyncIterator(source)[Symbol.asyncIterator]();
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 15, 18, 21]);
                    _g.label = 4;
                case 4:
                    if (!isNaN(size - bufferLength)) return [3 /*break*/, 6];
                    return [4 /*yield*/, tslib_1.__await(it.next(undefined))];
                case 5:
                    _a = _g.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, tslib_1.__await(it.next(size - bufferLength))];
                case 7:
                    _a = _g.sent();
                    _g.label = 8;
                case 8:
                    // read the next value
                    (_e = _a, done = _e.done, buffer = _e.value);
                    // if chunk is not null or empty, push it onto the queue
                    if (!done && buffer.byteLength > 0) {
                        buffers.push(buffer);
                        bufferLength += buffer.byteLength;
                    }
                    if (!(done || size <= bufferLength)) return [3 /*break*/, 13];
                    _g.label = 9;
                case 9: return [4 /*yield*/, tslib_1.__await(byteRange())];
                case 10: return [4 /*yield*/, _g.sent()];
                case 11:
                    (_f = _g.sent(), cmd = _f.cmd, size = _f.size);
                    _g.label = 12;
                case 12:
                    if (size < bufferLength) return [3 /*break*/, 9];
                    _g.label = 13;
                case 13:
                    if (!done) return [3 /*break*/, 4];
                    _g.label = 14;
                case 14: return [3 /*break*/, 21];
                case 15:
                    e_2 = _g.sent();
                    _b = (threw = true) && (typeof it.throw === 'function');
                    if (!_b) return [3 /*break*/, 17];
                    return [4 /*yield*/, tslib_1.__await(it.throw(e_2))];
                case 16:
                    _b = (_g.sent());
                    _g.label = 17;
                case 17:
                    _b;
                    return [3 /*break*/, 21];
                case 18:
                    _c = (threw === false) && (typeof it.return === 'function');
                    if (!_c) return [3 /*break*/, 20];
                    return [4 /*yield*/, tslib_1.__await(it.return(new Uint8Array(0)))];
                case 19:
                    _c = (_g.sent());
                    _g.label = 20;
                case 20:
                    _c;
                    return [7 /*endfinally*/];
                case 21: return [4 /*yield*/, tslib_1.__await(null)];
                case 22: return [2 /*return*/, _g.sent()];
            }
        });
    });
}
// All this manual Uint8Array chunk management can be avoided if/when engines
// add support for ArrayBuffer.transfer() or ArrayBuffer.prototype.realloc():
// https://github.com/domenic/proposal-arraybuffer-transfer
/** @ignore */
function fromDOMStream(source) {
    return tslib_1.__asyncGenerator(this, arguments, function fromDOMStream_1() {
        function byteRange() {
            var _a;
            if (cmd === 'peek') {
                return buffer_1.joinUint8Arrays(buffers, size)[0];
            }
            _a = tslib_1.__read(buffer_1.joinUint8Arrays(buffers, size), 3), buffer = _a[0], buffers = _a[1], bufferLength = _a[2];
            return buffer;
        }
        var done, threw, buffers, buffer, cmd, size, bufferLength, it, _a, e_3, _b, _c;
        var _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    done = false, threw = false;
                    buffers = [];
                    bufferLength = 0;
                    return [4 /*yield*/, tslib_1.__await(null)];
                case 1: return [4 /*yield*/, _g.sent()];
                case 2:
                    // Yield so the caller can inject the read command before we establish the ReadableStream lock
                    (_d = _g.sent(), cmd = _d.cmd, size = _d.size);
                    it = new AdaptiveByteReader(source);
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 15, 18, 22]);
                    _g.label = 4;
                case 4:
                    if (!isNaN(size - bufferLength)) return [3 /*break*/, 6];
                    return [4 /*yield*/, tslib_1.__await(it['read'](undefined))];
                case 5:
                    _a = _g.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, tslib_1.__await(it['read'](size - bufferLength))];
                case 7:
                    _a = _g.sent();
                    _g.label = 8;
                case 8:
                    // read the next value
                    (_e = _a, done = _e.done, buffer = _e.value);
                    // if chunk is not null or empty, push it onto the queue
                    if (!done && buffer.byteLength > 0) {
                        buffers.push(buffer_1.toUint8Array(buffer));
                        bufferLength += buffer.byteLength;
                    }
                    if (!(done || size <= bufferLength)) return [3 /*break*/, 13];
                    _g.label = 9;
                case 9: return [4 /*yield*/, tslib_1.__await(byteRange())];
                case 10: return [4 /*yield*/, _g.sent()];
                case 11:
                    (_f = _g.sent(), cmd = _f.cmd, size = _f.size);
                    _g.label = 12;
                case 12:
                    if (size < bufferLength) return [3 /*break*/, 9];
                    _g.label = 13;
                case 13:
                    if (!done) return [3 /*break*/, 4];
                    _g.label = 14;
                case 14: return [3 /*break*/, 22];
                case 15:
                    e_3 = _g.sent();
                    _b = (threw = true);
                    if (!_b) return [3 /*break*/, 17];
                    return [4 /*yield*/, tslib_1.__await(it['cancel'](e_3))];
                case 16:
                    _b = (_g.sent());
                    _g.label = 17;
                case 17:
                    _b;
                    return [3 /*break*/, 22];
                case 18:
                    if (!(threw === false)) return [3 /*break*/, 20];
                    return [4 /*yield*/, tslib_1.__await(it['cancel']())];
                case 19:
                    _c = (_g.sent());
                    return [3 /*break*/, 21];
                case 20:
                    _c = source['locked'] && it.releaseLock();
                    _g.label = 21;
                case 21:
                    _c;
                    return [7 /*endfinally*/];
                case 22: return [4 /*yield*/, tslib_1.__await(null)];
                case 23: return [2 /*return*/, _g.sent()];
            }
        });
    });
}
/** @ignore */
var AdaptiveByteReader = /** @class */ (function () {
    function AdaptiveByteReader(source) {
        this.source = source;
        this.byobReader = null;
        this.defaultReader = null;
        try {
            this.supportsBYOB = !!(this.reader = this.getBYOBReader());
        }
        catch (e) {
            this.supportsBYOB = !(this.reader = this.getDefaultReader());
        }
    }
    Object.defineProperty(AdaptiveByteReader.prototype, "closed", {
        get: function () {
            return this.reader ? this.reader['closed'].catch(function () { }) : Promise.resolve();
        },
        enumerable: false,
        configurable: true
    });
    AdaptiveByteReader.prototype.releaseLock = function () {
        if (this.reader) {
            this.reader.releaseLock();
        }
        this.reader = this.byobReader = this.defaultReader = null;
    };
    AdaptiveByteReader.prototype.cancel = function (reason) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, reader, source, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this, reader = _a.reader, source = _a.source;
                        _b = reader;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, reader['cancel'](reason).catch(function () { })];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _b;
                        source && (source['locked'] && this.releaseLock());
                        return [2 /*return*/];
                }
            });
        });
    };
    AdaptiveByteReader.prototype.read = function (size) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (size === 0) {
                            return [2 /*return*/, { done: this.reader == null, value: new Uint8Array(0) }];
                        }
                        if (!(!this.supportsBYOB || typeof size !== 'number')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getDefaultReader().read()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.readFromBYOBReader(size)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        result = _a;
                        !result.done && (result.value = buffer_1.toUint8Array(result));
                        return [2 /*return*/, result];
                }
            });
        });
    };
    AdaptiveByteReader.prototype.getDefaultReader = function () {
        if (this.byobReader) {
            this.releaseLock();
        }
        if (!this.defaultReader) {
            this.defaultReader = this.source['getReader']();
            // We have to catch and swallow errors here to avoid uncaught promise rejection exceptions
            // that seem to be raised when we call `releaseLock()` on this reader. I'm still mystified
            // about why these errors are raised, but I'm sure there's some important spec reason that
            // I haven't considered. I hate to employ such an anti-pattern here, but it seems like the
            // only solution in this case :/
            this.defaultReader['closed'].catch(function () { });
        }
        return (this.reader = this.defaultReader);
    };
    AdaptiveByteReader.prototype.getBYOBReader = function () {
        if (this.defaultReader) {
            this.releaseLock();
        }
        if (!this.byobReader) {
            this.byobReader = this.source['getReader']({ mode: 'byob' });
            // We have to catch and swallow errors here to avoid uncaught promise rejection exceptions
            // that seem to be raised when we call `releaseLock()` on this reader. I'm still mystified
            // about why these errors are raised, but I'm sure there's some important spec reason that
            // I haven't considered. I hate to employ such an anti-pattern here, but it seems like the
            // only solution in this case :/
            this.byobReader['closed'].catch(function () { });
        }
        return (this.reader = this.byobReader);
    };
    // This strategy plucked from the example in the streams spec:
    // https://streams.spec.whatwg.org/#example-manual-read-bytes
    AdaptiveByteReader.prototype.readFromBYOBReader = function (size) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readInto(this.getBYOBReader(), new ArrayBuffer(size), 0, size)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AdaptiveByteReader;
}());
/** @ignore */
function readInto(reader, buffer, offset, size) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, done, value;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (offset >= size) {
                        return [2 /*return*/, { done: false, value: new Uint8Array(buffer, 0, size) }];
                    }
                    return [4 /*yield*/, reader.read(new Uint8Array(buffer, offset, size - offset))];
                case 1:
                    _a = _b.sent(), done = _a.done, value = _a.value;
                    if (!(((offset += value.byteLength) < size) && !done)) return [3 /*break*/, 3];
                    return [4 /*yield*/, readInto(reader, value.buffer, offset, size)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [2 /*return*/, { done: done, value: new Uint8Array(value.buffer, 0, offset) }];
            }
        });
    });
}
/** @ignore */
var onEvent = function (stream, event) {
    var handler = function (_) { return resolve([event, _]); };
    var resolve;
    return [event, handler, new Promise(function (r) { return (resolve = r) && stream['once'](event, handler); })];
};
/** @ignore */
function fromNodeStream(stream) {
    return tslib_1.__asyncGenerator(this, arguments, function fromNodeStream_1() {
        function byteRange() {
            var _a;
            if (cmd === 'peek') {
                return buffer_1.joinUint8Arrays(buffers, size)[0];
            }
            _a = tslib_1.__read(buffer_1.joinUint8Arrays(buffers, size), 3), buffer = _a[0], buffers = _a[1], bufferLength = _a[2];
            return buffer;
        }
        function cleanup(events, err) {
            buffer = buffers = null;
            return new Promise(function (resolve, reject) {
                var e_4, _a;
                try {
                    for (var events_1 = tslib_1.__values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                        var _b = tslib_1.__read(events_1_1.value, 2), evt = _b[0], fn = _b[1];
                        stream['off'](evt, fn);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                try {
                    // Some stream implementations don't call the destroy callback,
                    // because it's really a node-internal API. Just calling `destroy`
                    // here should be enough to conform to the ReadableStream contract
                    var destroy = stream['destroy'];
                    destroy && destroy.call(stream, err);
                    err = undefined;
                }
                catch (e) {
                    err = e || err;
                }
                finally {
                    err != null ? reject(err) : resolve();
                }
            });
        }
        var events, event, done, err, cmd, size, bufferLength, buffers, buffer;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    events = [];
                    event = 'error';
                    done = false, err = null;
                    bufferLength = 0;
                    buffers = [];
                    return [4 /*yield*/, tslib_1.__await(null)];
                case 1: return [4 /*yield*/, _d.sent()];
                case 2:
                    // Yield so the caller can inject the read command before we
                    // add the listener for the source stream's 'readable' event.
                    (_a = _d.sent(), cmd = _a.cmd, size = _a.size);
                    if (!stream['isTTY']) return [3 /*break*/, 6];
                    return [4 /*yield*/, tslib_1.__await(new Uint8Array(0))];
                case 3: return [4 /*yield*/, _d.sent()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, tslib_1.__await(null)];
                case 5: return [2 /*return*/, _d.sent()];
                case 6:
                    _d.trys.push([6, , 15, 17]);
                    // initialize the stream event handlers
                    events[0] = onEvent(stream, 'end');
                    events[1] = onEvent(stream, 'error');
                    _d.label = 7;
                case 7:
                    events[2] = onEvent(stream, 'readable');
                    return [4 /*yield*/, tslib_1.__await(Promise.race(events.map(function (x) { return x[2]; })))];
                case 8:
                    // wait on the first message event from the stream
                    _b = tslib_1.__read.apply(void 0, [_d.sent(), 2]), event = _b[0], err = _b[1];
                    // if the stream emitted an Error, rethrow it
                    if (event === 'error') {
                        return [3 /*break*/, 14];
                    }
                    if (!(done = event === 'end')) {
                        // If the size is NaN, request to read everything in the stream's internal buffer
                        if (!isFinite(size - bufferLength)) {
                            buffer = buffer_1.toUint8Array(stream['read'](undefined));
                        }
                        else {
                            buffer = buffer_1.toUint8Array(stream['read'](size - bufferLength));
                            // If the byteLength is 0, then the requested amount is more than the stream has
                            // in its internal buffer. In this case the stream needs a "kick" to tell it to
                            // continue emitting readable events, so request to read everything the stream
                            // has in its internal buffer right now.
                            if (buffer.byteLength < (size - bufferLength)) {
                                buffer = buffer_1.toUint8Array(stream['read'](undefined));
                            }
                        }
                        // if chunk is not null or empty, push it onto the queue
                        if (buffer.byteLength > 0) {
                            buffers.push(buffer);
                            bufferLength += buffer.byteLength;
                        }
                    }
                    if (!(done || size <= bufferLength)) return [3 /*break*/, 13];
                    _d.label = 9;
                case 9: return [4 /*yield*/, tslib_1.__await(byteRange())];
                case 10: return [4 /*yield*/, _d.sent()];
                case 11:
                    (_c = _d.sent(), cmd = _c.cmd, size = _c.size);
                    _d.label = 12;
                case 12:
                    if (size < bufferLength) return [3 /*break*/, 9];
                    _d.label = 13;
                case 13:
                    if (!done) return [3 /*break*/, 7];
                    _d.label = 14;
                case 14: return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, tslib_1.__await(cleanup(events, event === 'error' ? err : null))];
                case 16:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 17: return [4 /*yield*/, tslib_1.__await(null)];
                case 18: return [2 /*return*/, _d.sent()];
            }
        });
    });
}

//# sourceMappingURL=adapters.js.map
