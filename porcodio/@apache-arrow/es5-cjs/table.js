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
exports.Table = void 0;
var tslib_1 = require("tslib");
var column_1 = require("./column");
var schema_1 = require("./schema");
var recordbatch_1 = require("./recordbatch");
var reader_1 = require("./ipc/reader");
var type_1 = require("./type");
var args_1 = require("./util/args");
var compat_1 = require("./util/compat");
var writer_1 = require("./ipc/writer");
var recordbatch_2 = require("./util/recordbatch");
var index_1 = require("./vector/index");
var Table = /** @class */ (function (_super) {
    tslib_1.__extends(Table, _super);
    function Table() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        var schema = null;
        if (args[0] instanceof schema_1.Schema) {
            schema = args.shift();
        }
        var chunks = args_1.selectArgs(recordbatch_1.RecordBatch, args);
        if (!schema && !(schema = chunks[0] && chunks[0].schema)) {
            throw new TypeError('Table must be initialized with a Schema or at least one RecordBatch');
        }
        chunks[0] || (chunks[0] = new recordbatch_1._InternalEmptyPlaceholderRecordBatch(schema));
        _this = _super.call(this, new type_1.Struct(schema.fields), chunks) || this;
        _this._schema = schema;
        _this._chunks = chunks;
        return _this;
    }
    /** @nocollapse */
    Table.empty = function (schema) {
        if (schema === void 0) { schema = new schema_1.Schema([]); }
        return new Table(schema, []);
    };
    /** @nocollapse */
    Table.from = function (input) {
        var _this = this;
        if (!input) {
            return Table.empty();
        }
        if (typeof input === 'object') {
            var table = compat_1.isIterable(input['values']) ? tableFromIterable(input)
                : compat_1.isAsyncIterable(input['values']) ? tableFromAsyncIterable(input)
                    : null;
            if (table !== null) {
                return table;
            }
        }
        var reader = reader_1.RecordBatchReader.from(input);
        if (compat_1.isPromise(reader)) {
            return (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Table).from;
                        return [4 /*yield*/, reader];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            }); }); })();
        }
        if (reader.isSync() && (reader = reader.open())) {
            return !reader.schema ? Table.empty() : new Table(reader.schema, tslib_1.__spread(reader));
        }
        return (function (opening) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var reader, schema, batches, reader_2, reader_2_1, batch, e_1_1;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, opening];
                    case 1:
                        reader = _b.sent();
                        schema = reader.schema;
                        batches = [];
                        if (!schema) return [3 /*break*/, 14];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        reader_2 = tslib_1.__asyncValues(reader);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, reader_2.next()];
                    case 4:
                        if (!(reader_2_1 = _b.sent(), !reader_2_1.done)) return [3 /*break*/, 6];
                        batch = reader_2_1.value;
                        batches.push(batch);
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(reader_2_1 && !reader_2_1.done && (_a = reader_2.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(reader_2)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/, new Table(schema, batches)];
                    case 14: return [2 /*return*/, Table.empty()];
                }
            });
        }); })(reader.open());
    };
    /** @nocollapse */
    Table.fromAsync = function (source) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Table.from(source)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** @nocollapse */
    Table.fromStruct = function (vector) {
        return Table.new(vector.data.childData, vector.type.children);
    };
    /** @nocollapse */
    Table.new = function () {
        var cols = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cols[_i] = arguments[_i];
        }
        return new (Table.bind.apply(Table, tslib_1.__spread([void 0], recordbatch_2.distributeColumnsIntoRecordBatches(args_1.selectColumnArgs(cols)))))();
    };
    Object.defineProperty(Table.prototype, "schema", {
        get: function () { return this._schema; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "length", {
        get: function () { return this._length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "chunks", {
        get: function () { return this._chunks; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "numCols", {
        get: function () { return this._numChildren; },
        enumerable: false,
        configurable: true
    });
    Table.prototype.clone = function (chunks) {
        if (chunks === void 0) { chunks = this._chunks; }
        return new Table(this._schema, chunks);
    };
    Table.prototype.getColumn = function (name) {
        return this.getColumnAt(this.getColumnIndex(name));
    };
    Table.prototype.getColumnAt = function (index) {
        return this.getChildAt(index);
    };
    Table.prototype.getColumnIndex = function (name) {
        return this._schema.fields.findIndex(function (f) { return f.name === name; });
    };
    Table.prototype.getChildAt = function (index) {
        if (index < 0 || index >= this.numChildren) {
            return null;
        }
        var field, child;
        var fields = this._schema.fields;
        var columns = this._children || (this._children = []);
        if (child = columns[index]) {
            return child;
        }
        if (field = fields[index]) {
            var chunks = this._chunks
                .map(function (chunk) { return chunk.getChildAt(index); })
                .filter(function (vec) { return vec != null; });
            if (chunks.length > 0) {
                return (columns[index] = new column_1.Column(field, chunks));
            }
        }
        return null;
    };
    // @ts-ignore
    Table.prototype.serialize = function (encoding, stream) {
        if (encoding === void 0) { encoding = 'binary'; }
        if (stream === void 0) { stream = true; }
        var Writer = !stream
            ? writer_1.RecordBatchFileWriter
            : writer_1.RecordBatchStreamWriter;
        return Writer.writeAll(this).toUint8Array(true);
    };
    Table.prototype.count = function () {
        return this._length;
    };
    Table.prototype.select = function () {
        var columnNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnNames[_i] = arguments[_i];
        }
        var nameToIndex = this._schema.fields.reduce(function (m, f, i) { return m.set(f.name, i); }, new Map());
        return this.selectAt.apply(this, tslib_1.__spread(columnNames.map(function (columnName) { return nameToIndex.get(columnName); }).filter(function (x) { return x > -1; })));
    };
    Table.prototype.selectAt = function () {
        var _a;
        var columnIndices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnIndices[_i] = arguments[_i];
        }
        var schema = (_a = this._schema).selectAt.apply(_a, tslib_1.__spread(columnIndices));
        return new Table(schema, this._chunks.map(function (_a) {
            var length = _a.length, childData = _a.data.childData;
            return new recordbatch_1.RecordBatch(schema, length, columnIndices.map(function (i) { return childData[i]; }).filter(Boolean));
        }));
    };
    Table.prototype.assign = function (other) {
        var _this = this;
        var fields = this._schema.fields;
        var _a = tslib_1.__read(other.schema.fields.reduce(function (memo, f2, newIdx) {
            var _a = tslib_1.__read(memo, 2), indices = _a[0], oldToNew = _a[1];
            var i = fields.findIndex(function (f) { return f.name === f2.name; });
            ~i ? (oldToNew[i] = newIdx) : indices.push(newIdx);
            return memo;
        }, [[], []]), 2), indices = _a[0], oldToNew = _a[1];
        var schema = this._schema.assign(other.schema);
        var columns = tslib_1.__spread(fields.map(function (_f, i, _fs, j) {
            if (j === void 0) { j = oldToNew[i]; }
            return (j === undefined ? _this.getColumnAt(i) : other.getColumnAt(j));
        }), indices.map(function (i) { return other.getColumnAt(i); })).filter(Boolean);
        return new (Table.bind.apply(Table, tslib_1.__spread([void 0], recordbatch_2.distributeVectorsIntoRecordBatches(schema, columns))))();
    };
    return Table;
}(index_1.Chunked));
exports.Table = Table;
function tableFromIterable(input) {
    var type = input.type;
    if (type instanceof type_1.Struct) {
        return Table.fromStruct(index_1.StructVector.from(input));
    }
    return null;
}
function tableFromAsyncIterable(input) {
    var type = input.type;
    if (type instanceof type_1.Struct) {
        return index_1.StructVector.from(input).then(function (vector) { return Table.fromStruct(vector); });
    }
    return null;
}

//# sourceMappingURL=table.js.map
