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
exports.StructBuilder = void 0;
var tslib_1 = require("tslib");
var schema_1 = require("../schema");
var builder_1 = require("../builder");
var type_1 = require("../type");
/** @ignore */
var StructBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(StructBuilder, _super);
    function StructBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StructBuilder.prototype.addChild = function (child, name) {
        if (name === void 0) { name = "" + this.numChildren; }
        var childIndex = this.children.push(child);
        this.type = new type_1.Struct(tslib_1.__spread(this.type.children, [new schema_1.Field(name, child.type, true)]));
        return childIndex;
    };
    return StructBuilder;
}(builder_1.Builder));
exports.StructBuilder = StructBuilder;

//# sourceMappingURL=struct.js.map
