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
exports.strideForType = exports.Dictionary = exports.Map_ = exports.FixedSizeList = exports.FixedSizeBinary = exports.SparseUnion = exports.DenseUnion = exports.Union = exports.Struct = exports.List = exports.IntervalYearMonth = exports.IntervalDayTime = exports.Interval = exports.TimestampNanosecond = exports.TimestampMicrosecond = exports.TimestampMillisecond = exports.TimestampSecond = exports.Timestamp = exports.TimeNanosecond = exports.TimeMicrosecond = exports.TimeMillisecond = exports.TimeSecond = exports.Time = exports.DateMillisecond = exports.DateDay = exports.Date_ = exports.Decimal = exports.Bool = exports.Utf8 = exports.Binary = exports.Float64 = exports.Float32 = exports.Float16 = exports.Float = exports.Uint64 = exports.Uint32 = exports.Uint16 = exports.Uint8 = exports.Int64 = exports.Int32 = exports.Int16 = exports.Int8 = exports.Int = exports.Null = exports.DataType = void 0;
var tslib_1 = require("tslib");
var enum_1 = require("./enum");
/**
 * An abstract base class for classes that encapsulate metadata about each of
 * the logical types that Arrow can represent.
 */
var DataType = /** @class */ (function () {
    function DataType() {
    }
    /** @nocollapse */ DataType.isNull = function (x) { return x && x.typeId === enum_1.Type.Null; };
    /** @nocollapse */ DataType.isInt = function (x) { return x && x.typeId === enum_1.Type.Int; };
    /** @nocollapse */ DataType.isFloat = function (x) { return x && x.typeId === enum_1.Type.Float; };
    /** @nocollapse */ DataType.isBinary = function (x) { return x && x.typeId === enum_1.Type.Binary; };
    /** @nocollapse */ DataType.isUtf8 = function (x) { return x && x.typeId === enum_1.Type.Utf8; };
    /** @nocollapse */ DataType.isBool = function (x) { return x && x.typeId === enum_1.Type.Bool; };
    /** @nocollapse */ DataType.isDecimal = function (x) { return x && x.typeId === enum_1.Type.Decimal; };
    /** @nocollapse */ DataType.isDate = function (x) { return x && x.typeId === enum_1.Type.Date; };
    /** @nocollapse */ DataType.isTime = function (x) { return x && x.typeId === enum_1.Type.Time; };
    /** @nocollapse */ DataType.isTimestamp = function (x) { return x && x.typeId === enum_1.Type.Timestamp; };
    /** @nocollapse */ DataType.isInterval = function (x) { return x && x.typeId === enum_1.Type.Interval; };
    /** @nocollapse */ DataType.isList = function (x) { return x && x.typeId === enum_1.Type.List; };
    /** @nocollapse */ DataType.isStruct = function (x) { return x && x.typeId === enum_1.Type.Struct; };
    /** @nocollapse */ DataType.isUnion = function (x) { return x && x.typeId === enum_1.Type.Union; };
    /** @nocollapse */ DataType.isFixedSizeBinary = function (x) { return x && x.typeId === enum_1.Type.FixedSizeBinary; };
    /** @nocollapse */ DataType.isFixedSizeList = function (x) { return x && x.typeId === enum_1.Type.FixedSizeList; };
    /** @nocollapse */ DataType.isMap = function (x) { return x && x.typeId === enum_1.Type.Map; };
    /** @nocollapse */ DataType.isDictionary = function (x) { return x && x.typeId === enum_1.Type.Dictionary; };
    Object.defineProperty(DataType.prototype, "typeId", {
        get: function () { return enum_1.Type.NONE; },
        enumerable: false,
        configurable: true
    });
    DataType[Symbol.toStringTag] = (function (proto) {
        proto.children = null;
        proto.ArrayType = Array;
        return proto[Symbol.toStringTag] = 'DataType';
    })(DataType.prototype);
    return DataType;
}());
exports.DataType = DataType;
/** @ignore */
var Null = /** @class */ (function (_super) {
    tslib_1.__extends(Null, _super);
    function Null() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Null.prototype.toString = function () { return "Null"; };
    Object.defineProperty(Null.prototype, "typeId", {
        get: function () { return enum_1.Type.Null; },
        enumerable: false,
        configurable: true
    });
    Null[Symbol.toStringTag] = (function (proto) {
        return proto[Symbol.toStringTag] = 'Null';
    })(Null.prototype);
    return Null;
}(DataType));
exports.Null = Null;
/** @ignore */
var Int_ = /** @class */ (function (_super) {
    tslib_1.__extends(Int_, _super);
    function Int_(isSigned, bitWidth) {
        var _this = _super.call(this) || this;
        _this.isSigned = isSigned;
        _this.bitWidth = bitWidth;
        return _this;
    }
    Object.defineProperty(Int_.prototype, "typeId", {
        get: function () { return enum_1.Type.Int; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Int_.prototype, "ArrayType", {
        get: function () {
            switch (this.bitWidth) {
                case 8: return this.isSigned ? Int8Array : Uint8Array;
                case 16: return this.isSigned ? Int16Array : Uint16Array;
                case 32: return this.isSigned ? Int32Array : Uint32Array;
                case 64: return this.isSigned ? Int32Array : Uint32Array;
            }
            throw new Error("Unrecognized " + this[Symbol.toStringTag] + " type");
        },
        enumerable: false,
        configurable: true
    });
    Int_.prototype.toString = function () { return (this.isSigned ? "I" : "Ui") + "nt" + this.bitWidth; };
    Int_[Symbol.toStringTag] = (function (proto) {
        proto.isSigned = null;
        proto.bitWidth = null;
        return proto[Symbol.toStringTag] = 'Int';
    })(Int_.prototype);
    return Int_;
}(DataType));
exports.Int = Int_;
/** @ignore */
var Int8 = /** @class */ (function (_super) {
    tslib_1.__extends(Int8, _super);
    function Int8() {
        return _super.call(this, true, 8) || this;
    }
    return Int8;
}(Int_));
exports.Int8 = Int8;
/** @ignore */
var Int16 = /** @class */ (function (_super) {
    tslib_1.__extends(Int16, _super);
    function Int16() {
        return _super.call(this, true, 16) || this;
    }
    return Int16;
}(Int_));
exports.Int16 = Int16;
/** @ignore */
var Int32 = /** @class */ (function (_super) {
    tslib_1.__extends(Int32, _super);
    function Int32() {
        return _super.call(this, true, 32) || this;
    }
    return Int32;
}(Int_));
exports.Int32 = Int32;
/** @ignore */
var Int64 = /** @class */ (function (_super) {
    tslib_1.__extends(Int64, _super);
    function Int64() {
        return _super.call(this, true, 64) || this;
    }
    return Int64;
}(Int_));
exports.Int64 = Int64;
/** @ignore */
var Uint8 = /** @class */ (function (_super) {
    tslib_1.__extends(Uint8, _super);
    function Uint8() {
        return _super.call(this, false, 8) || this;
    }
    return Uint8;
}(Int_));
exports.Uint8 = Uint8;
/** @ignore */
var Uint16 = /** @class */ (function (_super) {
    tslib_1.__extends(Uint16, _super);
    function Uint16() {
        return _super.call(this, false, 16) || this;
    }
    return Uint16;
}(Int_));
exports.Uint16 = Uint16;
/** @ignore */
var Uint32 = /** @class */ (function (_super) {
    tslib_1.__extends(Uint32, _super);
    function Uint32() {
        return _super.call(this, false, 32) || this;
    }
    return Uint32;
}(Int_));
exports.Uint32 = Uint32;
/** @ignore */
var Uint64 = /** @class */ (function (_super) {
    tslib_1.__extends(Uint64, _super);
    function Uint64() {
        return _super.call(this, false, 64) || this;
    }
    return Uint64;
}(Int_));
exports.Uint64 = Uint64;
Object.defineProperty(Int8.prototype, 'ArrayType', { value: Int8Array });
Object.defineProperty(Int16.prototype, 'ArrayType', { value: Int16Array });
Object.defineProperty(Int32.prototype, 'ArrayType', { value: Int32Array });
Object.defineProperty(Int64.prototype, 'ArrayType', { value: Int32Array });
Object.defineProperty(Uint8.prototype, 'ArrayType', { value: Uint8Array });
Object.defineProperty(Uint16.prototype, 'ArrayType', { value: Uint16Array });
Object.defineProperty(Uint32.prototype, 'ArrayType', { value: Uint32Array });
Object.defineProperty(Uint64.prototype, 'ArrayType', { value: Uint32Array });
/** @ignore */
var Float = /** @class */ (function (_super) {
    tslib_1.__extends(Float, _super);
    function Float(precision) {
        var _this = _super.call(this) || this;
        _this.precision = precision;
        return _this;
    }
    Object.defineProperty(Float.prototype, "typeId", {
        get: function () { return enum_1.Type.Float; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Float.prototype, "ArrayType", {
        get: function () {
            switch (this.precision) {
                case enum_1.Precision.HALF: return Uint16Array;
                case enum_1.Precision.SINGLE: return Float32Array;
                case enum_1.Precision.DOUBLE: return Float64Array;
            }
            // @ts-ignore
            throw new Error("Unrecognized " + this[Symbol.toStringTag] + " type");
        },
        enumerable: false,
        configurable: true
    });
    Float.prototype.toString = function () { return "Float" + ((this.precision << 5) || 16); };
    Float[Symbol.toStringTag] = (function (proto) {
        proto.precision = null;
        return proto[Symbol.toStringTag] = 'Float';
    })(Float.prototype);
    return Float;
}(DataType));
exports.Float = Float;
/** @ignore */
var Float16 = /** @class */ (function (_super) {
    tslib_1.__extends(Float16, _super);
    function Float16() {
        return _super.call(this, enum_1.Precision.HALF) || this;
    }
    return Float16;
}(Float));
exports.Float16 = Float16;
/** @ignore */
var Float32 = /** @class */ (function (_super) {
    tslib_1.__extends(Float32, _super);
    function Float32() {
        return _super.call(this, enum_1.Precision.SINGLE) || this;
    }
    return Float32;
}(Float));
exports.Float32 = Float32;
/** @ignore */
var Float64 = /** @class */ (function (_super) {
    tslib_1.__extends(Float64, _super);
    function Float64() {
        return _super.call(this, enum_1.Precision.DOUBLE) || this;
    }
    return Float64;
}(Float));
exports.Float64 = Float64;
Object.defineProperty(Float16.prototype, 'ArrayType', { value: Uint16Array });
Object.defineProperty(Float32.prototype, 'ArrayType', { value: Float32Array });
Object.defineProperty(Float64.prototype, 'ArrayType', { value: Float64Array });
/** @ignore */
var Binary = /** @class */ (function (_super) {
    tslib_1.__extends(Binary, _super);
    function Binary() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Binary.prototype, "typeId", {
        get: function () { return enum_1.Type.Binary; },
        enumerable: false,
        configurable: true
    });
    Binary.prototype.toString = function () { return "Binary"; };
    Binary[Symbol.toStringTag] = (function (proto) {
        proto.ArrayType = Uint8Array;
        return proto[Symbol.toStringTag] = 'Binary';
    })(Binary.prototype);
    return Binary;
}(DataType));
exports.Binary = Binary;
/** @ignore */
var Utf8 = /** @class */ (function (_super) {
    tslib_1.__extends(Utf8, _super);
    function Utf8() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Utf8.prototype, "typeId", {
        get: function () { return enum_1.Type.Utf8; },
        enumerable: false,
        configurable: true
    });
    Utf8.prototype.toString = function () { return "Utf8"; };
    Utf8[Symbol.toStringTag] = (function (proto) {
        proto.ArrayType = Uint8Array;
        return proto[Symbol.toStringTag] = 'Utf8';
    })(Utf8.prototype);
    return Utf8;
}(DataType));
exports.Utf8 = Utf8;
/** @ignore */
var Bool = /** @class */ (function (_super) {
    tslib_1.__extends(Bool, _super);
    function Bool() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Bool.prototype, "typeId", {
        get: function () { return enum_1.Type.Bool; },
        enumerable: false,
        configurable: true
    });
    Bool.prototype.toString = function () { return "Bool"; };
    Bool[Symbol.toStringTag] = (function (proto) {
        proto.ArrayType = Uint8Array;
        return proto[Symbol.toStringTag] = 'Bool';
    })(Bool.prototype);
    return Bool;
}(DataType));
exports.Bool = Bool;
/** @ignore */
var Decimal = /** @class */ (function (_super) {
    tslib_1.__extends(Decimal, _super);
    function Decimal(scale, precision) {
        var _this = _super.call(this) || this;
        _this.scale = scale;
        _this.precision = precision;
        return _this;
    }
    Object.defineProperty(Decimal.prototype, "typeId", {
        get: function () { return enum_1.Type.Decimal; },
        enumerable: false,
        configurable: true
    });
    Decimal.prototype.toString = function () { return "Decimal[" + this.precision + "e" + (this.scale > 0 ? "+" : "") + this.scale + "]"; };
    Decimal[Symbol.toStringTag] = (function (proto) {
        proto.scale = null;
        proto.precision = null;
        proto.ArrayType = Uint32Array;
        return proto[Symbol.toStringTag] = 'Decimal';
    })(Decimal.prototype);
    return Decimal;
}(DataType));
exports.Decimal = Decimal;
/** @ignore */
var Date_ = /** @class */ (function (_super) {
    tslib_1.__extends(Date_, _super);
    function Date_(unit) {
        var _this = _super.call(this) || this;
        _this.unit = unit;
        return _this;
    }
    Object.defineProperty(Date_.prototype, "typeId", {
        get: function () { return enum_1.Type.Date; },
        enumerable: false,
        configurable: true
    });
    Date_.prototype.toString = function () { return "Date" + (this.unit + 1) * 32 + "<" + enum_1.DateUnit[this.unit] + ">"; };
    Date_[Symbol.toStringTag] = (function (proto) {
        proto.unit = null;
        proto.ArrayType = Int32Array;
        return proto[Symbol.toStringTag] = 'Date';
    })(Date_.prototype);
    return Date_;
}(DataType));
exports.Date_ = Date_;
/** @ignore */
var DateDay = /** @class */ (function (_super) {
    tslib_1.__extends(DateDay, _super);
    function DateDay() {
        return _super.call(this, enum_1.DateUnit.DAY) || this;
    }
    return DateDay;
}(Date_));
exports.DateDay = DateDay;
/** @ignore */
var DateMillisecond = /** @class */ (function (_super) {
    tslib_1.__extends(DateMillisecond, _super);
    function DateMillisecond() {
        return _super.call(this, enum_1.DateUnit.MILLISECOND) || this;
    }
    return DateMillisecond;
}(Date_));
exports.DateMillisecond = DateMillisecond;
/** @ignore */
var Time_ = /** @class */ (function (_super) {
    tslib_1.__extends(Time_, _super);
    function Time_(unit, bitWidth) {
        var _this = _super.call(this) || this;
        _this.unit = unit;
        _this.bitWidth = bitWidth;
        return _this;
    }
    Object.defineProperty(Time_.prototype, "typeId", {
        get: function () { return enum_1.Type.Time; },
        enumerable: false,
        configurable: true
    });
    Time_.prototype.toString = function () { return "Time" + this.bitWidth + "<" + enum_1.TimeUnit[this.unit] + ">"; };
    Time_[Symbol.toStringTag] = (function (proto) {
        proto.unit = null;
        proto.bitWidth = null;
        proto.ArrayType = Int32Array;
        return proto[Symbol.toStringTag] = 'Time';
    })(Time_.prototype);
    return Time_;
}(DataType));
exports.Time = Time_;
/** @ignore */
var TimeSecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimeSecond, _super);
    function TimeSecond() {
        return _super.call(this, enum_1.TimeUnit.SECOND, 32) || this;
    }
    return TimeSecond;
}(Time_));
exports.TimeSecond = TimeSecond;
/** @ignore */
var TimeMillisecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimeMillisecond, _super);
    function TimeMillisecond() {
        return _super.call(this, enum_1.TimeUnit.MILLISECOND, 32) || this;
    }
    return TimeMillisecond;
}(Time_));
exports.TimeMillisecond = TimeMillisecond;
/** @ignore */
var TimeMicrosecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimeMicrosecond, _super);
    function TimeMicrosecond() {
        return _super.call(this, enum_1.TimeUnit.MICROSECOND, 64) || this;
    }
    return TimeMicrosecond;
}(Time_));
exports.TimeMicrosecond = TimeMicrosecond;
/** @ignore */
var TimeNanosecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimeNanosecond, _super);
    function TimeNanosecond() {
        return _super.call(this, enum_1.TimeUnit.NANOSECOND, 64) || this;
    }
    return TimeNanosecond;
}(Time_));
exports.TimeNanosecond = TimeNanosecond;
/** @ignore */
var Timestamp_ = /** @class */ (function (_super) {
    tslib_1.__extends(Timestamp_, _super);
    function Timestamp_(unit, timezone) {
        var _this = _super.call(this) || this;
        _this.unit = unit;
        _this.timezone = timezone;
        return _this;
    }
    Object.defineProperty(Timestamp_.prototype, "typeId", {
        get: function () { return enum_1.Type.Timestamp; },
        enumerable: false,
        configurable: true
    });
    Timestamp_.prototype.toString = function () { return "Timestamp<" + enum_1.TimeUnit[this.unit] + (this.timezone ? ", " + this.timezone : "") + ">"; };
    Timestamp_[Symbol.toStringTag] = (function (proto) {
        proto.unit = null;
        proto.timezone = null;
        proto.ArrayType = Int32Array;
        return proto[Symbol.toStringTag] = 'Timestamp';
    })(Timestamp_.prototype);
    return Timestamp_;
}(DataType));
exports.Timestamp = Timestamp_;
/** @ignore */
var TimestampSecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampSecond, _super);
    function TimestampSecond(timezone) {
        return _super.call(this, enum_1.TimeUnit.SECOND, timezone) || this;
    }
    return TimestampSecond;
}(Timestamp_));
exports.TimestampSecond = TimestampSecond;
/** @ignore */
var TimestampMillisecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampMillisecond, _super);
    function TimestampMillisecond(timezone) {
        return _super.call(this, enum_1.TimeUnit.MILLISECOND, timezone) || this;
    }
    return TimestampMillisecond;
}(Timestamp_));
exports.TimestampMillisecond = TimestampMillisecond;
/** @ignore */
var TimestampMicrosecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampMicrosecond, _super);
    function TimestampMicrosecond(timezone) {
        return _super.call(this, enum_1.TimeUnit.MICROSECOND, timezone) || this;
    }
    return TimestampMicrosecond;
}(Timestamp_));
exports.TimestampMicrosecond = TimestampMicrosecond;
/** @ignore */
var TimestampNanosecond = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampNanosecond, _super);
    function TimestampNanosecond(timezone) {
        return _super.call(this, enum_1.TimeUnit.NANOSECOND, timezone) || this;
    }
    return TimestampNanosecond;
}(Timestamp_));
exports.TimestampNanosecond = TimestampNanosecond;
/** @ignore */
var Interval_ = /** @class */ (function (_super) {
    tslib_1.__extends(Interval_, _super);
    function Interval_(unit) {
        var _this = _super.call(this) || this;
        _this.unit = unit;
        return _this;
    }
    Object.defineProperty(Interval_.prototype, "typeId", {
        get: function () { return enum_1.Type.Interval; },
        enumerable: false,
        configurable: true
    });
    Interval_.prototype.toString = function () { return "Interval<" + enum_1.IntervalUnit[this.unit] + ">"; };
    Interval_[Symbol.toStringTag] = (function (proto) {
        proto.unit = null;
        proto.ArrayType = Int32Array;
        return proto[Symbol.toStringTag] = 'Interval';
    })(Interval_.prototype);
    return Interval_;
}(DataType));
exports.Interval = Interval_;
/** @ignore */
var IntervalDayTime = /** @class */ (function (_super) {
    tslib_1.__extends(IntervalDayTime, _super);
    function IntervalDayTime() {
        return _super.call(this, enum_1.IntervalUnit.DAY_TIME) || this;
    }
    return IntervalDayTime;
}(Interval_));
exports.IntervalDayTime = IntervalDayTime;
/** @ignore */
var IntervalYearMonth = /** @class */ (function (_super) {
    tslib_1.__extends(IntervalYearMonth, _super);
    function IntervalYearMonth() {
        return _super.call(this, enum_1.IntervalUnit.YEAR_MONTH) || this;
    }
    return IntervalYearMonth;
}(Interval_));
exports.IntervalYearMonth = IntervalYearMonth;
/** @ignore */
var List = /** @class */ (function (_super) {
    tslib_1.__extends(List, _super);
    function List(child) {
        var _this = _super.call(this) || this;
        _this.children = [child];
        return _this;
    }
    Object.defineProperty(List.prototype, "typeId", {
        get: function () { return enum_1.Type.List; },
        enumerable: false,
        configurable: true
    });
    List.prototype.toString = function () { return "List<" + this.valueType + ">"; };
    Object.defineProperty(List.prototype, "valueType", {
        get: function () { return this.children[0].type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "valueField", {
        get: function () { return this.children[0]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "ArrayType", {
        get: function () { return this.valueType.ArrayType; },
        enumerable: false,
        configurable: true
    });
    List[Symbol.toStringTag] = (function (proto) {
        proto.children = null;
        return proto[Symbol.toStringTag] = 'List';
    })(List.prototype);
    return List;
}(DataType));
exports.List = List;
/** @ignore */
var Struct = /** @class */ (function (_super) {
    tslib_1.__extends(Struct, _super);
    function Struct(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(Struct.prototype, "typeId", {
        get: function () { return enum_1.Type.Struct; },
        enumerable: false,
        configurable: true
    });
    Struct.prototype.toString = function () { return "Struct<{" + this.children.map(function (f) { return f.name + ":" + f.type; }).join(", ") + "}>"; };
    Struct[Symbol.toStringTag] = (function (proto) {
        proto.children = null;
        return proto[Symbol.toStringTag] = 'Struct';
    })(Struct.prototype);
    return Struct;
}(DataType));
exports.Struct = Struct;
/** @ignore */
var Union_ = /** @class */ (function (_super) {
    tslib_1.__extends(Union_, _super);
    function Union_(mode, typeIds, children) {
        var _this = _super.call(this) || this;
        _this.mode = mode;
        _this.children = children;
        _this.typeIds = typeIds = Int32Array.from(typeIds);
        _this.typeIdToChildIndex = typeIds.reduce(function (typeIdToChildIndex, typeId, idx) {
            return (typeIdToChildIndex[typeId] = idx) && typeIdToChildIndex || typeIdToChildIndex;
        }, Object.create(null));
        return _this;
    }
    Object.defineProperty(Union_.prototype, "typeId", {
        get: function () { return enum_1.Type.Union; },
        enumerable: false,
        configurable: true
    });
    Union_.prototype.toString = function () {
        return this[Symbol.toStringTag] + "<" + this.children.map(function (x) { return "" + x.type; }).join(" | ") + ">";
    };
    Union_[Symbol.toStringTag] = (function (proto) {
        proto.mode = null;
        proto.typeIds = null;
        proto.children = null;
        proto.typeIdToChildIndex = null;
        proto.ArrayType = Int8Array;
        return proto[Symbol.toStringTag] = 'Union';
    })(Union_.prototype);
    return Union_;
}(DataType));
exports.Union = Union_;
/** @ignore */
var DenseUnion = /** @class */ (function (_super) {
    tslib_1.__extends(DenseUnion, _super);
    function DenseUnion(typeIds, children) {
        return _super.call(this, enum_1.UnionMode.Dense, typeIds, children) || this;
    }
    return DenseUnion;
}(Union_));
exports.DenseUnion = DenseUnion;
/** @ignore */
var SparseUnion = /** @class */ (function (_super) {
    tslib_1.__extends(SparseUnion, _super);
    function SparseUnion(typeIds, children) {
        return _super.call(this, enum_1.UnionMode.Sparse, typeIds, children) || this;
    }
    return SparseUnion;
}(Union_));
exports.SparseUnion = SparseUnion;
/** @ignore */
var FixedSizeBinary = /** @class */ (function (_super) {
    tslib_1.__extends(FixedSizeBinary, _super);
    function FixedSizeBinary(byteWidth) {
        var _this = _super.call(this) || this;
        _this.byteWidth = byteWidth;
        return _this;
    }
    Object.defineProperty(FixedSizeBinary.prototype, "typeId", {
        get: function () { return enum_1.Type.FixedSizeBinary; },
        enumerable: false,
        configurable: true
    });
    FixedSizeBinary.prototype.toString = function () { return "FixedSizeBinary[" + this.byteWidth + "]"; };
    FixedSizeBinary[Symbol.toStringTag] = (function (proto) {
        proto.byteWidth = null;
        proto.ArrayType = Uint8Array;
        return proto[Symbol.toStringTag] = 'FixedSizeBinary';
    })(FixedSizeBinary.prototype);
    return FixedSizeBinary;
}(DataType));
exports.FixedSizeBinary = FixedSizeBinary;
/** @ignore */
var FixedSizeList = /** @class */ (function (_super) {
    tslib_1.__extends(FixedSizeList, _super);
    function FixedSizeList(listSize, child) {
        var _this = _super.call(this) || this;
        _this.listSize = listSize;
        _this.children = [child];
        return _this;
    }
    Object.defineProperty(FixedSizeList.prototype, "typeId", {
        get: function () { return enum_1.Type.FixedSizeList; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedSizeList.prototype, "valueType", {
        get: function () { return this.children[0].type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedSizeList.prototype, "valueField", {
        get: function () { return this.children[0]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FixedSizeList.prototype, "ArrayType", {
        get: function () { return this.valueType.ArrayType; },
        enumerable: false,
        configurable: true
    });
    FixedSizeList.prototype.toString = function () { return "FixedSizeList[" + this.listSize + "]<" + this.valueType + ">"; };
    FixedSizeList[Symbol.toStringTag] = (function (proto) {
        proto.children = null;
        proto.listSize = null;
        return proto[Symbol.toStringTag] = 'FixedSizeList';
    })(FixedSizeList.prototype);
    return FixedSizeList;
}(DataType));
exports.FixedSizeList = FixedSizeList;
/** @ignore */
var Map_ = /** @class */ (function (_super) {
    tslib_1.__extends(Map_, _super);
    function Map_(child, keysSorted) {
        if (keysSorted === void 0) { keysSorted = false; }
        var _this = _super.call(this) || this;
        _this.children = [child];
        _this.keysSorted = keysSorted;
        return _this;
    }
    Object.defineProperty(Map_.prototype, "typeId", {
        get: function () { return enum_1.Type.Map; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map_.prototype, "keyType", {
        get: function () { return this.children[0].type.children[0].type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map_.prototype, "valueType", {
        get: function () { return this.children[0].type.children[1].type; },
        enumerable: false,
        configurable: true
    });
    Map_.prototype.toString = function () { return "Map<{" + this.children[0].type.children.map(function (f) { return f.name + ":" + f.type; }).join(", ") + "}>"; };
    Map_[Symbol.toStringTag] = (function (proto) {
        proto.children = null;
        proto.keysSorted = null;
        return proto[Symbol.toStringTag] = 'Map_';
    })(Map_.prototype);
    return Map_;
}(DataType));
exports.Map_ = Map_;
/** @ignore */
var getId = (function (atomicDictionaryId) { return function () { return ++atomicDictionaryId; }; })(-1);
/** @ignore */
var Dictionary = /** @class */ (function (_super) {
    tslib_1.__extends(Dictionary, _super);
    function Dictionary(dictionary, indices, id, isOrdered) {
        var _this = _super.call(this) || this;
        _this.indices = indices;
        _this.dictionary = dictionary;
        _this.isOrdered = isOrdered || false;
        _this.id = id == null ? getId() : typeof id === 'number' ? id : id.low;
        return _this;
    }
    Object.defineProperty(Dictionary.prototype, "typeId", {
        get: function () { return enum_1.Type.Dictionary; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "children", {
        get: function () { return this.dictionary.children; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "valueType", {
        get: function () { return this.dictionary; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "ArrayType", {
        get: function () { return this.dictionary.ArrayType; },
        enumerable: false,
        configurable: true
    });
    Dictionary.prototype.toString = function () { return "Dictionary<" + this.indices + ", " + this.dictionary + ">"; };
    Dictionary[Symbol.toStringTag] = (function (proto) {
        proto.id = null;
        proto.indices = null;
        proto.isOrdered = null;
        proto.dictionary = null;
        return proto[Symbol.toStringTag] = 'Dictionary';
    })(Dictionary.prototype);
    return Dictionary;
}(DataType));
exports.Dictionary = Dictionary;
/** @ignore */
function strideForType(type) {
    var t = type;
    switch (type.typeId) {
        case enum_1.Type.Decimal: return 4;
        case enum_1.Type.Timestamp: return 2;
        case enum_1.Type.Date: return 1 + t.unit;
        case enum_1.Type.Interval: return 1 + t.unit;
        case enum_1.Type.Int: return 1 + +(t.bitWidth > 32);
        case enum_1.Type.Time: return 1 + +(t.bitWidth > 32);
        case enum_1.Type.FixedSizeList: return t.listSize;
        case enum_1.Type.FixedSizeBinary: return t.byteWidth;
        default: return 1;
    }
}
exports.strideForType = strideForType;

//# sourceMappingURL=type.js.map
