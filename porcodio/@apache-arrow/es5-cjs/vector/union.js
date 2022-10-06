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
exports.SparseUnionVector = exports.DenseUnionVector = exports.UnionVector = void 0;
var tslib_1 = require("tslib");
var base_1 = require("./base");
/** @ignore */
var UnionVector = /** @class */ (function (_super) {
    tslib_1.__extends(UnionVector, _super);
    function UnionVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(UnionVector.prototype, "typeIdToChildIndex", {
        get: function () { return this.data.type.typeIdToChildIndex; },
        enumerable: false,
        configurable: true
    });
    return UnionVector;
}(base_1.BaseVector));
exports.UnionVector = UnionVector;
/** @ignore */
var DenseUnionVector = /** @class */ (function (_super) {
    tslib_1.__extends(DenseUnionVector, _super);
    function DenseUnionVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DenseUnionVector.prototype, "valueOffsets", {
        get: function () { return this.data.valueOffsets; },
        enumerable: false,
        configurable: true
    });
    return DenseUnionVector;
}(UnionVector));
exports.DenseUnionVector = DenseUnionVector;
/** @ignore */
var SparseUnionVector = /** @class */ (function (_super) {
    tslib_1.__extends(SparseUnionVector, _super);
    function SparseUnionVector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SparseUnionVector;
}(UnionVector));
exports.SparseUnionVector = SparseUnionVector;

//# sourceMappingURL=union.js.map
