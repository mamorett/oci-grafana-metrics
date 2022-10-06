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
exports.Chunked = void 0;
var tslib_1 = require("tslib");
var vector_1 = require("../util/vector");
var type_1 = require("../type");
var args_1 = require("../util/args");
var vector_2 = require("../vector");
/** @ignore */
var ChunkedIterator = /** @class */ (function () {
    function ChunkedIterator(chunks) {
        this.chunks = chunks;
        this.chunkIndex = 0;
        this.chunkIterator = this.getChunkIterator();
    }
    ChunkedIterator.prototype.next = function () {
        while (this.chunkIndex < this.chunks.length) {
            var next = this.chunkIterator.next();
            if (!next.done) {
                return next;
            }
            if (++this.chunkIndex < this.chunks.length) {
                this.chunkIterator = this.getChunkIterator();
            }
        }
        return { done: true, value: null };
    };
    ChunkedIterator.prototype.getChunkIterator = function () {
        return this.chunks[this.chunkIndex][Symbol.iterator]();
    };
    ChunkedIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return ChunkedIterator;
}());
/** @ignore */
var Chunked = /** @class */ (function (_super) {
    tslib_1.__extends(Chunked, _super);
    function Chunked(type, chunks, offsets) {
        if (chunks === void 0) { chunks = []; }
        if (offsets === void 0) { offsets = calculateOffsets(chunks); }
        var _this = _super.call(this) || this;
        _this._nullCount = -1;
        _this._type = type;
        _this._chunks = chunks;
        _this._chunkOffsets = offsets;
        _this._length = offsets[offsets.length - 1];
        _this._numChildren = (_this._type.children || []).length;
        return _this;
    }
    /** @nocollapse */
    Chunked.flatten = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        return args_1.selectChunkArgs(vector_2.Vector, vectors);
    };
    /** @nocollapse */
    Chunked.concat = function () {
        var vectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vectors[_i] = arguments[_i];
        }
        var chunks = Chunked.flatten.apply(Chunked, tslib_1.__spread(vectors));
        return new Chunked(chunks[0].type, chunks);
    };
    Object.defineProperty(Chunked.prototype, "type", {
        get: function () { return this._type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "length", {
        get: function () { return this._length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "chunks", {
        get: function () { return this._chunks; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "typeId", {
        get: function () { return this._type.typeId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "VectorName", {
        get: function () { return "Chunked<" + this._type + ">"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "data", {
        get: function () {
            return this._chunks[0] ? this._chunks[0].data : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "ArrayType", {
        get: function () { return this._type.ArrayType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "numChildren", {
        get: function () { return this._numChildren; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "stride", {
        get: function () { return this._chunks[0] ? this._chunks[0].stride : 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "byteLength", {
        get: function () {
            return this._chunks.reduce(function (byteLength, chunk) { return byteLength + chunk.byteLength; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "nullCount", {
        get: function () {
            var nullCount = this._nullCount;
            if (nullCount < 0) {
                this._nullCount = nullCount = this._chunks.reduce(function (x, _a) {
                    var nullCount = _a.nullCount;
                    return x + nullCount;
                }, 0);
            }
            return nullCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "indices", {
        get: function () {
            if (type_1.DataType.isDictionary(this._type)) {
                if (!this._indices) {
                    var chunks = this._chunks;
                    this._indices = (chunks.length === 1
                        ? chunks[0].indices
                        : Chunked.concat.apply(Chunked, tslib_1.__spread(chunks.map(function (x) { return x.indices; }))));
                }
                return this._indices;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Chunked.prototype, "dictionary", {
        get: function () {
            if (type_1.DataType.isDictionary(this._type)) {
                return this._chunks[this._chunks.length - 1].data.dictionary;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Chunked.prototype[Symbol.iterator] = function () {
        return new ChunkedIterator(this._chunks);
    };
    Chunked.prototype.clone = function (chunks) {
        if (chunks === void 0) { chunks = this._chunks; }
        return new Chunked(this._type, chunks);
    };
    Chunked.prototype.concat = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return this.clone(Chunked.flatten.apply(Chunked, tslib_1.__spread([this], others)));
    };
    Chunked.prototype.slice = function (begin, end) {
        return vector_1.clampRange(this, begin, end, this._sliceInternal);
    };
    Chunked.prototype.getChildAt = function (index) {
        if (index < 0 || index >= this._numChildren) {
            return null;
        }
        var columns = this._children || (this._children = []);
        var child, field, chunks;
        if (child = columns[index]) {
            return child;
        }
        if (field = (this._type.children || [])[index]) {
            chunks = this._chunks
                .map(function (vector) { return vector.getChildAt(index); })
                .filter(function (vec) { return vec != null; });
            if (chunks.length > 0) {
                return (columns[index] = new Chunked(field.type, chunks));
            }
        }
        return null;
    };
    Chunked.prototype.search = function (index, then) {
        var idx = index;
        // binary search to find the child vector and value indices
        var offsets = this._chunkOffsets;
        var rhs = offsets.length - 1;
        // return early if out of bounds, or if there's just one child
        if (idx < 0) {
            return null;
        }
        if (idx >= offsets[rhs]) {
            return null;
        }
        if (rhs <= 1) {
            return then ? then(this, 0, idx) : [0, idx];
        }
        var lhs = 0, pos = 0, mid = 0;
        do {
            if (lhs + 1 === rhs) {
                return then ? then(this, lhs, idx - pos) : [lhs, idx - pos];
            }
            mid = lhs + ((rhs - lhs) / 2) | 0;
            idx >= offsets[mid] ? (lhs = mid) : (rhs = mid);
        } while (idx < offsets[rhs] && idx >= (pos = offsets[lhs]));
        return null;
    };
    Chunked.prototype.isValid = function (index) {
        return !!this.search(index, this.isValidInternal);
    };
    Chunked.prototype.get = function (index) {
        return this.search(index, this.getInternal);
    };
    Chunked.prototype.set = function (index, value) {
        this.search(index, function (_a, i, j) {
            var chunks = _a.chunks;
            return chunks[i].set(j, value);
        });
    };
    Chunked.prototype.indexOf = function (element, offset) {
        var _this = this;
        if (offset && typeof offset === 'number') {
            return this.search(offset, function (self, i, j) { return _this.indexOfInternal(self, i, j, element); });
        }
        return this.indexOfInternal(this, 0, Math.max(0, offset || 0), element);
    };
    Chunked.prototype.toArray = function () {
        var chunks = this.chunks;
        var n = chunks.length;
        var ArrayType = this._type.ArrayType;
        if (n <= 0) {
            return new ArrayType(0);
        }
        if (n <= 1) {
            return chunks[0].toArray();
        }
        var len = 0;
        var src = new Array(n);
        for (var i = -1; ++i < n;) {
            len += (src[i] = chunks[i].toArray()).length;
        }
        if (ArrayType !== src[0].constructor) {
            ArrayType = src[0].constructor;
        }
        var dst = new ArrayType(len);
        var set = ArrayType === Array ? arraySet : typedSet;
        for (var i = -1, idx = 0; ++i < n;) {
            idx = set(src[i], dst, idx);
        }
        return dst;
    };
    Chunked.prototype.getInternal = function (_a, i, j) {
        var _chunks = _a._chunks;
        return _chunks[i].get(j);
    };
    Chunked.prototype.isValidInternal = function (_a, i, j) {
        var _chunks = _a._chunks;
        return _chunks[i].isValid(j);
    };
    Chunked.prototype.indexOfInternal = function (_a, chunkIndex, fromIndex, element) {
        var _chunks = _a._chunks;
        var i = chunkIndex - 1;
        var n = _chunks.length;
        var start = fromIndex, offset = 0, found = -1;
        while (++i < n) {
            if (~(found = _chunks[i].indexOf(element, start))) {
                return offset + found;
            }
            start = 0;
            offset += _chunks[i].length;
        }
        return -1;
    };
    Chunked.prototype._sliceInternal = function (self, begin, end) {
        var slices = [];
        var chunks = self.chunks, chunkOffsets = self._chunkOffsets;
        for (var i = -1, n = chunks.length; ++i < n;) {
            var chunk = chunks[i];
            var chunkLength = chunk.length;
            var chunkOffset = chunkOffsets[i];
            // If the child is to the right of the slice boundary, we can stop
            if (chunkOffset >= end) {
                break;
            }
            // If the child is to the left of of the slice boundary, exclude
            if (begin >= chunkOffset + chunkLength) {
                continue;
            }
            // If the child is between both left and right boundaries, include w/o slicing
            if (chunkOffset >= begin && (chunkOffset + chunkLength) <= end) {
                slices.push(chunk);
                continue;
            }
            // If the child overlaps one of the slice boundaries, include that slice
            var from = Math.max(0, begin - chunkOffset);
            var to = Math.min(end - chunkOffset, chunkLength);
            slices.push(chunk.slice(from, to));
        }
        return self.clone(slices);
    };
    return Chunked;
}(vector_2.AbstractVector));
exports.Chunked = Chunked;
/** @ignore */
function calculateOffsets(vectors) {
    var offsets = new Uint32Array((vectors || []).length + 1);
    var offset = offsets[0] = 0;
    var length = offsets.length;
    for (var index = 0; ++index < length;) {
        offsets[index] = (offset += vectors[index - 1].length);
    }
    return offsets;
}
/** @ignore */
var typedSet = function (src, dst, offset) {
    dst.set(src, offset);
    return (offset + src.length);
};
/** @ignore */
var arraySet = function (src, dst, offset) {
    var idx = offset;
    for (var i = -1, n = src.length; ++i < n;) {
        dst[idx++] = src[i];
    }
    return idx;
};

//# sourceMappingURL=chunked.js.map
