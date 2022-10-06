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
exports.instance = exports.GetVisitor = void 0;
var tslib_1 = require("tslib");
var bn_1 = require("../util/bn");
var visitor_1 = require("../visitor");
var utf8_1 = require("../util/utf8");
var math_1 = require("../util/math");
var enum_1 = require("../enum");
/** @ignore */
var GetVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(GetVisitor, _super);
    function GetVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GetVisitor;
}(visitor_1.Visitor));
exports.GetVisitor = GetVisitor;
/** @ignore */ var epochDaysToMs = function (data, index) { return 86400000 * data[index]; };
/** @ignore */ var epochMillisecondsLongToMs = function (data, index) { return 4294967296 * (data[index + 1]) + (data[index] >>> 0); };
/** @ignore */ var epochMicrosecondsLongToMs = function (data, index) { return 4294967296 * (data[index + 1] / 1000) + ((data[index] >>> 0) / 1000); };
/** @ignore */ var epochNanosecondsLongToMs = function (data, index) { return 4294967296 * (data[index + 1] / 1000000) + ((data[index] >>> 0) / 1000000); };
/** @ignore */ var epochMillisecondsToDate = function (epochMs) { return new Date(epochMs); };
/** @ignore */ var epochDaysToDate = function (data, index) { return epochMillisecondsToDate(epochDaysToMs(data, index)); };
/** @ignore */ var epochMillisecondsLongToDate = function (data, index) { return epochMillisecondsToDate(epochMillisecondsLongToMs(data, index)); };
/** @ignore */
var getNull = function (_vector, _index) { return null; };
/** @ignore */
var getVariableWidthBytes = function (values, valueOffsets, index) {
    var _a = valueOffsets, _b = index, x = _a[_b], _c = index + 1, y = _a[_c];
    return x != null && y != null ? values.subarray(x, y) : null;
};
/** @ignore */
var getBool = function (_a, index) {
    var offset = _a.offset, values = _a.values;
    var idx = offset + index;
    var byte = values[idx >> 3];
    return (byte & 1 << (idx % 8)) !== 0;
};
/** @ignore */
var getDateDay = function (_a, index) {
    var values = _a.values;
    return epochDaysToDate(values, index);
};
/** @ignore */
var getDateMillisecond = function (_a, index) {
    var values = _a.values;
    return epochMillisecondsLongToDate(values, index * 2);
};
/** @ignore */
var getNumeric = function (_a, index) {
    var stride = _a.stride, values = _a.values;
    return values[stride * index];
};
/** @ignore */
var getFloat16 = function (_a, index) {
    var stride = _a.stride, values = _a.values;
    return math_1.uint16ToFloat64(values[stride * index]);
};
/** @ignore */
var getBigInts = function (_a, index) {
    var stride = _a.stride, values = _a.values, type = _a.type;
    return bn_1.BN.new(values.subarray(stride * index, stride * (index + 1)), type.isSigned);
};
/** @ignore */
var getFixedSizeBinary = function (_a, index) {
    var stride = _a.stride, values = _a.values;
    return values.subarray(stride * index, stride * (index + 1));
};
/** @ignore */
var getBinary = function (_a, index) {
    var values = _a.values, valueOffsets = _a.valueOffsets;
    return getVariableWidthBytes(values, valueOffsets, index);
};
/** @ignore */
var getUtf8 = function (_a, index) {
    var values = _a.values, valueOffsets = _a.valueOffsets;
    var bytes = getVariableWidthBytes(values, valueOffsets, index);
    return bytes !== null ? utf8_1.decodeUtf8(bytes) : null;
};
/* istanbul ignore next */
/** @ignore */
var getInt = function (vector, index) { return (vector.type.bitWidth < 64
    ? getNumeric(vector, index)
    : getBigInts(vector, index)); };
/* istanbul ignore next */
/** @ignore */
var getFloat = function (vector, index) { return (vector.type.precision !== enum_1.Precision.HALF
    ? getNumeric(vector, index)
    : getFloat16(vector, index)); };
/* istanbul ignore next */
/** @ignore */
var getDate = function (vector, index) { return (vector.type.unit === enum_1.DateUnit.DAY
    ? getDateDay(vector, index)
    : getDateMillisecond(vector, index)); };
/** @ignore */
var getTimestampSecond = function (_a, index) {
    var values = _a.values;
    return 1000 * epochMillisecondsLongToMs(values, index * 2);
};
/** @ignore */
var getTimestampMillisecond = function (_a, index) {
    var values = _a.values;
    return epochMillisecondsLongToMs(values, index * 2);
};
/** @ignore */
var getTimestampMicrosecond = function (_a, index) {
    var values = _a.values;
    return epochMicrosecondsLongToMs(values, index * 2);
};
/** @ignore */
var getTimestampNanosecond = function (_a, index) {
    var values = _a.values;
    return epochNanosecondsLongToMs(values, index * 2);
};
/* istanbul ignore next */
/** @ignore */
var getTimestamp = function (vector, index) {
    switch (vector.type.unit) {
        case enum_1.TimeUnit.SECOND: return getTimestampSecond(vector, index);
        case enum_1.TimeUnit.MILLISECOND: return getTimestampMillisecond(vector, index);
        case enum_1.TimeUnit.MICROSECOND: return getTimestampMicrosecond(vector, index);
        case enum_1.TimeUnit.NANOSECOND: return getTimestampNanosecond(vector, index);
    }
};
/** @ignore */
var getTimeSecond = function (_a, index) {
    var values = _a.values, stride = _a.stride;
    return values[stride * index];
};
/** @ignore */
var getTimeMillisecond = function (_a, index) {
    var values = _a.values, stride = _a.stride;
    return values[stride * index];
};
/** @ignore */
var getTimeMicrosecond = function (_a, index) {
    var values = _a.values;
    return bn_1.BN.signed(values.subarray(2 * index, 2 * (index + 1)));
};
/** @ignore */
var getTimeNanosecond = function (_a, index) {
    var values = _a.values;
    return bn_1.BN.signed(values.subarray(2 * index, 2 * (index + 1)));
};
/* istanbul ignore next */
/** @ignore */
var getTime = function (vector, index) {
    switch (vector.type.unit) {
        case enum_1.TimeUnit.SECOND: return getTimeSecond(vector, index);
        case enum_1.TimeUnit.MILLISECOND: return getTimeMillisecond(vector, index);
        case enum_1.TimeUnit.MICROSECOND: return getTimeMicrosecond(vector, index);
        case enum_1.TimeUnit.NANOSECOND: return getTimeNanosecond(vector, index);
    }
};
/** @ignore */
var getDecimal = function (_a, index) {
    var values = _a.values;
    return bn_1.BN.decimal(values.subarray(4 * index, 4 * (index + 1)));
};
/** @ignore */
var getList = function (vector, index) {
    var child = vector.getChildAt(0), valueOffsets = vector.valueOffsets, stride = vector.stride;
    return child.slice(valueOffsets[index * stride], valueOffsets[(index * stride) + 1]);
};
/** @ignore */
var getMap = function (vector, index) {
    return vector.bind(index);
};
/** @ignore */
var getStruct = function (vector, index) {
    return vector.bind(index);
};
/* istanbul ignore next */
/** @ignore */
var getUnion = function (vector, index) {
    return vector.type.mode === enum_1.UnionMode.Dense ?
        getDenseUnion(vector, index) :
        getSparseUnion(vector, index);
};
/** @ignore */
var getDenseUnion = function (vector, index) {
    var childIndex = vector.typeIdToChildIndex[vector.typeIds[index]];
    var child = vector.getChildAt(childIndex);
    return child ? child.get(vector.valueOffsets[index]) : null;
};
/** @ignore */
var getSparseUnion = function (vector, index) {
    var childIndex = vector.typeIdToChildIndex[vector.typeIds[index]];
    var child = vector.getChildAt(childIndex);
    return child ? child.get(index) : null;
};
/** @ignore */
var getDictionary = function (vector, index) {
    return vector.getValue(vector.getKey(index));
};
/* istanbul ignore next */
/** @ignore */
var getInterval = function (vector, index) {
    return (vector.type.unit === enum_1.IntervalUnit.DAY_TIME)
        ? getIntervalDayTime(vector, index)
        : getIntervalYearMonth(vector, index);
};
/** @ignore */
var getIntervalDayTime = function (_a, index) {
    var values = _a.values;
    return values.subarray(2 * index, 2 * (index + 1));
};
/** @ignore */
var getIntervalYearMonth = function (_a, index) {
    var values = _a.values;
    var interval = values[index];
    var int32s = new Int32Array(2);
    int32s[0] = interval / 12 | 0; /* years */
    int32s[1] = interval % 12 | 0; /* months */
    return int32s;
};
/** @ignore */
var getFixedSizeList = function (vector, index) {
    var child = vector.getChildAt(0), stride = vector.stride;
    return child.slice(index * stride, (index + 1) * stride);
};
GetVisitor.prototype.visitNull = getNull;
GetVisitor.prototype.visitBool = getBool;
GetVisitor.prototype.visitInt = getInt;
GetVisitor.prototype.visitInt8 = getNumeric;
GetVisitor.prototype.visitInt16 = getNumeric;
GetVisitor.prototype.visitInt32 = getNumeric;
GetVisitor.prototype.visitInt64 = getBigInts;
GetVisitor.prototype.visitUint8 = getNumeric;
GetVisitor.prototype.visitUint16 = getNumeric;
GetVisitor.prototype.visitUint32 = getNumeric;
GetVisitor.prototype.visitUint64 = getBigInts;
GetVisitor.prototype.visitFloat = getFloat;
GetVisitor.prototype.visitFloat16 = getFloat16;
GetVisitor.prototype.visitFloat32 = getNumeric;
GetVisitor.prototype.visitFloat64 = getNumeric;
GetVisitor.prototype.visitUtf8 = getUtf8;
GetVisitor.prototype.visitBinary = getBinary;
GetVisitor.prototype.visitFixedSizeBinary = getFixedSizeBinary;
GetVisitor.prototype.visitDate = getDate;
GetVisitor.prototype.visitDateDay = getDateDay;
GetVisitor.prototype.visitDateMillisecond = getDateMillisecond;
GetVisitor.prototype.visitTimestamp = getTimestamp;
GetVisitor.prototype.visitTimestampSecond = getTimestampSecond;
GetVisitor.prototype.visitTimestampMillisecond = getTimestampMillisecond;
GetVisitor.prototype.visitTimestampMicrosecond = getTimestampMicrosecond;
GetVisitor.prototype.visitTimestampNanosecond = getTimestampNanosecond;
GetVisitor.prototype.visitTime = getTime;
GetVisitor.prototype.visitTimeSecond = getTimeSecond;
GetVisitor.prototype.visitTimeMillisecond = getTimeMillisecond;
GetVisitor.prototype.visitTimeMicrosecond = getTimeMicrosecond;
GetVisitor.prototype.visitTimeNanosecond = getTimeNanosecond;
GetVisitor.prototype.visitDecimal = getDecimal;
GetVisitor.prototype.visitList = getList;
GetVisitor.prototype.visitStruct = getStruct;
GetVisitor.prototype.visitUnion = getUnion;
GetVisitor.prototype.visitDenseUnion = getDenseUnion;
GetVisitor.prototype.visitSparseUnion = getSparseUnion;
GetVisitor.prototype.visitDictionary = getDictionary;
GetVisitor.prototype.visitInterval = getInterval;
GetVisitor.prototype.visitIntervalDayTime = getIntervalDayTime;
GetVisitor.prototype.visitIntervalYearMonth = getIntervalYearMonth;
GetVisitor.prototype.visitFixedSizeList = getFixedSizeList;
GetVisitor.prototype.visitMap = getMap;
/** @ignore */
exports.instance = new GetVisitor();

//# sourceMappingURL=get.js.map
