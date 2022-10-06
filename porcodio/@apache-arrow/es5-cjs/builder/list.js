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
exports.ListBuilder = void 0;
var tslib_1 = require("tslib");
var run_1 = require("./run");
var schema_1 = require("../schema");
var type_1 = require("../type");
var buffer_1 = require("./buffer");
var builder_1 = require("../builder");
/** @ignore */
var ListBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(ListBuilder, _super);
    function ListBuilder(opts) {
        var _this = _super.call(this, opts) || this;
        _this._run = new run_1.Run();
        _this._offsets = new buffer_1.OffsetsBufferBuilder();
        return _this;
    }
    ListBuilder.prototype.addChild = function (child, name) {
        if (name === void 0) { name = '0'; }
        if (this.numChildren > 0) {
            throw new Error('ListBuilder can only have one child.');
        }
        this.children[this.numChildren] = child;
        this.type = new type_1.List(new schema_1.Field(name, child.type, true));
        return this.numChildren - 1;
    };
    ListBuilder.prototype.clear = function () {
        this._run.clear();
        return _super.prototype.clear.call(this);
    };
    ListBuilder.prototype._flushPending = function (pending) {
        var e_1, _a, _b;
        var run = this._run;
        var offsets = this._offsets;
        var setValue = this._setValue;
        var index = 0, value;
        try {
            for (var pending_1 = tslib_1.__values(pending), pending_1_1 = pending_1.next(); !pending_1_1.done; pending_1_1 = pending_1.next()) {
                _b = tslib_1.__read(pending_1_1.value, 2), index = _b[0], value = _b[1];
                if (value === undefined) {
                    offsets.set(index, 0);
                }
                else {
                    offsets.set(index, value.length);
                    setValue(this, index, run.bind(value));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pending_1_1 && !pending_1_1.done && (_a = pending_1.return)) _a.call(pending_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return ListBuilder;
}(builder_1.VariableWidthBuilder));
exports.ListBuilder = ListBuilder;

//# sourceMappingURL=list.js.map
