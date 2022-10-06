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
exports.AsyncRandomAccessFile = exports.RandomAccessFile = void 0;
var tslib_1 = require("tslib");
var stream_1 = require("./stream");
var buffer_1 = require("../util/buffer");
/** @ignore */
var RandomAccessFile = /** @class */ (function (_super) {
    tslib_1.__extends(RandomAccessFile, _super);
    function RandomAccessFile(buffer, byteLength) {
        var _this = _super.call(this) || this;
        _this.position = 0;
        _this.buffer = buffer_1.toUint8Array(buffer);
        _this.size = typeof byteLength === 'undefined' ? _this.buffer.byteLength : byteLength;
        return _this;
    }
    RandomAccessFile.prototype.readInt32 = function (position) {
        var _a = this.readAt(position, 4), buffer = _a.buffer, byteOffset = _a.byteOffset;
        return new DataView(buffer, byteOffset).getInt32(0, true);
    };
    RandomAccessFile.prototype.seek = function (position) {
        this.position = Math.min(position, this.size);
        return position < this.size;
    };
    RandomAccessFile.prototype.read = function (nBytes) {
        var _a = this, buffer = _a.buffer, size = _a.size, position = _a.position;
        if (buffer && position < size) {
            if (typeof nBytes !== 'number') {
                nBytes = Infinity;
            }
            this.position = Math.min(size, position + Math.min(size - position, nBytes));
            return buffer.subarray(position, this.position);
        }
        return null;
    };
    RandomAccessFile.prototype.readAt = function (position, nBytes) {
        var buf = this.buffer;
        var end = Math.min(this.size, position + nBytes);
        return buf ? buf.subarray(position, end) : new Uint8Array(nBytes);
    };
    RandomAccessFile.prototype.close = function () { this.buffer && (this.buffer = null); };
    RandomAccessFile.prototype.throw = function (value) { this.close(); return { done: true, value: value }; };
    RandomAccessFile.prototype.return = function (value) { this.close(); return { done: true, value: value }; };
    return RandomAccessFile;
}(stream_1.ByteStream));
exports.RandomAccessFile = RandomAccessFile;
/** @ignore */
var AsyncRandomAccessFile = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncRandomAccessFile, _super);
    function AsyncRandomAccessFile(file, byteLength) {
        var _this = _super.call(this) || this;
        _this.position = 0;
        _this._handle = file;
        if (typeof byteLength === 'number') {
            _this.size = byteLength;
        }
        else {
            _this._pending = (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, file.stat()];
                        case 1:
                            _a.size = (_b.sent()).size;
                            delete this._pending;
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
        return _this;
    }
    AsyncRandomAccessFile.prototype.readInt32 = function (position) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, buffer, byteOffset;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.readAt(position, 4)];
                    case 1:
                        _a = _b.sent(), buffer = _a.buffer, byteOffset = _a.byteOffset;
                        return [2 /*return*/, new DataView(buffer, byteOffset).getInt32(0, true)];
                }
            });
        });
    };
    AsyncRandomAccessFile.prototype.seek = function (position) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this._pending;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._pending];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        this.position = Math.min(position, this.size);
                        return [2 /*return*/, position < this.size];
                }
            });
        });
    };
    AsyncRandomAccessFile.prototype.read = function (nBytes) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, file, size, position, pos, offset, bytesRead, end, buffer;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this._pending;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._pending];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a;
                        _b = this, file = _b._handle, size = _b.size, position = _b.position;
                        if (!(file && position < size)) return [3 /*break*/, 6];
                        if (typeof nBytes !== 'number') {
                            nBytes = Infinity;
                        }
                        pos = position, offset = 0, bytesRead = 0;
                        end = Math.min(size, pos + Math.min(size - pos, nBytes));
                        buffer = new Uint8Array(Math.max(0, (this.position = end) - pos));
                        _c.label = 3;
                    case 3:
                        if (!((pos += bytesRead) < end && (offset += bytesRead) < buffer.byteLength)) return [3 /*break*/, 5];
                        return [4 /*yield*/, file.read(buffer, offset, buffer.byteLength - offset, pos)];
                    case 4:
                        (bytesRead = (_c.sent()).bytesRead);
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, buffer];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    AsyncRandomAccessFile.prototype.readAt = function (position, nBytes) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, file, size, end, buffer;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this._pending;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._pending];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a;
                        _b = this, file = _b._handle, size = _b.size;
                        if (!(file && (position + nBytes) < size)) return [3 /*break*/, 4];
                        end = Math.min(size, position + nBytes);
                        buffer = new Uint8Array(end - position);
                        return [4 /*yield*/, file.read(buffer, 0, nBytes, position)];
                    case 3: return [2 /*return*/, (_c.sent()).buffer];
                    case 4: return [2 /*return*/, new Uint8Array(nBytes)];
                }
            });
        });
    };
    AsyncRandomAccessFile.prototype.close = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () { var f, _a; return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    f = this._handle;
                    this._handle = null;
                    _a = f;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, f.close()];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    _a;
                    return [2 /*return*/];
            }
        }); });
    };
    AsyncRandomAccessFile.prototype.throw = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { done: true, value: value }];
            }
        }); });
    };
    AsyncRandomAccessFile.prototype.return = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { done: true, value: value }];
            }
        }); });
    };
    return AsyncRandomAccessFile;
}(stream_1.AsyncByteStream));
exports.AsyncRandomAccessFile = AsyncRandomAccessFile;

//# sourceMappingURL=file.js.map
