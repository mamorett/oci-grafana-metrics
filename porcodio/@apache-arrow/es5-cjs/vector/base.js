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
exports.BaseVector = void 0;
var tslib_1 = require("tslib");
var enum_1 = require("../enum");
var chunked_1 = require("./chunked");
var vector_1 = require("../util/vector");
var vector_2 = require("../vector");
/** @ignore */
var BaseVector = /** @class */ (function (_super) {
    tslib_1.__extends(BaseVector, _super);
    function BaseVector(data, children) {
        var _this = _super.call(this) || this;
        _this._children = children;
        _this.numChildren = data.childData.length;
        _this._bindDataAccessors(_this.data = data);
        return _this;
    }
    Object.defineProperty(BaseVector.prototype, "type", {
        get: function () { return this.data.type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "typeId", {
        get: function () { return this.data.typeId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "length", {
        get: function () { return this.data.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "offset", {
        get: function () { return this.data.offset; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "stride", {
        get: function () { return this.data.stride; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "nullCount", {
        get: function () { return this.data.nullCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "byteLength", {
        get: function () { return this.data.byteLength; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "VectorName", {
        get: function () { return enum_1.Type[this.typeId] + "Vector"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "ArrayType", {
        get: function () { return this.type.ArrayType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "values", {
        get: function () { return this.data.values; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "typeIds", {
        get: function () { return this.data.typeIds; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "nullBitmap", {
        get: function () { return this.data.nullBitmap; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, "valueOffsets", {
        get: function () { return this.data.valueOffsets; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseVector.prototype, Symbol.toStringTag, {
        get: function () { return this.VectorName + "<" + this.type[Symbol.toStringTag] + ">"; },
        enumerable: false,
        configurable: true
    });
    BaseVector.prototype.clone = function (data, children) {
        if (children === void 0) { children = this._children; }
        return vector_2.Vector.new(data, children);
    };
    BaseVector.prototype.concat = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return chunked_1.Chunked.concat.apply(chunked_1.Chunked, tslib_1.__spread([this], others));
    };
    BaseVector.prototype.slice = function (begin, end) {
        // Adjust args similar to Array.prototype.slice. Normalize begin/end to
        // clamp between 0 and length, and wrap around on negative indices, e.g.
        // slice(-1, 5) or slice(5, -1)
        return vector_1.clampRange(this, begin, end, this._sliceInternal);
    };
    BaseVector.prototype.isValid = function (index) {
        if (this.nullCount > 0) {
            var idx = this.offset + index;
            var val = this.nullBitmap[idx >> 3];
            var mask = (val & (1 << (idx % 8)));
            return mask !== 0;
        }
        return true;
    };
    BaseVector.prototype.getChildAt = function (index) {
        return index < 0 || index >= this.numChildren ? null : ((this._children || (this._children = []))[index] ||
            (this._children[index] = vector_2.Vector.new(this.data.childData[index])));
    };
    BaseVector.prototype.toJSON = function () { return tslib_1.__spread(this); };
    BaseVector.prototype._sliceInternal = function (self, begin, end) {
        return self.clone(self.data.slice(begin, end - begin), null);
    };
    // @ts-ignore
    BaseVector.prototype._bindDataAccessors = function (data) {
        // Implementation in src/vectors/index.ts due to circular dependency/packaging shenanigans
    };
    return BaseVector;
}(vector_2.AbstractVector));
exports.BaseVector = BaseVector;
BaseVector.prototype[Symbol.isConcatSpreadable] = true;

//# sourceMappingURL=base.js.map
