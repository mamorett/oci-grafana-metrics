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
exports.instance = exports.GetDataTypeConstructor = void 0;
var tslib_1 = require("tslib");
var type = require("../type");
var visitor_1 = require("../visitor");
/** @ignore */
var GetDataTypeConstructor = /** @class */ (function (_super) {
    tslib_1.__extends(GetDataTypeConstructor, _super);
    function GetDataTypeConstructor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetDataTypeConstructor.prototype.visitNull = function () { return type.Null; };
    GetDataTypeConstructor.prototype.visitBool = function () { return type.Bool; };
    GetDataTypeConstructor.prototype.visitInt = function () { return type.Int; };
    GetDataTypeConstructor.prototype.visitInt8 = function () { return type.Int8; };
    GetDataTypeConstructor.prototype.visitInt16 = function () { return type.Int16; };
    GetDataTypeConstructor.prototype.visitInt32 = function () { return type.Int32; };
    GetDataTypeConstructor.prototype.visitInt64 = function () { return type.Int64; };
    GetDataTypeConstructor.prototype.visitUint8 = function () { return type.Uint8; };
    GetDataTypeConstructor.prototype.visitUint16 = function () { return type.Uint16; };
    GetDataTypeConstructor.prototype.visitUint32 = function () { return type.Uint32; };
    GetDataTypeConstructor.prototype.visitUint64 = function () { return type.Uint64; };
    GetDataTypeConstructor.prototype.visitFloat = function () { return type.Float; };
    GetDataTypeConstructor.prototype.visitFloat16 = function () { return type.Float16; };
    GetDataTypeConstructor.prototype.visitFloat32 = function () { return type.Float32; };
    GetDataTypeConstructor.prototype.visitFloat64 = function () { return type.Float64; };
    GetDataTypeConstructor.prototype.visitUtf8 = function () { return type.Utf8; };
    GetDataTypeConstructor.prototype.visitBinary = function () { return type.Binary; };
    GetDataTypeConstructor.prototype.visitFixedSizeBinary = function () { return type.FixedSizeBinary; };
    GetDataTypeConstructor.prototype.visitDate = function () { return type.Date_; };
    GetDataTypeConstructor.prototype.visitDateDay = function () { return type.DateDay; };
    GetDataTypeConstructor.prototype.visitDateMillisecond = function () { return type.DateMillisecond; };
    GetDataTypeConstructor.prototype.visitTimestamp = function () { return type.Timestamp; };
    GetDataTypeConstructor.prototype.visitTimestampSecond = function () { return type.TimestampSecond; };
    GetDataTypeConstructor.prototype.visitTimestampMillisecond = function () { return type.TimestampMillisecond; };
    GetDataTypeConstructor.prototype.visitTimestampMicrosecond = function () { return type.TimestampMicrosecond; };
    GetDataTypeConstructor.prototype.visitTimestampNanosecond = function () { return type.TimestampNanosecond; };
    GetDataTypeConstructor.prototype.visitTime = function () { return type.Time; };
    GetDataTypeConstructor.prototype.visitTimeSecond = function () { return type.TimeSecond; };
    GetDataTypeConstructor.prototype.visitTimeMillisecond = function () { return type.TimeMillisecond; };
    GetDataTypeConstructor.prototype.visitTimeMicrosecond = function () { return type.TimeMicrosecond; };
    GetDataTypeConstructor.prototype.visitTimeNanosecond = function () { return type.TimeNanosecond; };
    GetDataTypeConstructor.prototype.visitDecimal = function () { return type.Decimal; };
    GetDataTypeConstructor.prototype.visitList = function () { return type.List; };
    GetDataTypeConstructor.prototype.visitStruct = function () { return type.Struct; };
    GetDataTypeConstructor.prototype.visitUnion = function () { return type.Union; };
    GetDataTypeConstructor.prototype.visitDenseUnion = function () { return type.DenseUnion; };
    GetDataTypeConstructor.prototype.visitSparseUnion = function () { return type.SparseUnion; };
    GetDataTypeConstructor.prototype.visitDictionary = function () { return type.Dictionary; };
    GetDataTypeConstructor.prototype.visitInterval = function () { return type.Interval; };
    GetDataTypeConstructor.prototype.visitIntervalDayTime = function () { return type.IntervalDayTime; };
    GetDataTypeConstructor.prototype.visitIntervalYearMonth = function () { return type.IntervalYearMonth; };
    GetDataTypeConstructor.prototype.visitFixedSizeList = function () { return type.FixedSizeList; };
    GetDataTypeConstructor.prototype.visitMap = function () { return type.Map_; };
    return GetDataTypeConstructor;
}(visitor_1.Visitor));
exports.GetDataTypeConstructor = GetDataTypeConstructor;
/** @ignore */
exports.instance = new GetDataTypeConstructor();

//# sourceMappingURL=typector.js.map
