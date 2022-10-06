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
exports.TimeNanosecondVector = exports.TimeMicrosecondVector = exports.TimeMillisecondVector = exports.TimeSecondVector = exports.TimeVector = void 0;
var tslib_1 = require("tslib");
var base_1 = require("./base");
/** @ignore */
var TimeVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimeVector, _super);
    function TimeVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeVector;
}(base_1.BaseVector));
exports.TimeVector = TimeVector;
/** @ignore */
var TimeSecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimeSecondVector, _super);
    function TimeSecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeSecondVector;
}(TimeVector));
exports.TimeSecondVector = TimeSecondVector;
/** @ignore */
var TimeMillisecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimeMillisecondVector, _super);
    function TimeMillisecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeMillisecondVector;
}(TimeVector));
exports.TimeMillisecondVector = TimeMillisecondVector;
/** @ignore */
var TimeMicrosecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimeMicrosecondVector, _super);
    function TimeMicrosecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeMicrosecondVector;
}(TimeVector));
exports.TimeMicrosecondVector = TimeMicrosecondVector;
/** @ignore */
var TimeNanosecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(TimeNanosecondVector, _super);
    function TimeNanosecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TimeNanosecondVector;
}(TimeVector));
exports.TimeNanosecondVector = TimeNanosecondVector;

//# sourceMappingURL=time.js.map
