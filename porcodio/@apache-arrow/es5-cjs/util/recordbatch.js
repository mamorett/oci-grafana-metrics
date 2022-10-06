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
exports.distributeVectorsIntoRecordBatches = exports.distributeColumnsIntoRecordBatches = exports.ensureSameLengthData = void 0;
var tslib_1 = require("tslib");
var data_1 = require("../data");
var schema_1 = require("../schema");
var chunked_1 = require("../vector/chunked");
var recordbatch_1 = require("../recordbatch");
var noopBuf = new Uint8Array(0);
var nullBufs = function (bitmapLength) { return [
    noopBuf, noopBuf, new Uint8Array(bitmapLength), noopBuf
]; };
/** @ignore */
function ensureSameLengthData(schema, chunks, batchLength) {
    if (batchLength === void 0) { batchLength = chunks.reduce(function (l, c) { return Math.max(l, c.length); }, 0); }
    var data;
    var field;
    var i = -1;
    var n = chunks.length;
    var fields = tslib_1.__spread(schema.fields);
    var batchData = [];
    var bitmapLength = ((batchLength + 63) & ~63) >> 3;
    while (++i < n) {
        if ((data = chunks[i]) && data.length === batchLength) {
            batchData[i] = data;
        }
        else {
            (field = fields[i]).nullable || (fields[i] = fields[i].clone({ nullable: true }));
            batchData[i] = data ? data._changeLengthAndBackfillNullBitmap(batchLength)
                : data_1.Data.new(field.type, 0, batchLength, batchLength, nullBufs(bitmapLength));
        }
    }
    return [new schema_1.Schema(fields), batchLength, batchData];
}
exports.ensureSameLengthData = ensureSameLengthData;
/** @ignore */
function distributeColumnsIntoRecordBatches(columns) {
    return distributeVectorsIntoRecordBatches(new schema_1.Schema(columns.map(function (_a) {
        var field = _a.field;
        return field;
    })), columns);
}
exports.distributeColumnsIntoRecordBatches = distributeColumnsIntoRecordBatches;
/** @ignore */
function distributeVectorsIntoRecordBatches(schema, vecs) {
    return uniformlyDistributeChunksAcrossRecordBatches(schema, vecs.map(function (v) { return v instanceof chunked_1.Chunked ? v.chunks.map(function (c) { return c.data; }) : [v.data]; }));
}
exports.distributeVectorsIntoRecordBatches = distributeVectorsIntoRecordBatches;
/** @ignore */
function uniformlyDistributeChunksAcrossRecordBatches(schema, columns) {
    var fields = tslib_1.__spread(schema.fields);
    var batchArgs = [];
    var memo = { numBatches: columns.reduce(function (n, c) { return Math.max(n, c.length); }, 0) };
    var numBatches = 0, batchLength = 0;
    var i = -1;
    var numColumns = columns.length;
    var child, childData = [];
    while (memo.numBatches-- > 0) {
        for (batchLength = Number.POSITIVE_INFINITY, i = -1; ++i < numColumns;) {
            childData[i] = child = columns[i].shift();
            batchLength = Math.min(batchLength, child ? child.length : batchLength);
        }
        if (isFinite(batchLength)) {
            childData = distributeChildData(fields, batchLength, childData, columns, memo);
            if (batchLength > 0) {
                batchArgs[numBatches++] = [batchLength, childData.slice()];
            }
        }
    }
    return [
        schema = new schema_1.Schema(fields, schema.metadata),
        batchArgs.map(function (xs) { return new (recordbatch_1.RecordBatch.bind.apply(recordbatch_1.RecordBatch, tslib_1.__spread([void 0, schema], xs)))(); })
    ];
}
/** @ignore */
function distributeChildData(fields, batchLength, childData, columns, memo) {
    var data;
    var field;
    var length = 0, i = -1;
    var n = columns.length;
    var bitmapLength = ((batchLength + 63) & ~63) >> 3;
    while (++i < n) {
        if ((data = childData[i]) && ((length = data.length) >= batchLength)) {
            if (length === batchLength) {
                childData[i] = data;
            }
            else {
                childData[i] = data.slice(0, batchLength);
                data = data.slice(batchLength, length - batchLength);
                memo.numBatches = Math.max(memo.numBatches, columns[i].unshift(data));
            }
        }
        else {
            (field = fields[i]).nullable || (fields[i] = field.clone({ nullable: true }));
            childData[i] = data ? data._changeLengthAndBackfillNullBitmap(batchLength)
                : data_1.Data.new(field.type, 0, batchLength, batchLength, nullBufs(bitmapLength));
        }
    }
    return childData;
}

//# sourceMappingURL=recordbatch.js.map
