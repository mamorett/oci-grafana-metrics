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
exports.TimestampNanosecondBuilder = exports.TimestampMicrosecondBuilder = exports.TimestampMillisecondBuilder = exports.TimestampSecondBuilder = exports.TimestampBuilder = void 0;
var tslib_1 = require("tslib");
var builder_1 = require("../builder");
/** @ignore */
var TimestampBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampBuilder, _super);
    function TimestampBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampBuilder;
}(builder_1.FixedWidthBuilder));
exports.TimestampBuilder = TimestampBuilder;
/** @ignore */
var TimestampSecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampSecondBuilder, _super);
    function TimestampSecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampSecondBuilder;
}(TimestampBuilder));
exports.TimestampSecondBuilder = TimestampSecondBuilder;
/** @ignore */
var TimestampMillisecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampMillisecondBuilder, _super);
    function TimestampMillisecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampMillisecondBuilder;
}(TimestampBuilder));
exports.TimestampMillisecondBuilder = TimestampMillisecondBuilder;
/** @ignore */
var TimestampMicrosecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampMicrosecondBuilder, _super);
    function TimestampMicrosecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampMicrosecondBuilder;
}(TimestampBuilder));
exports.TimestampMicrosecondBuilder = TimestampMicrosecondBuilder;
/** @ignore */
var TimestampNanosecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimestampNanosecondBuilder, _super);
    function TimestampNanosecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimestampNanosecondBuilder;
}(TimestampBuilder));
exports.TimestampNanosecondBuilder = TimestampNanosecondBuilder;

//# sourceMappingURL=timestamp.js.map
