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
exports.compareArrayLike = exports.rebaseValueOffsets = exports.toUint8ClampedArrayAsyncIterator = exports.toFloat64ArrayAsyncIterator = exports.toFloat32ArrayAsyncIterator = exports.toUint32ArrayAsyncIterator = exports.toUint16ArrayAsyncIterator = exports.toUint8ArrayAsyncIterator = exports.toInt32ArrayAsyncIterator = exports.toInt16ArrayAsyncIterator = exports.toInt8ArrayAsyncIterator = exports.toArrayBufferViewAsyncIterator = exports.toUint8ClampedArrayIterator = exports.toFloat64ArrayIterator = exports.toFloat32ArrayIterator = exports.toUint32ArrayIterator = exports.toUint16ArrayIterator = exports.toUint8ArrayIterator = exports.toInt32ArrayIterator = exports.toInt16ArrayIterator = exports.toInt8ArrayIterator = exports.toArrayBufferViewIterator = exports.toUint8ClampedArray = exports.toFloat64Array = exports.toFloat32Array = exports.toBigUint64Array = exports.toUint32Array = exports.toUint16Array = exports.toUint8Array = exports.toBigInt64Array = exports.toInt32Array = exports.toInt16Array = exports.toInt8Array = exports.toArrayBufferView = exports.joinUint8Arrays = exports.memcpy = void 0;
var tslib_1 = require("tslib");
var flatbuffers_1 = require("flatbuffers");
var utf8_1 = require("../util/utf8");
var ByteBuffer = flatbuffers_1.flatbuffers.ByteBuffer;
var compat_1 = require("./compat");
/** @ignore */
var SharedArrayBuf = (typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : ArrayBuffer);
/** @ignore */
function collapseContiguousByteRanges(chunks) {
    var result = chunks[0] ? [chunks[0]] : [];
    var xOffset, yOffset, xLen, yLen;
    for (var x = void 0, y = void 0, i = 0, j = 0, n = chunks.length; ++i < n;) {
        x = result[j];
        y = chunks[i];
        // continue if x and y don't share the same underlying ArrayBuffer, or if x isn't before y
        if (!x || !y || x.buffer !== y.buffer || y.byteOffset < x.byteOffset) {
            y && (result[++j] = y);
            continue;
        }
        (xOffset = x.byteOffset, xLen = x.byteLength);
        (yOffset = y.byteOffset, yLen = y.byteLength);
        // continue if the byte ranges of x and y aren't contiguous
        if ((xOffset + xLen) < yOffset || (yOffset + yLen) < xOffset) {
            y && (result[++j] = y);
            continue;
        }
        result[j] = new Uint8Array(x.buffer, xOffset, yOffset - xOffset + yLen);
    }
    return result;
}
/** @ignore */
function memcpy(target, source, targetByteOffset, sourceByteLength) {
    if (targetByteOffset === void 0) { targetByteOffset = 0; }
    if (sourceByteLength === void 0) { sourceByteLength = source.byteLength; }
    var targetByteLength = target.byteLength;
    var dst = new Uint8Array(target.buffer, target.byteOffset, targetByteLength);
    var src = new Uint8Array(source.buffer, source.byteOffset, Math.min(sourceByteLength, targetByteLength));
    dst.set(src, targetByteOffset);
    return target;
}
exports.memcpy = memcpy;
/** @ignore */
function joinUint8Arrays(chunks, size) {
    // collapse chunks that share the same underlying ArrayBuffer and whose byte ranges overlap,
    // to avoid unnecessarily copying the bytes to do this buffer join. This is a common case during
    // streaming, where we may be reading partial byte ranges out of the same underlying ArrayBuffer
    var result = collapseContiguousByteRanges(chunks);
    var byteLength = result.reduce(function (x, b) { return x + b.byteLength; }, 0);
    var source, sliced, buffer;
    var offset = 0, index = -1;
    var length = Math.min(size || Infinity, byteLength);
    for (var n = result.length; ++index < n;) {
        source = result[index];
        sliced = source.subarray(0, Math.min(source.length, length - offset));
        if (length <= (offset + sliced.length)) {
            if (sliced.length < source.length) {
                result[index] = source.subarray(sliced.length);
            }
            else if (sliced.length === source.length) {
                index++;
            }
            buffer ? memcpy(buffer, sliced, offset) : (buffer = sliced);
            break;
        }
        memcpy(buffer || (buffer = new Uint8Array(length)), sliced, offset);
        offset += sliced.length;
    }
    return [buffer || new Uint8Array(0), result.slice(index), byteLength - (buffer ? buffer.byteLength : 0)];
}
exports.joinUint8Arrays = joinUint8Arrays;
function toArrayBufferView(ArrayBufferViewCtor, input) {
    var value = compat_1.isIteratorResult(input) ? input.value : input;
    if (value instanceof ArrayBufferViewCtor) {
        if (ArrayBufferViewCtor === Uint8Array) {
            // Node's `Buffer` class passes the `instanceof Uint8Array` check, but we need
            // a real Uint8Array, since Buffer#slice isn't the same as Uint8Array#slice :/
            return new ArrayBufferViewCtor(value.buffer, value.byteOffset, value.byteLength);
        }
        return value;
    }
    if (!value) {
        return new ArrayBufferViewCtor(0);
    }
    if (typeof value === 'string') {
        value = utf8_1.encodeUtf8(value);
    }
    if (value instanceof ArrayBuffer) {
        return new ArrayBufferViewCtor(value);
    }
    if (value instanceof SharedArrayBuf) {
        return new ArrayBufferViewCtor(value);
    }
    if (value instanceof ByteBuffer) {
        return toArrayBufferView(ArrayBufferViewCtor, value.bytes());
    }
    return !ArrayBuffer.isView(value) ? ArrayBufferViewCtor.from(value) : value.byteLength <= 0 ? new ArrayBufferViewCtor(0)
        : new ArrayBufferViewCtor(value.buffer, value.byteOffset, value.byteLength / ArrayBufferViewCtor.BYTES_PER_ELEMENT);
}
exports.toArrayBufferView = toArrayBufferView;
/** @ignore */ exports.toInt8Array = function (input) { return toArrayBufferView(Int8Array, input); };
/** @ignore */ exports.toInt16Array = function (input) { return toArrayBufferView(Int16Array, input); };
/** @ignore */ exports.toInt32Array = function (input) { return toArrayBufferView(Int32Array, input); };
/** @ignore */ exports.toBigInt64Array = function (input) { return toArrayBufferView(compat_1.BigInt64Array, input); };
/** @ignore */ exports.toUint8Array = function (input) { return toArrayBufferView(Uint8Array, input); };
/** @ignore */ exports.toUint16Array = function (input) { return toArrayBufferView(Uint16Array, input); };
/** @ignore */ exports.toUint32Array = function (input) { return toArrayBufferView(Uint32Array, input); };
/** @ignore */ exports.toBigUint64Array = function (input) { return toArrayBufferView(compat_1.BigUint64Array, input); };
/** @ignore */ exports.toFloat32Array = function (input) { return toArrayBufferView(Float32Array, input); };
/** @ignore */ exports.toFloat64Array = function (input) { return toArrayBufferView(Float64Array, input); };
/** @ignore */ exports.toUint8ClampedArray = function (input) { return toArrayBufferView(Uint8ClampedArray, input); };
/** @ignore */
var pump = function (iterator) { iterator.next(); return iterator; };
/** @ignore */
function toArrayBufferViewIterator(ArrayCtor, source) {
    var wrap, buffers;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wrap = function (x) { return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, x];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                }); };
                buffers = (typeof source === 'string') ? wrap(source)
                    : (ArrayBuffer.isView(source)) ? wrap(source)
                        : (source instanceof ArrayBuffer) ? wrap(source)
                            : (source instanceof SharedArrayBuf) ? wrap(source)
                                : !compat_1.isIterable(source) ? wrap(source) : source;
                return [5 /*yield**/, tslib_1.__values(pump((function (it) {
                        var r, _a, _b;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    r = null;
                                    _c.label = 1;
                                case 1:
                                    _b = (_a = it).next;
                                    return [4 /*yield*/, toArrayBufferView(ArrayCtor, r)];
                                case 2:
                                    r = _b.apply(_a, [_c.sent()]);
                                    _c.label = 3;
                                case 3:
                                    if (!r.done) return [3 /*break*/, 1];
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    })(buffers[Symbol.iterator]())))];
            case 1:
                _a.sent();
                return [2 /*return*/, new ArrayCtor()];
        }
    });
}
exports.toArrayBufferViewIterator = toArrayBufferViewIterator;
/** @ignore */ exports.toInt8ArrayIterator = function (input) { return toArrayBufferViewIterator(Int8Array, input); };
/** @ignore */ exports.toInt16ArrayIterator = function (input) { return toArrayBufferViewIterator(Int16Array, input); };
/** @ignore */ exports.toInt32ArrayIterator = function (input) { return toArrayBufferViewIterator(Int32Array, input); };
/** @ignore */ exports.toUint8ArrayIterator = function (input) { return toArrayBufferViewIterator(Uint8Array, input); };
/** @ignore */ exports.toUint16ArrayIterator = function (input) { return toArrayBufferViewIterator(Uint16Array, input); };
/** @ignore */ exports.toUint32ArrayIterator = function (input) { return toArrayBufferViewIterator(Uint32Array, input); };
/** @ignore */ exports.toFloat32ArrayIterator = function (input) { return toArrayBufferViewIterator(Float32Array, input); };
/** @ignore */ exports.toFloat64ArrayIterator = function (input) { return toArrayBufferViewIterator(Float64Array, input); };
/** @ignore */ exports.toUint8ClampedArrayIterator = function (input) { return toArrayBufferViewIterator(Uint8ClampedArray, input); };
/** @ignore */
function toArrayBufferViewAsyncIterator(ArrayCtor, source) {
    return tslib_1.__asyncGenerator(this, arguments, function toArrayBufferViewAsyncIterator_1() {
        var _a, _b, wrap, emit, buffers;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!compat_1.isPromise(source)) return [3 /*break*/, 5];
                    _a = toArrayBufferViewAsyncIterator;
                    _b = [ArrayCtor];
                    return [4 /*yield*/, tslib_1.__await(source)];
                case 1: return [5 /*yield**/, tslib_1.__values(tslib_1.__asyncDelegator.apply(void 0, [tslib_1.__asyncValues.apply(void 0, [_a.apply(void 0, _b.concat([_c.sent()]))])]))];
                case 2: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_c.sent()])];
                case 3: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_c.sent()])];
                case 4: return [2 /*return*/, _c.sent()];
                case 5:
                    wrap = function (x) { return tslib_1.__asyncGenerator(this, arguments, function () { return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tslib_1.__await(x)];
                            case 1: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_a.sent()])];
                            case 2: return [4 /*yield*/, _a.sent()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    }); }); };
                    emit = function (source) {
                        return tslib_1.__asyncGenerator(this, arguments, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [5 /*yield**/, tslib_1.__values(tslib_1.__asyncDelegator(tslib_1.__asyncValues(pump((function (it) {
                                            var r, _a, _b;
                                            return tslib_1.__generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        r = null;
                                                        _c.label = 1;
                                                    case 1:
                                                        _b = (_a = it).next;
                                                        return [4 /*yield*/, r && r.value];
                                                    case 2:
                                                        r = _b.apply(_a, [_c.sent()]);
                                                        _c.label = 3;
                                                    case 3:
                                                        if (!r.done) return [3 /*break*/, 1];
                                                        _c.label = 4;
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        })(source[Symbol.iterator]())))))];
                                    case 1: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_a.sent()])];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    buffers = (typeof source === 'string') ? wrap(source) // if string, wrap in an AsyncIterableIterator
                        : (ArrayBuffer.isView(source)) ? wrap(source) // if TypedArray, wrap in an AsyncIterableIterator
                            : (source instanceof ArrayBuffer) ? wrap(source) // if ArrayBuffer, wrap in an AsyncIterableIterator
                                : (source instanceof SharedArrayBuf) ? wrap(source) // if SharedArrayBuffer, wrap in an AsyncIterableIterator
                                    : compat_1.isIterable(source) ? emit(source) // If Iterable, wrap in an AsyncIterableIterator and compose the `next` values
                                        : !compat_1.isAsyncIterable(source) ? wrap(source) // If not an AsyncIterable, treat as a sentinel and wrap in an AsyncIterableIterator
                                            : source;
                    return [5 /*yield**/, // otherwise if AsyncIterable, use it
                        tslib_1.__values(tslib_1.__asyncDelegator(tslib_1.__asyncValues(pump((function (it) {
                            return tslib_1.__asyncGenerator(this, arguments, function () {
                                var r, _a, _b;
                                return tslib_1.__generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            r = null;
                                            _c.label = 1;
                                        case 1:
                                            _b = (_a = it).next;
                                            return [4 /*yield*/, tslib_1.__await(toArrayBufferView(ArrayCtor, r))];
                                        case 2: return [4 /*yield*/, _c.sent()];
                                        case 3: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_b.apply(_a, [_c.sent()])])];
                                        case 4:
                                            r = _c.sent();
                                            _c.label = 5;
                                        case 5:
                                            if (!r.done) return [3 /*break*/, 1];
                                            _c.label = 6;
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            });
                        })(buffers[Symbol.asyncIterator]())))))];
                case 6: // otherwise if AsyncIterable, use it
                return [4 /*yield*/, tslib_1.__await.apply(void 0, [// otherwise if AsyncIterable, use it
                        _c.sent()])];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, tslib_1.__await(new ArrayCtor())];
                case 8: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.toArrayBufferViewAsyncIterator = toArrayBufferViewAsyncIterator;
/** @ignore */ exports.toInt8ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Int8Array, input); };
/** @ignore */ exports.toInt16ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Int16Array, input); };
/** @ignore */ exports.toInt32ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Int32Array, input); };
/** @ignore */ exports.toUint8ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Uint8Array, input); };
/** @ignore */ exports.toUint16ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Uint16Array, input); };
/** @ignore */ exports.toUint32ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Uint32Array, input); };
/** @ignore */ exports.toFloat32ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Float32Array, input); };
/** @ignore */ exports.toFloat64ArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Float64Array, input); };
/** @ignore */ exports.toUint8ClampedArrayAsyncIterator = function (input) { return toArrayBufferViewAsyncIterator(Uint8ClampedArray, input); };
/** @ignore */
function rebaseValueOffsets(offset, length, valueOffsets) {
    // If we have a non-zero offset, create a new offsets array with the values
    // shifted by the start offset, such that the new start offset is 0
    if (offset !== 0) {
        valueOffsets = valueOffsets.slice(0, length + 1);
        for (var i = -1; ++i <= length;) {
            valueOffsets[i] += offset;
        }
    }
    return valueOffsets;
}
exports.rebaseValueOffsets = rebaseValueOffsets;
/** @ignore */
function compareArrayLike(a, b) {
    var i = 0;
    var n = a.length;
    if (n !== b.length) {
        return false;
    }
    if (n > 0) {
        do {
            if (a[i] !== b[i]) {
                return false;
            }
        } while (++i < n);
    }
    return true;
}
exports.compareArrayLike = compareArrayLike;

//# sourceMappingURL=buffer.js.map
