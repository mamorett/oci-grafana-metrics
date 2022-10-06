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
exports.builderThroughNodeStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var index_1 = require("../../builder/index");
/** @ignore */
function builderThroughNodeStream(options) {
    return new BuilderDuplex(index_1.Builder.new(options), options);
}
exports.builderThroughNodeStream = builderThroughNodeStream;
/** @ignore */
var BuilderDuplex = /** @class */ (function (_super) {
    tslib_1.__extends(BuilderDuplex, _super);
    function BuilderDuplex(builder, options) {
        var _this = this;
        var _a = options.queueingStrategy, queueingStrategy = _a === void 0 ? 'count' : _a, _b = options.autoDestroy, autoDestroy = _b === void 0 ? true : _b;
        var _c = options.highWaterMark, highWaterMark = _c === void 0 ? queueingStrategy !== 'bytes' ? 1000 : Math.pow(2, 14) : _c;
        _this = _super.call(this, { autoDestroy: autoDestroy, highWaterMark: 1, allowHalfOpen: true, writableObjectMode: true, readableObjectMode: true }) || this;
        _this._numChunks = 0;
        _this._finished = false;
        _this._builder = builder;
        _this._desiredSize = highWaterMark;
        _this._getSize = queueingStrategy !== 'bytes' ? builderLength : builderByteLength;
        return _this;
    }
    BuilderDuplex.prototype._read = function (size) {
        this._maybeFlush(this._builder, this._desiredSize = size);
    };
    BuilderDuplex.prototype._final = function (cb) {
        this._maybeFlush(this._builder.finish(), this._desiredSize);
        cb && cb();
    };
    BuilderDuplex.prototype._write = function (value, _, cb) {
        var result = this._maybeFlush(this._builder.append(value), this._desiredSize);
        cb && cb();
        return result;
    };
    BuilderDuplex.prototype._destroy = function (err, cb) {
        this._builder.clear();
        cb && cb(err);
    };
    BuilderDuplex.prototype._maybeFlush = function (builder, size) {
        if (this._getSize(builder) >= size) {
            ++this._numChunks && this.push(builder.toVector());
        }
        if (builder.finished) {
            if (builder.length > 0 || this._numChunks === 0) {
                ++this._numChunks && this.push(builder.toVector());
            }
            if (!this._finished && (this._finished = true)) {
                this.push(null);
            }
            return false;
        }
        return this._getSize(builder) < this.writableHighWaterMark;
    };
    return BuilderDuplex;
}(stream_1.Duplex));
/** @ignore */ var builderLength = function (builder) { return builder.length; };
/** @ignore */ var builderByteLength = function (builder) { return builder.byteLength; };

//# sourceMappingURL=builder.js.map
