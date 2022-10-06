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
exports.Uint64Builder = exports.Uint32Builder = exports.Uint16Builder = exports.Uint8Builder = exports.Int64Builder = exports.Int32Builder = exports.Int16Builder = exports.Int8Builder = exports.IntBuilder = void 0;
var tslib_1 = require("tslib");
var bn_1 = require("../util/bn");
var buffer_1 = require("./buffer");
var compat_1 = require("../util/compat");
var builder_1 = require("../builder");
/** @ignore */
var IntBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(IntBuilder, _super);
    function IntBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntBuilder.prototype.setValue = function (index, value) {
        this._values.set(index, value);
    };
    return IntBuilder;
}(builder_1.FixedWidthBuilder));
exports.IntBuilder = IntBuilder;
/** @ignore */
var Int8Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Int8Builder, _super);
    function Int8Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int8Builder;
}(IntBuilder));
exports.Int8Builder = Int8Builder;
/** @ignore */
var Int16Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Int16Builder, _super);
    function Int16Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int16Builder;
}(IntBuilder));
exports.Int16Builder = Int16Builder;
/** @ignore */
var Int32Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Int32Builder, _super);
    function Int32Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Int32Builder;
}(IntBuilder));
exports.Int32Builder = Int32Builder;
/** @ignore */
var Int64Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Int64Builder, _super);
    function Int64Builder(options) {
        var _this = this;
        if (options['nullValues']) {
            options['nullValues'] = options['nullValues'].map(toBigInt);
        }
        _this = _super.call(this, options) || this;
        _this._values = new buffer_1.WideBufferBuilder(new Int32Array(0), 2);
        return _this;
    }
    Object.defineProperty(Int64Builder.prototype, "values64", {
        get: function () { return this._values.buffer64; },
        enumerable: false,
        configurable: true
    });
    Int64Builder.prototype.isValid = function (value) { return _super.prototype.isValid.call(this, toBigInt(value)); };
    return Int64Builder;
}(IntBuilder));
exports.Int64Builder = Int64Builder;
/** @ignore */
var Uint8Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Uint8Builder, _super);
    function Uint8Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Uint8Builder;
}(IntBuilder));
exports.Uint8Builder = Uint8Builder;
/** @ignore */
var Uint16Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Uint16Builder, _super);
    function Uint16Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Uint16Builder;
}(IntBuilder));
exports.Uint16Builder = Uint16Builder;
/** @ignore */
var Uint32Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Uint32Builder, _super);
    function Uint32Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Uint32Builder;
}(IntBuilder));
exports.Uint32Builder = Uint32Builder;
/** @ignore */
var Uint64Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Uint64Builder, _super);
    function Uint64Builder(options) {
        var _this = this;
        if (options['nullValues']) {
            options['nullValues'] = options['nullValues'].map(toBigInt);
        }
        _this = _super.call(this, options) || this;
        _this._values = new buffer_1.WideBufferBuilder(new Uint32Array(0), 2);
        return _this;
    }
    Object.defineProperty(Uint64Builder.prototype, "values64", {
        get: function () { return this._values.buffer64; },
        enumerable: false,
        configurable: true
    });
    Uint64Builder.prototype.isValid = function (value) { return _super.prototype.isValid.call(this, toBigInt(value)); };
    return Uint64Builder;
}(IntBuilder));
exports.Uint64Builder = Uint64Builder;
var toBigInt = (function (memo) { return function (value) {
    if (ArrayBuffer.isView(value)) {
        memo.buffer = value.buffer;
        memo.byteOffset = value.byteOffset;
        memo.byteLength = value.byteLength;
        value = bn_1.bignumToBigInt(memo);
        memo.buffer = null;
    }
    return value;
}; })({ 'BigIntArray': compat_1.BigInt64Array });

//# sourceMappingURL=int.js.map
