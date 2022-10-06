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
exports.Utf8Vector = void 0;
var tslib_1 = require("tslib");
var vector_1 = require("../vector");
var base_1 = require("./base");
var type_1 = require("../type");
var index_1 = require("./index");
/** @ignore */
var Utf8Vector = /** @class */ (function (_super) {
    tslib_1.__extends(Utf8Vector, _super);
    function Utf8Vector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @nocollapse */
    Utf8Vector.from = function (input) {
        return index_1.vectorFromValuesWithType(function () { return new type_1.Utf8(); }, input);
    };
    Utf8Vector.prototype.asBinary = function () {
        return vector_1.Vector.new(this.data.clone(new type_1.Binary()));
    };
    return Utf8Vector;
}(base_1.BaseVector));
exports.Utf8Vector = Utf8Vector;

//# sourceMappingURL=utf8.js.map
