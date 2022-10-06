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
exports.BuilderTransform = exports.builderThroughDOMStream = void 0;
var tslib_1 = require("tslib");
var index_1 = require("../../builder/index");
/** @ignore */
function builderThroughDOMStream(options) {
    return new BuilderTransform(options);
}
exports.builderThroughDOMStream = builderThroughDOMStream;
/** @ignore */
var BuilderTransform = /** @class */ (function () {
    function BuilderTransform(options) {
        // Access properties by string indexers to defeat closure compiler
        var _a, _b;
        var _this = this;
        this._numChunks = 0;
        this._finished = false;
        this._bufferedSize = 0;
        var readableStrategy = options["readableStrategy"], writableStrategy = options["writableStrategy"], _c = options["queueingStrategy"], queueingStrategy = _c === void 0 ? 'count' : _c, builderOptions = tslib_1.__rest(options, ['readableStrategy', 'writableStrategy', 'queueingStrategy']);
        this._controller = null;
        this._builder = index_1.Builder.new(builderOptions);
        this._getSize = queueingStrategy !== 'bytes' ? chunkLength : chunkByteLength;
        var _d = tslib_1.__assign({}, readableStrategy)["highWaterMark"], readableHighWaterMark = _d === void 0 ? queueingStrategy === 'bytes' ? Math.pow(2, 14) : 1000 : _d;
        var _e = tslib_1.__assign({}, writableStrategy)["highWaterMark"], writableHighWaterMark = _e === void 0 ? queueingStrategy === 'bytes' ? Math.pow(2, 14) : 1000 : _e;
        this['readable'] = new ReadableStream((_a = {},
            _a['cancel'] = function () { _this._builder.clear(); },
            _a['pull'] = function (c) { _this._maybeFlush(_this._builder, _this._controller = c); },
            _a['start'] = function (c) { _this._maybeFlush(_this._builder, _this._controller = c); },
            _a), {
            'highWaterMark': readableHighWaterMark,
            'size': queueingStrategy !== 'bytes' ? chunkLength : chunkByteLength,
        });
        this['writable'] = new WritableStream((_b = {},
            _b['abort'] = function () { _this._builder.clear(); },
            _b['write'] = function () { _this._maybeFlush(_this._builder, _this._controller); },
            _b['close'] = function () { _this._maybeFlush(_this._builder.finish(), _this._controller); },
            _b), {
            'highWaterMark': writableHighWaterMark,
            'size': function (value) { return _this._writeValueAndReturnChunkSize(value); },
        });
    }
    BuilderTransform.prototype._writeValueAndReturnChunkSize = function (value) {
        var bufferedSize = this._bufferedSize;
        this._bufferedSize = this._getSize(this._builder.append(value));
        return this._bufferedSize - bufferedSize;
    };
    BuilderTransform.prototype._maybeFlush = function (builder, controller) {
        if (controller === null) {
            return;
        }
        if (this._bufferedSize >= controller.desiredSize) {
            ++this._numChunks && this._enqueue(controller, builder.toVector());
        }
        if (builder.finished) {
            if (builder.length > 0 || this._numChunks === 0) {
                ++this._numChunks && this._enqueue(controller, builder.toVector());
            }
            if (!this._finished && (this._finished = true)) {
                this._enqueue(controller, null);
            }
        }
    };
    BuilderTransform.prototype._enqueue = function (controller, chunk) {
        this._bufferedSize = 0;
        this._controller = null;
        chunk === null ? controller.close() : controller.enqueue(chunk);
    };
    return BuilderTransform;
}());
exports.BuilderTransform = BuilderTransform;
/** @ignore */ var chunkLength = function (chunk) { return chunk.length; };
/** @ignore */ var chunkByteLength = function (chunk) { return chunk.byteLength; };

//# sourceMappingURL=builder.js.map
