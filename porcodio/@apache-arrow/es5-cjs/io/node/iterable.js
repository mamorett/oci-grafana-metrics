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
exports.toNodeStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var compat_1 = require("../../util/compat");
/** @ignore */
function toNodeStream(source, options) {
    if (compat_1.isAsyncIterable(source)) {
        return new AsyncIterableReadable(source[Symbol.asyncIterator](), options);
    }
    if (compat_1.isIterable(source)) {
        return new IterableReadable(source[Symbol.iterator](), options);
    }
    /* istanbul ignore next */
    throw new Error("toNodeStream() must be called with an Iterable or AsyncIterable");
}
exports.toNodeStream = toNodeStream;
/** @ignore */
var IterableReadable = /** @class */ (function (_super) {
    tslib_1.__extends(IterableReadable, _super);
    function IterableReadable(it, options) {
        var _this = _super.call(this, options) || this;
        _this._iterator = it;
        _this._pulling = false;
        _this._bytesMode = !options || !options.objectMode;
        return _this;
    }
    IterableReadable.prototype._read = function (size) {
        var it = this._iterator;
        if (it && !this._pulling && (this._pulling = true)) {
            this._pulling = this._pull(size, it);
        }
    };
    IterableReadable.prototype._destroy = function (e, cb) {
        var it = this._iterator;
        var fn;
        it && (fn = e != null && it.throw || it.return);
        fn && fn.call(it, e);
        cb && cb(null);
    };
    IterableReadable.prototype._pull = function (size, it) {
        var bm = this._bytesMode;
        var r = null;
        while (this.readable && !(r = it.next(bm ? size : null)).done) {
            if (size != null) {
                size -= (bm && ArrayBuffer.isView(r.value) ? r.value.byteLength : 1);
            }
            if (!this.push(r.value) || size <= 0) {
                break;
            }
        }
        if ((r && r.done || !this.readable) && (this.push(null) || true)) {
            it.return && it.return();
        }
        return !this.readable;
    };
    return IterableReadable;
}(stream_1.Readable));
/** @ignore */
var AsyncIterableReadable = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncIterableReadable, _super);
    function AsyncIterableReadable(it, options) {
        var _this = _super.call(this, options) || this;
        _this._iterator = it;
        _this._pulling = false;
        _this._bytesMode = !options || !options.objectMode;
        return _this;
    }
    AsyncIterableReadable.prototype._read = function (size) {
        var _this = this;
        var it = this._iterator;
        if (it && !this._pulling && (this._pulling = true)) {
            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a; return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this._pull(size, it)];
                    case 1: return [2 /*return*/, _a._pulling = _b.sent()];
                }
            }); }); })();
        }
    };
    AsyncIterableReadable.prototype._destroy = function (e, cb) {
        var it = this._iterator;
        var fn;
        it && (fn = e != null && it.throw || it.return);
        fn && fn.call(it, e).then(function () { return cb && cb(null); }) || (cb && cb(null));
    };
    AsyncIterableReadable.prototype._pull = function (size, it) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var bm, r, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        bm = this._bytesMode;
                        r = null;
                        _b.label = 1;
                    case 1:
                        _a = this.readable;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, it.next(bm ? size : null)];
                    case 2:
                        _a = !(r = _b.sent()).done;
                        _b.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 4];
                        if (size != null) {
                            size -= (bm && ArrayBuffer.isView(r.value) ? r.value.byteLength : 1);
                        }
                        if (!this.push(r.value) || size <= 0) {
                            return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 1];
                    case 4:
                        if ((r && r.done || !this.readable) && (this.push(null) || true)) {
                            it.return && it.return();
                        }
                        return [2 /*return*/, !this.readable];
                }
            });
        });
    };
    return AsyncIterableReadable;
}(stream_1.Readable));

//# sourceMappingURL=iterable.js.map
