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
exports.VariableWidthBuilder = exports.FixedWidthBuilder = exports.Builder = void 0;
var tslib_1 = require("tslib");
var vector_1 = require("./vector");
var enum_1 = require("./enum");
var data_1 = require("./data");
var valid_1 = require("./builder/valid");
var buffer_1 = require("./builder/buffer");
var type_1 = require("./type");
/**
 * An abstract base class for types that construct Arrow Vectors from arbitrary JavaScript values.
 *
 * A `Builder` is responsible for writing arbitrary JavaScript values
 * to ArrayBuffers and/or child Builders according to the Arrow specification
 * for each DataType, creating or resizing the underlying ArrayBuffers as necessary.
 *
 * The `Builder` for each Arrow `DataType` handles converting and appending
 * values for a given `DataType`. The high-level {@link Builder.new `Builder.new()`} convenience
 * method creates the specific `Builder` subclass for the supplied `DataType`.
 *
 * Once created, `Builder` instances support both appending values to the end
 * of the `Builder`, and random-access writes to specific indices
 * (`Builder.prototype.append(value)` is a convenience method for
 * `builder.set(builder.length, value)`). Appending or setting values beyond the
 * Builder's current length may cause the builder to grow its underlying buffers
 * or child Builders (if applicable) to accommodate the new values.
 *
 * After enough values have been written to a `Builder`, `Builder.prototype.flush()`
 * will commit the values to the underlying ArrayBuffers (or child Builders). The
 * internal Builder state will be reset, and an instance of `Data<T>` is returned.
 * Alternatively, `Builder.prototype.toVector()` will flush the `Builder` and return
 * an instance of `Vector<T>` instead.
 *
 * When there are no more values to write, use `Builder.prototype.finish()` to
 * finalize the `Builder`. This does not reset the internal state, so it is
 * necessary to call `Builder.prototype.flush()` or `toVector()` one last time
 * if there are still values queued to be flushed.
 *
 * Note: calling `Builder.prototype.finish()` is required when using a `DictionaryBuilder`,
 * because this is when it flushes the values that have been enqueued in its internal
 * dictionary's `Builder`, and creates the `dictionaryVector` for the `Dictionary` `DataType`.
 *
 * ```ts
 * import { Builder, Utf8 } from 'apache-arrow';
 *
 * const utf8Builder = Builder.new({
 *     type: new Utf8(),
 *     nullValues: [null, 'n/a']
 * });
 *
 * utf8Builder
 *     .append('hello')
 *     .append('n/a')
 *     .append('world')
 *     .append(null);
 *
 * const utf8Vector = utf8Builder.finish().toVector();
 *
 * console.log(utf8Vector.toJSON());
 * // > ["hello", null, "world", null]
 * ```
 *
 * @typeparam T The `DataType` of this `Builder`.
 * @typeparam TNull The type(s) of values which will be considered null-value sentinels.
 */
var Builder = /** @class */ (function () {
    /**
     * Construct a builder with the given Arrow DataType with optional null values,
     * which will be interpreted as "null" when set or appended to the `Builder`.
     * @param {{ type: T, nullValues?: any[] }} options A `BuilderOptions` object used to create this `Builder`.
     */
    function Builder(_a) {
        var type = _a["type"], nulls = _a["nullValues"];
        /**
         * The number of values written to the `Builder` that haven't been flushed yet.
         * @readonly
         */
        this.length = 0;
        /**
         * A boolean indicating whether `Builder.prototype.finish()` has been called on this `Builder`.
         * @readonly
         */
        this.finished = false;
        this.type = type;
        this.children = [];
        this.nullValues = nulls;
        this.stride = type_1.strideForType(type);
        this._nulls = new buffer_1.BitmapBufferBuilder();
        if (nulls && nulls.length > 0) {
            this._isValid = valid_1.createIsValidFunction(nulls);
        }
    }
    /**
     * Create a `Builder` instance based on the `type` property of the supplied `options` object.
     * @param {BuilderOptions<T, TNull>} options An object with a required `DataType` instance
     * and other optional parameters to be passed to the `Builder` subclass for the given `type`.
     *
     * @typeparam T The `DataType` of the `Builder` to create.
     * @typeparam TNull The type(s) of values which will be considered null-value sentinels.
     * @nocollapse
     */
    // @ts-ignore
    Builder.new = function (options) { };
    /** @nocollapse */
    // @ts-ignore
    Builder.throughNode = function (options) {
        throw new Error("\"throughNode\" not available in this environment");
    };
    /** @nocollapse */
    // @ts-ignore
    Builder.throughDOM = function (options) {
        throw new Error("\"throughDOM\" not available in this environment");
    };
    /**
     * Transform a synchronous `Iterable` of arbitrary JavaScript values into a
     * sequence of Arrow Vector<T> following the chunking semantics defined in
     * the supplied `options` argument.
     *
     * This function returns a function that accepts an `Iterable` of values to
     * transform. When called, this function returns an Iterator of `Vector<T>`.
     *
     * The resulting `Iterator<Vector<T>>` yields Vectors based on the
     * `queueingStrategy` and `highWaterMark` specified in the `options` argument.
     *
     * * If `queueingStrategy` is `"count"` (or omitted), The `Iterator<Vector<T>>`
     *   will flush the underlying `Builder` (and yield a new `Vector<T>`) once the
     *   Builder's `length` reaches or exceeds the supplied `highWaterMark`.
     * * If `queueingStrategy` is `"bytes"`, the `Iterator<Vector<T>>` will flush
     *   the underlying `Builder` (and yield a new `Vector<T>`) once its `byteLength`
     *   reaches or exceeds the supplied `highWaterMark`.
     *
     * @param {IterableBuilderOptions<T, TNull>} options An object of properties which determine the `Builder` to create and the chunking semantics to use.
     * @returns A function which accepts a JavaScript `Iterable` of values to
     *          write, and returns an `Iterator` that yields Vectors according
     *          to the chunking semantics defined in the `options` argument.
     * @nocollapse
     */
    Builder.throughIterable = function (options) {
        return throughIterable(options);
    };
    /**
     * Transform an `AsyncIterable` of arbitrary JavaScript values into a
     * sequence of Arrow Vector<T> following the chunking semantics defined in
     * the supplied `options` argument.
     *
     * This function returns a function that accepts an `AsyncIterable` of values to
     * transform. When called, this function returns an AsyncIterator of `Vector<T>`.
     *
     * The resulting `AsyncIterator<Vector<T>>` yields Vectors based on the
     * `queueingStrategy` and `highWaterMark` specified in the `options` argument.
     *
     * * If `queueingStrategy` is `"count"` (or omitted), The `AsyncIterator<Vector<T>>`
     *   will flush the underlying `Builder` (and yield a new `Vector<T>`) once the
     *   Builder's `length` reaches or exceeds the supplied `highWaterMark`.
     * * If `queueingStrategy` is `"bytes"`, the `AsyncIterator<Vector<T>>` will flush
     *   the underlying `Builder` (and yield a new `Vector<T>`) once its `byteLength`
     *   reaches or exceeds the supplied `highWaterMark`.
     *
     * @param {IterableBuilderOptions<T, TNull>} options An object of properties which determine the `Builder` to create and the chunking semantics to use.
     * @returns A function which accepts a JavaScript `AsyncIterable` of values
     *          to write, and returns an `AsyncIterator` that yields Vectors
     *          according to the chunking semantics defined in the `options`
     *          argument.
     * @nocollapse
     */
    Builder.throughAsyncIterable = function (options) {
        return throughAsyncIterable(options);
    };
    /**
     * Flush the `Builder` and return a `Vector<T>`.
     * @returns {Vector<T>} A `Vector<T>` of the flushed values.
     */
    Builder.prototype.toVector = function () { return vector_1.Vector.new(this.flush()); };
    Object.defineProperty(Builder.prototype, "ArrayType", {
        get: function () { return this.type.ArrayType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "nullCount", {
        get: function () { return this._nulls.numInvalid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "numChildren", {
        get: function () { return this.children.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "byteLength", {
        /**
         * @returns The aggregate length (in bytes) of the values that have been written.
         */
        get: function () {
            var size = 0;
            this._offsets && (size += this._offsets.byteLength);
            this._values && (size += this._values.byteLength);
            this._nulls && (size += this._nulls.byteLength);
            this._typeIds && (size += this._typeIds.byteLength);
            return this.children.reduce(function (size, child) { return size + child.byteLength; }, size);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "reservedLength", {
        /**
         * @returns The aggregate number of rows that have been reserved to write new values.
         */
        get: function () {
            return this._nulls.reservedLength;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "reservedByteLength", {
        /**
         * @returns The aggregate length (in bytes) that has been reserved to write new values.
         */
        get: function () {
            var size = 0;
            this._offsets && (size += this._offsets.reservedByteLength);
            this._values && (size += this._values.reservedByteLength);
            this._nulls && (size += this._nulls.reservedByteLength);
            this._typeIds && (size += this._typeIds.reservedByteLength);
            return this.children.reduce(function (size, child) { return size + child.reservedByteLength; }, size);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "valueOffsets", {
        get: function () { return this._offsets ? this._offsets.buffer : null; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "values", {
        get: function () { return this._values ? this._values.buffer : null; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "nullBitmap", {
        get: function () { return this._nulls ? this._nulls.buffer : null; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Builder.prototype, "typeIds", {
        get: function () { return this._typeIds ? this._typeIds.buffer : null; },
        enumerable: false,
        configurable: true
    });
    /**
     * Appends a value (or null) to this `Builder`.
     * This is equivalent to `builder.set(builder.length, value)`.
     * @param {T['TValue'] | TNull } value The value to append.
     */
    Builder.prototype.append = function (value) { return this.set(this.length, value); };
    /**
     * Validates whether a value is valid (true), or null (false)
     * @param {T['TValue'] | TNull } value The value to compare against null the value representations
     */
    Builder.prototype.isValid = function (value) { return this._isValid(value); };
    /**
     * Write a value (or null-value sentinel) at the supplied index.
     * If the value matches one of the null-value representations, a 1-bit is
     * written to the null `BitmapBufferBuilder`. Otherwise, a 0 is written to
     * the null `BitmapBufferBuilder`, and the value is passed to
     * `Builder.prototype.setValue()`.
     * @param {number} index The index of the value to write.
     * @param {T['TValue'] | TNull } value The value to write at the supplied index.
     * @returns {this} The updated `Builder` instance.
     */
    Builder.prototype.set = function (index, value) {
        if (this.setValid(index, this.isValid(value))) {
            this.setValue(index, value);
        }
        return this;
    };
    /**
     * Write a value to the underlying buffers at the supplied index, bypassing
     * the null-value check. This is a low-level method that
     * @param {number} index
     * @param {T['TValue'] | TNull } value
     */
    Builder.prototype.setValue = function (index, value) { this._setValue(this, index, value); };
    Builder.prototype.setValid = function (index, valid) {
        this.length = this._nulls.set(index, +valid).length;
        return valid;
    };
    // @ts-ignore
    Builder.prototype.addChild = function (child, name) {
        if (name === void 0) { name = "" + this.numChildren; }
        throw new Error("Cannot append children to non-nested type \"" + this.type + "\"");
    };
    /**
     * Retrieve the child `Builder` at the supplied `index`, or null if no child
     * exists at that index.
     * @param {number} index The index of the child `Builder` to retrieve.
     * @returns {Builder | null} The child Builder at the supplied index or null.
     */
    Builder.prototype.getChildAt = function (index) {
        return this.children[index] || null;
    };
    /**
     * Commit all the values that have been written to their underlying
     * ArrayBuffers, including any child Builders if applicable, and reset
     * the internal `Builder` state.
     * @returns A `Data<T>` of the buffers and childData representing the values written.
     */
    Builder.prototype.flush = function () {
        var buffers = [];
        var values = this._values;
        var offsets = this._offsets;
        var typeIds = this._typeIds;
        var _a = this, length = _a.length, nullCount = _a.nullCount;
        if (typeIds) { /* Unions */
            buffers[enum_1.BufferType.TYPE] = typeIds.flush(length);
            // DenseUnions
            offsets && (buffers[enum_1.BufferType.OFFSET] = offsets.flush(length));
        }
        else if (offsets) { /* Variable-width primitives (Binary, Utf8) and Lists */
            // Binary, Utf8
            values && (buffers[enum_1.BufferType.DATA] = values.flush(offsets.last()));
            buffers[enum_1.BufferType.OFFSET] = offsets.flush(length);
        }
        else if (values) { /* Fixed-width primitives (Int, Float, Decimal, Time, Timestamp, and Interval) */
            buffers[enum_1.BufferType.DATA] = values.flush(length);
        }
        nullCount > 0 && (buffers[enum_1.BufferType.VALIDITY] = this._nulls.flush(length));
        var data = data_1.Data.new(this.type, 0, length, nullCount, buffers, this.children.map(function (child) { return child.flush(); }));
        this.clear();
        return data;
    };
    /**
     * Finalize this `Builder`, and child builders if applicable.
     * @returns {this} The finalized `Builder` instance.
     */
    Builder.prototype.finish = function () {
        this.finished = true;
        this.children.forEach(function (child) { return child.finish(); });
        return this;
    };
    /**
     * Clear this Builder's internal state, including child Builders if applicable, and reset the length to 0.
     * @returns {this} The cleared `Builder` instance.
     */
    Builder.prototype.clear = function () {
        this.length = 0;
        this._offsets && (this._offsets.clear());
        this._values && (this._values.clear());
        this._nulls && (this._nulls.clear());
        this._typeIds && (this._typeIds.clear());
        this.children.forEach(function (child) { return child.clear(); });
        return this;
    };
    return Builder;
}());
exports.Builder = Builder;
Builder.prototype.length = 1;
Builder.prototype.stride = 1;
Builder.prototype.children = null;
Builder.prototype.finished = false;
Builder.prototype.nullValues = null;
Builder.prototype._isValid = function () { return true; };
/** @ignore */
var FixedWidthBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(FixedWidthBuilder, _super);
    function FixedWidthBuilder(opts) {
        var _this = _super.call(this, opts) || this;
        _this._values = new buffer_1.DataBufferBuilder(new _this.ArrayType(0), _this.stride);
        return _this;
    }
    FixedWidthBuilder.prototype.setValue = function (index, value) {
        var values = this._values;
        values.reserve(index - values.length + 1);
        return _super.prototype.setValue.call(this, index, value);
    };
    return FixedWidthBuilder;
}(Builder));
exports.FixedWidthBuilder = FixedWidthBuilder;
/** @ignore */
var VariableWidthBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(VariableWidthBuilder, _super);
    function VariableWidthBuilder(opts) {
        var _this = _super.call(this, opts) || this;
        _this._pendingLength = 0;
        _this._offsets = new buffer_1.OffsetsBufferBuilder();
        return _this;
    }
    VariableWidthBuilder.prototype.setValue = function (index, value) {
        var pending = this._pending || (this._pending = new Map());
        var current = pending.get(index);
        current && (this._pendingLength -= current.length);
        this._pendingLength += value.length;
        pending.set(index, value);
    };
    VariableWidthBuilder.prototype.setValid = function (index, isValid) {
        if (!_super.prototype.setValid.call(this, index, isValid)) {
            (this._pending || (this._pending = new Map())).set(index, undefined);
            return false;
        }
        return true;
    };
    VariableWidthBuilder.prototype.clear = function () {
        this._pendingLength = 0;
        this._pending = undefined;
        return _super.prototype.clear.call(this);
    };
    VariableWidthBuilder.prototype.flush = function () {
        this._flush();
        return _super.prototype.flush.call(this);
    };
    VariableWidthBuilder.prototype.finish = function () {
        this._flush();
        return _super.prototype.finish.call(this);
    };
    VariableWidthBuilder.prototype._flush = function () {
        var pending = this._pending;
        var pendingLength = this._pendingLength;
        this._pendingLength = 0;
        this._pending = undefined;
        if (pending && pending.size > 0) {
            this._flushPending(pending, pendingLength);
        }
        return this;
    };
    return VariableWidthBuilder;
}(Builder));
exports.VariableWidthBuilder = VariableWidthBuilder;
/** @ignore */
function throughIterable(options) {
    var _a = options["queueingStrategy"], queueingStrategy = _a === void 0 ? 'count' : _a;
    var _b = options["highWaterMark"], highWaterMark = _b === void 0 ? queueingStrategy !== 'bytes' ? 1000 : Math.pow(2, 14) : _b;
    var sizeProperty = queueingStrategy !== 'bytes' ? 'length' : 'byteLength';
    return function (source) {
        var numChunks, builder, source_1, source_1_1, value, _a, e_1_1;
        var e_1, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    numChunks = 0;
                    builder = Builder.new(options);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 9]);
                    source_1 = tslib_1.__values(source), source_1_1 = source_1.next();
                    _c.label = 2;
                case 2:
                    if (!!source_1_1.done) return [3 /*break*/, 6];
                    value = source_1_1.value;
                    if (!(builder.append(value)[sizeProperty] >= highWaterMark)) return [3 /*break*/, 5];
                    _a = ++numChunks;
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, builder.toVector()];
                case 3:
                    _a = (_c.sent());
                    _c.label = 4;
                case 4:
                    _a;
                    _c.label = 5;
                case 5:
                    source_1_1 = source_1.next();
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (source_1_1 && !source_1_1.done && (_b = source_1.return)) _b.call(source_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9:
                    if (!(builder.finish().length > 0 || numChunks === 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, builder.toVector()];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    };
}
/** @ignore */
function throughAsyncIterable(options) {
    var _a = options["queueingStrategy"], queueingStrategy = _a === void 0 ? 'count' : _a;
    var _b = options["highWaterMark"], highWaterMark = _b === void 0 ? queueingStrategy !== 'bytes' ? 1000 : Math.pow(2, 14) : _b;
    var sizeProperty = queueingStrategy !== 'bytes' ? 'length' : 'byteLength';
    return function (source) {
        return tslib_1.__asyncGenerator(this, arguments, function () {
            var numChunks, builder, source_2, source_2_1, value, _a, e_2_1;
            var e_2, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        numChunks = 0;
                        builder = Builder.new(options);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 9, 10, 15]);
                        source_2 = tslib_1.__asyncValues(source);
                        _c.label = 2;
                    case 2: return [4 /*yield*/, tslib_1.__await(source_2.next())];
                    case 3:
                        if (!(source_2_1 = _c.sent(), !source_2_1.done)) return [3 /*break*/, 8];
                        value = source_2_1.value;
                        if (!(builder.append(value)[sizeProperty] >= highWaterMark)) return [3 /*break*/, 7];
                        _a = ++numChunks;
                        if (!_a) return [3 /*break*/, 6];
                        return [4 /*yield*/, tslib_1.__await(builder.toVector())];
                    case 4: return [4 /*yield*/, _c.sent()];
                    case 5:
                        _a = (_c.sent());
                        _c.label = 6;
                    case 6:
                        _a;
                        _c.label = 7;
                    case 7: return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _c.trys.push([10, , 13, 14]);
                        if (!(source_2_1 && !source_2_1.done && (_b = source_2.return))) return [3 /*break*/, 12];
                        return [4 /*yield*/, tslib_1.__await(_b.call(source_2))];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15:
                        if (!(builder.finish().length > 0 || numChunks === 0)) return [3 /*break*/, 18];
                        return [4 /*yield*/, tslib_1.__await(builder.toVector())];
                    case 16: return [4 /*yield*/, _c.sent()];
                    case 17:
                        _c.sent();
                        _c.label = 18;
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
}

//# sourceMappingURL=builder.js.map
