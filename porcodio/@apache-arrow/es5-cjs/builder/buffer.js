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
exports.WideBufferBuilder = exports.OffsetsBufferBuilder = exports.BitmapBufferBuilder = exports.DataBufferBuilder = exports.BufferBuilder = void 0;
var tslib_1 = require("tslib");
var buffer_1 = require("../util/buffer");
var compat_1 = require("../util/compat");
/** @ignore */
var roundLengthUpToNearest64Bytes = function (len, BPE) { return ((((len * BPE) + 63) & ~63) || 64) / BPE; };
/** @ignore */
var sliceOrExtendArray = function (arr, len) {
    if (len === void 0) { len = 0; }
    return (arr.length >= len ? arr.subarray(0, len) : buffer_1.memcpy(new arr.constructor(len), arr, 0));
};
/** @ignore */
var BufferBuilder = /** @class */ (function () {
    function BufferBuilder(buffer, stride) {
        if (stride === void 0) { stride = 1; }
        this.buffer = buffer;
        this.stride = stride;
        this.BYTES_PER_ELEMENT = buffer.BYTES_PER_ELEMENT;
        this.ArrayType = buffer.constructor;
        this._resize(this.length = buffer.length / stride | 0);
    }
    Object.defineProperty(BufferBuilder.prototype, "byteLength", {
        get: function () { return this.length * this.stride * this.BYTES_PER_ELEMENT | 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferBuilder.prototype, "reservedLength", {
        get: function () { return this.buffer.length / this.stride; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BufferBuilder.prototype, "reservedByteLength", {
        get: function () { return this.buffer.byteLength; },
        enumerable: false,
        configurable: true
    });
    // @ts-ignore
    BufferBuilder.prototype.set = function (index, value) { return this; };
    BufferBuilder.prototype.append = function (value) { return this.set(this.length, value); };
    BufferBuilder.prototype.reserve = function (extra) {
        if (extra > 0) {
            this.length += extra;
            var stride = this.stride;
            var length_1 = this.length * stride;
            var reserved = this.buffer.length;
            if (length_1 >= reserved) {
                this._resize(reserved === 0
                    ? roundLengthUpToNearest64Bytes(length_1 * 1, this.BYTES_PER_ELEMENT)
                    : roundLengthUpToNearest64Bytes(length_1 * 2, this.BYTES_PER_ELEMENT));
            }
        }
        return this;
    };
    BufferBuilder.prototype.flush = function (length) {
        if (length === void 0) { length = this.length; }
        length = roundLengthUpToNearest64Bytes(length * this.stride, this.BYTES_PER_ELEMENT);
        var array = sliceOrExtendArray(this.buffer, length);
        this.clear();
        return array;
    };
    BufferBuilder.prototype.clear = function () {
        this.length = 0;
        this._resize(0);
        return this;
    };
    BufferBuilder.prototype._resize = function (newLength) {
        return this.buffer = buffer_1.memcpy(new this.ArrayType(newLength), this.buffer);
    };
    return BufferBuilder;
}());
exports.BufferBuilder = BufferBuilder;
BufferBuilder.prototype.offset = 0;
/** @ignore */
var DataBufferBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(DataBufferBuilder, _super);
    function DataBufferBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataBufferBuilder.prototype.last = function () { return this.get(this.length - 1); };
    DataBufferBuilder.prototype.get = function (index) { return this.buffer[index]; };
    DataBufferBuilder.prototype.set = function (index, value) {
        this.reserve(index - this.length + 1);
        this.buffer[index * this.stride] = value;
        return this;
    };
    return DataBufferBuilder;
}(BufferBuilder));
exports.DataBufferBuilder = DataBufferBuilder;
/** @ignore */
var BitmapBufferBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(BitmapBufferBuilder, _super);
    function BitmapBufferBuilder(data) {
        if (data === void 0) { data = new Uint8Array(0); }
        var _this = _super.call(this, data, 1 / 8) || this;
        _this.numValid = 0;
        return _this;
    }
    Object.defineProperty(BitmapBufferBuilder.prototype, "numInvalid", {
        get: function () { return this.length - this.numValid; },
        enumerable: false,
        configurable: true
    });
    BitmapBufferBuilder.prototype.get = function (idx) { return this.buffer[idx >> 3] >> idx % 8 & 1; };
    BitmapBufferBuilder.prototype.set = function (idx, val) {
        var buffer = this.reserve(idx - this.length + 1).buffer;
        var byte = idx >> 3, bit = idx % 8, cur = buffer[byte] >> bit & 1;
        // If `val` is truthy and the current bit is 0, flip it to 1 and increment `numValid`.
        // If `val` is falsey and the current bit is 1, flip it to 0 and decrement `numValid`.
        val ? cur === 0 && ((buffer[byte] |= (1 << bit)), ++this.numValid)
            : cur === 1 && ((buffer[byte] &= ~(1 << bit)), --this.numValid);
        return this;
    };
    BitmapBufferBuilder.prototype.clear = function () {
        this.numValid = 0;
        return _super.prototype.clear.call(this);
    };
    return BitmapBufferBuilder;
}(DataBufferBuilder));
exports.BitmapBufferBuilder = BitmapBufferBuilder;
/** @ignore */
var OffsetsBufferBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(OffsetsBufferBuilder, _super);
    function OffsetsBufferBuilder(data) {
        if (data === void 0) { data = new Int32Array(1); }
        return _super.call(this, data, 1) || this;
    }
    OffsetsBufferBuilder.prototype.append = function (value) {
        return this.set(this.length - 1, value);
    };
    OffsetsBufferBuilder.prototype.set = function (index, value) {
        var offset = this.length - 1;
        var buffer = this.reserve(index - offset + 1).buffer;
        if (offset < index++) {
            buffer.fill(buffer[offset], offset, index);
        }
        buffer[index] = buffer[index - 1] + value;
        return this;
    };
    OffsetsBufferBuilder.prototype.flush = function (length) {
        if (length === void 0) { length = this.length - 1; }
        if (length > this.length) {
            this.set(length - 1, 0);
        }
        return _super.prototype.flush.call(this, length + 1);
    };
    return OffsetsBufferBuilder;
}(DataBufferBuilder));
exports.OffsetsBufferBuilder = OffsetsBufferBuilder;
/** @ignore */
var WideBufferBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(WideBufferBuilder, _super);
    function WideBufferBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(WideBufferBuilder.prototype, "ArrayType64", {
        get: function () {
            return this._ArrayType64 || (this._ArrayType64 = (this.buffer instanceof Int32Array ? compat_1.BigInt64Array : compat_1.BigUint64Array));
        },
        enumerable: false,
        configurable: true
    });
    WideBufferBuilder.prototype.set = function (index, value) {
        this.reserve(index - this.length + 1);
        switch (typeof value) {
            case 'bigint':
                this.buffer64[index] = value;
                break;
            case 'number':
                this.buffer[index * this.stride] = value;
                break;
            default: this.buffer.set(value, index * this.stride);
        }
        return this;
    };
    WideBufferBuilder.prototype._resize = function (newLength) {
        var data = _super.prototype._resize.call(this, newLength);
        var length = data.byteLength / (this.BYTES_PER_ELEMENT * this.stride);
        if (compat_1.BigIntAvailable) {
            this.buffer64 = new this.ArrayType64(data.buffer, data.byteOffset, length);
        }
        return data;
    };
    return WideBufferBuilder;
}(BufferBuilder));
exports.WideBufferBuilder = WideBufferBuilder;

//# sourceMappingURL=buffer.js.map
