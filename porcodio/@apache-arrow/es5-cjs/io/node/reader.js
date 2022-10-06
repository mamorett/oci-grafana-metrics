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
exports.recordBatchReaderThroughNodeStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var stream_2 = require("../../io/stream");
var reader_1 = require("../../ipc/reader");
/** @ignore */
function recordBatchReaderThroughNodeStream(options) {
    return new RecordBatchReaderDuplex(options);
}
exports.recordBatchReaderThroughNodeStream = recordBatchReaderThroughNodeStream;
/** @ignore */
var RecordBatchReaderDuplex = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchReaderDuplex, _super);
    function RecordBatchReaderDuplex(options) {
        var _this = _super.call(this, tslib_1.__assign(tslib_1.__assign({ allowHalfOpen: false }, options), { readableObjectMode: true, writableObjectMode: false })) || this;
        _this._pulling = false;
        _this._autoDestroy = true;
        _this._reader = null;
        _this._pulling = false;
        _this._asyncQueue = new stream_2.AsyncByteQueue();
        _this._autoDestroy = options && (typeof options.autoDestroy === 'boolean') ? options.autoDestroy : true;
        return _this;
    }
    RecordBatchReaderDuplex.prototype._final = function (cb) {
        var aq = this._asyncQueue;
        aq && aq.close();
        cb && cb();
    };
    RecordBatchReaderDuplex.prototype._write = function (x, _, cb) {
        var aq = this._asyncQueue;
        aq && aq.write(x);
        cb && cb();
        return true;
    };
    RecordBatchReaderDuplex.prototype._read = function (size) {
        var _this = this;
        var aq = this._asyncQueue;
        if (aq && !this._pulling && (this._pulling = true)) {
            (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!!this._reader) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this._open(aq)];
                        case 1:
                            _a._reader = _c.sent();
                            _c.label = 2;
                        case 2:
                            _b = this;
                            return [4 /*yield*/, this._pull(size, this._reader)];
                        case 3:
                            _b._pulling = _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
    };
    RecordBatchReaderDuplex.prototype._destroy = function (err, cb) {
        var aq = this._asyncQueue;
        if (aq) {
            err ? aq.abort(err) : aq.close();
        }
        cb(this._asyncQueue = this._reader = null);
    };
    RecordBatchReaderDuplex.prototype._open = function (source) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reader_1.RecordBatchReader.from(source)];
                    case 1: return [4 /*yield*/, (_a.sent()).open({ autoDestroy: this._autoDestroy })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RecordBatchReaderDuplex.prototype._pull = function (size, reader) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r, _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        r = null;
                        _e.label = 1;
                    case 1:
                        _a = this.readable;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, reader.next()];
                    case 2:
                        _a = !(r = _e.sent()).done;
                        _e.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 4];
                        if (!this.push(r.value) || (size != null && --size <= 0)) {
                            return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 1];
                    case 4:
                        _b = !this.readable;
                        if (_b) return [3 /*break*/, 8];
                        _c = r && r.done;
                        if (!_c) return [3 /*break*/, 7];
                        _d = reader.autoDestroy;
                        if (_d) return [3 /*break*/, 6];
                        return [4 /*yield*/, reader.reset().open()];
                    case 5:
                        _d = (_e.sent()).closed;
                        _e.label = 6;
                    case 6:
                        _c = (_d);
                        _e.label = 7;
                    case 7:
                        _b = (_c);
                        _e.label = 8;
                    case 8:
                        if (!_b) return [3 /*break*/, 10];
                        this.push(null);
                        return [4 /*yield*/, reader.cancel()];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [2 /*return*/, !this.readable];
                }
            });
        });
    };
    return RecordBatchReaderDuplex;
}(stream_1.Duplex));

//# sourceMappingURL=reader.js.map
