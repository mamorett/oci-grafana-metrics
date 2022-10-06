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
exports.DateMillisecondVector = exports.DateDayVector = exports.DateVector = void 0;
var tslib_1 = require("tslib");
var enum_1 = require("../enum");
var base_1 = require("./base");
var index_1 = require("./index");
var type_1 = require("../type");
/** @ignore */
var DateVector = /** @class */ (function (_super) {
    tslib_1.__extends(DateVector, _super);
    function DateVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @nocollapse */
    DateVector.from = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 2) {
            return index_1.vectorFromValuesWithType(function () { return args[1] === enum_1.DateUnit.DAY ? new type_1.DateDay() : new type_1.DateMillisecond(); }, args[0]);
        }
        return index_1.vectorFromValuesWithType(function () { return new type_1.DateMillisecond(); }, args[0]);
    };
    return DateVector;
}(base_1.BaseVector));
exports.DateVector = DateVector;
/** @ignore */
var DateDayVector = /** @class */ (function (_super) {
    tslib_1.__extends(DateDayVector, _super);
    function DateDayVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DateDayVector;
}(DateVector));
exports.DateDayVector = DateDayVector;
/** @ignore */
var DateMillisecondVector = /** @class */ (function (_super) {
    tslib_1.__extends(DateMillisecondVector, _super);
    function DateMillisecondVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DateMillisecondVector;
}(DateVector));
exports.DateMillisecondVector = DateMillisecondVector;

//# sourceMappingURL=date.js.map
