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
exports.Data = exports.kUnknownNullCount = void 0;
var bit_1 = require("./util/bit");
var bit_2 = require("./util/bit");
var enum_1 = require("./enum");
var type_1 = require("./type");
var buffer_1 = require("./util/buffer");
/** @ignore */ exports.kUnknownNullCount = -1;
/** @ignore */
var Data = /** @class */ (function () {
    function Data(type, offset, length, nullCount, buffers, childData, dictionary) {
        this.type = type;
        this.dictionary = dictionary;
        this.offset = Math.floor(Math.max(offset || 0, 0));
        this.length = Math.floor(Math.max(length || 0, 0));
        this._nullCount = Math.floor(Math.max(nullCount || 0, -1));
        this.childData = (childData || []).map(function (x) { return x instanceof Data ? x : x.data; });
        var buffer;
        if (buffers instanceof Data) {
            this.stride = buffers.stride;
            this.values = buffers.values;
            this.typeIds = buffers.typeIds;
            this.nullBitmap = buffers.nullBitmap;
            this.valueOffsets = buffers.valueOffsets;
        }
        else {
            this.stride = type_1.strideForType(type);
            if (buffers) {
                (buffer = buffers[0]) && (this.valueOffsets = buffer);
                (buffer = buffers[1]) && (this.values = buffer);
                (buffer = buffers[2]) && (this.nullBitmap = buffer);
                (buffer = buffers[3]) && (this.typeIds = buffer);
            }
        }
    }
    Object.defineProperty(Data.prototype, "typeId", {
        get: function () { return this.type.typeId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "ArrayType", {
        get: function () { return this.type.ArrayType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "buffers", {
        get: function () {
            return [this.valueOffsets, this.values, this.nullBitmap, this.typeIds];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "byteLength", {
        get: function () {
            var byteLength = 0;
            var _a = this, valueOffsets = _a.valueOffsets, values = _a.values, nullBitmap = _a.nullBitmap, typeIds = _a.typeIds;
            valueOffsets && (byteLength += valueOffsets.byteLength);
            values && (byteLength += values.byteLength);
            nullBitmap && (byteLength += nullBitmap.byteLength);
            typeIds && (byteLength += typeIds.byteLength);
            return this.childData.reduce(function (byteLength, child) { return byteLength + child.byteLength; }, byteLength);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "nullCount", {
        get: function () {
            var nullCount = this._nullCount;
            var nullBitmap;
            if (nullCount <= exports.kUnknownNullCount && (nullBitmap = this.nullBitmap)) {
                this._nullCount = nullCount = this.length - bit_2.popcnt_bit_range(nullBitmap, this.offset, this.offset + this.length);
            }
            return nullCount;
        },
        enumerable: false,
        configurable: true
    });
    Data.prototype.clone = function (type, offset, length, nullCount, buffers, childData) {
        if (offset === void 0) { offset = this.offset; }
        if (length === void 0) { length = this.length; }
        if (nullCount === void 0) { nullCount = this._nullCount; }
        if (buffers === void 0) { buffers = this; }
        if (childData === void 0) { childData = this.childData; }
        return new Data(type, offset, length, nullCount, buffers, childData, this.dictionary);
    };
    Data.prototype.slice = function (offset, length) {
        var _a = this, stride = _a.stride, typeId = _a.typeId, childData = _a.childData;
        // +true === 1, +false === 0, so this means
        // we keep nullCount at 0 if it's already 0,
        // otherwise set to the invalidated flag -1
        var nullCount = +(this._nullCount === 0) - 1;
        var childStride = typeId === 16 /* FixedSizeList */ ? stride : 1;
        var buffers = this._sliceBuffers(offset, length, stride, typeId);
        return this.clone(this.type, this.offset + offset, length, nullCount, buffers, 
        // Don't slice children if we have value offsets (the variable-width types)
        (!childData.length || this.valueOffsets) ? childData : this._sliceChildren(childData, childStride * offset, childStride * length));
    };
    Data.prototype._changeLengthAndBackfillNullBitmap = function (newLength) {
        if (this.typeId === enum_1.Type.Null) {
            return this.clone(this.type, 0, newLength, 0);
        }
        var _a = this, length = _a.length, nullCount = _a.nullCount;
        // start initialized with 0s (nulls), then fill from 0 to length with 1s (not null)
        var bitmap = new Uint8Array(((newLength + 63) & ~63) >> 3).fill(255, 0, length >> 3);
        // set all the bits in the last byte (up to bit `length - length % 8`) to 1 (not null)
        bitmap[length >> 3] = (1 << (length - (length & ~7))) - 1;
        // if we have a nullBitmap, truncate + slice and set it over the pre-filled 1s
        if (nullCount > 0) {
            bitmap.set(bit_1.truncateBitmap(this.offset, length, this.nullBitmap), 0);
        }
        var buffers = this.buffers;
        buffers[enum_1.BufferType.VALIDITY] = bitmap;
        return this.clone(this.type, 0, newLength, nullCount + (newLength - length), buffers);
    };
    Data.prototype._sliceBuffers = function (offset, length, stride, typeId) {
        var arr;
        var buffers = this.buffers;
        // If typeIds exist, slice the typeIds buffer
        (arr = buffers[enum_1.BufferType.TYPE]) && (buffers[enum_1.BufferType.TYPE] = arr.subarray(offset, offset + length));
        // If offsets exist, only slice the offsets buffer
        (arr = buffers[enum_1.BufferType.OFFSET]) && (buffers[enum_1.BufferType.OFFSET] = arr.subarray(offset, offset + length + 1)) ||
            // Otherwise if no offsets, slice the data buffer. Don't slice the data vector for Booleans, since the offset goes by bits not bytes
            (arr = buffers[enum_1.BufferType.DATA]) && (buffers[enum_1.BufferType.DATA] = typeId === 6 ? arr : arr.subarray(stride * offset, stride * (offset + length)));
        return buffers;
    };
    Data.prototype._sliceChildren = function (childData, offset, length) {
        return childData.map(function (child) { return child.slice(offset, length); });
    };
    //
    // Convenience methods for creating Data instances for each of the Arrow Vector types
    //
    /** @nocollapse */
    Data.new = function (type, offset, length, nullCount, buffers, childData, dictionary) {
        if (buffers instanceof Data) {
            buffers = buffers.buffers;
        }
        else if (!buffers) {
            buffers = [];
        }
        switch (type.typeId) {
            case enum_1.Type.Null: return Data.Null(type, offset, length);
            case enum_1.Type.Int: return Data.Int(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Dictionary: return Data.Dictionary(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || [], dictionary);
            case enum_1.Type.Float: return Data.Float(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Bool: return Data.Bool(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Decimal: return Data.Decimal(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Date: return Data.Date(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Time: return Data.Time(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Timestamp: return Data.Timestamp(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Interval: return Data.Interval(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.FixedSizeBinary: return Data.FixedSizeBinary(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Binary: return Data.Binary(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.OFFSET] || [], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.Utf8: return Data.Utf8(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.OFFSET] || [], buffers[enum_1.BufferType.DATA] || []);
            case enum_1.Type.List: return Data.List(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.OFFSET] || [], (childData || [])[0]);
            case enum_1.Type.FixedSizeList: return Data.FixedSizeList(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], (childData || [])[0]);
            case enum_1.Type.Struct: return Data.Struct(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], childData || []);
            case enum_1.Type.Map: return Data.Map(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.OFFSET] || [], (childData || [])[0]);
            case enum_1.Type.Union: return Data.Union(type, offset, length, nullCount || 0, buffers[enum_1.BufferType.VALIDITY], buffers[enum_1.BufferType.TYPE] || [], buffers[enum_1.BufferType.OFFSET] || childData, childData);
        }
        throw new Error("Unrecognized typeId " + type.typeId);
    };
    /** @nocollapse */
    Data.Null = function (type, offset, length) {
        return new Data(type, offset, length, 0);
    };
    /** @nocollapse */
    Data.Int = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Dictionary = function (type, offset, length, nullCount, nullBitmap, data, dictionary) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.indices.ArrayType, data), buffer_1.toUint8Array(nullBitmap)], [], dictionary);
    };
    /** @nocollapse */
    Data.Float = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Bool = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Decimal = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Date = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Time = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Timestamp = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Interval = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.FixedSizeBinary = function (type, offset, length, nullCount, nullBitmap, data) {
        return new Data(type, offset, length, nullCount, [undefined, buffer_1.toArrayBufferView(type.ArrayType, data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Binary = function (type, offset, length, nullCount, nullBitmap, valueOffsets, data) {
        return new Data(type, offset, length, nullCount, [buffer_1.toInt32Array(valueOffsets), buffer_1.toUint8Array(data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.Utf8 = function (type, offset, length, nullCount, nullBitmap, valueOffsets, data) {
        return new Data(type, offset, length, nullCount, [buffer_1.toInt32Array(valueOffsets), buffer_1.toUint8Array(data), buffer_1.toUint8Array(nullBitmap)]);
    };
    /** @nocollapse */
    Data.List = function (type, offset, length, nullCount, nullBitmap, valueOffsets, child) {
        return new Data(type, offset, length, nullCount, [buffer_1.toInt32Array(valueOffsets), undefined, buffer_1.toUint8Array(nullBitmap)], child ? [child] : []);
    };
    /** @nocollapse */
    Data.FixedSizeList = function (type, offset, length, nullCount, nullBitmap, child) {
        return new Data(type, offset, length, nullCount, [undefined, undefined, buffer_1.toUint8Array(nullBitmap)], child ? [child] : []);
    };
    /** @nocollapse */
    Data.Struct = function (type, offset, length, nullCount, nullBitmap, children) {
        return new Data(type, offset, length, nullCount, [undefined, undefined, buffer_1.toUint8Array(nullBitmap)], children);
    };
    /** @nocollapse */
    Data.Map = function (type, offset, length, nullCount, nullBitmap, valueOffsets, child) {
        return new Data(type, offset, length, nullCount, [buffer_1.toInt32Array(valueOffsets), undefined, buffer_1.toUint8Array(nullBitmap)], child ? [child] : []);
    };
    /** @nocollapse */
    Data.Union = function (type, offset, length, nullCount, nullBitmap, typeIds, valueOffsetsOrChildren, children) {
        var buffers = [
            undefined, undefined,
            buffer_1.toUint8Array(nullBitmap),
            buffer_1.toArrayBufferView(type.ArrayType, typeIds)
        ];
        if (type.mode === enum_1.UnionMode.Sparse) {
            return new Data(type, offset, length, nullCount, buffers, valueOffsetsOrChildren);
        }
        buffers[enum_1.BufferType.OFFSET] = buffer_1.toInt32Array(valueOffsetsOrChildren);
        return new Data(type, offset, length, nullCount, buffers, children);
    };
    return Data;
}());
exports.Data = Data;
Data.prototype.childData = Object.freeze([]);

//# sourceMappingURL=data.js.map
