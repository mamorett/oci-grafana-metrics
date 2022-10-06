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
exports.instance = exports.GetBuilderCtor = void 0;
var tslib_1 = require("tslib");
var visitor_1 = require("../visitor");
var binary_1 = require("../builder/binary");
var bool_1 = require("../builder/bool");
var date_1 = require("../builder/date");
var decimal_1 = require("../builder/decimal");
var dictionary_1 = require("../builder/dictionary");
var fixedsizebinary_1 = require("../builder/fixedsizebinary");
var fixedsizelist_1 = require("../builder/fixedsizelist");
var float_1 = require("../builder/float");
var interval_1 = require("../builder/interval");
var int_1 = require("../builder/int");
var list_1 = require("../builder/list");
var map_1 = require("../builder/map");
var null_1 = require("../builder/null");
var struct_1 = require("../builder/struct");
var timestamp_1 = require("../builder/timestamp");
var time_1 = require("../builder/time");
var union_1 = require("../builder/union");
var utf8_1 = require("../builder/utf8");
/** @ignore */
var GetBuilderCtor = /** @class */ (function (_super) {
    tslib_1.__extends(GetBuilderCtor, _super);
    function GetBuilderCtor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetBuilderCtor.prototype.visitNull = function () { return null_1.NullBuilder; };
    GetBuilderCtor.prototype.visitBool = function () { return bool_1.BoolBuilder; };
    GetBuilderCtor.prototype.visitInt = function () { return int_1.IntBuilder; };
    GetBuilderCtor.prototype.visitInt8 = function () { return int_1.Int8Builder; };
    GetBuilderCtor.prototype.visitInt16 = function () { return int_1.Int16Builder; };
    GetBuilderCtor.prototype.visitInt32 = function () { return int_1.Int32Builder; };
    GetBuilderCtor.prototype.visitInt64 = function () { return int_1.Int64Builder; };
    GetBuilderCtor.prototype.visitUint8 = function () { return int_1.Uint8Builder; };
    GetBuilderCtor.prototype.visitUint16 = function () { return int_1.Uint16Builder; };
    GetBuilderCtor.prototype.visitUint32 = function () { return int_1.Uint32Builder; };
    GetBuilderCtor.prototype.visitUint64 = function () { return int_1.Uint64Builder; };
    GetBuilderCtor.prototype.visitFloat = function () { return float_1.FloatBuilder; };
    GetBuilderCtor.prototype.visitFloat16 = function () { return float_1.Float16Builder; };
    GetBuilderCtor.prototype.visitFloat32 = function () { return float_1.Float32Builder; };
    GetBuilderCtor.prototype.visitFloat64 = function () { return float_1.Float64Builder; };
    GetBuilderCtor.prototype.visitUtf8 = function () { return utf8_1.Utf8Builder; };
    GetBuilderCtor.prototype.visitBinary = function () { return binary_1.BinaryBuilder; };
    GetBuilderCtor.prototype.visitFixedSizeBinary = function () { return fixedsizebinary_1.FixedSizeBinaryBuilder; };
    GetBuilderCtor.prototype.visitDate = function () { return date_1.DateBuilder; };
    GetBuilderCtor.prototype.visitDateDay = function () { return date_1.DateDayBuilder; };
    GetBuilderCtor.prototype.visitDateMillisecond = function () { return date_1.DateMillisecondBuilder; };
    GetBuilderCtor.prototype.visitTimestamp = function () { return timestamp_1.TimestampBuilder; };
    GetBuilderCtor.prototype.visitTimestampSecond = function () { return timestamp_1.TimestampSecondBuilder; };
    GetBuilderCtor.prototype.visitTimestampMillisecond = function () { return timestamp_1.TimestampMillisecondBuilder; };
    GetBuilderCtor.prototype.visitTimestampMicrosecond = function () { return timestamp_1.TimestampMicrosecondBuilder; };
    GetBuilderCtor.prototype.visitTimestampNanosecond = function () { return timestamp_1.TimestampNanosecondBuilder; };
    GetBuilderCtor.prototype.visitTime = function () { return time_1.TimeBuilder; };
    GetBuilderCtor.prototype.visitTimeSecond = function () { return time_1.TimeSecondBuilder; };
    GetBuilderCtor.prototype.visitTimeMillisecond = function () { return time_1.TimeMillisecondBuilder; };
    GetBuilderCtor.prototype.visitTimeMicrosecond = function () { return time_1.TimeMicrosecondBuilder; };
    GetBuilderCtor.prototype.visitTimeNanosecond = function () { return time_1.TimeNanosecondBuilder; };
    GetBuilderCtor.prototype.visitDecimal = function () { return decimal_1.DecimalBuilder; };
    GetBuilderCtor.prototype.visitList = function () { return list_1.ListBuilder; };
    GetBuilderCtor.prototype.visitStruct = function () { return struct_1.StructBuilder; };
    GetBuilderCtor.prototype.visitUnion = function () { return union_1.UnionBuilder; };
    GetBuilderCtor.prototype.visitDenseUnion = function () { return union_1.DenseUnionBuilder; };
    GetBuilderCtor.prototype.visitSparseUnion = function () { return union_1.SparseUnionBuilder; };
    GetBuilderCtor.prototype.visitDictionary = function () { return dictionary_1.DictionaryBuilder; };
    GetBuilderCtor.prototype.visitInterval = function () { return interval_1.IntervalBuilder; };
    GetBuilderCtor.prototype.visitIntervalDayTime = function () { return interval_1.IntervalDayTimeBuilder; };
    GetBuilderCtor.prototype.visitIntervalYearMonth = function () { return interval_1.IntervalYearMonthBuilder; };
    GetBuilderCtor.prototype.visitFixedSizeList = function () { return fixedsizelist_1.FixedSizeListBuilder; };
    GetBuilderCtor.prototype.visitMap = function () { return map_1.MapBuilder; };
    return GetBuilderCtor;
}(visitor_1.Visitor));
exports.GetBuilderCtor = GetBuilderCtor;
/** @ignore */
exports.instance = new GetBuilderCtor();

//# sourceMappingURL=builderctor.js.map
