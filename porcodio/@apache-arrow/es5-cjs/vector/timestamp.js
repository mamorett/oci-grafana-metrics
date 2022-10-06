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
exports.TimestampNanosecondVector = exports.TimestampMicrosecondVector = exports.TimestampMillisecondVector = exports.TimestampSecondVector = exports.TimestampVector = void 0;
var tslib_1 = require("tslib");
var base_1 = require("./base");
/** @ignore */
var TimestampVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampVector, _super);
    function TimestampVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampVector;
}(base_1.BaseVector));
exports.TimestampVector = TimestampVector;
/** @ignore */
var TimestampSecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampSecondVector, _super);
    function TimestampSecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampSecondVector;
}(TimestampVector));
exports.TimestampSecondVector = TimestampSecondVector;
/** @ignore */
var TimestampMillisecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampMillisecondVector, _super);
    function TimestampMillisecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampMillisecondVector;
}(TimestampVector));
exports.TimestampMillisecondVector = TimestampMillisecondVector;
/** @ignore */
var TimestampMicrosecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampMicrosecondVector, _super);
    function TimestampMicrosecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampMicrosecondVector;
}(TimestampVector));
exports.TimestampMicrosecondVector = TimestampMicrosecondVector;
/** @ignore */
var TimestampNanosecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampNanosecondVector, _super);
    function TimestampNanosecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampNanosecondVector;
}(TimestampVector));
exports.TimestampNanosecondVector = TimestampNanosecondVector;

//# sourceMappingURL=timestamp.js.map
