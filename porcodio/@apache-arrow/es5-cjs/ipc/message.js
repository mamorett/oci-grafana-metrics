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
exports.magicX2AndPadding = exports.magicAndPadding = exports.magicLength = exports.checkForMagicArrowString = exports.MAGIC = exports.MAGIC_STR = exports.PADDING = exports.JSONMessageReader = exports.AsyncMessageReader = exports.MessageReader = void 0;
var tslib_1 = require("tslib");
var enum_1 = require("../enum");
var flatbuffers_1 = require("flatbuffers");
var ByteBuffer = flatbuffers_1.flatbuffers.ByteBuffer;
var message_1 = require("./metadata/message");
var compat_1 = require("../util/compat");
var file_1 = require("../io/file");
var buffer_1 = require("../util/buffer");
var stream_1 = require("../io/stream");
var interfaces_1 = require("../io/interfaces");
/** @ignore */ var invalidMessageType = function (type) { return "Expected " + enum_1.MessageHeader[type] + " Message in stream, but was null or length 0."; };
/** @ignore */ var nullMessage = function (type) { return "Header pointer of flatbuffer-encoded " + enum_1.MessageHeader[type] + " Message is null or length 0."; };
/** @ignore */ var invalidMessageMetadata = function (expected, actual) { return "Expected to read " + expected + " metadata bytes, but only read " + actual + "."; };
/** @ignore */ var invalidMessageBodyLength = function (expected, actual) { return "Expected to read " + expected + " bytes for message body, but only read " + actual + "."; };
/** @ignore */
var MessageReader = /** @class */ (function () {
    function MessageReader(source) {
        this.source = source instanceof stream_1.ByteStream ? source : new stream_1.ByteStream(source);
    }
    MessageReader.prototype[Symbol.iterator] = function () { return this; };
    MessageReader.prototype.next = function () {
        var r;
        if ((r = this.readMetadataLength()).done) {
            return interfaces_1.ITERATOR_DONE;
        }
        // ARROW-6313: If the first 4 bytes are continuation indicator (-1), read
        // the next 4 for the 32-bit metadata length. Otherwise, assume this is a
        // pre-v0.15 message, where the first 4 bytes are the metadata length.
        if ((r.value === -1) &&
            (r = this.readMetadataLength()).done) {
            return interfaces_1.ITERATOR_DONE;
        }
        if ((r = this.readMetadata(r.value)).done) {
            return interfaces_1.ITERATOR_DONE;
        }
        return r;
    };
    MessageReader.prototype.throw = function (value) { return this.source.throw(value); };
    MessageReader.prototype.return = function (value) { return this.source.return(value); };
    MessageReader.prototype.readMessage = function (type) {
        var r;
        if ((r = this.next()).done) {
            return null;
        }
        if ((type != null) && r.value.headerType !== type) {
            throw new Error(invalidMessageType(type));
        }
        return r.value;
    };
    MessageReader.prototype.readMessageBody = function (bodyLength) {
        if (bodyLength <= 0) {
            return new Uint8Array(0);
        }
        var buf = buffer_1.toUint8Array(this.source.read(bodyLength));
        if (buf.byteLength < bodyLength) {
            throw new Error(invalidMessageBodyLength(bodyLength, buf.byteLength));
        }
        // 1. Work around bugs in fs.ReadStream's internal Buffer pooling, see: https://github.com/nodejs/node/issues/24817
        // 2. Work around https://github.com/whatwg/streams/blob/0ebe4b042e467d9876d80ae045de3843092ad797/reference-implementation/lib/helpers.js#L126
        return /* 1. */ (buf.byteOffset % 8 === 0) &&
            /* 2. */ (buf.byteOffset + buf.byteLength) <= buf.buffer.byteLength ? buf : buf.slice();
    };
    MessageReader.prototype.readSchema = function (throwIfNull) {
        if (throwIfNull === void 0) { throwIfNull = false; }
        var type = enum_1.MessageHeader.Schema;
        var message = this.readMessage(type);
        var schema = message && message.header();
        if (throwIfNull && !schema) {
            throw new Error(nullMessage(type));
        }
        return schema;
    };
    MessageReader.prototype.readMetadataLength = function () {
        var buf = this.source.read(exports.PADDING);
        var bb = buf && new ByteBuffer(buf);
        var len = bb && bb.readInt32(0) || 0;
        return { done: len === 0, value: len };
    };
    MessageReader.prototype.readMetadata = function (metadataLength) {
        var buf = this.source.read(metadataLength);
        if (!buf) {
            return interfaces_1.ITERATOR_DONE;
        }
        if (buf.byteLength < metadataLength) {
            throw new Error(invalidMessageMetadata(metadataLength, buf.byteLength));
        }
        return { done: false, value: message_1.Message.decode(buf) };
    };
    return MessageReader;
}());
exports.MessageReader = MessageReader;
/** @ignore */
var AsyncMessageReader = /** @class */ (function () {
    function AsyncMessageReader(source, byteLength) {
        this.source = source instanceof stream_1.AsyncByteStream ? source
            : compat_1.isFileHandle(source)
                ? new file_1.AsyncRandomAccessFile(source, byteLength)
                : new stream_1.AsyncByteStream(source);
    }
    AsyncMessageReader.prototype[Symbol.asyncIterator] = function () { return this; };
    AsyncMessageReader.prototype.next = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.readMetadataLength()];
                    case 1:
                        if ((r = _b.sent()).done) {
                            return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                        }
                        _a = (r.value === -1);
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.readMetadataLength()];
                    case 2:
                        _a = (r = _b.sent()).done;
                        _b.label = 3;
                    case 3:
                        // ARROW-6313: If the first 4 bytes are continuation indicator (-1), read
                        // the next 4 for the 32-bit metadata length. Otherwise, assume this is a
                        // pre-v0.15 message, where the first 4 bytes are the metadata length.
                        if (_a) {
                            return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                        }
                        return [4 /*yield*/, this.readMetadata(r.value)];
                    case 4:
                        if ((r = _b.sent()).done) {
                            return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                        }
                        return [2 /*return*/, r];
                }
            });
        });
    };
    AsyncMessageReader.prototype.throw = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.source.throw(value)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); });
    };
    AsyncMessageReader.prototype.return = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.source.return(value)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); });
    };
    AsyncMessageReader.prototype.readMessage = function (type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var r;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.next()];
                    case 1:
                        if ((r = _a.sent()).done) {
                            return [2 /*return*/, null];
                        }
                        if ((type != null) && r.value.headerType !== type) {
                            throw new Error(invalidMessageType(type));
                        }
                        return [2 /*return*/, r.value];
                }
            });
        });
    };
    AsyncMessageReader.prototype.readMessageBody = function (bodyLength) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buf, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (bodyLength <= 0) {
                            return [2 /*return*/, new Uint8Array(0)];
                        }
                        _a = buffer_1.toUint8Array;
                        return [4 /*yield*/, this.source.read(bodyLength)];
                    case 1:
                        buf = _a.apply(void 0, [_b.sent()]);
                        if (buf.byteLength < bodyLength) {
                            throw new Error(invalidMessageBodyLength(bodyLength, buf.byteLength));
                        }
                        // 1. Work around bugs in fs.ReadStream's internal Buffer pooling, see: https://github.com/nodejs/node/issues/24817
                        // 2. Work around https://github.com/whatwg/streams/blob/0ebe4b042e467d9876d80ae045de3843092ad797/reference-implementation/lib/helpers.js#L126
                        return [2 /*return*/, /* 1. */ (buf.byteOffset % 8 === 0) &&
                                /* 2. */ (buf.byteOffset + buf.byteLength) <= buf.buffer.byteLength ? buf : buf.slice()];
                }
            });
        });
    };
    AsyncMessageReader.prototype.readSchema = function (throwIfNull) {
        if (throwIfNull === void 0) { throwIfNull = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var type, message, schema;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = enum_1.MessageHeader.Schema;
                        return [4 /*yield*/, this.readMessage(type)];
                    case 1:
                        message = _a.sent();
                        schema = message && message.header();
                        if (throwIfNull && !schema) {
                            throw new Error(nullMessage(type));
                        }
                        return [2 /*return*/, schema];
                }
            });
        });
    };
    AsyncMessageReader.prototype.readMetadataLength = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buf, bb, len;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.source.read(exports.PADDING)];
                    case 1:
                        buf = _a.sent();
                        bb = buf && new ByteBuffer(buf);
                        len = bb && bb.readInt32(0) || 0;
                        return [2 /*return*/, { done: len === 0, value: len }];
                }
            });
        });
    };
    AsyncMessageReader.prototype.readMetadata = function (metadataLength) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var buf;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.source.read(metadataLength)];
                    case 1:
                        buf = _a.sent();
                        if (!buf) {
                            return [2 /*return*/, interfaces_1.ITERATOR_DONE];
                        }
                        if (buf.byteLength < metadataLength) {
                            throw new Error(invalidMessageMetadata(metadataLength, buf.byteLength));
                        }
                        return [2 /*return*/, { done: false, value: message_1.Message.decode(buf) }];
                }
            });
        });
    };
    return AsyncMessageReader;
}());
exports.AsyncMessageReader = AsyncMessageReader;
/** @ignore */
var JSONMessageReader = /** @class */ (function (_super) {
    tslib_1.__extends(JSONMessageReader, _super);
    function JSONMessageReader(source) {
        var _this = _super.call(this, new Uint8Array(0)) || this;
        _this._schema = false;
        _this._body = [];
        _this._batchIndex = 0;
        _this._dictionaryIndex = 0;
        _this._json = source instanceof interfaces_1.ArrowJSON ? source : new interfaces_1.ArrowJSON(source);
        return _this;
    }
    JSONMessageReader.prototype.next = function () {
        var _json = this._json;
        if (!this._schema) {
            this._schema = true;
            var message = message_1.Message.fromJSON(_json.schema, enum_1.MessageHeader.Schema);
            return { done: false, value: message };
        }
        if (this._dictionaryIndex < _json.dictionaries.length) {
            var batch = _json.dictionaries[this._dictionaryIndex++];
            this._body = batch['data']['columns'];
            var message = message_1.Message.fromJSON(batch, enum_1.MessageHeader.DictionaryBatch);
            return { done: false, value: message };
        }
        if (this._batchIndex < _json.batches.length) {
            var batch = _json.batches[this._batchIndex++];
            this._body = batch['columns'];
            var message = message_1.Message.fromJSON(batch, enum_1.MessageHeader.RecordBatch);
            return { done: false, value: message };
        }
        this._body = [];
        return interfaces_1.ITERATOR_DONE;
    };
    JSONMessageReader.prototype.readMessageBody = function (_bodyLength) {
        return flattenDataSources(this._body);
        function flattenDataSources(xs) {
            return (xs || []).reduce(function (buffers, column) { return tslib_1.__spread(buffers, (column['VALIDITY'] && [column['VALIDITY']] || []), (column['TYPE'] && [column['TYPE']] || []), (column['OFFSET'] && [column['OFFSET']] || []), (column['DATA'] && [column['DATA']] || []), flattenDataSources(column['children'])); }, []);
        }
    };
    JSONMessageReader.prototype.readMessage = function (type) {
        var r;
        if ((r = this.next()).done) {
            return null;
        }
        if ((type != null) && r.value.headerType !== type) {
            throw new Error(invalidMessageType(type));
        }
        return r.value;
    };
    JSONMessageReader.prototype.readSchema = function () {
        var type = enum_1.MessageHeader.Schema;
        var message = this.readMessage(type);
        var schema = message && message.header();
        if (!message || !schema) {
            throw new Error(nullMessage(type));
        }
        return schema;
    };
    return JSONMessageReader;
}(MessageReader));
exports.JSONMessageReader = JSONMessageReader;
/** @ignore */
exports.PADDING = 4;
/** @ignore */
exports.MAGIC_STR = 'ARROW1';
/** @ignore */
exports.MAGIC = new Uint8Array(exports.MAGIC_STR.length);
for (var i = 0; i < exports.MAGIC_STR.length; i += 1 | 0) {
    exports.MAGIC[i] = exports.MAGIC_STR.charCodeAt(i);
}
/** @ignore */
function checkForMagicArrowString(buffer, index) {
    if (index === void 0) { index = 0; }
    for (var i = -1, n = exports.MAGIC.length; ++i < n;) {
        if (exports.MAGIC[i] !== buffer[index + i]) {
            return false;
        }
    }
    return true;
}
exports.checkForMagicArrowString = checkForMagicArrowString;
/** @ignore */
exports.magicLength = exports.MAGIC.length;
/** @ignore */
exports.magicAndPadding = exports.magicLength + exports.PADDING;
/** @ignore */
exports.magicX2AndPadding = exports.magicLength * 2 + exports.PADDING;

//# sourceMappingURL=message.js.map
