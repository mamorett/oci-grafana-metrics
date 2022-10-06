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
exports.VectorAssembler = void 0;
var tslib_1 = require("tslib");
var visitor_1 = require("../visitor");
var enum_1 = require("../enum");
var recordbatch_1 = require("../recordbatch");
var buffer_1 = require("../util/buffer");
var bit_1 = require("../util/bit");
var args_1 = require("../util/args");
var message_1 = require("../ipc/metadata/message");
var type_1 = require("../type");
/** @ignore */
var VectorAssembler = /** @class */ (function (_super) {
    tslib_1.__extends(VectorAssembler, _super);
    function VectorAssembler() {
        var _this = _super.call(this) || this;
        _this._byteLength = 0;
        _this._nodes = [];
        _this._buffers = [];
        _this._bufferRegions = [];
        return _this;
    }
    /** @nocollapse */
    VectorAssembler.assemble = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var assembler = new VectorAssembler();
        var vectorChildren = args_1.selectVectorChildrenArgs(recordbatch_1.RecordBatch, args);
        var _a = tslib_1.__read(assembler.visitMany(vectorChildren), 1), _b = _a[0], assembleResult = _b === void 0 ? assembler : _b;
        return assembleResult;
    };
    VectorAssembler.prototype.visit = function (vector) {
        if (!type_1.DataType.isDictionary(vector.type)) {
            var data = vector.data, length_1 = vector.length, nullCount = vector.nullCount;
            if (length_1 > 2147483647) {
                /* istanbul ignore next */
                throw new RangeError('Cannot write arrays larger than 2^31 - 1 in length');
            }
            if (!type_1.DataType.isNull(vector.type)) {
                addBuffer.call(this, nullCount <= 0
                    ? new Uint8Array(0) // placeholder validity buffer
                    : bit_1.truncateBitmap(data.offset, length_1, data.nullBitmap));
            }
            this.nodes.push(new message_1.FieldNode(length_1, nullCount));
        }
        return _super.prototype.visit.call(this, vector);
    };
    VectorAssembler.prototype.visitNull = function (_nullV) {
        return this;
    };
    VectorAssembler.prototype.visitDictionary = function (vector) {
        // Assemble the indices here, Dictionary assembled separately.
        return this.visit(vector.indices);
    };
    Object.defineProperty(VectorAssembler.prototype, "nodes", {
        get: function () { return this._nodes; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VectorAssembler.prototype, "buffers", {
        get: function () { return this._buffers; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VectorAssembler.prototype, "byteLength", {
        get: function () { return this._byteLength; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VectorAssembler.prototype, "bufferRegions", {
        get: function () { return this._bufferRegions; },
        enumerable: false,
        configurable: true
    });
    return VectorAssembler;
}(visitor_1.Visitor));
exports.VectorAssembler = VectorAssembler;
/** @ignore */
function addBuffer(values) {
    var byteLength = (values.byteLength + 7) & ~7; // Round up to a multiple of 8
    this.buffers.push(values);
    this.bufferRegions.push(new message_1.BufferRegion(this._byteLength, byteLength));
    this._byteLength += byteLength;
    return this;
}
/** @ignore */
function assembleUnion(vector) {
    var type = vector.type, length = vector.length, typeIds = vector.typeIds, valueOffsets = vector.valueOffsets;
    // All Union Vectors have a typeIds buffer
    addBuffer.call(this, typeIds);
    // If this is a Sparse Union, treat it like all other Nested types
    if (type.mode === enum_1.UnionMode.Sparse) {
        return assembleNestedVector.call(this, vector);
    }
    else if (type.mode === enum_1.UnionMode.Dense) {
        // If this is a Dense Union, add the valueOffsets buffer and potentially slice the children
        if (vector.offset <= 0) {
            // If the Vector hasn't been sliced, write the existing valueOffsets
            addBuffer.call(this, valueOffsets);
            // We can treat this like all other Nested types
            return assembleNestedVector.call(this, vector);
        }
        else {
            // A sliced Dense Union is an unpleasant case. Because the offsets are different for
            // each child vector, we need to "rebase" the valueOffsets for each child
            // Union typeIds are not necessary 0-indexed
            var maxChildTypeId = typeIds.reduce(function (x, y) { return Math.max(x, y); }, typeIds[0]);
            var childLengths = new Int32Array(maxChildTypeId + 1);
            // Set all to -1 to indicate that we haven't observed a first occurrence of a particular child yet
            var childOffsets = new Int32Array(maxChildTypeId + 1).fill(-1);
            var shiftedOffsets = new Int32Array(length);
            // If we have a non-zero offset, then the value offsets do not start at
            // zero. We must a) create a new offsets array with shifted offsets and
            // b) slice the values array accordingly
            var unshiftedOffsets = buffer_1.rebaseValueOffsets(-valueOffsets[0], length, valueOffsets);
            for (var typeId = void 0, shift = void 0, index = -1; ++index < length;) {
                if ((shift = childOffsets[typeId = typeIds[index]]) === -1) {
                    shift = childOffsets[typeId] = unshiftedOffsets[typeId];
                }
                shiftedOffsets[index] = unshiftedOffsets[index] - shift;
                ++childLengths[typeId];
            }
            addBuffer.call(this, shiftedOffsets);
            // Slice and visit children accordingly
            for (var child = void 0, childIndex = -1, numChildren = type.children.length; ++childIndex < numChildren;) {
                if (child = vector.getChildAt(childIndex)) {
                    var typeId = type.typeIds[childIndex];
                    var childLength = Math.min(length, childLengths[typeId]);
                    this.visit(child.slice(childOffsets[typeId], childLength));
                }
            }
        }
    }
    return this;
}
/** @ignore */
function assembleBoolVector(vector) {
    // Bool vector is a special case of FlatVector, as its data buffer needs to stay packed
    var values;
    if (vector.nullCount >= vector.length) {
        // If all values are null, just insert a placeholder empty data buffer (fastest path)
        return addBuffer.call(this, new Uint8Array(0));
    }
    else if ((values = vector.values) instanceof Uint8Array) {
        // If values is already a Uint8Array, slice the bitmap (fast path)
        return addBuffer.call(this, bit_1.truncateBitmap(vector.offset, vector.length, values));
    }
    // Otherwise if the underlying data *isn't* a Uint8Array, enumerate the
    // values as bools and re-pack them into a Uint8Array. This code isn't
    // reachable unless you're trying to manipulate the Data internals,
    // we we're only doing this for safety.
    /* istanbul ignore next */
    return addBuffer.call(this, bit_1.packBools(vector));
}
/** @ignore */
function assembleFlatVector(vector) {
    return addBuffer.call(this, vector.values.subarray(0, vector.length * vector.stride));
}
/** @ignore */
function assembleFlatListVector(vector) {
    var length = vector.length, values = vector.values, valueOffsets = vector.valueOffsets;
    var firstOffset = valueOffsets[0];
    var lastOffset = valueOffsets[length];
    var byteLength = Math.min(lastOffset - firstOffset, values.byteLength - firstOffset);
    // Push in the order FlatList types read their buffers
    addBuffer.call(this, buffer_1.rebaseValueOffsets(-valueOffsets[0], length, valueOffsets)); // valueOffsets buffer first
    addBuffer.call(this, values.subarray(firstOffset, firstOffset + byteLength)); // sliced values buffer second
    return this;
}
/** @ignore */
function assembleListVector(vector) {
    var length = vector.length, valueOffsets = vector.valueOffsets;
    // If we have valueOffsets (MapVector, ListVector), push that buffer first
    if (valueOffsets) {
        addBuffer.call(this, buffer_1.rebaseValueOffsets(valueOffsets[0], length, valueOffsets));
    }
    // Then insert the List's values child
    return this.visit(vector.getChildAt(0));
}
/** @ignore */
function assembleNestedVector(vector) {
    return this.visitMany(vector.type.children.map(function (_, i) { return vector.getChildAt(i); }).filter(Boolean))[0];
}
VectorAssembler.prototype.visitBool = assembleBoolVector;
VectorAssembler.prototype.visitInt = assembleFlatVector;
VectorAssembler.prototype.visitFloat = assembleFlatVector;
VectorAssembler.prototype.visitUtf8 = assembleFlatListVector;
VectorAssembler.prototype.visitBinary = assembleFlatListVector;
VectorAssembler.prototype.visitFixedSizeBinary = assembleFlatVector;
VectorAssembler.prototype.visitDate = assembleFlatVector;
VectorAssembler.prototype.visitTimestamp = assembleFlatVector;
VectorAssembler.prototype.visitTime = assembleFlatVector;
VectorAssembler.prototype.visitDecimal = assembleFlatVector;
VectorAssembler.prototype.visitList = assembleListVector;
VectorAssembler.prototype.visitStruct = assembleNestedVector;
VectorAssembler.prototype.visitUnion = assembleUnion;
VectorAssembler.prototype.visitInterval = assembleFlatVector;
VectorAssembler.prototype.visitFixedSizeList = assembleListVector;
VectorAssembler.prototype.visitMap = assembleListVector;

//# sourceMappingURL=vectorassembler.js.map
