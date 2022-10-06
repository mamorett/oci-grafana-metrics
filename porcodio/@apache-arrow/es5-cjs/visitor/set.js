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
exports.instance = exports.SetVisitor = void 0;
var tslib_1 = require("tslib");
var vector_1 = require("../vector");
var visitor_1 = require("../visitor");
var utf8_1 = require("../util/utf8");
var math_1 = require("../util/math");
var buffer_1 = require("../util/buffer");
var enum_1 = require("../enum");
/** @ignore */
var SetVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SetVisitor, _super);
    function SetVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SetVisitor;
}(visitor_1.Visitor));
exports.SetVisitor = SetVisitor;
/** @ignore */
var setEpochMsToDays = function (data, index, epochMs) { data[index] = (epochMs / 86400000) | 0; };
/** @ignore */
var setEpochMsToMillisecondsLong = function (data, index, epochMs) {
    data[index] = (epochMs % 4294967296) | 0;
    data[index + 1] = (epochMs / 4294967296) | 0;
};
/** @ignore */
var setEpochMsToMicrosecondsLong = function (data, index, epochMs) {
    data[index] = ((epochMs * 1000) % 4294967296) | 0;
    data[index + 1] = ((epochMs * 1000) / 4294967296) | 0;
};
/** @ignore */
var setEpochMsToNanosecondsLong = function (data, index, epochMs) {
    data[index] = ((epochMs * 1000000) % 4294967296) | 0;
    data[index + 1] = ((epochMs * 1000000) / 4294967296) | 0;
};
/** @ignore */
var setVariableWidthBytes = function (values, valueOffsets, index, value) {
    var _a = valueOffsets, _b = index, x = _a[_b], _c = index + 1, y = _a[_c];
    if (x != null && y != null) {
        values.set(value.subarray(0, y - x), x);
    }
};
/** @ignore */
var setBool = function (_a, index, val) {
    var offset = _a.offset, values = _a.values;
    var idx = offset + index;
    val ? (values[idx >> 3] |= (1 << (idx % 8))) // true
        : (values[idx >> 3] &= ~(1 << (idx % 8))); // false
};
/** @ignore */
var setDateDay = function (_a, index, value) {
    var values = _a.values;
    setEpochMsToDays(values, index, value.valueOf());
};
/** @ignore */
var setDateMillisecond = function (_a, index, value) {
    var values = _a.values;
    setEpochMsToMillisecondsLong(values, index * 2, value.valueOf());
};
/** @ignore */
var setNumeric = function (_a, index, value) {
    var stride = _a.stride, values = _a.values;
    values[stride * index] = value;
};
/** @ignore */
var setFloat16 = function (_a, index, value) {
    var stride = _a.stride, values = _a.values;
    values[stride * index] = math_1.float64ToUint16(value);
};
/** @ignore */
var setNumericX2 = function (vector, index, value) {
    switch (typeof value) {
        case 'bigint':
            vector.values64[index] = value;
            break;
        case 'number':
            vector.values[index * vector.stride] = value;
            break;
        default: {
            var val = value;
            var stride = vector.stride, ArrayType = vector.ArrayType;
            var long = buffer_1.toArrayBufferView(ArrayType, val);
            vector.values.set(long.subarray(0, stride), stride * index);
        }
    }
};
/** @ignore */
var setFixedSizeBinary = function (_a, index, value) {
    var stride = _a.stride, values = _a.values;
    values.set(value.subarray(0, stride), stride * index);
};
/** @ignore */
var setBinary = function (_a, index, value) {
    var values = _a.values, valueOffsets = _a.valueOffsets;
    return setVariableWidthBytes(values, valueOffsets, index, value);
};
/** @ignore */
var setUtf8 = function (_a, index, value) {
    var values = _a.values, valueOffsets = _a.valueOffsets;
    setVariableWidthBytes(values, valueOffsets, index, utf8_1.encodeUtf8(value));
};
/* istanbul ignore next */
/** @ignore */
var setInt = function (vector, index, value) {
    vector.type.bitWidth < 64
        ? setNumeric(vector, index, value)
        : setNumericX2(vector, index, value);
};
/* istanbul ignore next */
/** @ignore */
var setFloat = function (vector, index, value) {
    vector.type.precision !== enum_1.Precision.HALF
        ? setNumeric(vector, index, value)
        : setFloat16(vector, index, value);
};
/* istanbul ignore next */
var setDate = function (vector, index, value) {
    vector.type.unit === enum_1.DateUnit.DAY
        ? setDateDay(vector, index, value)
        : setDateMillisecond(vector, index, value);
};
/** @ignore */
var setTimestampSecond = function (_a, index, value) {
    var values = _a.values;
    return setEpochMsToMillisecondsLong(values, index * 2, value / 1000);
};
/** @ignore */
var setTimestampMillisecond = function (_a, index, value) {
    var values = _a.values;
    return setEpochMsToMillisecondsLong(values, index * 2, value);
};
/** @ignore */
var setTimestampMicrosecond = function (_a, index, value) {
    var values = _a.values;
    return setEpochMsToMicrosecondsLong(values, index * 2, value);
};
/** @ignore */
var setTimestampNanosecond = function (_a, index, value) {
    var values = _a.values;
    return setEpochMsToNanosecondsLong(values, index * 2, value);
};
/* istanbul ignore next */
/** @ignore */
var setTimestamp = function (vector, index, value) {
    switch (vector.type.unit) {
        case enum_1.TimeUnit.SECOND: return setTimestampSecond(vector, index, value);
        case enum_1.TimeUnit.MILLISECOND: return setTimestampMillisecond(vector, index, value);
        case enum_1.TimeUnit.MICROSECOND: return setTimestampMicrosecond(vector, index, value);
        case enum_1.TimeUnit.NANOSECOND: return setTimestampNanosecond(vector, index, value);
    }
};
/** @ignore */
var setTimeSecond = function (_a, index, value) {
    var values = _a.values, stride = _a.stride;
    values[stride * index] = value;
};
/** @ignore */
var setTimeMillisecond = function (_a, index, value) {
    var values = _a.values, stride = _a.stride;
    values[stride * index] = value;
};
/** @ignore */
var setTimeMicrosecond = function (_a, index, value) {
    var values = _a.values;
    values.set(value.subarray(0, 2), 2 * index);
};
/** @ignore */
var setTimeNanosecond = function (_a, index, value) {
    var values = _a.values;
    values.set(value.subarray(0, 2), 2 * index);
};
/* istanbul ignore next */
/** @ignore */
var setTime = function (vector, index, value) {
    switch (vector.type.unit) {
        case enum_1.TimeUnit.SECOND: return setTimeSecond(vector, index, value);
        case enum_1.TimeUnit.MILLISECOND: return setTimeMillisecond(vector, index, value);
        case enum_1.TimeUnit.MICROSECOND: return setTimeMicrosecond(vector, index, value);
        case enum_1.TimeUnit.NANOSECOND: return setTimeNanosecond(vector, index, value);
    }
};
/** @ignore */
var setDecimal = function (_a, index, value) {
    var values = _a.values;
    values.set(value.subarray(0, 4), 4 * index);
};
/** @ignore */
var setList = function (vector, index, value) {
    var values = vector.getChildAt(0), valueOffsets = vector.valueOffsets;
    for (var idx = -1, itr = valueOffsets[index], end = valueOffsets[index + 1]; itr < end;) {
        values.set(itr++, value.get(++idx));
    }
};
/** @ignore */
var setMap = function (vector, index, value) {
    var values = vector.getChildAt(0), valueOffsets = vector.valueOffsets;
    var entries = value instanceof Map ? tslib_1.__spread(value) : Object.entries(value);
    for (var idx = -1, itr = valueOffsets[index], end = valueOffsets[index + 1]; itr < end;) {
        values.set(itr++, entries[++idx]);
    }
};
/** @ignore */ var _setStructArrayValue = function (o, v) { return function (c, _, i) { return c && c.set(o, v[i]); }; };
/** @ignore */ var _setStructVectorValue = function (o, v) { return function (c, _, i) { return c && c.set(o, v.get(i)); }; };
/** @ignore */ var _setStructMapValue = function (o, v) { return function (c, f, _) { return c && c.set(o, v.get(f.name)); }; };
/** @ignore */ var _setStructObjectValue = function (o, v) { return function (c, f, _) { return c && c.set(o, v[f.name]); }; };
/** @ignore */
var setStruct = function (vector, index, value) {
    var setValue = value instanceof Map ? _setStructMapValue(index, value) :
        value instanceof vector_1.Vector ? _setStructVectorValue(index, value) :
            Array.isArray(value) ? _setStructArrayValue(index, value) :
                _setStructObjectValue(index, value);
    vector.type.children.forEach(function (f, i) { return setValue(vector.getChildAt(i), f, i); });
};
/* istanbul ignore next */
/** @ignore */
var setUnion = function (vector, index, value) {
    vector.type.mode === enum_1.UnionMode.Dense ?
        setDenseUnion(vector, index, value) :
        setSparseUnion(vector, index, value);
};
/** @ignore */
var setDenseUnion = function (vector, index, value) {
    var childIndex = vector.typeIdToChildIndex[vector.typeIds[index]];
    var child = vector.getChildAt(childIndex);
    child && child.set(vector.valueOffsets[index], value);
};
/** @ignore */
var setSparseUnion = function (vector, index, value) {
    var childIndex = vector.typeIdToChildIndex[vector.typeIds[index]];
    var child = vector.getChildAt(childIndex);
    child && child.set(index, value);
};
/** @ignore */
var setDictionary = function (vector, index, value) {
    var key = vector.getKey(index);
    if (key !== null) {
        vector.setValue(key, value);
    }
};
/* istanbul ignore next */
/** @ignore */
var setIntervalValue = function (vector, index, value) {
    (vector.type.unit === enum_1.IntervalUnit.DAY_TIME)
        ? setIntervalDayTime(vector, index, value)
        : setIntervalYearMonth(vector, index, value);
};
/** @ignore */
var setIntervalDayTime = function (_a, index, value) {
    var values = _a.values;
    values.set(value.subarray(0, 2), 2 * index);
};
/** @ignore */
var setIntervalYearMonth = function (_a, index, value) {
    var values = _a.values;
    values[index] = (value[0] * 12) + (value[1] % 12);
};
/** @ignore */
var setFixedSizeList = function (vector, index, value) {
    var child = vector.getChildAt(0), stride = vector.stride;
    for (var idx = -1, offset = index * stride; ++idx < stride;) {
        child.set(offset + idx, value.get(idx));
    }
};
SetVisitor.prototype.visitBool = setBool;
SetVisitor.prototype.visitInt = setInt;
SetVisitor.prototype.visitInt8 = setNumeric;
SetVisitor.prototype.visitInt16 = setNumeric;
SetVisitor.prototype.visitInt32 = setNumeric;
SetVisitor.prototype.visitInt64 = setNumericX2;
SetVisitor.prototype.visitUint8 = setNumeric;
SetVisitor.prototype.visitUint16 = setNumeric;
SetVisitor.prototype.visitUint32 = setNumeric;
SetVisitor.prototype.visitUint64 = setNumericX2;
SetVisitor.prototype.visitFloat = setFloat;
SetVisitor.prototype.visitFloat16 = setFloat16;
SetVisitor.prototype.visitFloat32 = setNumeric;
SetVisitor.prototype.visitFloat64 = setNumeric;
SetVisitor.prototype.visitUtf8 = setUtf8;
SetVisitor.prototype.visitBinary = setBinary;
SetVisitor.prototype.visitFixedSizeBinary = setFixedSizeBinary;
SetVisitor.prototype.visitDate = setDate;
SetVisitor.prototype.visitDateDay = setDateDay;
SetVisitor.prototype.visitDateMillisecond = setDateMillisecond;
SetVisitor.prototype.visitTimestamp = setTimestamp;
SetVisitor.prototype.visitTimestampSecond = setTimestampSecond;
SetVisitor.prototype.visitTimestampMillisecond = setTimestampMillisecond;
SetVisitor.prototype.visitTimestampMicrosecond = setTimestampMicrosecond;
SetVisitor.prototype.visitTimestampNanosecond = setTimestampNanosecond;
SetVisitor.prototype.visitTime = setTime;
SetVisitor.prototype.visitTimeSecond = setTimeSecond;
SetVisitor.prototype.visitTimeMillisecond = setTimeMillisecond;
SetVisitor.prototype.visitTimeMicrosecond = setTimeMicrosecond;
SetVisitor.prototype.visitTimeNanosecond = setTimeNanosecond;
SetVisitor.prototype.visitDecimal = setDecimal;
SetVisitor.prototype.visitList = setList;
SetVisitor.prototype.visitStruct = setStruct;
SetVisitor.prototype.visitUnion = setUnion;
SetVisitor.prototype.visitDenseUnion = setDenseUnion;
SetVisitor.prototype.visitSparseUnion = setSparseUnion;
SetVisitor.prototype.visitDictionary = setDictionary;
SetVisitor.prototype.visitInterval = setIntervalValue;
SetVisitor.prototype.visitIntervalDayTime = setIntervalDayTime;
SetVisitor.prototype.visitIntervalYearMonth = setIntervalYearMonth;
SetVisitor.prototype.visitFixedSizeList = setFixedSizeList;
SetVisitor.prototype.visitMap = setMap;
/** @ignore */
exports.instance = new SetVisitor();

//# sourceMappingURL=set.js.map
