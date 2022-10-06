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
exports.JSONTypeAssembler = void 0;
var tslib_1 = require("tslib");
var visitor_1 = require("../visitor");
var Schema_1 = require("../fb/Schema");
var enum_1 = require("../enum");
/** @ignore */
var JSONTypeAssembler = /** @class */ (function (_super) {
    tslib_1.__extends(JSONTypeAssembler, _super);
    function JSONTypeAssembler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONTypeAssembler.prototype.visit = function (node) {
        return node == null ? undefined : _super.prototype.visit.call(this, node);
    };
    JSONTypeAssembler.prototype.visitNull = function (_a) {
        var typeId = _a.typeId;
        return { 'name': Schema_1.Type[typeId].toLowerCase() };
    };
    JSONTypeAssembler.prototype.visitInt = function (_a) {
        var typeId = _a.typeId, bitWidth = _a.bitWidth, isSigned = _a.isSigned;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'bitWidth': bitWidth, 'isSigned': isSigned };
    };
    JSONTypeAssembler.prototype.visitFloat = function (_a) {
        var typeId = _a.typeId, precision = _a.precision;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'precision': enum_1.Precision[precision] };
    };
    JSONTypeAssembler.prototype.visitBinary = function (_a) {
        var typeId = _a.typeId;
        return { 'name': Schema_1.Type[typeId].toLowerCase() };
    };
    JSONTypeAssembler.prototype.visitBool = function (_a) {
        var typeId = _a.typeId;
        return { 'name': Schema_1.Type[typeId].toLowerCase() };
    };
    JSONTypeAssembler.prototype.visitUtf8 = function (_a) {
        var typeId = _a.typeId;
        return { 'name': Schema_1.Type[typeId].toLowerCase() };
    };
    JSONTypeAssembler.prototype.visitDecimal = function (_a) {
        var typeId = _a.typeId, scale = _a.scale, precision = _a.precision;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'scale': scale, 'precision': precision };
    };
    JSONTypeAssembler.prototype.visitDate = function (_a) {
        var typeId = _a.typeId, unit = _a.unit;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'unit': enum_1.DateUnit[unit] };
    };
    JSONTypeAssembler.prototype.visitTime = function (_a) {
        var typeId = _a.typeId, unit = _a.unit, bitWidth = _a.bitWidth;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'unit': enum_1.TimeUnit[unit], bitWidth: bitWidth };
    };
    JSONTypeAssembler.prototype.visitTimestamp = function (_a) {
        var typeId = _a.typeId, timezone = _a.timezone, unit = _a.unit;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'unit': enum_1.TimeUnit[unit], timezone: timezone };
    };
    JSONTypeAssembler.prototype.visitInterval = function (_a) {
        var typeId = _a.typeId, unit = _a.unit;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'unit': enum_1.IntervalUnit[unit] };
    };
    JSONTypeAssembler.prototype.visitList = function (_a) {
        var typeId = _a.typeId;
        return { 'name': Schema_1.Type[typeId].toLowerCase() };
    };
    JSONTypeAssembler.prototype.visitStruct = function (_a) {
        var typeId = _a.typeId;
        return { 'name': Schema_1.Type[typeId].toLowerCase() };
    };
    JSONTypeAssembler.prototype.visitUnion = function (_a) {
        var typeId = _a.typeId, mode = _a.mode, typeIds = _a.typeIds;
        return {
            'name': Schema_1.Type[typeId].toLowerCase(),
            'mode': enum_1.UnionMode[mode],
            'typeIds': tslib_1.__spread(typeIds)
        };
    };
    JSONTypeAssembler.prototype.visitDictionary = function (node) {
        return this.visit(node.dictionary);
    };
    JSONTypeAssembler.prototype.visitFixedSizeBinary = function (_a) {
        var typeId = _a.typeId, byteWidth = _a.byteWidth;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'byteWidth': byteWidth };
    };
    JSONTypeAssembler.prototype.visitFixedSizeList = function (_a) {
        var typeId = _a.typeId, listSize = _a.listSize;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'listSize': listSize };
    };
    JSONTypeAssembler.prototype.visitMap = function (_a) {
        var typeId = _a.typeId, keysSorted = _a.keysSorted;
        return { 'name': Schema_1.Type[typeId].toLowerCase(), 'keysSorted': keysSorted };
    };
    return JSONTypeAssembler;
}(visitor_1.Visitor));
exports.JSONTypeAssembler = JSONTypeAssembler;

//# sourceMappingURL=jsontypeassembler.js.map
