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
exports._InternalEmptyPlaceholderRecordBatch = exports.RecordBatch = void 0;
var tslib_1 = require("tslib");
var data_1 = require("./data");
var table_1 = require("./table");
var vector_1 = require("./vector");
var visitor_1 = require("./visitor");
var schema_1 = require("./schema");
var compat_1 = require("./util/compat");
var chunked_1 = require("./vector/chunked");
var args_1 = require("./util/args");
var type_1 = require("./type");
var recordbatch_1 = require("./util/recordbatch");
var index_1 = require("./vector/index");
var RecordBatch = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatch, _super);
    function RecordBatch() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        var data;
        var schema = args[0];
        var children;
        if (args[1] instanceof data_1.Data) {
            _a = tslib_1.__read(args, 3), data = _a[1], children = _a[2];
        }
        else {
            var fields = schema.fields;
            var _b = tslib_1.__read(args, 3), length_1 = _b[1], childData = _b[2];
            data = data_1.Data.Struct(new type_1.Struct(fields), 0, length_1, 0, null, childData);
        }
        _this = _super.call(this, data, children) || this;
        _this._schema = schema;
        return _this;
    }
    /** @nocollapse */
    RecordBatch.from = function (options) {
        if (compat_1.isIterable(options['values'])) {
            return table_1.Table.from(options);
        }
        return table_1.Table.from(options);
    };
    /** @nocollapse */
    RecordBatch.new = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = tslib_1.__read(args_1.selectFieldArgs(args), 2), fs = _a[0], xs = _a[1];
        var vs = xs.filter(function (x) { return x instanceof vector_1.Vector; });
        return new (RecordBatch.bind.apply(RecordBatch, tslib_1.__spread([void 0], recordbatch_1.ensureSameLengthData(new schema_1.Schema(fs), vs.map(function (x) { return x.data; })))))();
    };
    RecordBatch.prototype.clone = function (data, children) {
        if (children === void 0) { children = this._children; }
        return new RecordBatch(this._schema, data, children);
    };
    RecordBatch.prototype.concat = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        var schema = this._schema, chunks = chunked_1.Chunked.flatten.apply(chunked_1.Chunked, tslib_1.__spread([this], others));
        return new table_1.Table(schema, chunks.map(function (_a) {
            var data = _a.data;
            return new RecordBatch(schema, data);
        }));
    };
    Object.defineProperty(RecordBatch.prototype, "schema", {
        get: function () { return this._schema; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatch.prototype, "numCols", {
        get: function () { return this._schema.fields.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatch.prototype, "dictionaries", {
        get: function () {
            return this._dictionaries || (this._dictionaries = DictionaryCollector.collect(this));
        },
        enumerable: false,
        configurable: true
    });
    RecordBatch.prototype.select = function () {
        var columnNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnNames[_i] = arguments[_i];
        }
        var nameToIndex = this._schema.fields.reduce(function (m, f, i) { return m.set(f.name, i); }, new Map());
        return this.selectAt.apply(this, tslib_1.__spread(columnNames.map(function (columnName) { return nameToIndex.get(columnName); }).filter(function (x) { return x > -1; })));
    };
    RecordBatch.prototype.selectAt = function () {
        var _a;
        var _this = this;
        var columnIndices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnIndices[_i] = arguments[_i];
        }
        var schema = (_a = this._schema).selectAt.apply(_a, tslib_1.__spread(columnIndices));
        var childData = columnIndices.map(function (i) { return _this.data.childData[i]; }).filter(Boolean);
        return new RecordBatch(schema, this.length, childData);
    };
    return RecordBatch;
}(index_1.StructVector));
exports.RecordBatch = RecordBatch;
/**
 * An internal class used by the `RecordBatchReader` and `RecordBatchWriter`
 * implementations to differentiate between a stream with valid zero-length
 * RecordBatches, and a stream with a Schema message, but no RecordBatches.
 * @see https://github.com/apache/arrow/pull/4373
 * @ignore
 * @private
 */
/* eslint-disable @typescript-eslint/naming-convention */
var _InternalEmptyPlaceholderRecordBatch = /** @class */ (function (_super) {
    tslib_1.__extends(_InternalEmptyPlaceholderRecordBatch, _super);
    function _InternalEmptyPlaceholderRecordBatch(schema) {
        return _super.call(this, schema, 0, schema.fields.map(function (f) { return data_1.Data.new(f.type, 0, 0, 0); })) || this;
    }
    return _InternalEmptyPlaceholderRecordBatch;
}(RecordBatch));
exports._InternalEmptyPlaceholderRecordBatch = _InternalEmptyPlaceholderRecordBatch;
/** @ignore */
var DictionaryCollector = /** @class */ (function (_super) {
    tslib_1.__extends(DictionaryCollector, _super);
    function DictionaryCollector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dictionaries = new Map();
        return _this;
    }
    DictionaryCollector.collect = function (batch) {
        return new DictionaryCollector().visit(batch.data, new type_1.Struct(batch.schema.fields)).dictionaries;
    };
    DictionaryCollector.prototype.visit = function (data, type) {
        var _this = this;
        if (type_1.DataType.isDictionary(type)) {
            return this.visitDictionary(data, type);
        }
        else {
            data.childData.forEach(function (child, i) {
                return _this.visit(child, type.children[i].type);
            });
        }
        return this;
    };
    DictionaryCollector.prototype.visitDictionary = function (data, type) {
        var dictionary = data.dictionary;
        if (dictionary && dictionary.length > 0) {
            this.dictionaries.set(type.id, dictionary);
        }
        return this;
    };
    return DictionaryCollector;
}(visitor_1.Visitor));

//# sourceMappingURL=recordbatch.js.map
