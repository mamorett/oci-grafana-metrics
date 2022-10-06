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
exports.DictionaryBuilder = void 0;
var tslib_1 = require("tslib");
var type_1 = require("../type");
var builder_1 = require("../builder");
/** @ignore */
var DictionaryBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(DictionaryBuilder, _super);
    function DictionaryBuilder(_a) {
        var type = _a["type"], nulls = _a["nullValues"], hashFn = _a["dictionaryHashFunction"];
        var _this = _super.call(this, { type: new type_1.Dictionary(type.dictionary, type.indices, type.id, type.isOrdered) }) || this;
        _this._nulls = null;
        _this._dictionaryOffset = 0;
        _this._keysToIndices = Object.create(null);
        _this.indices = builder_1.Builder.new({ 'type': _this.type.indices, 'nullValues': nulls });
        _this.dictionary = builder_1.Builder.new({ 'type': _this.type.dictionary, 'nullValues': null });
        if (typeof hashFn === 'function') {
            _this.valueToKey = hashFn;
        }
        return _this;
    }
    Object.defineProperty(DictionaryBuilder.prototype, "values", {
        get: function () { return this.indices.values; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBuilder.prototype, "nullCount", {
        get: function () { return this.indices.nullCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBuilder.prototype, "nullBitmap", {
        get: function () { return this.indices.nullBitmap; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBuilder.prototype, "byteLength", {
        get: function () { return this.indices.byteLength + this.dictionary.byteLength; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBuilder.prototype, "reservedLength", {
        get: function () { return this.indices.reservedLength + this.dictionary.reservedLength; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBuilder.prototype, "reservedByteLength", {
        get: function () { return this.indices.reservedByteLength + this.dictionary.reservedByteLength; },
        enumerable: false,
        configurable: true
    });
    DictionaryBuilder.prototype.isValid = function (value) { return this.indices.isValid(value); };
    DictionaryBuilder.prototype.setValid = function (index, valid) {
        var indices = this.indices;
        valid = indices.setValid(index, valid);
        this.length = indices.length;
        return valid;
    };
    DictionaryBuilder.prototype.setValue = function (index, value) {
        var keysToIndices = this._keysToIndices;
        var key = this.valueToKey(value);
        var idx = keysToIndices[key];
        if (idx === undefined) {
            keysToIndices[key] = idx = this._dictionaryOffset + this.dictionary.append(value).length - 1;
        }
        return this.indices.setValue(index, idx);
    };
    DictionaryBuilder.prototype.flush = function () {
        var type = this.type;
        var prev = this._dictionary;
        var curr = this.dictionary.toVector();
        var data = this.indices.flush().clone(type);
        data.dictionary = prev ? prev.concat(curr) : curr;
        this.finished || (this._dictionaryOffset += curr.length);
        this._dictionary = data.dictionary;
        this.clear();
        return data;
    };
    DictionaryBuilder.prototype.finish = function () {
        this.indices.finish();
        this.dictionary.finish();
        this._dictionaryOffset = 0;
        this._keysToIndices = Object.create(null);
        return _super.prototype.finish.call(this);
    };
    DictionaryBuilder.prototype.clear = function () {
        this.indices.clear();
        this.dictionary.clear();
        return _super.prototype.clear.call(this);
    };
    DictionaryBuilder.prototype.valueToKey = function (val) {
        return typeof val === 'string' ? val : "" + val;
    };
    return DictionaryBuilder;
}(builder_1.Builder));
exports.DictionaryBuilder = DictionaryBuilder;

//# sourceMappingURL=dictionary.js.map
