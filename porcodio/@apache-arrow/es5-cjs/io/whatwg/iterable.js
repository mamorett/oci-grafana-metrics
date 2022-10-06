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
exports.toDOMStream = void 0;
var tslib_1 = require("tslib");
var buffer_1 = require("../../util/buffer");
var compat_1 = require("../../util/compat");
/** @ignore */
function toDOMStream(source, options) {
    if (compat_1.isAsyncIterable(source)) {
        return asyncIterableAsReadableDOMStream(source, options);
    }
    if (compat_1.isIterable(source)) {
        return iterableAsReadableDOMStream(source, options);
    }
    /* istanbul ignore next */
    throw new Error("toDOMStream() must be called with an Iterable or AsyncIterable");
}
exports.toDOMStream = toDOMStream;
/** @ignore */
function iterableAsReadableDOMStream(source, options) {
    var it = null;
    var bm = (options && options.type === 'bytes') || false;
    var hwm = options && options.highWaterMark || (Math.pow(2, 24));
    return new ReadableStream(tslib_1.__assign(tslib_1.__assign({}, options), { start: function (controller) { next(controller, it || (it = source[Symbol.iterator]())); },
        pull: function (controller) { it ? (next(controller, it)) : controller.close(); },
        cancel: function () { (it && (it.return && it.return()) || true) && (it = null); } }), tslib_1.__assign({ highWaterMark: bm ? hwm : undefined }, options));
    function next(controller, it) {
        var buf;
        var r = null;
        var size = controller.desiredSize || null;
        while (!(r = it.next(bm ? size : null)).done) {
            if (ArrayBuffer.isView(r.value) && (buf = buffer_1.toUint8Array(r.value))) {
                size != null && bm && (size = size - buf.byteLength + 1);
                r.value = buf;
            }
            controller.enqueue(r.value);
            if (size != null && --size <= 0) {
                return;
            }
        }
        controller.close();
    }
}
/** @ignore */
function asyncIterableAsReadableDOMStream(source, options) {
    var it = null;
    var bm = (options && options.type === 'bytes') || false;
    var hwm = options && options.highWaterMark || (Math.pow(2, 24));
    return new ReadableStream(tslib_1.__assign(tslib_1.__assign({}, options), { start: function (controller) {
            return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, next(controller, it || (it = source[Symbol.asyncIterator]()))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); });
        },
        pull: function (controller) {
            return tslib_1.__awaiter(this, void 0, void 0, function () { var _a; return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!it) return [3 /*break*/, 2];
                        return [4 /*yield*/, next(controller, it)];
                    case 1:
                        _a = (_b.sent());
                        return [3 /*break*/, 3];
                    case 2:
                        _a = controller.close();
                        _b.label = 3;
                    case 3:
                        _a;
                        return [2 /*return*/];
                }
            }); });
        },
        cancel: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = it;
                        if (!_a) return [3 /*break*/, 3];
                        _b = it.return;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, it.return()];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a = (_b);
                        _c.label = 3;
                    case 3:
                        (_a || true) && (it = null);
                        return [2 /*return*/];
                }
            }); });
        } }), tslib_1.__assign({ highWaterMark: bm ? hwm : undefined }, options));
    function next(controller, it) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buf, r, size;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = null;
                        size = controller.desiredSize || null;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, it.next(bm ? size : null)];
                    case 2:
                        if (!!(r = _a.sent()).done) return [3 /*break*/, 3];
                        if (ArrayBuffer.isView(r.value) && (buf = buffer_1.toUint8Array(r.value))) {
                            size != null && bm && (size = size - buf.byteLength + 1);
                            r.value = buf;
                        }
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

//# sourceMappingURL=iterable.js.map
