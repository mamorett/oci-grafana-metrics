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
exports.Field = exports.Schema = void 0;
var tslib_1 = require("tslib");
var type_1 = require("./type");
var Schema = /** @class */ (function () {
    function Schema(fields, metadata, dictionaries) {
        if (fields === void 0) { fields = []; }
        this.fields = (fields || []);
        this.metadata = metadata || new Map();
        if (!dictionaries) {
            dictionaries = generateDictionaryMap(fields);
        }
        this.dictionaries = dictionaries;
    }
    Object.defineProperty(Schema.prototype, Symbol.toStringTag, {
        get: function () { return 'Schema'; },
        enumerable: false,
        configurable: true
    });
    Schema.prototype.toString = function () {
        return "Schema<{ " + this.fields.map(function (f, i) { return i + ": " + f; }).join(', ') + " }>";
    };
    Schema.prototype.select = function () {
        var columnNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnNames[_i] = arguments[_i];
        }
        var names = columnNames.reduce(function (xs, x) { return (xs[x] = true) && xs; }, Object.create(null));
        return new Schema(this.fields.filter(function (f) { return names[f.name]; }), this.metadata);
    };
    Schema.prototype.selectAt = function () {
        var _this = this;
        var columnIndices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnIndices[_i] = arguments[_i];
        }
        return new Schema(columnIndices.map(function (i) { return _this.fields[i]; }).filter(Boolean), this.metadata);
    };
    Schema.prototype.assign = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var other = (args[0] instanceof Schema
            ? args[0]
            : Array.isArray(args[0])
                ? new Schema(args[0])
                : new Schema(args));
        var curFields = tslib_1.__spread(this.fields);
        var metadata = mergeMaps(mergeMaps(new Map(), this.metadata), other.metadata);
        var newFields = other.fields.filter(function (f2) {
            var i = curFields.findIndex(function (f) { return f.name === f2.name; });
            return ~i ? (curFields[i] = f2.clone({
                metadata: mergeMaps(mergeMaps(new Map(), curFields[i].metadata), f2.metadata)
            })) && false : true;
        });
        var newDictionaries = generateDictionaryMap(newFields, new Map());
        return new Schema(tslib_1.__spread(curFields, newFields), metadata, new Map(tslib_1.__spread(this.dictionaries, newDictionaries)));
    };
    return Schema;
}());
exports.Schema = Schema;
var Field = /** @class */ (function () {
    function Field(name, type, nullable, metadata) {
        if (nullable === void 0) { nullable = false; }
        this.name = name;
        this.type = type;
        this.nullable = nullable;
        this.metadata = metadata || new Map();
    }
    /** @nocollapse */
    Field.new = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = tslib_1.__read(args, 4), name = _a[0], type = _a[1], nullable = _a[2], metadata = _a[3];
        if (args[0] && typeof args[0] === 'object') {
            (name = args[0].name);
            (type === undefined) && (type = args[0].type);
            (nullable === undefined) && (nullable = args[0].nullable);
            (metadata === undefined) && (metadata = args[0].metadata);
        }
        return new Field("" + name, type, nullable, metadata);
    };
    Object.defineProperty(Field.prototype, "typeId", {
        get: function () { return this.type.typeId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Field.prototype, Symbol.toStringTag, {
        get: function () { return 'Field'; },
        enumerable: false,
        configurable: true
    });
    Field.prototype.toString = function () { return this.name + ": " + this.type; };
    Field.prototype.clone = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _l = tslib_1.__read(args, 4), name = _l[0], type = _l[1], nullable = _l[2], metadata = _l[3];
        (!args[0] || typeof args[0] !== 'object')
            ? (_a = tslib_1.__read(args, 4), _b = _a[0], name = _b === void 0 ? this.name : _b, _c = _a[1], type = _c === void 0 ? this.type : _c, _d = _a[2], nullable = _d === void 0 ? this.nullable : _d, _e = _a[3], metadata = _e === void 0 ? this.metadata : _e, args)
            : (_f = args[0], _g = _f.name, name = _g === void 0 ? this.name : _g, _h = _f.type, type = _h === void 0 ? this.type : _h, _j = _f.nullable, nullable = _j === void 0 ? this.nullable : _j, _k = _f.metadata, metadata = _k === void 0 ? this.metadata : _k, _f);
        return Field.new(name, type, nullable, metadata);
    };
    return Field;
}());
exports.Field = Field;
/** @ignore */
function mergeMaps(m1, m2) {
    return new Map(tslib_1.__spread((m1 || new Map()), (m2 || new Map())));
}
/** @ignore */
function generateDictionaryMap(fields, dictionaries) {
    if (dictionaries === void 0) { dictionaries = new Map(); }
    for (var i = -1, n = fields.length; ++i < n;) {
        var field = fields[i];
        var type = field.type;
        if (type_1.DataType.isDictionary(type)) {
            if (!dictionaries.has(type.id)) {
                dictionaries.set(type.id, type.dictionary);
            }
            else if (dictionaries.get(type.id) !== type.dictionary) {
                throw new Error("Cannot create Schema containing two different dictionaries with the same Id");
            }
        }
        if (type.children && type.children.length > 0) {
            generateDictionaryMap(type.children, dictionaries);
        }
    }
    return dictionaries;
}
// Add these here so they're picked up by the externs creator
// in the build, and closure-compiler doesn't minify them away
Schema.prototype.fields = null;
Schema.prototype.metadata = null;
Schema.prototype.dictionaries = null;
Field.prototype.type = null;
Field.prototype.name = null;
Field.prototype.nullable = null;
Field.prototype.metadata = null;

//# sourceMappingURL=schema.js.map
