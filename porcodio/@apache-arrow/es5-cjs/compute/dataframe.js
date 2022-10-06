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
exports.FilteredDataFrame = exports.CountByResult = exports.DataFrame = void 0;
var tslib_1 = require("tslib");
var table_1 = require("../table");
var int_1 = require("../vector/int");
var schema_1 = require("../schema");
var predicate_1 = require("./predicate");
var recordbatch_1 = require("../recordbatch");
var type_1 = require("../type");
table_1.Table.prototype.countBy = function (name) { return new DataFrame(this.chunks).countBy(name); };
table_1.Table.prototype.scan = function (next, bind) { return new DataFrame(this.chunks).scan(next, bind); };
table_1.Table.prototype.scanReverse = function (next, bind) { return new DataFrame(this.chunks).scanReverse(next, bind); };
table_1.Table.prototype.filter = function (predicate) { return new DataFrame(this.chunks).filter(predicate); };
var DataFrame = /** @class */ (function (_super) {
    tslib_1.__extends(DataFrame, _super);
    function DataFrame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataFrame.prototype.filter = function (predicate) {
        return new FilteredDataFrame(this.chunks, predicate);
    };
    DataFrame.prototype.scan = function (next, bind) {
        var batches = this.chunks, numBatches = batches.length;
        for (var batchIndex = -1; ++batchIndex < numBatches;) {
            // load batches
            var batch = batches[batchIndex];
            if (bind) {
                bind(batch);
            }
            // yield all indices
            for (var index = -1, numRows = batch.length; ++index < numRows;) {
                next(index, batch);
            }
        }
    };
    DataFrame.prototype.scanReverse = function (next, bind) {
        var batches = this.chunks, numBatches = batches.length;
        for (var batchIndex = numBatches; --batchIndex >= 0;) {
            // load batches
            var batch = batches[batchIndex];
            if (bind) {
                bind(batch);
            }
            // yield all indices
            for (var index = batch.length; --index >= 0;) {
                next(index, batch);
            }
        }
    };
    DataFrame.prototype.countBy = function (name) {
        var batches = this.chunks, numBatches = batches.length;
        var count_by = typeof name === 'string' ? new predicate_1.Col(name) : name;
        // Assume that all dictionary batches are deltas, which means that the
        // last record batch has the most complete dictionary
        count_by.bind(batches[numBatches - 1]);
        var vector = count_by.vector;
        if (!type_1.DataType.isDictionary(vector.type)) {
            throw new Error('countBy currently only supports dictionary-encoded columns');
        }
        var countByteLength = Math.ceil(Math.log(vector.length) / Math.log(256));
        var CountsArrayType = countByteLength == 4 ? Uint32Array :
            countByteLength >= 2 ? Uint16Array : Uint8Array;
        var counts = new CountsArrayType(vector.dictionary.length);
        for (var batchIndex = -1; ++batchIndex < numBatches;) {
            // load batches
            var batch = batches[batchIndex];
            // rebind the countBy Col
            count_by.bind(batch);
            var keys = count_by.vector.indices;
            // yield all indices
            for (var index = -1, numRows = batch.length; ++index < numRows;) {
                var key = keys.get(index);
                if (key !== null) {
                    counts[key]++;
                }
            }
        }
        return new CountByResult(vector.dictionary, int_1.IntVector.from(counts));
    };
    return DataFrame;
}(table_1.Table));
exports.DataFrame = DataFrame;
/** @ignore */
var CountByResult = /** @class */ (function (_super) {
    tslib_1.__extends(CountByResult, _super);
    function CountByResult(values, counts) {
        var _this = this;
        var schema = new schema_1.Schema([
            new schema_1.Field('values', values.type),
            new schema_1.Field('counts', counts.type)
        ]);
        _this = _super.call(this, new recordbatch_1.RecordBatch(schema, counts.length, [values, counts])) || this;
        return _this;
    }
    CountByResult.prototype.toJSON = function () {
        var values = this.getColumnAt(0);
        var counts = this.getColumnAt(1);
        var result = {};
        for (var i = -1; ++i < this.length;) {
            result[values.get(i)] = counts.get(i);
        }
        return result;
    };
    return CountByResult;
}(table_1.Table));
exports.CountByResult = CountByResult;
/** @ignore */
var FilteredBatchIterator = /** @class */ (function () {
    function FilteredBatchIterator(batches, predicate) {
        this.batches = batches;
        this.predicate = predicate;
        this.batchIndex = 0;
        this.index = 0;
        // TODO: bind batches lazily
        // If predicate doesn't match anything in the batch we don't need
        // to bind the callback
        this.batch = this.batches[this.batchIndex];
        this.predicateFunc = this.predicate.bind(this.batch);
    }
    FilteredBatchIterator.prototype.next = function () {
        while (this.batchIndex < this.batches.length) {
            while (this.index < this.batch.length) {
                if (this.predicateFunc(this.index, this.batch)) {
                    return {
                        value: this.batch.get(this.index++),
                    };
                }
                this.index++;
            }
            if (++this.batchIndex < this.batches.length) {
                this.index = 0;
                this.batch = this.batches[this.batchIndex];
                this.predicateFunc = this.predicate.bind(this.batch);
            }
        }
        return { done: true, value: null };
    };
    FilteredBatchIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return FilteredBatchIterator;
}());
/** @ignore */
var FilteredDataFrame = /** @class */ (function (_super) {
    tslib_1.__extends(FilteredDataFrame, _super);
    function FilteredDataFrame(batches, predicate) {
        var _this = _super.call(this, batches) || this;
        _this._predicate = predicate;
        return _this;
    }
    FilteredDataFrame.prototype.scan = function (next, bind) {
        // inlined version of this:
        // this.parent.scan((idx, columns) => {
        //     if (this.predicate(idx, columns)) next(idx, columns);
        // });
        var batches = this._chunks;
        var numBatches = batches.length;
        for (var batchIndex = -1; ++batchIndex < numBatches;) {
            // load batches
            var batch = batches[batchIndex];
            var predicate = this._predicate.bind(batch);
            var isBound = false;
            // yield all indices
            for (var index = -1, numRows = batch.length; ++index < numRows;) {
                if (predicate(index, batch)) {
                    // bind batches lazily - if predicate doesn't match anything
                    // in the batch we don't need to call bind on the batch
                    if (bind && !isBound) {
                        bind(batch);
                        isBound = true;
                    }
                    next(index, batch);
                }
            }
        }
    };
    FilteredDataFrame.prototype.scanReverse = function (next, bind) {
        var batches = this._chunks;
        var numBatches = batches.length;
        for (var batchIndex = numBatches; --batchIndex >= 0;) {
            // load batches
            var batch = batches[batchIndex];
            var predicate = this._predicate.bind(batch);
            var isBound = false;
            // yield all indices
            for (var index = batch.length; --index >= 0;) {
                if (predicate(index, batch)) {
                    // bind batches lazily - if predicate doesn't match anything
                    // in the batch we don't need to call bind on the batch
                    if (bind && !isBound) {
                        bind(batch);
                        isBound = true;
                    }
                    next(index, batch);
                }
            }
        }
    };
    FilteredDataFrame.prototype.count = function () {
        // inlined version of this:
        // let sum = 0;
        // this.parent.scan((idx, columns) => {
        //     if (this.predicate(idx, columns)) ++sum;
        // });
        // return sum;
        var sum = 0;
        var batches = this._chunks;
        var numBatches = batches.length;
        for (var batchIndex = -1; ++batchIndex < numBatches;) {
            // load batches
            var batch = batches[batchIndex];
            var predicate = this._predicate.bind(batch);
            for (var index = -1, numRows = batch.length; ++index < numRows;) {
                if (predicate(index, batch)) {
                    ++sum;
                }
            }
        }
        return sum;
    };
    FilteredDataFrame.prototype[Symbol.iterator] = function () {
        // inlined version of this:
        // this.parent.scan((idx, columns) => {
        //     if (this.predicate(idx, columns)) next(idx, columns);
        // });
        return new FilteredBatchIterator(this._chunks, this._predicate);
    };
    FilteredDataFrame.prototype.filter = function (predicate) {
        return new FilteredDataFrame(this._chunks, this._predicate.and(predicate));
    };
    FilteredDataFrame.prototype.countBy = function (name) {
        var batches = this._chunks, numBatches = batches.length;
        var count_by = typeof name === 'string' ? new predicate_1.Col(name) : name;
        // Assume that all dictionary batches are deltas, which means that the
        // last record batch has the most complete dictionary
        count_by.bind(batches[numBatches - 1]);
        var vector = count_by.vector;
        if (!type_1.DataType.isDictionary(vector.type)) {
            throw new Error('countBy currently only supports dictionary-encoded columns');
        }
        var countByteLength = Math.ceil(Math.log(vector.length) / Math.log(256));
        var CountsArrayType = countByteLength == 4 ? Uint32Array :
            countByteLength >= 2 ? Uint16Array : Uint8Array;
        var counts = new CountsArrayType(vector.dictionary.length);
        for (var batchIndex = -1; ++batchIndex < numBatches;) {
            // load batches
            var batch = batches[batchIndex];
            var predicate = this._predicate.bind(batch);
            // rebind the countBy Col
            count_by.bind(batch);
            var keys = count_by.vector.indices;
            // yield all indices
            for (var index = -1, numRows = batch.length; ++index < numRows;) {
                var key = keys.get(index);
                if (key !== null && predicate(index, batch)) {
                    counts[key]++;
                }
            }
        }
        return new CountByResult(vector.dictionary, int_1.IntVector.from(counts));
    };
    return FilteredDataFrame;
}(DataFrame));
exports.FilteredDataFrame = FilteredDataFrame;

//# sourceMappingURL=dataframe.js.map
