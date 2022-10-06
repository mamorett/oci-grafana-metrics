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
exports.TimeNanosecondBuilder = exports.TimeMicrosecondBuilder = exports.TimeMillisecondBuilder = exports.TimeSecondBuilder = exports.TimeBuilder = void 0;
var tslib_1 = require("tslib");
var builder_1 = require("../builder");
/** @ignore */
var TimeBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimeBuilder, _super);
    function TimeBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeBuilder;
}(builder_1.FixedWidthBuilder));
exports.TimeBuilder = TimeBuilder;
/** @ignore */
var TimeSecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimeSecondBuilder, _super);
    function TimeSecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeSecondBuilder;
}(TimeBuilder));
exports.TimeSecondBuilder = TimeSecondBuilder;
/** @ignore */
var TimeMillisecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimeMillisecondBuilder, _super);
    function TimeMillisecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeMillisecondBuilder;
}(TimeBuilder));
exports.TimeMillisecondBuilder = TimeMillisecondBuilder;
/** @ignore */
var TimeMicrosecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimeMicrosecondBuilder, _super);
    function TimeMicrosecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeMicrosecondBuilder;
}(TimeBuilder));
exports.TimeMicrosecondBuilder = TimeMicrosecondBuilder;
/** @ignore */
var TimeNanosecondBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(TimeNanosecondBuilder, _super);
    function TimeNanosecondBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeNanosecondBuilder;
}(TimeBuilder));
exports.TimeNanosecondBuilder = TimeNanosecondBuilder;

//# sourceMappingURL=time.js.map
