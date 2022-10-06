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
exports.DenseUnionBuilder = exports.SparseUnionBuilder = exports.UnionBuilder = void 0;
var tslib_1 = require("tslib");
var schema_1 = require("../schema");
var buffer_1 = require("./buffer");
var builder_1 = require("../builder");
var type_1 = require("../type");
/** @ignore */
var UnionBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(UnionBuilder, _super);
    function UnionBuilder(options) {
        var _this = _super.call(this, options) || this;
        _this._typeIds = new buffer_1.DataBufferBuilder(new Int8Array(0), 1);
        if (typeof options['valueToChildTypeId'] === 'function') {
            _this._valueToChildTypeId = options['valueToChildTypeId'];
        }
        return _this;
    }
    Object.defineProperty(UnionBuilder.prototype, "typeIdToChildIndex", {
        get: function () { return this.type.typeIdToChildIndex; },
        enumerable: false,
        configurable: true
    });
    UnionBuilder.prototype.append = function (value, childTypeId) {
        return this.set(this.length, value, childTypeId);
    };
    UnionBuilder.prototype.set = function (index, value, childTypeId) {
        if (childTypeId === undefined) {
            childTypeId = this._valueToChildTypeId(this, value, index);
        }
        if (this.setValid(index, this.isValid(value))) {
            this.setValue(index, value, childTypeId);
        }
        return this;
    };
    UnionBuilder.prototype.setValue = function (index, value, childTypeId) {
        this._typeIds.set(index, childTypeId);
        _super.prototype.setValue.call(this, index, value);
    };
    UnionBuilder.prototype.addChild = function (child, name) {
        if (name === void 0) { name = "" + this.children.length; }
        var childTypeId = this.children.push(child);
        var _a = this.type, children = _a.children, mode = _a.mode, typeIds = _a.typeIds;
        var fields = tslib_1.__spread(children, [new schema_1.Field(name, child.type)]);
        this.type = new type_1.Union(mode, tslib_1.__spread(typeIds, [childTypeId]), fields);
        return childTypeId;
    };
    /** @ignore */
    // @ts-ignore
    UnionBuilder.prototype._valueToChildTypeId = function (builder, value, offset) {
        throw new Error("Cannot map UnionBuilder value to child typeId. Pass the `childTypeId` as the second argument to unionBuilder.append(), or supply a `valueToChildTypeId` function as part of the UnionBuilder constructor options.");
    };
    return UnionBuilder;
}(builder_1.Builder));
exports.UnionBuilder = UnionBuilder;
/** @ignore */
var SparseUnionBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(SparseUnionBuilder, _super);
    function SparseUnionBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SparseUnionBuilder;
}(UnionBuilder));
exports.SparseUnionBuilder = SparseUnionBuilder;
/** @ignore */
var DenseUnionBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(DenseUnionBuilder, _super);
    function DenseUnionBuilder(options) {
        var _this = _super.call(this, options) || this;
        _this._offsets = new buffer_1.DataBufferBuilder(new Int32Array(0));
        return _this;
    }
    /** @ignore */
    DenseUnionBuilder.prototype.setValue = function (index, value, childTypeId) {
        var childIndex = this.type.typeIdToChildIndex[childTypeId];
        this._offsets.set(index, this.getChildAt(childIndex).length);
        return _super.prototype.setValue.call(this, index, value, childTypeId);
    };
    return DenseUnionBuilder;
}(UnionBuilder));
exports.DenseUnionBuilder = DenseUnionBuilder;

//# sourceMappingURL=union.js.map
