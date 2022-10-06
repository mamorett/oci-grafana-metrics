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
exports.selectColumnChildrenArgs = exports.selectVectorChildrenArgs = exports.selectChunkArgs = exports.selectFieldArgs = exports.selectColumnArgs = exports.selectArgs = void 0;
var tslib_1 = require("tslib");
var data_1 = require("../data");
var schema_1 = require("../schema");
var column_1 = require("../column");
var vector_1 = require("../vector");
var type_1 = require("../type");
var chunked_1 = require("../vector/chunked");
var isArray = Array.isArray;
/** @ignore */
exports.selectArgs = function (Ctor, vals) { return _selectArgs(Ctor, vals, [], 0); };
/** @ignore */
exports.selectColumnArgs = function (args) {
    var _a = tslib_1.__read(_selectFieldArgs(args, [[], []]), 2), fields = _a[0], values = _a[1];
    return values.map(function (x, i) {
        return x instanceof column_1.Column ? column_1.Column.new(x.field.clone(fields[i]), x) :
            x instanceof vector_1.Vector ? column_1.Column.new(fields[i], x) :
                column_1.Column.new(fields[i], []);
    });
};
/** @ignore */
exports.selectFieldArgs = function (args) { return _selectFieldArgs(args, [[], []]); };
/** @ignore */
exports.selectChunkArgs = function (Ctor, vals) { return _selectChunkArgs(Ctor, vals, [], 0); };
/** @ignore */
exports.selectVectorChildrenArgs = function (Ctor, vals) { return _selectVectorChildrenArgs(Ctor, vals, [], 0); };
/** @ignore */
exports.selectColumnChildrenArgs = function (Ctor, vals) { return _selectColumnChildrenArgs(Ctor, vals, [], 0); };
/** @ignore */
function _selectArgs(Ctor, vals, res, idx) {
    var value, j = idx;
    var i = -1;
    var n = vals.length;
    while (++i < n) {
        if (isArray(value = vals[i])) {
            j = _selectArgs(Ctor, value, res, j).length;
        }
        else if (value instanceof Ctor) {
            res[j++] = value;
        }
    }
    return res;
}
/** @ignore */
function _selectChunkArgs(Ctor, vals, res, idx) {
    var value, j = idx;
    var i = -1;
    var n = vals.length;
    while (++i < n) {
        if (isArray(value = vals[i])) {
            j = _selectChunkArgs(Ctor, value, res, j).length;
        }
        else if (value instanceof chunked_1.Chunked) {
            j = _selectChunkArgs(Ctor, value.chunks, res, j).length;
        }
        else if (value instanceof Ctor) {
            res[j++] = value;
        }
    }
    return res;
}
/** @ignore */
function _selectVectorChildrenArgs(Ctor, vals, res, idx) {
    var value, j = idx;
    var i = -1;
    var n = vals.length;
    while (++i < n) {
        if (isArray(value = vals[i])) {
            j = _selectVectorChildrenArgs(Ctor, value, res, j).length;
        }
        else if (value instanceof Ctor) {
            j = _selectArgs(vector_1.Vector, value.schema.fields.map(function (_, i) { return value.getChildAt(i); }), res, j).length;
        }
        else if (value instanceof vector_1.Vector) {
            res[j++] = value;
        }
    }
    return res;
}
/** @ignore */
function _selectColumnChildrenArgs(Ctor, vals, res, idx) {
    var value, j = idx;
    var i = -1;
    var n = vals.length;
    while (++i < n) {
        if (isArray(value = vals[i])) {
            j = _selectColumnChildrenArgs(Ctor, value, res, j).length;
        }
        else if (value instanceof Ctor) {
            j = _selectArgs(column_1.Column, value.schema.fields.map(function (f, i) { return column_1.Column.new(f, value.getChildAt(i)); }), res, j).length;
        }
        else if (value instanceof column_1.Column) {
            res[j++] = value;
        }
    }
    return res;
}
/** @ignore */
var toKeysAndValues = function (xs, _a, i) {
    var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
    return (xs[0][i] = k, xs[1][i] = v, xs);
};
/** @ignore */
function _selectFieldArgs(vals, ret) {
    var _a, _b, _c, _d;
    var keys;
    var n;
    switch (n = vals.length) {
        case 0: return ret;
        case 1:
            keys = ret[0];
            if (!(vals[0])) {
                return ret;
            }
            if (isArray(vals[0])) {
                return _selectFieldArgs(vals[0], ret);
            }
            if (!(vals[0] instanceof data_1.Data || vals[0] instanceof vector_1.Vector || vals[0] instanceof type_1.DataType)) {
                _a = tslib_1.__read(Object.entries(vals[0]).reduce(toKeysAndValues, ret), 2), keys = _a[0], vals = _a[1];
            }
            break;
        default:
            !isArray(keys = vals[n - 1])
                ? (vals = isArray(vals[0]) ? vals[0] : vals, keys = [])
                : (vals = isArray(vals[0]) ? vals[0] : vals.slice(0, n - 1));
    }
    var fieldIndex = -1;
    var valueIndex = -1;
    var idx = -1;
    var len = vals.length;
    var field;
    var val;
    var _e = tslib_1.__read(ret, 2), fields = _e[0], values = _e[1];
    while (++idx < len) {
        val = vals[idx];
        if (val instanceof column_1.Column && (values[++valueIndex] = val)) {
            fields[++fieldIndex] = val.field.clone(keys[idx], val.type, true);
        }
        else {
            (_b = keys, _c = idx, _d = _b[_c], field = _d === void 0 ? idx : _d);
            if (val instanceof type_1.DataType && (values[++valueIndex] = val)) {
                fields[++fieldIndex] = schema_1.Field.new(field, val, true);
            }
            else if (val && val.type && (values[++valueIndex] = val)) {
                val instanceof data_1.Data && (values[valueIndex] = val = vector_1.Vector.new(val));
                fields[++fieldIndex] = schema_1.Field.new(field, val.type, true);
            }
        }
    }
    return ret;
}

//# sourceMappingURL=args.js.map
