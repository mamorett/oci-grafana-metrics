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
exports.instance = exports.GetVectorConstructor = void 0;
var tslib_1 = require("tslib");
var visitor_1 = require("../visitor");
var binary_1 = require("../vector/binary");
var bool_1 = require("../vector/bool");
var date_1 = require("../vector/date");
var decimal_1 = require("../vector/decimal");
var dictionary_1 = require("../vector/dictionary");
var fixedsizebinary_1 = require("../vector/fixedsizebinary");
var fixedsizelist_1 = require("../vector/fixedsizelist");
var float_1 = require("../vector/float");
var interval_1 = require("../vector/interval");
var int_1 = require("../vector/int");
var list_1 = require("../vector/list");
var map_1 = require("../vector/map");
var null_1 = require("../vector/null");
var struct_1 = require("../vector/struct");
var timestamp_1 = require("../vector/timestamp");
var time_1 = require("../vector/time");
var union_1 = require("../vector/union");
var utf8_1 = require("../vector/utf8");
/** @ignore */
var GetVectorConstructor = /** @class */ (function (_super) {
    tslib_1.__extends(GetVectorConstructor, _super);
    function GetVectorConstructor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetVectorConstructor.prototype.visitNull = function () { return null_1.NullVector; };
    GetVectorConstructor.prototype.visitBool = function () { return bool_1.BoolVector; };
    GetVectorConstructor.prototype.visitInt = function () { return int_1.IntVector; };
    GetVectorConstructor.prototype.visitInt8 = function () { return int_1.Int8Vector; };
    GetVectorConstructor.prototype.visitInt16 = function () { return int_1.Int16Vector; };
    GetVectorConstructor.prototype.visitInt32 = function () { return int_1.Int32Vector; };
    GetVectorConstructor.prototype.visitInt64 = function () { return int_1.Int64Vector; };
    GetVectorConstructor.prototype.visitUint8 = function () { return int_1.Uint8Vector; };
    GetVectorConstructor.prototype.visitUint16 = function () { return int_1.Uint16Vector; };
    GetVectorConstructor.prototype.visitUint32 = function () { return int_1.Uint32Vector; };
    GetVectorConstructor.prototype.visitUint64 = function () { return int_1.Uint64Vector; };
    GetVectorConstructor.prototype.visitFloat = function () { return float_1.FloatVector; };
    GetVectorConstructor.prototype.visitFloat16 = function () { return float_1.Float16Vector; };
    GetVectorConstructor.prototype.visitFloat32 = function () { return float_1.Float32Vector; };
    GetVectorConstructor.prototype.visitFloat64 = function () { return float_1.Float64Vector; };
    GetVectorConstructor.prototype.visitUtf8 = function () { return utf8_1.Utf8Vector; };
    GetVectorConstructor.prototype.visitBinary = function () { return binary_1.BinaryVector; };
    GetVectorConstructor.prototype.visitFixedSizeBinary = function () { return fixedsizebinary_1.FixedSizeBinaryVector; };
    GetVectorConstructor.prototype.visitDate = function () { return date_1.DateVector; };
    GetVectorConstructor.prototype.visitDateDay = function () { return date_1.DateDayVector; };
    GetVectorConstructor.prototype.visitDateMillisecond = function () { return date_1.DateMillisecondVector; };
    GetVectorConstructor.prototype.visitTimestamp = function () { return timestamp_1.TimestampVector; };
    GetVectorConstructor.prototype.visitTimestampSecond = function () { return timestamp_1.TimestampSecondVector; };
    GetVectorConstructor.prototype.visitTimestampMillisecond = function () { return timestamp_1.TimestampMillisecondVector; };
    GetVectorConstructor.prototype.visitTimestampMicrosecond = function () { return timestamp_1.TimestampMicrosecondVector; };
    GetVectorConstructor.prototype.visitTimestampNanosecond = function () { return timestamp_1.TimestampNanosecondVector; };
    GetVectorConstructor.prototype.visitTime = function () { return time_1.TimeVector; };
    GetVectorConstructor.prototype.visitTimeSecond = function () { return time_1.TimeSecondVector; };
    GetVectorConstructor.prototype.visitTimeMillisecond = function () { return time_1.TimeMillisecondVector; };
    GetVectorConstructor.prototype.visitTimeMicrosecond = function () { return time_1.TimeMicrosecondVector; };
    GetVectorConstructor.prototype.visitTimeNanosecond = function () { return time_1.TimeNanosecondVector; };
    GetVectorConstructor.prototype.visitDecimal = function () { return decimal_1.DecimalVector; };
    GetVectorConstructor.prototype.visitList = function () { return list_1.ListVector; };
    GetVectorConstructor.prototype.visitStruct = function () { return struct_1.StructVector; };
    GetVectorConstructor.prototype.visitUnion = function () { return union_1.UnionVector; };
    GetVectorConstructor.prototype.visitDenseUnion = function () { return union_1.DenseUnionVector; };
    GetVectorConstructor.prototype.visitSparseUnion = function () { return union_1.SparseUnionVector; };
    GetVectorConstructor.prototype.visitDictionary = function () { return dictionary_1.DictionaryVector; };
    GetVectorConstructor.prototype.visitInterval = function () { return interval_1.IntervalVector; };
    GetVectorConstructor.prototype.visitIntervalDayTime = function () { return interval_1.IntervalDayTimeVector; };
    GetVectorConstructor.prototype.visitIntervalYearMonth = function () { return interval_1.IntervalYearMonthVector; };
    GetVectorConstructor.prototype.visitFixedSizeList = function () { return fixedsizelist_1.FixedSizeListVector; };
    GetVectorConstructor.prototype.visitMap = function () { return map_1.MapVector; };
    return GetVectorConstructor;
}(visitor_1.Visitor));
exports.GetVectorConstructor = GetVectorConstructor;
/** @ignore */
exports.instance = new GetVectorConstructor();

//# sourceMappingURL=vectorctor.js.map
