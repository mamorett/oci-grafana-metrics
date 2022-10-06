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
exports.AsyncRecordBatchFileReader = exports.RecordBatchFileReader = exports.AsyncRecordBatchStreamReader = exports.RecordBatchStreamReader = exports.RecordBatchReader = void 0;
var tslib_1 = require("tslib");
var vector_1 = require("../vector");
var enum_1 = require("../enum");
var file_1 = require("./metadata/file");
var adapters_1 = require("../io/adapters");
var stream_1 = require("../io/stream");
var file_2 = require("../io/file");
var vectorloader_1 = require("../visitor/vectorloader");
var recordbatch_1 = require("../recordbatch");
var interfaces_1 = require("../io/interfaces");
var message_1 = require("./message");
var compat_1 = require("../util/compat");
var RecordBatchReader = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchReader, _super);
    function RecordBatchReader(impl) {
        var _this = _super.call(this) || this;
        _this._impl = impl;
        return _this;
    }
    Object.defineProperty(RecordBatchReader.prototype, "closed", {
        get: function () { return this._impl.closed; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReader.prototype, "schema", {
        get: function () { return this._impl.schema; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReader.prototype, "autoDestroy", {
        get: function () { return this._impl.autoDestroy; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReader.prototype, "dictionaries", {
        get: function () { return this._impl.dictionaries; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReader.prototype, "numDictionaries", {
        get: function () { return this._impl.numDictionaries; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReader.prototype, "numRecordBatches", {
        get: function () { return this._impl.numRecordBatches; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReader.prototype, "footer", {
        get: function () { return this._impl.isFile() ? this._impl.footer : null; },
        enumerable: false,
        configurable: true
    });
    RecordBatchReader.prototype.isSync = function () { return this._impl.isSync(); };
    RecordBatchReader.prototype.isAsync = function () { return this._impl.isAsync(); };
    RecordBatchReader.prototype.isFile = function () { return this._impl.isFile(); };
    RecordBatchReader.prototype.isStream = function () { return this._impl.isStream(); };
    RecordBatchReader.prototype.next = function () {
        return this._impl.next();
    };
    RecordBatchReader.prototype.throw = function (value) {
        return this._impl.throw(value);
    };
    RecordBatchReader.prototype.return = function (value) {
        return this._impl.return(value);
    };
    RecordBatchReader.prototype.cancel = function () {
        return this._impl.cancel();
    };
    RecordBatchReader.prototype.reset = function (schema) {
        this._impl.reset(schema);
        this._DOMStream = undefined;
        this._nodeStream = undefined;
        return this;
    };
    RecordBatchReader.prototype.open = function (options) {
        var _this = this;
        var opening = this._impl.open(options);
        return compat_1.isPromise(opening) ? opening.then(function () { return _this; }) : this;
    };
    RecordBatchReader.prototype.readRecordBatch = function (index) {
        return this._impl.isFile() ? this._impl.readRecordBatch(index) : null;
    };
    RecordBatchReader.prototype[Symbol.iterator] = function () {
        return this._impl[Symbol.iterator]();
    };
    RecordBatchReader.prototype[Symbol.asyncIterator] = function () {
        return this._impl[Symbol.asyncIterator]();
    };
    RecordBatchReader.prototype.toDOMStream = function () {
        var _a, _b;
        var _this = this;
        return adapters_1.default.toDOMStream((this.isSync()
            ? (_a = {}, _a[Symbol.iterator] = function () { return _this; }, _a)
            : (_b = {}, _b[Symbol.asyncIterator] = function () { return _this; }, _b)));
    };
    RecordBatchReader.prototype.toNodeStream = function () {
        var _a, _b;
        var _this = this;
        return adapters_1.default.toNodeStream((this.isSync()
            ? (_a = {}, _a[Symbol.iterator] = function () { return _this; }, _a)
            : (_b = {}, _b[Symbol.asyncIterator] = function () { return _this; }, _b)), { objectMode: true });
    };
    /** @nocollapse */
    // @ts-ignore
    RecordBatchReader.throughNode = function (options) {
        throw new Error("\"throughNode\" not available in this environment");
    };
    /** @nocollapse */
    RecordBatchReader.throughDOM = function (
    // @ts-ignore
    writableStrategy, 
    // @ts-ignore
    readableStrategy) {
        throw new Error("\"throughDOM\" not available in this environment");
    };
    /** @nocollapse */
    RecordBatchReader.from = function (source) {
        var _this = this;
        if (source instanceof RecordBatchReader) {
            return source;
        }
        else if (compat_1.isArrowJSON(source)) {
            return fromArrowJSON(source);
        }
        else if (compat_1.isFileHandle(source)) {
            return fromFileHandle(source);
        }
        else if (compat_1.isPromise(source)) {
            return (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a, _b; return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = RecordBatchReader).from;
                        return [4 /*yield*/, source];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            }); }); })();
        }
        else if (compat_1.isFetchResponse(source) || compat_1.isReadableDOMStream(source) || compat_1.isReadableNodeStream(source) || compat_1.isAsyncIterable(source)) {
            return fromAsyncByteStream(new stream_1.AsyncByteStream(source));
        }
        return fromByteStream(new stream_1.ByteStream(source));
    };
    /** @nocollapse */
    RecordBatchReader.readAll = function (source) {
        if (source instanceof RecordBatchReader) {
            return source.isSync() ? readAllSync(source) : readAllAsync(source);
        }
        else if (compat_1.isArrowJSON(source) || ArrayBuffer.isView(source) || compat_1.isIterable(source) || compat_1.isIteratorResult(source)) {
            return readAllSync(source);
        }
        return readAllAsync(source);
    };
    return RecordBatchReader;
}(interfaces_1.ReadableInterop));
exports.RecordBatchReader = RecordBatchReader;
//
// Since TS is a structural type system, we define the following subclass stubs
// so that concrete types exist to associate with with the interfaces below.
//
// The implementation for each RecordBatchReader is hidden away in the set of
// `RecordBatchReaderImpl` classes in the second half of this file. This allows
// us to export a single RecordBatchReader class, and swap out the impl based
// on the io primitives or underlying arrow (JSON, file, or stream) at runtime.
//
// Async/await makes our job a bit harder, since it forces everything to be
// either fully sync or fully async. This is why the logic for the reader impls
// has been duplicated into both sync and async variants. Since the RBR
// delegates to its impl, an RBR with an AsyncRecordBatchFileReaderImpl for
// example will return async/await-friendly Promises, but one with a (sync)
// RecordBatchStreamReaderImpl will always return values. Nothing should be
// different about their logic, aside from the async handling. This is also why
// this code looks highly structured, as it should be nearly identical and easy
// to follow.
//
/** @ignore */
var RecordBatchStreamReader = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchStreamReader, _super);
    function RecordBatchStreamReader(_impl) {
        var _this = _super.call(this, _impl) || this;
        _this._impl = _impl;
        return _this;
    }
    RecordBatchStreamReader.prototype[Symbol.iterator] = function () { return this._impl[Symbol.iterator](); };
    RecordBatchStreamReader.prototype[Symbol.asyncIterator] = function () { return tslib_1.__asyncGenerator(this, arguments, function _a() { return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [5 /*yield**/, tslib_1.__values(tslib_1.__asyncDelegator(tslib_1.__asyncValues(this[Symbol.iterator]())))];
            case 1: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_b.sent()])];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    }); }); };
    return RecordBatchStreamReader;
}(RecordBatchReader));
exports.RecordBatchStreamReader = RecordBatchStreamReader;
/** @ignore */
var AsyncRecordBatchStreamReader = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncRecordBatchStreamReader, _super);
    function AsyncRecordBatchStreamReader(_impl) {
        var _this = _super.call(this, _impl) || this;
        _this._impl = _impl;
        return _this;
    }
    AsyncRecordBatchStreamReader.prototype[Symbol.iterator] = function () { throw new Error("AsyncRecordBatchStreamReader is not Iterable"); };
    AsyncRecordBatchStreamReader.prototype[Symbol.asyncIterator] = function () { return this._impl[Symbol.asyncIterator](); };
    return AsyncRecordBatchStreamReader;
}(RecordBatchReader));
exports.AsyncRecordBatchStreamReader = AsyncRecordBatchStreamReader;
/** @ignore */
var RecordBatchFileReader = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchFileReader, _super);
    function RecordBatchFileReader(_impl) {
        var _this = _super.call(this, _impl) || this;
        _this._impl = _impl;
        return _this;
    }
    return RecordBatchFileReader;
}(RecordBatchStreamReader));
exports.RecordBatchFileReader = RecordBatchFileReader;
/** @ignore */
var AsyncRecordBatchFileReader = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncRecordBatchFileReader, _super);
    function AsyncRecordBatchFileReader(_impl) {
        var _this = _super.call(this, _impl) || this;
        _this._impl = _impl;
        return _this;
    }
    return AsyncRecordBatchFileReader;
}(AsyncRecordBatchStreamReader));
exports.AsyncRecordBatchFileReader = AsyncRecordBatchFileReader;
/** @ignore */
var RecordBatchReaderImpl = /** @class */ (function () {
    function RecordBatchReaderImpl(dictionaries) {
        if (dictionaries === void 0) { dictionaries = new Map(); }
        this.closed = false;
        this.autoDestroy = true;
        this._dictionaryIndex = 0;
        this._recordBatchIndex = 0;
        this.dictionaries = dictionaries;
    }
    Object.defineProperty(RecordBatchReaderImpl.prototype, "numDictionaries", {
        get: function () { return this._dictionaryIndex; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchReaderImpl.prototype, "numRecordBatches", {
        get: function () { return this._recordBatchIndex; },
        enumerable: false,
        configurable: true
    });
    RecordBatchReaderImpl.prototype.isSync = function () { return false; };
    RecordBatchReaderImpl.prototype.isAsync = function () { return false; };
    RecordBatchReaderImpl.prototype.isFile = function () { return false; };
    RecordBatchReaderImpl.prototype.isStream = function () { return false; };
    RecordBatchReaderImpl.prototype.reset = function (schema) {
        this._dictionaryIndex = 0;
        this._recordBatchIndex = 0;
        this.schema = schema;
        this.dictionaries = new Map();
        return this;
    };
    RecordBatchReaderImpl.prototype._loadRecordBatch = function (header, body) {
        return new recordbatch_1.RecordBatch(this.schema, header.length, this._loadVectors(header, body, this.schema.fields));
    };
    RecordBatchReaderImpl.prototype._loadDictionaryBatch = function (header, body) {
        var id = header.id, isDelta = header.isDelta, data = header.data;
        var _a = this, dictionaries = _a.dictionaries, schema = _a.schema;
        var dictionary = dictionaries.get(id);
        if (isDelta || !dictionary) {
            var type = schema.dictionaries.get(id);
            return (dictionary && isDelta ? dictionary.concat(vector_1.Vector.new(this._loadVectors(data, body, [type])[0])) :
                vector_1.Vector.new(this._loadVectors(data, body, [type])[0]));
        }
        return dictionary;
    };
    RecordBatchReaderImpl.prototype._loadVectors = function (header, body, types) {
        return new vectorloader_1.VectorLoader(body, header.nodes, header.buffers, this.dictionaries).visitMany(types);
    };
    return RecordBatchReaderImpl;
}());
/** @ignore */
var RecordBatchStreamReaderImpl = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchStreamReaderImpl, _super);
    function RecordBatchStreamReaderImpl(source, dictionaries) {
        var _this = _super.call(this, dictionaries) || this;
        _this._reader = !compat_1.isArrowJSON(source)
            ? new message_1.MessageReader(_this._handle = source)
            : new message_1.JSONMessageReader(_this._handle = source);
        return _this;
    }
    RecordBatchStreamReaderImpl.prototype.isSync = function () { return true; };
    RecordBatchStreamReaderImpl.prototype.isStream = function () { return true; };
    RecordBatchStreamReaderImpl.prototype[Symbol.iterator] = function () {
        return this;
    };
    RecordBatchStreamReaderImpl.prototype.cancel = function () {
        if (!this.closed && (this.closed = true)) {
            this.reset()._reader.return();
            this._reader = null;
            this.dictionaries = null;
        }
    };
    RecordBatchStreamReaderImpl.prototype.open = function (options) {
        if (!this.closed) {
            this.autoDestroy = shouldAutoDestroy(this, options);
            if (!(this.schema || (this.schema = this._reader.readSchema()))) {
                this.cancel();
            }
        }
        return this;
    };
    RecordBatchStreamReaderImpl.prototype.throw = function (value) {
        if (!this.closed && this.autoDestroy && (this.closed = true)) {
            return this.reset()._reader.throw(value);
        }
        return interfaces_1.ITERATOR_DONE;
    };
    RecordBatchStreamReaderImpl.prototype.return = function (value) {
        if (!this.closed && this.autoDestroy && (this.closed = true)) {
            return this.reset()._reader.return(value);
        }
        return interfaces_1.ITERATOR_DONE;
    };
    RecordBatchStreamReaderImpl.prototype.next = function () {
        if (this.closed) {
            return interfaces_1.ITERATOR_DONE;
        }
        var message;
        var reader = this._reader;
        while (message = this._readNextMessageAndValidate()) {
            if (message.isSchema()) {
                this.reset(message.header());
            }
            else if (message.isRecordBatch()) {
                this._recordBatchIndex++;
                var header = message.header();
                var buffer = reader.readMessageBody(message.bodyLength);
                var recordBatch = this._loadRecordBatch(header, buffer);
                return { done: false, value: recordBatch };
            }
            else if (message.isDictionaryBatch()) {
                this._dictionaryIndex++;
                var header = message.header();
                var buffer = reader.readMessageBody(message.bodyLength);
                var vector = this._loadDictionaryBatch(header, buffer);
                this.dictionaries.set(header.id, vector);
            }
        }
        if (this.schema && this._recordBatchIndex === 0) {
            this._recordBatchIndex++;
            return { done: false, value: new recordbatch_1._InternalEmptyPlaceholderRecordBatch(this.schema) };
        }
        return this.return();
    };
    RecordBatchStreamReaderImpl.prototype._readNextMessageAndValidate = function (type) {
        return this._reader.readMessage(type);
    };
    return RecordBatchStreamReaderImpl;
}(RecordBatchReaderImpl));
/** @ignore */
var AsyncRecordBatchStreamReaderImpl = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncRecordBatchStreamReaderImpl, _super);
    function AsyncRecordBatchStreamReaderImpl(source, dictionaries) {
        var _this = _super.call(this, dictionaries) || this;
        _this._reader = new message_1.AsyncMessageReader(_this._handle = source);
        return _this;
    }
    AsyncRecordBatchStreamReaderImpl.prototype.isAsync = function () { return true; };
    AsyncRecordBatchStreamReaderImpl.prototype.isStream = function () { return true; };
    AsyncRecordBatchStreamReaderImpl.prototype[Symbol.asyncIterator] = function () {
        return this;
    };
    AsyncRecordBatchStreamReaderImpl.prototype.cancel = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.closed && (this.closed = true))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reset()._reader.return()];
                    case 1:
                        _a.sent();
                        this._reader = null;
                        this.dictionaries = null;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    AsyncRecordBatchStreamReaderImpl.prototype.open = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.closed) return [3 /*break*/, 4];
                        this.autoDestroy = shouldAutoDestroy(this, options);
                        _a = this.schema;
                        if (_a) return [3 /*break*/, 2];
                        _b = this;
                        return [4 /*yield*/, this._reader.readSchema()];
                    case 1:
                        _a = (_b.schema = (_c.sent()));
                        _c.label = 2;
                    case 2:
                        if (!!(_a)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cancel()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, this];
                }
            });
        });
    };
    AsyncRecordBatchStreamReaderImpl.prototype.throw = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.closed && this.autoDestroy && (this.closed = true))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reset()._reader.throw(value)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                }
            });
        });
    };
    AsyncRecordBatchStreamReaderImpl.prototype.return = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.closed && this.autoDestroy && (this.closed = true))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reset()._reader.return(value)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                }
            });
        });
    };
    AsyncRecordBatchStreamReaderImpl.prototype.next = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var message, reader, header, buffer, recordBatch, header, buffer, vector;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.closed) {
                            return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                        }
                        reader = this._reader;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this._readNextMessageAndValidate()];
                    case 2:
                        if (!(message = _a.sent())) return [3 /*break*/, 9];
                        if (!message.isSchema()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reset(message.header())];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!message.isRecordBatch()) return [3 /*break*/, 6];
                        this._recordBatchIndex++;
                        header = message.header();
                        return [4 /*yield*/, reader.readMessageBody(message.bodyLength)];
                    case 5:
                        buffer = _a.sent();
                        recordBatch = this._loadRecordBatch(header, buffer);
                        return [2 /*return*/, { done: false, value: recordBatch }];
                    case 6:
                        if (!message.isDictionaryBatch()) return [3 /*break*/, 8];
                        this._dictionaryIndex++;
                        header = message.header();
                        return [4 /*yield*/, reader.readMessageBody(message.bodyLength)];
                    case 7:
                        buffer = _a.sent();
                        vector = this._loadDictionaryBatch(header, buffer);
                        this.dictionaries.set(header.id, vector);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 1];
                    case 9:
                        if (this.schema && this._recordBatchIndex === 0) {
                            this._recordBatchIndex++;
                            return [2 /*return*/, { done: false, value: new recordbatch_1._InternalEmptyPlaceholderRecordBatch(this.schema) }];
                        }
                        return [4 /*yield*/, this.return()];
                    case 10: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AsyncRecordBatchStreamReaderImpl.prototype._readNextMessageAndValidate = function (type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._reader.readMessage(type)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AsyncRecordBatchStreamReaderImpl;
}(RecordBatchReaderImpl));
/** @ignore */
var RecordBatchFileReaderImpl = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchFileReaderImpl, _super);
    function RecordBatchFileReaderImpl(source, dictionaries) {
        return _super.call(this, source instanceof file_2.RandomAccessFile ? source : new file_2.RandomAccessFile(source), dictionaries) || this;
    }
    Object.defineProperty(RecordBatchFileReaderImpl.prototype, "footer", {
        get: function () { return this._footer; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchFileReaderImpl.prototype, "numDictionaries", {
        get: function () { return this._footer ? this._footer.numDictionaries : 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatchFileReaderImpl.prototype, "numRecordBatches", {
        get: function () { return this._footer ? this._footer.numRecordBatches : 0; },
        enumerable: false,
        configurable: true
    });
    RecordBatchFileReaderImpl.prototype.isSync = function () { return true; };
    RecordBatchFileReaderImpl.prototype.isFile = function () { return true; };
    RecordBatchFileReaderImpl.prototype.open = function (options) {
        var e_1, _a;
        if (!this.closed && !this._footer) {
            this.schema = (this._footer = this._readFooter()).schema;
            try {
                for (var _b = tslib_1.__values(this._footer.dictionaryBatches()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var block = _c.value;
                    block && this._readDictionaryBatch(this._dictionaryIndex++);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return _super.prototype.open.call(this, options);
    };
    RecordBatchFileReaderImpl.prototype.readRecordBatch = function (index) {
        if (this.closed) {
            return null;
        }
        if (!this._footer) {
            this.open();
        }
        var block = this._footer && this._footer.getRecordBatch(index);
        if (block && this._handle.seek(block.offset)) {
            var message = this._reader.readMessage(enum_1.MessageHeader.RecordBatch);
            if (message && message.isRecordBatch()) {
                var header = message.header();
                var buffer = this._reader.readMessageBody(message.bodyLength);
                var recordBatch = this._loadRecordBatch(header, buffer);
                return recordBatch;
            }
        }
        return null;
    };
    RecordBatchFileReaderImpl.prototype._readDictionaryBatch = function (index) {
        var block = this._footer && this._footer.getDictionaryBatch(index);
        if (block && this._handle.seek(block.offset)) {
            var message = this._reader.readMessage(enum_1.MessageHeader.DictionaryBatch);
            if (message && message.isDictionaryBatch()) {
                var header = message.header();
                var buffer = this._reader.readMessageBody(message.bodyLength);
                var vector = this._loadDictionaryBatch(header, buffer);
                this.dictionaries.set(header.id, vector);
            }
        }
    };
    RecordBatchFileReaderImpl.prototype._readFooter = function () {
        var _handle = this._handle;
        var offset = _handle.size - message_1.magicAndPadding;
        var length = _handle.readInt32(offset);
        var buffer = _handle.readAt(offset - length, length);
        return file_1.Footer.decode(buffer);
    };
    RecordBatchFileReaderImpl.prototype._readNextMessageAndValidate = function (type) {
        if (!this._footer) {
            this.open();
        }
        if (this._footer && this._recordBatchIndex < this.numRecordBatches) {
            var block = this._footer && this._footer.getRecordBatch(this._recordBatchIndex);
            if (block && this._handle.seek(block.offset)) {
                return this._reader.readMessage(type);
            }
        }
        return null;
    };
    return RecordBatchFileReaderImpl;
}(RecordBatchStreamReaderImpl));
/** @ignore */
var AsyncRecordBatchFileReaderImpl = /** @class */ (function (_super) {
    tslib_1.__extends(AsyncRecordBatchFileReaderImpl, _super);
    function AsyncRecordBatchFileReaderImpl(source) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var _this = this;
        var byteLength = typeof rest[0] !== 'number' ? rest.shift() : undefined;
        var dictionaries = rest[0] instanceof Map ? rest.shift() : undefined;
        _this = _super.call(this, source instanceof file_2.AsyncRandomAccessFile ? source : new file_2.AsyncRandomAccessFile(source, byteLength), dictionaries) || this;
        return _this;
    }
    Object.defineProperty(AsyncRecordBatchFileReaderImpl.prototype, "footer", {
        get: function () { return this._footer; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AsyncRecordBatchFileReaderImpl.prototype, "numDictionaries", {
        get: function () { return this._footer ? this._footer.numDictionaries : 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AsyncRecordBatchFileReaderImpl.prototype, "numRecordBatches", {
        get: function () { return this._footer ? this._footer.numRecordBatches : 0; },
        enumerable: false,
        configurable: true
    });
    AsyncRecordBatchFileReaderImpl.prototype.isFile = function () { return true; };
    AsyncRecordBatchFileReaderImpl.prototype.isAsync = function () { return true; };
    AsyncRecordBatchFileReaderImpl.prototype.open = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, block, _e, e_2_1;
            var e_2, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!(!this.closed && !this._footer)) return [3 /*break*/, 10];
                        _a = this;
                        _b = this;
                        return [4 /*yield*/, this._readFooter()];
                    case 1:
                        _a.schema = (_b._footer = _g.sent()).schema;
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 8, 9, 10]);
                        _c = tslib_1.__values(this._footer.dictionaryBatches()), _d = _c.next();
                        _g.label = 3;
                    case 3:
                        if (!!_d.done) return [3 /*break*/, 7];
                        block = _d.value;
                        _e = block;
                        if (!_e) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._readDictionaryBatch(this._dictionaryIndex++)];
                    case 4:
                        _e = (_g.sent());
                        _g.label = 5;
                    case 5:
                        _e;
                        _g.label = 6;
                    case 6:
                        _d = _c.next();
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_2_1 = _g.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 10: return [4 /*yield*/, _super.prototype.open.call(this, options)];
                    case 11: return [2 /*return*/, _g.sent()];
                }
            });
        });
    };
    AsyncRecordBatchFileReaderImpl.prototype.readRecordBatch = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var block, _a, message, header, buffer, recordBatch;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.closed) {
                            return [2 /*return*/, null];
                        }
                        if (!!this._footer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.open()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        block = this._footer && this._footer.getRecordBatch(index);
                        _a = block;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._handle.seek(block.offset)];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        if (!_a) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._reader.readMessage(enum_1.MessageHeader.RecordBatch)];
                    case 5:
                        message = _b.sent();
                        if (!(message && message.isRecordBatch())) return [3 /*break*/, 7];
                        header = message.header();
                        return [4 /*yield*/, this._reader.readMessageBody(message.bodyLength)];
                    case 6:
                        buffer = _b.sent();
                        recordBatch = this._loadRecordBatch(header, buffer);
                        return [2 /*return*/, recordBatch];
                    case 7: return [2 /*return*/, null];
                }
            });
        });
    };
    AsyncRecordBatchFileReaderImpl.prototype._readDictionaryBatch = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var block, _a, message, header, buffer, vector;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        block = this._footer && this._footer.getDictionaryBatch(index);
                        _a = block;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._handle.seek(block.offset)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._reader.readMessage(enum_1.MessageHeader.DictionaryBatch)];
                    case 3:
                        message = _b.sent();
                        if (!(message && message.isDictionaryBatch())) return [3 /*break*/, 5];
                        header = message.header();
                        return [4 /*yield*/, this._reader.readMessageBody(message.bodyLength)];
                    case 4:
                        buffer = _b.sent();
                        vector = this._loadDictionaryBatch(header, buffer);
                        this.dictionaries.set(header.id, vector);
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AsyncRecordBatchFileReaderImpl.prototype._readFooter = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _handle, _a, offset, length, buffer;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _handle = this._handle;
                        _a = _handle._pending;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, _handle._pending];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        offset = _handle.size - message_1.magicAndPadding;
                        return [4 /*yield*/, _handle.readInt32(offset)];
                    case 3:
                        length = _b.sent();
                        return [4 /*yield*/, _handle.readAt(offset - length, length)];
                    case 4:
                        buffer = _b.sent();
                        return [2 /*return*/, file_1.Footer.decode(buffer)];
                }
            });
        });
    };
    AsyncRecordBatchFileReaderImpl.prototype._readNextMessageAndValidate = function (type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var block, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this._footer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.open()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(this._footer && this._recordBatchIndex < this.numRecordBatches)) return [3 /*break*/, 6];
                        block = this._footer.getRecordBatch(this._recordBatchIndex);
                        _a = block;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._handle.seek(block.offset)];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        if (!_a) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._reader.readMessage(type)];
                    case 5: return [2 /*return*/, _b.sent()];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    return AsyncRecordBatchFileReaderImpl;
}(AsyncRecordBatchStreamReaderImpl));
/** @ignore */
var RecordBatchJSONReaderImpl = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchJSONReaderImpl, _super);
    function RecordBatchJSONReaderImpl(source, dictionaries) {
        return _super.call(this, source, dictionaries) || this;
    }
    RecordBatchJSONReaderImpl.prototype._loadVectors = function (header, body, types) {
        return new vectorloader_1.JSONVectorLoader(body, header.nodes, header.buffers, this.dictionaries).visitMany(types);
    };
    return RecordBatchJSONReaderImpl;
}(RecordBatchStreamReaderImpl));
//
// Define some helper functions and static implementations down here. There's
// a bit of branching in the static methods that can lead to the same routines
// being executed, so we've broken those out here for readability.
//
/** @ignore */
function shouldAutoDestroy(self, options) {
    return options && (typeof options['autoDestroy'] === 'boolean') ? options['autoDestroy'] : self['autoDestroy'];
}
/** @ignore */
function readAllSync(source) {
    var reader;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reader = RecordBatchReader.from(source);
                _a.label = 1;
            case 1:
                _a.trys.push([1, , 6, 7]);
                if (!!reader.open({ autoDestroy: false }).closed) return [3 /*break*/, 5];
                _a.label = 2;
            case 2: return [4 /*yield*/, reader];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(reader.reset().open()).closed) return [3 /*break*/, 2];
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                reader.cancel();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
/** @ignore */
function readAllAsync(source) {
    return tslib_1.__asyncGenerator(this, arguments, function readAllAsync_1() {
        var reader;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tslib_1.__await(RecordBatchReader.from(source))];
                case 1:
                    reader = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 10, 12]);
                    return [4 /*yield*/, tslib_1.__await(reader.open({ autoDestroy: false }))];
                case 3:
                    if (!!(_a.sent()).closed) return [3 /*break*/, 9];
                    _a.label = 4;
                case 4: return [4 /*yield*/, tslib_1.__await(reader)];
                case 5: return [4 /*yield*/, _a.sent()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [4 /*yield*/, tslib_1.__await(reader.reset().open())];
                case 8:
                    if (!(_a.sent()).closed) return [3 /*break*/, 4];
                    _a.label = 9;
                case 9: return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, tslib_1.__await(reader.cancel())];
                case 11:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/** @ignore */
function fromArrowJSON(source) {
    return new RecordBatchStreamReader(new RecordBatchJSONReaderImpl(source));
}
/** @ignore */
function fromByteStream(source) {
    var bytes = source.peek((message_1.magicLength + 7) & ~7);
    return bytes && bytes.byteLength >= 4 ? !message_1.checkForMagicArrowString(bytes)
        ? new RecordBatchStreamReader(new RecordBatchStreamReaderImpl(source))
        : new RecordBatchFileReader(new RecordBatchFileReaderImpl(source.read()))
        : new RecordBatchStreamReader(new RecordBatchStreamReaderImpl(function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/];
        }); }()));
}
/** @ignore */
function fromAsyncByteStream(source) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var bytes, _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, source.peek((message_1.magicLength + 7) & ~7)];
                case 1:
                    bytes = _e.sent();
                    if (!(bytes && bytes.byteLength >= 4)) return [3 /*break*/, 5];
                    if (!!message_1.checkForMagicArrowString(bytes)) return [3 /*break*/, 2];
                    _b = new AsyncRecordBatchStreamReader(new AsyncRecordBatchStreamReaderImpl(source));
                    return [3 /*break*/, 4];
                case 2:
                    _c = RecordBatchFileReader.bind;
                    _d = RecordBatchFileReaderImpl.bind;
                    return [4 /*yield*/, source.read()];
                case 3:
                    _b = new (_c.apply(RecordBatchFileReader, [void 0, new (_d.apply(RecordBatchFileReaderImpl, [void 0, _e.sent()]))()]))();
                    _e.label = 4;
                case 4:
                    _a = _b;
                    return [3 /*break*/, 6];
                case 5:
                    _a = new AsyncRecordBatchStreamReader(new AsyncRecordBatchStreamReaderImpl(function () { return tslib_1.__asyncGenerator(this, arguments, function () { return tslib_1.__generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); }()));
                    _e.label = 6;
                case 6: return [2 /*return*/, _a];
            }
        });
    });
}
/** @ignore */
function fromFileHandle(source) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var size, file, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, source.stat()];
                case 1:
                    size = (_b.sent()).size;
                    file = new file_2.AsyncRandomAccessFile(source, size);
                    if (!(size >= message_1.magicX2AndPadding)) return [3 /*break*/, 3];
                    _a = message_1.checkForMagicArrowString;
                    return [4 /*yield*/, file.readAt(0, (message_1.magicLength + 7) & ~7)];
                case 2:
                    if (_a.apply(void 0, [_b.sent()])) {
                        return [2 /*return*/, new AsyncRecordBatchFileReader(new AsyncRecordBatchFileReaderImpl(file))];
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/, new AsyncRecordBatchStreamReader(new AsyncRecordBatchStreamReaderImpl(file))];
            }
        });
    });
}

//# sourceMappingURL=reader.js.map
