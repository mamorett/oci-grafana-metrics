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
exports.recordBatchWriterThroughNodeStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("stream");
var stream_2 = require("../../io/stream");
/** @ignore */
function recordBatchWriterThroughNodeStream(options) {
    return new RecordBatchWriterDuplex(new this(options));
}
exports.recordBatchWriterThroughNodeStream = recordBatchWriterThroughNodeStream;
/** @ignore */
var RecordBatchWriterDuplex = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchWriterDuplex, _super);
    function RecordBatchWriterDuplex(writer, options) {
        var _this = _super.call(this, tslib_1.__assign(tslib_1.__assign({ allowHalfOpen: false }, options), { writableObjectMode: true, readableObjectMode: false })) || this;
        _this._pulling = false;
        _this._writer = writer;
        _this._reader = new stream_2.AsyncByteStream(writer);
        return _this;
    }
    RecordBatchWriterDuplex.prototype._final = function (cb) {
        var writer = this._writer;
        writer && writer.close();
        cb && cb();
    };
    RecordBatchWriterDuplex.prototype._write = function (x, _, cb) {
        var writer = this._writer;
        writer && writer.write(x);
        cb && cb();
        return true;
    };
    RecordBatchWriterDuplex.prototype._read = function (size) {
        var _this = this;
        var it = this._reader;
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
    RecordBatchWriterDuplex.prototype._destroy = function (err, cb) {
        var writer = this._writer;
        if (writer) {
            err ? writer.abort(err) : writer.close();
        }
        cb(this._reader = this._writer = null);
    };
    RecordBatchWriterDuplex.prototype._pull = function (size, reader) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        r = null;
                        _b.label = 1;
                    case 1:
                        _a = this.readable;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, reader.next(size || null)];
                    case 2:
                        _a = !(r = _b.sent()).done;
                        _b.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 4];
                        if (size != null && r.value) {
                            size -= r.value.byteLength;
                        }
                        if (!this.push(r.value) || size <= 0) {
                            return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 1];
                    case 4:
                        if (!(r && r.done || !this.readable)) return [3 /*break*/, 6];
                        this.push(null);
                        return [4 /*yield*/, reader.cancel()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, !this.readable];
                }
            });
        });
    };
    return RecordBatchWriterDuplex;
}(stream_1.Duplex));

//# sourceMappingURL=writer.js.map
