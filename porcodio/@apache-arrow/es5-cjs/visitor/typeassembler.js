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
exports.instance = exports.TypeAssembler = void 0;
var tslib_1 = require("tslib");
var flatbuffers_1 = require("flatbuffers");
var Long = flatbuffers_1.flatbuffers.Long;
var visitor_1 = require("../visitor");
var Schema_1 = require("../fb/Schema");
/** @ignore */
var TypeAssembler = /** @class */ (function (_super) {
    tslib_1.__extends(TypeAssembler, _super);
    function TypeAssembler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeAssembler.prototype.visit = function (node, builder) {
        return (node == null || builder == null) ? undefined : _super.prototype.visit.call(this, node, builder);
    };
    TypeAssembler.prototype.visitNull = function (_node, b) {
        Schema_1.Null.startNull(b);
        return Schema_1.Null.endNull(b);
    };
    TypeAssembler.prototype.visitInt = function (node, b) {
        Schema_1.Int.startInt(b);
        Schema_1.Int.addBitWidth(b, node.bitWidth);
        Schema_1.Int.addIsSigned(b, node.isSigned);
        return Schema_1.Int.endInt(b);
    };
    TypeAssembler.prototype.visitFloat = function (node, b) {
        Schema_1.FloatingPoint.startFloatingPoint(b);
        Schema_1.FloatingPoint.addPrecision(b, node.precision);
        return Schema_1.FloatingPoint.endFloatingPoint(b);
    };
    TypeAssembler.prototype.visitBinary = function (_node, b) {
        Schema_1.Binary.startBinary(b);
        return Schema_1.Binary.endBinary(b);
    };
    TypeAssembler.prototype.visitBool = function (_node, b) {
        Schema_1.Bool.startBool(b);
        return Schema_1.Bool.endBool(b);
    };
    TypeAssembler.prototype.visitUtf8 = function (_node, b) {
        Schema_1.Utf8.startUtf8(b);
        return Schema_1.Utf8.endUtf8(b);
    };
    TypeAssembler.prototype.visitDecimal = function (node, b) {
        Schema_1.Decimal.startDecimal(b);
        Schema_1.Decimal.addScale(b, node.scale);
        Schema_1.Decimal.addPrecision(b, node.precision);
        return Schema_1.Decimal.endDecimal(b);
    };
    TypeAssembler.prototype.visitDate = function (node, b) {
        Schema_1.Date.startDate(b);
        Schema_1.Date.addUnit(b, node.unit);
        return Schema_1.Date.endDate(b);
    };
    TypeAssembler.prototype.visitTime = function (node, b) {
        Schema_1.Time.startTime(b);
        Schema_1.Time.addUnit(b, node.unit);
        Schema_1.Time.addBitWidth(b, node.bitWidth);
        return Schema_1.Time.endTime(b);
    };
    TypeAssembler.prototype.visitTimestamp = function (node, b) {
        var timezone = (node.timezone && b.createString(node.timezone)) || undefined;
        Schema_1.Timestamp.startTimestamp(b);
        Schema_1.Timestamp.addUnit(b, node.unit);
        if (timezone !== undefined) {
            Schema_1.Timestamp.addTimezone(b, timezone);
        }
        return Schema_1.Timestamp.endTimestamp(b);
    };
    TypeAssembler.prototype.visitInterval = function (node, b) {
        Schema_1.Interval.startInterval(b);
        Schema_1.Interval.addUnit(b, node.unit);
        return Schema_1.Interval.endInterval(b);
    };
    TypeAssembler.prototype.visitList = function (_node, b) {
        Schema_1.List.startList(b);
        return Schema_1.List.endList(b);
    };
    TypeAssembler.prototype.visitStruct = function (_node, b) {
        Schema_1.Struct_.startStruct_(b);
        return Schema_1.Struct_.endStruct_(b);
    };
    TypeAssembler.prototype.visitUnion = function (node, b) {
        Schema_1.Union.startTypeIdsVector(b, node.typeIds.length);
        var typeIds = Schema_1.Union.createTypeIdsVector(b, node.typeIds);
        Schema_1.Union.startUnion(b);
        Schema_1.Union.addMode(b, node.mode);
        Schema_1.Union.addTypeIds(b, typeIds);
        return Schema_1.Union.endUnion(b);
    };
    TypeAssembler.prototype.visitDictionary = function (node, b) {
        var indexType = this.visit(node.indices, b);
        Schema_1.DictionaryEncoding.startDictionaryEncoding(b);
        Schema_1.DictionaryEncoding.addId(b, new Long(node.id, 0));
        Schema_1.DictionaryEncoding.addIsOrdered(b, node.isOrdered);
        if (indexType !== undefined) {
            Schema_1.DictionaryEncoding.addIndexType(b, indexType);
        }
        return Schema_1.DictionaryEncoding.endDictionaryEncoding(b);
    };
    TypeAssembler.prototype.visitFixedSizeBinary = function (node, b) {
        Schema_1.FixedSizeBinary.startFixedSizeBinary(b);
        Schema_1.FixedSizeBinary.addByteWidth(b, node.byteWidth);
        return Schema_1.FixedSizeBinary.endFixedSizeBinary(b);
    };
    TypeAssembler.prototype.visitFixedSizeList = function (node, b) {
        Schema_1.FixedSizeList.startFixedSizeList(b);
        Schema_1.FixedSizeList.addListSize(b, node.listSize);
        return Schema_1.FixedSizeList.endFixedSizeList(b);
    };
    TypeAssembler.prototype.visitMap = function (node, b) {
        Schema_1.Map.startMap(b);
        Schema_1.Map.addKeysSorted(b, node.keysSorted);
        return Schema_1.Map.endMap(b);
    };
    return TypeAssembler;
}(visitor_1.Visitor));
exports.TypeAssembler = TypeAssembler;
/** @ignore */
exports.instance = new TypeAssembler();

//# sourceMappingURL=typeassembler.js.map
