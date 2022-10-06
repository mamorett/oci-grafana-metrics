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
exports.StructVector = void 0;
var tslib_1 = require("tslib");
var row_1 = require("./row");
var base_1 = require("./base");
/** @ignore */ var kRowIndex = Symbol.for('rowIndex');
/** @ignore */
var StructVector = /** @class */ (function (_super) {
    tslib_1.__extends(StructVector, _super);
    function StructVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StructVector.prototype.bind = function (index) {
        var proto = this._row || (this._row = new row_1.StructRow(this));
        var bound = Object.create(proto);
        bound[kRowIndex] = index;
        return bound;
    };
    return StructVector;
}(base_1.BaseVector));
exports.StructVector = StructVector;

//# sourceMappingURL=struct.js.map
