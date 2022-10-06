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
exports.BinaryVector = void 0;
var tslib_1 = require("tslib");
var vector_1 = require("../vector");
var base_1 = require("./base");
var type_1 = require("../type");
/** @ignore */
var BinaryVector = /** @class */ (function (_super) {
    tslib_1.__extends(BinaryVector, _super);
    function BinaryVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BinaryVector.prototype.asUtf8 = function () {
        return vector_1.Vector.new(this.data.clone(new type_1.Utf8()));
    };
    return BinaryVector;
}(base_1.BaseVector));
exports.BinaryVector = BinaryVector;

//# sourceMappingURL=binary.js.map
