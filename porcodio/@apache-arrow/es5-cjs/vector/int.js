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
exports.Uint64Vector = exports.Uint32Vector = exports.Uint16Vector = exports.Uint8Vector = exports.Int64Vector = exports.Int32Vector = exports.Int16Vector = exports.Int8Vector = exports.IntVector = void 0;
var tslib_1 = require("tslib");
var data_1 = require("../data");
var vector_1 = require("../vector");
var base_1 = require("./base");
var index_1 = require("./index");
var compat_1 = require("../util/compat");
var buffer_1 = require("../util/buffer");
var type_1 = require("../type");
/** @ignore */
var IntVector = /** @class */ (function (_super) {
    tslib_1.__extends(IntVector, _super);
    function IntVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @nocollapse */
    IntVector.from = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = tslib_1.__read(args, 2), input = _a[0], _b = _a[1], is64bit = _b === void 0 ? false : _b;
        var ArrowType = vectorTypeToDataType(this, is64bit);
        if ((input instanceof ArrayBuffer) || ArrayBuffer.isView(input)) {
            var InputType = arrayTypeToDataType(input.constructor, is64bit) || ArrowType;
            // Special case, infer the Arrow DataType from the input if calling the base
            // IntVector.from with a TypedArray, e.g. `IntVector.from(new Int32Array())`
            if (ArrowType === null) {
                ArrowType = InputType;
            }
            // If the DataType inferred from the Vector constructor matches the
            // DataType inferred from the input arguments, return zero-copy view
            if (ArrowType && ArrowType === InputType) {
                var type = new ArrowType();
                var length_1 = input.byteLength / type.ArrayType.BYTES_PER_ELEMENT;
                // If the ArrowType is 64bit but the input type is 32bit pairs, update the logical length
                if (convert32To64Bit(ArrowType, input.constructor)) {
                    length_1 *= 0.5;
                }
                return vector_1.Vector.new(data_1.Data.Int(type, 0, length_1, 0, null, input));
            }
        }
        if (ArrowType) {
            // If the DataType inferred from the Vector constructor is different than
            // the DataType inferred from the input TypedArray, or if input isn't a
            // TypedArray, use the Builders to construct the result Vector
            return index_1.vectorFromValuesWithType(function () { return new ArrowType(); }, input);
        }
        if ((input instanceof DataView) || (input instanceof ArrayBuffer)) {
            throw new TypeError("Cannot infer integer type from instance of " + input.constructor.name);
        }
        throw new TypeError('Unrecognized IntVector input');
    };
    return IntVector;
}(base_1.BaseVector));
exports.IntVector = IntVector;
/** @ignore */
var Int8Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Int8Vector, _super);
    function Int8Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int8Vector;
}(IntVector));
exports.Int8Vector = Int8Vector;
/** @ignore */
var Int16Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Int16Vector, _super);
    function Int16Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int16Vector;
}(IntVector));
exports.Int16Vector = Int16Vector;
/** @ignore */
var Int32Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Int32Vector, _super);
    function Int32Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int32Vector;
}(IntVector));
exports.Int32Vector = Int32Vector;
/** @ignore */
var Int64Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Int64Vector, _super);
    function Int64Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Int64Vector.prototype.toBigInt64Array = function () {
        return buffer_1.toBigInt64Array(this.values);
    };
    Object.defineProperty(Int64Vector.prototype, "values64", {
        get: function () {
            return this._values64 || (this._values64 = this.toBigInt64Array());
        },
        enumerable: false,
        configurable: true
    });
    return Int64Vector;
}(IntVector));
exports.Int64Vector = Int64Vector;
/** @ignore */
var Uint8Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Uint8Vector, _super);
    function Uint8Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Uint8Vector;
}(IntVector));
exports.Uint8Vector = Uint8Vector;
/** @ignore */
var Uint16Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Uint16Vector, _super);
    function Uint16Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Uint16Vector;
}(IntVector));
exports.Uint16Vector = Uint16Vector;
/** @ignore */
var Uint32Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Uint32Vector, _super);
    function Uint32Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Uint32Vector;
}(IntVector));
exports.Uint32Vector = Uint32Vector;
/** @ignore */
var Uint64Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Uint64Vector, _super);
    function Uint64Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint64Vector.prototype.toBigUint64Array = function () {
        return buffer_1.toBigUint64Array(this.values);
    };
    Object.defineProperty(Uint64Vector.prototype, "values64", {
        get: function () {
            return this._values64 || (this._values64 = this.toBigUint64Array());
        },
        enumerable: false,
        configurable: true
    });
    return Uint64Vector;
}(IntVector));
exports.Uint64Vector = Uint64Vector;
var convert32To64Bit = function (typeCtor, dataCtor) {
    return (typeCtor === type_1.Int64 || typeCtor === type_1.Uint64) &&
        (dataCtor === Int32Array || dataCtor === Uint32Array);
};
/** @ignore */
var arrayTypeToDataType = function (ctor, is64bit) {
    switch (ctor) {
        case Int8Array: return type_1.Int8;
        case Int16Array: return type_1.Int16;
        case Int32Array: return is64bit ? type_1.Int64 : type_1.Int32;
        case compat_1.BigInt64Array: return type_1.Int64;
        case Uint8Array: return type_1.Uint8;
        case Uint16Array: return type_1.Uint16;
        case Uint32Array: return is64bit ? type_1.Uint64 : type_1.Uint32;
        case compat_1.BigUint64Array: return type_1.Uint64;
        default: return null;
    }
};
/** @ignore */
var vectorTypeToDataType = function (ctor, is64bit) {
    switch (ctor) {
        case Int8Vector: return type_1.Int8;
        case Int16Vector: return type_1.Int16;
        case Int32Vector: return is64bit ? type_1.Int64 : type_1.Int32;
        case Int64Vector: return type_1.Int64;
        case Uint8Vector: return type_1.Uint8;
        case Uint16Vector: return type_1.Uint16;
        case Uint32Vector: return is64bit ? type_1.Uint64 : type_1.Uint32;
        case Uint64Vector: return type_1.Uint64;
        default: return null;
    }
};

//# sourceMappingURL=int.js.map
