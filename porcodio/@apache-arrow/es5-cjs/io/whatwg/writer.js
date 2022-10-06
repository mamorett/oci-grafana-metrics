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
exports.recordBatchWriterThroughDOMStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("../../io/stream");
/** @ignore */
function recordBatchWriterThroughDOMStream(writableStrategy, readableStrategy) {
    var writer = new this(writableStrategy);
    var reader = new stream_1.AsyncByteStream(writer);
    var readable = new ReadableStream({
        type: 'bytes',
        cancel: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reader.cancel()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); });
        },
        pull: function (controller) {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, next(controller)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); });
        },
        start: function (controller) {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, next(controller)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); });
        },
    }, tslib_1.__assign({ 'highWaterMark': Math.pow(2, 14) }, readableStrategy));
    return { writable: new WritableStream(writer, writableStrategy), readable: readable };
    function next(controller) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buf, size;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buf = null;
                        size = controller.desiredSize;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, reader.read(size || null)];
                    case 2:
                        if (!(buf = _a.sent())) return [3 /*break*/, 3];
                        controller.enqueue(buf);
                        if (size != null && (size -= buf.byteLength) <= 0) {
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        controller.close();
                        return [2 /*return*/];
                }
            });
        });
    }
}
exports.recordBatchWriterThroughDOMStream = recordBatchWriterThroughDOMStream;

//# sourceMappingURL=writer.js.map
