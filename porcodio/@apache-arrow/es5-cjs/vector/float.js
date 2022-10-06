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
exports.Float64Vector = exports.Float32Vector = exports.Float16Vector = exports.FloatVector = void 0;
var tslib_1 = require("tslib");
var data_1 = require("../data");
var vector_1 = require("../vector");
var base_1 = require("./base");
var index_1 = require("./index");
var type_1 = require("../type");
/** @ignore */
var FloatVector = /** @class */ (function (_super) {
    tslib_1.__extends(FloatVector, _super);
    function FloatVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @nocollapse */
    FloatVector.from = function (input) {
        var ArrowType = vectorTypeToDataType(this);
        if ((input instanceof ArrayBuffer) || ArrayBuffer.isView(input)) {
            var InputType = arrayTypeToDataType(input.constructor) || ArrowType;
            // Special case, infer the Arrow DataType from the input if calling the base
            // FloatVector.from with a TypedArray, e.g. `FloatVector.from(new Float32Array())`
            if (ArrowType === null) {
                ArrowType = InputType;
            }
            // If the DataType inferred from the Vector constructor matches the
            // DataType inferred from the input arguments, return zero-copy view
            if (ArrowType && ArrowType === InputType) {
                var type = new ArrowType();
                var length_1 = input.byteLength / type.ArrayType.BYTES_PER_ELEMENT;
                // If the ArrowType is Float16 but the input type isn't a Uint16Array,
                // let the Float16Builder handle casting the input values to Uint16s.
                if (!convertTo16Bit(ArrowType, input.constructor)) {
                    return vector_1.Vector.new(data_1.Data.Float(type, 0, length_1, 0, null, input));
                }
            }
        }
        if (ArrowType) {
            // If the DataType inferred from the Vector constructor is different than
            // the DataType inferred from the input TypedArray, or if input isn't a
            // TypedArray, use the Builders to construct the result Vector
            return index_1.vectorFromValuesWithType(function () { return new ArrowType(); }, input);
        }
        if ((input instanceof DataView) || (input instanceof ArrayBuffer)) {
            throw new TypeError("Cannot infer float type from instance of " + input.constructor.name);
        }
        throw new TypeError('Unrecognized FloatVector input');
    };
    return FloatVector;
}(base_1.BaseVector));
exports.FloatVector = FloatVector;
/** @ignore */
var Float16Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Float16Vector, _super);
    function Float16Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Since JS doesn't have half floats, `toArray()` returns a zero-copy slice
    // of the underlying Uint16Array data. This behavior ensures we don't incur
    // extra compute or copies if you're calling `toArray()` in order to create
    // a buffer for something like WebGL. Buf if you're using JS and want typed
    // arrays of 4-to-8-byte precision, these methods will enumerate the values
    // and clamp to the desired byte lengths.
    Float16Vector.prototype.toFloat32Array = function () { return new Float32Array(this); };
    Float16Vector.prototype.toFloat64Array = function () { return new Float64Array(this); };
    return Float16Vector;
}(FloatVector));
exports.Float16Vector = Float16Vector;
/** @ignore */
var Float32Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Float32Vector, _super);
    function Float32Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Float32Vector;
}(FloatVector));
exports.Float32Vector = Float32Vector;
/** @ignore */
var Float64Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Float64Vector, _super);
    function Float64Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Float64Vector;
}(FloatVector));
exports.Float64Vector = Float64Vector;
var convertTo16Bit = function (typeCtor, dataCtor) {
    return (typeCtor === type_1.Float16) && (dataCtor !== Uint16Array);
};
/** @ignore */
var arrayTypeToDataType = function (ctor) {
    switch (ctor) {
        case Uint16Array: return type_1.Float16;
        case Float32Array: return type_1.Float32;
        case Float64Array: return type_1.Float64;
        default: return null;
    }
};
/** @ignore */
var vectorTypeToDataType = function (ctor) {
    switch (ctor) {
        case Float16Vector: return type_1.Float16;
        case Float32Vector: return type_1.Float32;
        case Float64Vector: return type_1.Float64;
        default: return null;
    }
};

//# sourceMappingURL=float.js.map
