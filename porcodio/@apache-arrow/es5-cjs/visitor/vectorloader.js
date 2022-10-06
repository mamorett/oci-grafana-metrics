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
exports.JSONVectorLoader = exports.VectorLoader = void 0;
var tslib_1 = require("tslib");
var data_1 = require("../data");
var schema_1 = require("../schema");
var type_1 = require("../type");
var visitor_1 = require("../visitor");
var bit_1 = require("../util/bit");
var utf8_1 = require("../util/utf8");
var int_1 = require("../util/int");
var enum_1 = require("../enum");
var buffer_1 = require("../util/buffer");
/** @ignore */
var VectorLoader = /** @class */ (function (_super) {
    tslib_1.__extends(VectorLoader, _super);
    function VectorLoader(bytes, nodes, buffers, dictionaries) {
        var _this = _super.call(this) || this;
        _this.nodesIndex = -1;
        _this.buffersIndex = -1;
        _this.bytes = bytes;
        _this.nodes = nodes;
        _this.buffers = buffers;
        _this.dictionaries = dictionaries;
        return _this;
    }
    VectorLoader.prototype.visit = function (node) {
        return _super.prototype.visit.call(this, node instanceof schema_1.Field ? node.type : node);
    };
    VectorLoader.prototype.visitNull = function (type, _a) {
        var length = (_a === void 0 ? this.nextFieldNode() : _a).length;
        return data_1.Data.Null(type, 0, length);
    };
    VectorLoader.prototype.visitBool = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Bool(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitInt = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Int(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitFloat = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Float(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitUtf8 = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Utf8(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readOffsets(type), this.readData(type));
    };
    VectorLoader.prototype.visitBinary = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Binary(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readOffsets(type), this.readData(type));
    };
    VectorLoader.prototype.visitFixedSizeBinary = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.FixedSizeBinary(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitDate = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Date(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitTimestamp = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Timestamp(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitTime = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Time(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitDecimal = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Decimal(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitList = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.List(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readOffsets(type), this.visit(type.children[0]));
    };
    VectorLoader.prototype.visitStruct = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Struct(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.visitMany(type.children));
    };
    VectorLoader.prototype.visitUnion = function (type) { return type.mode === enum_1.UnionMode.Sparse ? this.visitSparseUnion(type) : this.visitDenseUnion(type); };
    VectorLoader.prototype.visitDenseUnion = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Union(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readTypeIds(type), this.readOffsets(type), this.visitMany(type.children));
    };
    VectorLoader.prototype.visitSparseUnion = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Union(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readTypeIds(type), this.visitMany(type.children));
    };
    VectorLoader.prototype.visitDictionary = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Dictionary(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type.indices), this.readDictionary(type));
    };
    VectorLoader.prototype.visitInterval = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Interval(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readData(type));
    };
    VectorLoader.prototype.visitFixedSizeList = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.FixedSizeList(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.visit(type.children[0]));
    };
    VectorLoader.prototype.visitMap = function (type, _a) {
        var _b = _a === void 0 ? this.nextFieldNode() : _a, length = _b.length, nullCount = _b.nullCount;
        return data_1.Data.Map(type, 0, length, nullCount, this.readNullBitmap(type, nullCount), this.readOffsets(type), this.visit(type.children[0]));
    };
    VectorLoader.prototype.nextFieldNode = function () { return this.nodes[++this.nodesIndex]; };
    VectorLoader.prototype.nextBufferRange = function () { return this.buffers[++this.buffersIndex]; };
    VectorLoader.prototype.readNullBitmap = function (type, nullCount, buffer) {
        if (buffer === void 0) { buffer = this.nextBufferRange(); }
        return nullCount > 0 && this.readData(type, buffer) || new Uint8Array(0);
    };
    VectorLoader.prototype.readOffsets = function (type, buffer) { return this.readData(type, buffer); };
    VectorLoader.prototype.readTypeIds = function (type, buffer) { return this.readData(type, buffer); };
    VectorLoader.prototype.readData = function (_type, _a) {
        var _b = _a === void 0 ? this.nextBufferRange() : _a, length = _b.length, offset = _b.offset;
        return this.bytes.subarray(offset, offset + length);
    };
    VectorLoader.prototype.readDictionary = function (type) {
        return this.dictionaries.get(type.id);
    };
    return VectorLoader;
}(visitor_1.Visitor));
exports.VectorLoader = VectorLoader;
/** @ignore */
var JSONVectorLoader = /** @class */ (function (_super) {
    tslib_1.__extends(JSONVectorLoader, _super);
    function JSONVectorLoader(sources, nodes, buffers, dictionaries) {
        var _this = _super.call(this, new Uint8Array(0), nodes, buffers, dictionaries) || this;
        _this.sources = sources;
        return _this;
    }
    JSONVectorLoader.prototype.readNullBitmap = function (_type, nullCount, _a) {
        var offset = (_a === void 0 ? this.nextBufferRange() : _a).offset;
        return nullCount <= 0 ? new Uint8Array(0) : bit_1.packBools(this.sources[offset]);
    };
    JSONVectorLoader.prototype.readOffsets = function (_type, _a) {
        var offset = (_a === void 0 ? this.nextBufferRange() : _a).offset;
        return buffer_1.toArrayBufferView(Uint8Array, buffer_1.toArrayBufferView(Int32Array, this.sources[offset]));
    };
    JSONVectorLoader.prototype.readTypeIds = function (type, _a) {
        var offset = (_a === void 0 ? this.nextBufferRange() : _a).offset;
        return buffer_1.toArrayBufferView(Uint8Array, buffer_1.toArrayBufferView(type.ArrayType, this.sources[offset]));
    };
    JSONVectorLoader.prototype.readData = function (type, _a) {
        var offset = (_a === void 0 ? this.nextBufferRange() : _a).offset;
        var sources = this.sources;
        if (type_1.DataType.isTimestamp(type)) {
            return buffer_1.toArrayBufferView(Uint8Array, int_1.Int64.convertArray(sources[offset]));
        }
        else if ((type_1.DataType.isInt(type) || type_1.DataType.isTime(type)) && type.bitWidth === 64) {
            return buffer_1.toArrayBufferView(Uint8Array, int_1.Int64.convertArray(sources[offset]));
        }
        else if (type_1.DataType.isDate(type) && type.unit === enum_1.DateUnit.MILLISECOND) {
            return buffer_1.toArrayBufferView(Uint8Array, int_1.Int64.convertArray(sources[offset]));
        }
        else if (type_1.DataType.isDecimal(type)) {
            return buffer_1.toArrayBufferView(Uint8Array, int_1.Int128.convertArray(sources[offset]));
        }
        else if (type_1.DataType.isBinary(type) || type_1.DataType.isFixedSizeBinary(type)) {
            return binaryDataFromJSON(sources[offset]);
        }
        else if (type_1.DataType.isBool(type)) {
            return bit_1.packBools(sources[offset]);
        }
        else if (type_1.DataType.isUtf8(type)) {
            return utf8_1.encodeUtf8(sources[offset].join(''));
        }
        return buffer_1.toArrayBufferView(Uint8Array, buffer_1.toArrayBufferView(type.ArrayType, sources[offset].map(function (x) { return +x; })));
    };
    return JSONVectorLoader;
}(VectorLoader));
exports.JSONVectorLoader = JSONVectorLoader;
/** @ignore */
function binaryDataFromJSON(values) {
    // "DATA": ["49BC7D5B6C47D2","3F5FB6D9322026"]
    // There are definitely more efficient ways to do this... but it gets the
    // job done.
    var joined = values.join('');
    var data = new Uint8Array(joined.length / 2);
    for (var i = 0; i < joined.length; i += 2) {
        data[i >> 1] = parseInt(joined.substr(i, 2), 16);
    }
    return data;
}

//# sourceMappingURL=vectorloader.js.map
