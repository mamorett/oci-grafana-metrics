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
exports.recordBatchReaderThroughDOMStream = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("../../io/stream");
var reader_1 = require("../../ipc/reader");
/** @ignore */
function recordBatchReaderThroughDOMStream(writableStrategy, readableStrategy) {
    var queue = new stream_1.AsyncByteQueue();
    var reader = null;
    var readable = new ReadableStream({
        cancel: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queue.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); });
        },
        start: function (controller) {
            return tslib_1.__awaiter(this, void 0, void 0, function () { var _a, _b, _c; return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = next;
                        _b = [controller];
                        _c = reader;
                        if (_c) return [3 /*break*/, 2];
                        return [4 /*yield*/, open()];
                    case 1:
                        _c = (reader = _d.sent());
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c]))];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                }
            }); });
        },
        pull: function (controller) {
            return tslib_1.__awaiter(this, void 0, void 0, function () { var _a; return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!reader) return [3 /*break*/, 2];
                        return [4 /*yield*/, next(controller, reader)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = controller.close();
                        _b.label = 3;
                    case 3:
                        _a;
                        return [2 /*return*/];
                }
            }); });
        }
    });
    return { writable: new WritableStream(queue, tslib_1.__assign({ 'highWaterMark': Math.pow(2, 14) }, writableStrategy)), readable: readable };
    function open() {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reader_1.RecordBatchReader.from(queue)];
                    case 1: return [4 /*yield*/, (_a.sent()).open(readableStrategy)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function next(controller, reader) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var size, r;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        size = controller.desiredSize;
                        r = null;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, reader.next()];
                    case 2:
                        if (!!(r = _a.sent()).done) return [3 /*break*/, 3];
                        controller.enqueue(r.value);
                        if (size != null && --size <= 0) {
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
exports.recordBatchReaderThroughDOMStream = recordBatchReaderThroughDOMStream;

//# sourceMappingURL=reader.js.map
