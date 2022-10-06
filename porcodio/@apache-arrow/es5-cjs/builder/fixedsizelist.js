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
exports.FixedSizeListBuilder = void 0;
var tslib_1 = require("tslib");
var run_1 = require("./run");
var schema_1 = require("../schema");
var builder_1 = require("../builder");
var type_1 = require("../type");
/** @ignore */
var FixedSizeListBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(FixedSizeListBuilder, _super);
    function FixedSizeListBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._run = new run_1.Run();
        return _this;
    }
    FixedSizeListBuilder.prototype.setValue = function (index, value) {
        _super.prototype.setValue.call(this, index, this._run.bind(value));
    };
    FixedSizeListBuilder.prototype.addChild = function (child, name) {
        if (name === void 0) { name = '0'; }
        if (this.numChildren > 0) {
            throw new Error('FixedSizeListBuilder can only have one child.');
        }
        var childIndex = this.children.push(child);
        this.type = new type_1.FixedSizeList(this.type.listSize, new schema_1.Field(name, child.type, true));
        return childIndex;
    };
    FixedSizeListBuilder.prototype.clear = function () {
        this._run.clear();
        return _super.prototype.clear.call(this);
    };
    return FixedSizeListBuilder;
}(builder_1.Builder));
exports.FixedSizeListBuilder = FixedSizeListBuilder;

//# sourceMappingURL=fixedsizelist.js.map
