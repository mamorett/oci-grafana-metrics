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
exports.BinaryBuilder = void 0;
var tslib_1 = require("tslib");
var buffer_1 = require("../util/buffer");
var buffer_2 = require("./buffer");
var builder_1 = require("../builder");
/** @ignore */
var BinaryBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(BinaryBuilder, _super);
    function BinaryBuilder(opts) {
        var _this = _super.call(this, opts) || this;
        _this._values = new buffer_2.BufferBuilder(new Uint8Array(0));
        return _this;
    }
    Object.defineProperty(BinaryBuilder.prototype, "byteLength", {
        get: function () {
            var size = this._pendingLength + (this.length * 4);
            this._offsets && (size += this._offsets.byteLength);
            this._values && (size += this._values.byteLength);
            this._nulls && (size += this._nulls.byteLength);
            return size;
        },
        enumerable: false,
        configurable: true
    });
    BinaryBuilder.prototype.setValue = function (index, value) {
        return _super.prototype.setValue.call(this, index, buffer_1.toUint8Array(value));
    };
    BinaryBuilder.prototype._flushPending = function (pending, pendingLength) {
        var e_1, _a, _b;
        var offsets = this._offsets;
        var data = this._values.reserve(pendingLength).buffer;
        var index = 0, length = 0, offset = 0, value;
        try {
            for (var pending_1 = tslib_1.__values(pending), pending_1_1 = pending_1.next(); !pending_1_1.done; pending_1_1 = pending_1.next()) {
                _b = tslib_1.__read(pending_1_1.value, 2), index = _b[0], value = _b[1];
                if (value === undefined) {
                    offsets.set(index, 0);
                }
                else {
                    length = value.length;
                    data.set(value, offset);
                    offsets.set(index, length);
                    offset += length;
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
    return BinaryBuilder;
}(builder_1.VariableWidthBuilder));
exports.BinaryBuilder = BinaryBuilder;

//# sourceMappingURL=binary.js.map
