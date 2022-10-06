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
exports.Column = void 0;
var tslib_1 = require("tslib");
var schema_1 = require("./schema");
var vector_1 = require("./vector");
var chunked_1 = require("./vector/chunked");
var Column = /** @class */ (function (_super) {
    tslib_1.__extends(Column, _super);
    function Column(field, vectors, offsets) {
        if (vectors === void 0) { vectors = []; }
        var _this = this;
        vectors = chunked_1.Chunked.flatten.apply(chunked_1.Chunked, tslib_1.__spread(vectors));
        _this = _super.call(this, field.type, vectors, offsets) || this;
        _this._field = field;
        if (vectors.length === 1 && !(_this instanceof SingleChunkColumn)) {
            return new SingleChunkColumn(field, vectors[0], _this._chunkOffsets);
        }
        return _this;
    }
    /** @nocollapse */
    Column.new = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = tslib_1.__read(args), field = _a[0], data = _a[1], rest = _a.slice(2);
        if (typeof field !== 'string' && !(field instanceof schema_1.Field)) {
            data = field;
            field = '';
        }
        var chunks = chunked_1.Chunked.flatten(Array.isArray(data) ? tslib_1.__spread(data, rest) :
            data instanceof vector_1.Vector ? tslib_1.__spread([data], rest) :
                [vector_1.Vector.new.apply(vector_1.Vector, tslib_1.__spread([data], rest))]);
        if (typeof field === 'string') {
            var type = chunks[0].data.type;
            field = new schema_1.Field(field, type, true);
        }
        else if (!field.nullable && chunks.some(function (_a) {
            var nullCount = _a.nullCount;
            return nullCount > 0;
        })) {
            field = field.clone({ nullable: true });
        }
        return new Column(field, chunks);
    };
    Object.defineProperty(Column.prototype, "field", {
        get: function () { return this._field; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Column.prototype, "name", {
        get: function () { return this._field.name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Column.prototype, "nullable", {
        get: function () { return this._field.nullable; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Column.prototype, "metadata", {
        get: function () { return this._field.metadata; },
        enumerable: false,
        configurable: true
    });
    Column.prototype.clone = function (chunks) {
        if (chunks === void 0) { chunks = this._chunks; }
        return new Column(this._field, chunks);
    };
    Column.prototype.getChildAt = function (index) {
        if (index < 0 || index >= this.numChildren) {
            return null;
        }
        var columns = this._children || (this._children = []);
        var column, field, chunks;
        if (column = columns[index]) {
            return column;
        }
        if (field = (this.type.children || [])[index]) {
            chunks = this._chunks
                .map(function (vector) { return vector.getChildAt(index); })
                .filter(function (vec) { return vec != null; });
            if (chunks.length > 0) {
                return (columns[index] = new Column(field, chunks));
            }
        }
        return null;
    };
    return Column;
}(chunked_1.Chunked));
exports.Column = Column;
/** @ignore */
var SingleChunkColumn = /** @class */ (function (_super) {
    tslib_1.__extends(SingleChunkColumn, _super);
    function SingleChunkColumn(field, vector, offsets) {
        var _this = _super.call(this, field, [vector], offsets) || this;
        _this._chunk = vector;
        return _this;
    }
    SingleChunkColumn.prototype.search = function (index, then) {
        return then ? then(this, 0, index) : [0, index];
    };
    SingleChunkColumn.prototype.isValid = function (index) {
        return this._chunk.isValid(index);
    };
    SingleChunkColumn.prototype.get = function (index) {
        return this._chunk.get(index);
    };
    SingleChunkColumn.prototype.set = function (index, value) {
        this._chunk.set(index, value);
    };
    SingleChunkColumn.prototype.indexOf = function (element, offset) {
        return this._chunk.indexOf(element, offset);
    };
    return SingleChunkColumn;
}(Column));

//# sourceMappingURL=column.js.map
