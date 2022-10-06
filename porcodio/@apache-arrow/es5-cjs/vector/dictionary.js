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
exports.DictionaryVector = void 0;
var tslib_1 = require("tslib");
var data_1 = require("../data");
var vector_1 = require("../vector");
var base_1 = require("./base");
var index_1 = require("./index");
var type_1 = require("../type");
/** @ignore */
var DictionaryVector = /** @class */ (function (_super) {
    tslib_1.__extends(DictionaryVector, _super);
    function DictionaryVector(data) {
        var _this = _super.call(this, data) || this;
        _this.indices = vector_1.Vector.new(data.clone(_this.type.indices));
        return _this;
    }
    /** @nocollapse */
    DictionaryVector.from = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 3) {
            var _a = tslib_1.__read(args, 3), values = _a[0], indices = _a[1], keys = _a[2];
            var type = new type_1.Dictionary(values.type, indices, null, null);
            return vector_1.Vector.new(data_1.Data.Dictionary(type, 0, keys.length, 0, null, keys, values));
        }
        return index_1.vectorFromValuesWithType(function () { return args[0].type; }, args[0]);
    };
    Object.defineProperty(DictionaryVector.prototype, "dictionary", {
        get: function () { return this.data.dictionary; },
        enumerable: false,
        configurable: true
    });
    DictionaryVector.prototype.reverseLookup = function (value) { return this.dictionary.indexOf(value); };
    DictionaryVector.prototype.getKey = function (idx) { return this.indices.get(idx); };
    DictionaryVector.prototype.getValue = function (key) { return this.dictionary.get(key); };
    DictionaryVector.prototype.setKey = function (idx, key) { return this.indices.set(idx, key); };
    DictionaryVector.prototype.setValue = function (key, value) { return this.dictionary.set(key, value); };
    return DictionaryVector;
}(base_1.BaseVector));
exports.DictionaryVector = DictionaryVector;
DictionaryVector.prototype.indices = null;

//# sourceMappingURL=dictionary.js.map
