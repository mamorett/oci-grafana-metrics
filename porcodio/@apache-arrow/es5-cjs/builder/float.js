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
exports.Float64Builder = exports.Float32Builder = exports.Float16Builder = exports.FloatBuilder = void 0;
var tslib_1 = require("tslib");
var math_1 = require("../util/math");
var builder_1 = require("../builder");
/** @ignore */
var FloatBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(FloatBuilder, _super);
    function FloatBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FloatBuilder;
}(builder_1.FixedWidthBuilder));
exports.FloatBuilder = FloatBuilder;
/** @ignore */
var Float16Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Float16Builder, _super);
    function Float16Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Float16Builder.prototype.setValue = function (index, value) {
        // convert JS float64 to a uint16
        this._values.set(index, math_1.float64ToUint16(value));
    };
    return Float16Builder;
}(FloatBuilder));
exports.Float16Builder = Float16Builder;
/** @ignore */
var Float32Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Float32Builder, _super);
    function Float32Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Float32Builder.prototype.setValue = function (index, value) {
        this._values.set(index, value);
    };
    return Float32Builder;
}(FloatBuilder));
exports.Float32Builder = Float32Builder;
/** @ignore */
var Float64Builder = /** @class */ (function (_super) {
    tslib_1.__extends(Float64Builder, _super);
    function Float64Builder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Float64Builder.prototype.setValue = function (index, value) {
        this._values.set(index, value);
    };
    return Float64Builder;
}(FloatBuilder));
exports.Float64Builder = Float64Builder;

//# sourceMappingURL=float.js.map
