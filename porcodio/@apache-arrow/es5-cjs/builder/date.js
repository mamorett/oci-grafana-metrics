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
exports.DateMillisecondBuilder = exports.DateDayBuilder = exports.DateBuilder = void 0;
var tslib_1 = require("tslib");
var builder_1 = require("../builder");
/** @ignore */
var DateBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(DateBuilder, _super);
    function DateBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DateBuilder;
}(builder_1.FixedWidthBuilder));
exports.DateBuilder = DateBuilder;
/** @ignore */
var DateDayBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(DateDayBuilder, _super);
    function DateDayBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DateDayBuilder;
}(DateBuilder));
exports.DateDayBuilder = DateDayBuilder;
/** @ignore */
var DateMillisecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(DateMillisecondBuilder, _super);
    function DateMillisecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DateMillisecondBuilder;
}(DateBuilder));
exports.DateMillisecondBuilder = DateMillisecondBuilder;

//# sourceMappingURL=date.js.map
