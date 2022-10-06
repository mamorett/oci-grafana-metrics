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
exports.AsyncQueue = exports.ReadableInterop = exports.ArrowJSON = exports.ITERATOR_DONE = void 0;
var tslib_1 = require("tslib");
var adapters_1 = require("./adapters");
/** @ignore */
exports.ITERATOR_DONE = Object.freeze({ done: true, value: void (0) });
/** @ignore */
var ArrowJSON = /** @class */ (function () {
    function ArrowJSON(_json) {
        this._json = _json;
    }
    Object.defineProperty(ArrowJSON.prototype, "schema", {
        get: function () { return this._json['schema']; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowJSON.prototype, "batches", {
        get: function () { return (this._json['batches'] || []); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ArrowJSON.prototype, "dictionaries", {
        get: function () { return (this._json['dictionaries'] || []); },
        enumerable: false,
        configurable: true
    });
    return ArrowJSON;
}());
exports.ArrowJSON = ArrowJSON;
/** @ignore */
var ReadableInterop = /** @class */ (function () {
    function ReadableInterop() {
    }
    ReadableInterop.prototype.tee = function () {
        return this._getDOMStream().tee();
    };
    ReadableInterop.prototype.pipe = function (writable, options) {
        return this._getNodeStream().pipe(writable, options);
    };
    ReadableInterop.prototype.pipeTo = function (writable, options) { return this._getDOMStream().pipeTo(writable, options); };
    ReadableInterop.prototype.pipeThrough = function (duplex, options) {
        return this._getDOMStream().pipeThrough(duplex, options);
    };
    ReadableInterop.prototype._getDOMStream = function () {
        return this._DOMStream || (this._DOMStream = this.toDOMStream());
    };
    ReadableInterop.prototype._getNodeStream = function () {
        return this._nodeStream || (this._nodeStream = this.toNodeStream());
    };
    return ReadableInterop;
}());
exports.ReadableInterop = ReadableInterop;
/** @ignore */
var AsyncQueue = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncQueue, _super);
    function AsyncQueue() {
        var _this = _super.call(this) || this;
        _this._values = [];
        _this.resolvers = [];
        _this._closedPromise = new Promise(function (r) { return _this._closedPromiseResolve = r; });
        return _this;
    }
    Object.defineProperty(AsyncQueue.prototype, "closed", {
        get: function () { return this._closedPromise; },
        enumerable: false,
        configurable: true
    });
    AsyncQueue.prototype.cancel = function (reason) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.return(reason)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        }); });
    };
    AsyncQueue.prototype.write = function (value) {
        if (this._ensureOpen()) {
            this.resolvers.length <= 0
                ? (this._values.push(value))
                : (this.resolvers.shift().resolve({ done: false, value: value }));
        }
    };
    AsyncQueue.prototype.abort = function (value) {
        if (this._closedPromiseResolve) {
            this.resolvers.length <= 0
                ? (this._error = { error: value })
                : (this.resolvers.shift().reject({ done: true, value: value }));
        }
    };
    AsyncQueue.prototype.close = function () {
        if (this._closedPromiseResolve) {
            var resolvers = this.resolvers;
            while (resolvers.length > 0) {
                resolvers.shift().resolve(exports.ITERATOR_DONE);
            }
            this._closedPromiseResolve();
            this._closedPromiseResolve = undefined;
        }
    };
    AsyncQueue.prototype[Symbol.asyncIterator] = function () { return this; };
    AsyncQueue.prototype.toDOMStream = function (options) {
        return adapters_1.default.toDOMStream((this._closedPromiseResolve || this._error)
            ? this
            : this._values, options);
    };
    AsyncQueue.prototype.toNodeStream = function (options) {
        return adapters_1.default.toNodeStream((this._closedPromiseResolve || this._error)
            ? this
            : this._values, options);
    };
    AsyncQueue.prototype.throw = function (_) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.abort(_)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, exports.ITERATOR_DONE];
            }
        }); });
    };
    AsyncQueue.prototype.return = function (_) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, exports.ITERATOR_DONE];
            }
        }); });
    };
    AsyncQueue.prototype.read = function (size) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.next(size, 'read')];
                case 1: return [2 /*return*/, (_a.sent()).value];
            }
        }); });
    };
    AsyncQueue.prototype.peek = function (size) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.next(size, 'peek')];
                case 1: return [2 /*return*/, (_a.sent()).value];
            }
        }); });
    };
    AsyncQueue.prototype.next = function () {
        var _this = this;
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        if (this._values.length > 0) {
            return Promise.resolve({ done: false, value: this._values.shift() });
        }
        else if (this._error) {
            return Promise.reject({ done: true, value: this._error.error });
        }
        else if (!this._closedPromiseResolve) {
            return Promise.resolve(exports.ITERATOR_DONE);
        }
        else {
            return new Promise(function (resolve, reject) {
                _this.resolvers.push({ resolve: resolve, reject: reject });
            });
        }
    };
    AsyncQueue.prototype._ensureOpen = function () {
        if (this._closedPromiseResolve) {
            return true;
        }
        throw new Error(this + " is closed");
    };
    return AsyncQueue;
}(ReadableInterop));
exports.AsyncQueue = AsyncQueue;

//# sourceMappingURL=interfaces.js.map
