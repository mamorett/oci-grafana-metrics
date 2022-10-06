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
exports.RecordBatchJSONWriter = exports.RecordBatchFileWriter = exports.RecordBatchStreamWriter = exports.RecordBatchWriter = void 0;
var tslib_1 = require("tslib");
var table_1 = require("../table");
var message_1 = require("./message");
var column_1 = require("../column");
var type_1 = require("../type");
var schema_1 = require("../schema");
var message_2 = require("./metadata/message");
var metadata = require("./metadata/message");
var file_1 = require("./metadata/file");
var enum_1 = require("../enum");
var typecomparator_1 = require("../visitor/typecomparator");
var stream_1 = require("../io/stream");
var vectorassembler_1 = require("../visitor/vectorassembler");
var jsontypeassembler_1 = require("../visitor/jsontypeassembler");
var jsonvectorassembler_1 = require("../visitor/jsonvectorassembler");
var buffer_1 = require("../util/buffer");
var recordbatch_1 = require("../recordbatch");
var interfaces_1 = require("../io/interfaces");
var compat_1 = require("../util/compat");
var RecordBatchWriter = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchWriter, _super);
    function RecordBatchWriter(options) {
        var _this = _super.call(this) || this;
        _this._position = 0;
        _this._started = false;
        // @ts-ignore
        _this._sink = new stream_1.AsyncByteQueue();
        _this._schema = null;
        _this._dictionaryBlocks = [];
        _this._recordBatchBlocks = [];
        _this._dictionaryDeltaOffsets = new Map();
        compat_1.isObject(options) || (options = { autoDestroy: true, writeLegacyIpcFormat: false });
        _this._autoDestroy = (typeof options.autoDestroy === 'boolean') ? options.autoDestroy : true;
        _this._writeLegacyIpcFormat = (typeof options.writeLegacyIpcFormat === 'boolean') ? options.writeLegacyIpcFormat : false;
        return _this;
    }
    /** @nocollapse */
    // @ts-ignore
    RecordBatchWriter.throughNode = function (options) {
        throw new Error("\"throughNode\" not available in this environment");
    };
    /** @nocollapse */
    RecordBatchWriter.throughDOM = function (
    // @ts-ignore
    writableStrategy, 
    // @ts-ignore
    readableStrategy) {
        throw new Error("\"throughDOM\" not available in this environment");
    };
    RecordBatchWriter.prototype.toString = function (sync) {
        if (sync === void 0) { sync = false; }
        return this._sink.toString(sync);
    };
    RecordBatchWriter.prototype.toUint8Array = function (sync) {
        if (sync === void 0) { sync = false; }
        return this._sink.toUint8Array(sync);
    };
    RecordBatchWriter.prototype.writeAll = function (input) {
        var _this = this;
        if (compat_1.isPromise(input)) {
            return input.then(function (x) { return _this.writeAll(x); });
        }
        else if (compat_1.isAsyncIterable(input)) {
            return writeAllAsync(this, input);
        }
        return writeAll(this, input);
    };
    Object.defineProperty(RecordBatchWriter.prototype, "closed", {
        get: function () { return this._sink.closed; },
        enumerable: false,
        configurable: true
    });
    RecordBatchWriter.prototype[Symbol.asyncIterator] = function () { return this._sink[Symbol.asyncIterator](); };
    RecordBatchWriter.prototype.toDOMStream = function (options) { return this._sink.toDOMStream(options); };
    RecordBatchWriter.prototype.toNodeStream = function (options) { return this._sink.toNodeStream(options); };
    RecordBatchWriter.prototype.close = function () {
        return this.reset()._sink.close();
    };
    RecordBatchWriter.prototype.abort = function (reason) {
        return this.reset()._sink.abort(reason);
    };
    RecordBatchWriter.prototype.finish = function () {
        this._autoDestroy ? this.close() : this.reset(this._sink, this._schema);
        return this;
    };
    RecordBatchWriter.prototype.reset = function (sink, schema) {
        if (sink === void 0) { sink = this._sink; }
        if (schema === void 0) { schema = null; }
        if ((sink === this._sink) || (sink instanceof stream_1.AsyncByteQueue)) {
            this._sink = sink;
        }
        else {
            this._sink = new stream_1.AsyncByteQueue();
            if (sink && compat_1.isWritableDOMStream(sink)) {
                this.toDOMStream({ type: 'bytes' }).pipeTo(sink);
            }
            else if (sink && compat_1.isWritableNodeStream(sink)) {
                this.toNodeStream({ objectMode: false }).pipe(sink);
            }
        }
        if (this._started && this._schema) {
            this._writeFooter(this._schema);
        }
        this._started = false;
        this._dictionaryBlocks = [];
        this._recordBatchBlocks = [];
        this._dictionaryDeltaOffsets = new Map();
        if (!schema || !(typecomparator_1.compareSchemas(schema, this._schema))) {
            if (schema === null) {
                this._position = 0;
                this._schema = null;
            }
            else {
                this._started = true;
                this._schema = schema;
                this._writeSchema(schema);
            }
        }
        return this;
    };
    RecordBatchWriter.prototype.write = function (payload) {
        var schema = null;
        if (!this._sink) {
            throw new Error("RecordBatchWriter is closed");
        }
        else if (payload === null || payload === undefined) {
            return this.finish() && undefined;
        }
        else if (payload instanceof table_1.Table && !(schema = payload.schema)) {
            return this.finish() && undefined;
        }
        else if (payload instanceof recordbatch_1.RecordBatch && !(schema = payload.schema)) {
            return this.finish() && undefined;
        }
        if (schema && !typecomparator_1.compareSchemas(schema, this._schema)) {
            if (this._started && this._autoDestroy) {
                return this.close();
            }
            this.reset(this._sink, schema);
        }
        if (payload instanceof recordbatch_1.RecordBatch) {
            if (!(payload instanceof recordbatch_1._InternalEmptyPlaceholderRecordBatch)) {
                this._writeRecordBatch(payload);
            }
        }
        else if (payload instanceof table_1.Table) {
            this.writeAll(payload.chunks);
        }
        else if (compat_1.isIterable(payload)) {
            this.writeAll(payload);
        }
    };
    RecordBatchWriter.prototype._writeMessage = function (message, alignment) {
        if (alignment === void 0) { alignment = 8; }
        var a = alignment - 1;
        var buffer = message_2.Message.encode(message);
        var flatbufferSize = buffer.byteLength;
        var prefixSize = !this._writeLegacyIpcFormat ? 8 : 4;
        var alignedSize = (flatbufferSize + prefixSize + a) & ~a;
        var nPaddingBytes = alignedSize - flatbufferSize - prefixSize;
        if (message.headerType === enum_1.MessageHeader.RecordBatch) {
            this._recordBatchBlocks.push(new file_1.FileBlock(alignedSize, message.bodyLength, this._position));
        }
        else if (message.headerType === enum_1.MessageHeader.DictionaryBatch) {
            this._dictionaryBlocks.push(new file_1.FileBlock(alignedSize, message.bodyLength, this._position));
        }
        // If not in legacy pre-0.15.0 mode, write the stream continuation indicator
        if (!this._writeLegacyIpcFormat) {
            this._write(Int32Array.of(-1));
        }
        // Write the flatbuffer size prefix including padding
        this._write(Int32Array.of(alignedSize - prefixSize));
        // Write the flatbuffer
        if (flatbufferSize > 0) {
            this._write(buffer);
        }
        // Write any padding
        return this._writePadding(nPaddingBytes);
    };
    RecordBatchWriter.prototype._write = function (chunk) {
        if (this._started) {
            var buffer = buffer_1.toUint8Array(chunk);
            if (buffer && buffer.byteLength > 0) {
                this._sink.write(buffer);
                this._position += buffer.byteLength;
            }
        }
        return this;
    };
    RecordBatchWriter.prototype._writeSchema = function (schema) {
        return this._writeMessage(message_2.Message.from(schema));
    };
    // @ts-ignore
    RecordBatchWriter.prototype._writeFooter = function (schema) {
        // eos bytes
        return this._writeLegacyIpcFormat
            ? this._write(Int32Array.of(0))
            : this._write(Int32Array.of(-1, 0));
    };
    RecordBatchWriter.prototype._writeMagic = function () {
        return this._write(message_1.MAGIC);
    };
    RecordBatchWriter.prototype._writePadding = function (nBytes) {
        return nBytes > 0 ? this._write(new Uint8Array(nBytes)) : this;
    };
    RecordBatchWriter.prototype._writeRecordBatch = function (batch) {
        var _a = vectorassembler_1.VectorAssembler.assemble(batch), byteLength = _a.byteLength, nodes = _a.nodes, bufferRegions = _a.bufferRegions, buffers = _a.buffers;
        var recordBatch = new metadata.RecordBatch(batch.length, nodes, bufferRegions);
        var message = message_2.Message.from(recordBatch, byteLength);
        return this
            ._writeDictionaries(batch)
            ._writeMessage(message)
            ._writeBodyBuffers(buffers);
    };
    RecordBatchWriter.prototype._writeDictionaryBatch = function (dictionary, id, isDelta) {
        if (isDelta === void 0) { isDelta = false; }
        this._dictionaryDeltaOffsets.set(id, dictionary.length + (this._dictionaryDeltaOffsets.get(id) || 0));
        var _a = vectorassembler_1.VectorAssembler.assemble(dictionary), byteLength = _a.byteLength, nodes = _a.nodes, bufferRegions = _a.bufferRegions, buffers = _a.buffers;
        var recordBatch = new metadata.RecordBatch(dictionary.length, nodes, bufferRegions);
        var dictionaryBatch = new metadata.DictionaryBatch(recordBatch, id, isDelta);
        var message = message_2.Message.from(dictionaryBatch, byteLength);
        return this
            ._writeMessage(message)
            ._writeBodyBuffers(buffers);
    };
    RecordBatchWriter.prototype._writeBodyBuffers = function (buffers) {
        var buffer;
        var size, padding;
        for (var i = -1, n = buffers.length; ++i < n;) {
            if ((buffer = buffers[i]) && (size = buffer.byteLength) > 0) {
                this._write(buffer);
                if ((padding = ((size + 7) & ~7) - size) > 0) {
                    this._writePadding(padding);
                }
            }
        }
        return this;
    };
    RecordBatchWriter.prototype._writeDictionaries = function (batch) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = tslib_1.__values(batch.dictionaries), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = tslib_1.__read(_d.value, 2), id = _e[0], dictionary = _e[1];
                var offset = this._dictionaryDeltaOffsets.get(id) || 0;
                if (offset === 0 || (dictionary = dictionary.slice(offset)).length > 0) {
                    var chunks = 'chunks' in dictionary ? dictionary.chunks : [dictionary];
                    try {
                        for (var chunks_1 = (e_2 = void 0, tslib_1.__values(chunks)), chunks_1_1 = chunks_1.next(); !chunks_1_1.done; chunks_1_1 = chunks_1.next()) {
                            var chunk = chunks_1_1.value;
                            this._writeDictionaryBatch(chunk, id, offset > 0);
                            offset += chunk.length;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (chunks_1_1 && !chunks_1_1.done && (_b = chunks_1.return)) _b.call(chunks_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    return RecordBatchWriter;
}(interfaces_1.ReadableInterop));
exports.RecordBatchWriter = RecordBatchWriter;
/** @ignore */
var RecordBatchStreamWriter = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchStreamWriter, _super);
    function RecordBatchStreamWriter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @nocollapse */
    RecordBatchStreamWriter.writeAll = function (input, options) {
        var writer = new RecordBatchStreamWriter(options);
        if (compat_1.isPromise(input)) {
            return input.then(function (x) { return writer.writeAll(x); });
        }
        else if (compat_1.isAsyncIterable(input)) {
            return writeAllAsync(writer, input);
        }
        return writeAll(writer, input);
    };
    return RecordBatchStreamWriter;
}(RecordBatchWriter));
exports.RecordBatchStreamWriter = RecordBatchStreamWriter;
/** @ignore */
var RecordBatchFileWriter = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchFileWriter, _super);
    function RecordBatchFileWriter() {
        var _this = _super.call(this) || this;
        _this._autoDestroy = true;
        return _this;
    }
    /** @nocollapse */
    RecordBatchFileWriter.writeAll = function (input) {
        var writer = new RecordBatchFileWriter();
        if (compat_1.isPromise(input)) {
            return input.then(function (x) { return writer.writeAll(x); });
        }
        else if (compat_1.isAsyncIterable(input)) {
            return writeAllAsync(writer, input);
        }
        return writeAll(writer, input);
    };
    // @ts-ignore
    RecordBatchFileWriter.prototype._writeSchema = function (schema) {
        return this._writeMagic()._writePadding(2);
    };
    RecordBatchFileWriter.prototype._writeFooter = function (schema) {
        var buffer = file_1.Footer.encode(new file_1.Footer(schema, enum_1.MetadataVersion.V4, this._recordBatchBlocks, this._dictionaryBlocks));
        return _super.prototype._writeFooter.call(this, schema) // EOS bytes for sequential readers
            ._write(buffer) // Write the flatbuffer
            ._write(Int32Array.of(buffer.byteLength)) // then the footer size suffix
            ._writeMagic(); // then the magic suffix
    };
    return RecordBatchFileWriter;
}(RecordBatchWriter));
exports.RecordBatchFileWriter = RecordBatchFileWriter;
/** @ignore */
var RecordBatchJSONWriter = /** @class */ (function (_super) {
    tslib_1.__extends(RecordBatchJSONWriter, _super);
    function RecordBatchJSONWriter() {
        var _this = _super.call(this) || this;
        _this._autoDestroy = true;
        _this._recordBatches = [];
        _this._dictionaries = [];
        return _this;
    }
    /** @nocollapse */
    RecordBatchJSONWriter.writeAll = function (input) {
        return new RecordBatchJSONWriter().writeAll(input);
    };
    RecordBatchJSONWriter.prototype._writeMessage = function () { return this; };
    // @ts-ignore
    RecordBatchJSONWriter.prototype._writeFooter = function (schema) { return this; };
    RecordBatchJSONWriter.prototype._writeSchema = function (schema) {
        return this._write("{\n  \"schema\": " + JSON.stringify({ fields: schema.fields.map(fieldToJSON) }, null, 2));
    };
    RecordBatchJSONWriter.prototype._writeDictionaries = function (batch) {
        if (batch.dictionaries.size > 0) {
            this._dictionaries.push(batch);
        }
        return this;
    };
    RecordBatchJSONWriter.prototype._writeDictionaryBatch = function (dictionary, id, isDelta) {
        if (isDelta === void 0) { isDelta = false; }
        this._dictionaryDeltaOffsets.set(id, dictionary.length + (this._dictionaryDeltaOffsets.get(id) || 0));
        this._write(this._dictionaryBlocks.length === 0 ? "    " : ",\n    ");
        this._write("" + dictionaryBatchToJSON(dictionary, id, isDelta));
        this._dictionaryBlocks.push(new file_1.FileBlock(0, 0, 0));
        return this;
    };
    RecordBatchJSONWriter.prototype._writeRecordBatch = function (batch) {
        this._writeDictionaries(batch);
        this._recordBatches.push(batch);
        return this;
    };
    RecordBatchJSONWriter.prototype.close = function () {
        var e_3, _a;
        if (this._dictionaries.length > 0) {
            this._write(",\n  \"dictionaries\": [\n");
            try {
                for (var _b = tslib_1.__values(this._dictionaries), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var batch = _c.value;
                    _super.prototype._writeDictionaries.call(this, batch);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this._write("\n  ]");
        }
        if (this._recordBatches.length > 0) {
            for (var i = -1, n = this._recordBatches.length; ++i < n;) {
                this._write(i === 0 ? ",\n  \"batches\": [\n    " : ",\n    ");
                this._write("" + recordBatchToJSON(this._recordBatches[i]));
                this._recordBatchBlocks.push(new file_1.FileBlock(0, 0, 0));
            }
            this._write("\n  ]");
        }
        if (this._schema) {
            this._write("\n}");
        }
        this._dictionaries = [];
        this._recordBatches = [];
        return _super.prototype.close.call(this);
    };
    return RecordBatchJSONWriter;
}(RecordBatchWriter));
exports.RecordBatchJSONWriter = RecordBatchJSONWriter;
/** @ignore */
function writeAll(writer, input) {
    var e_4, _a;
    var chunks = input;
    if (input instanceof table_1.Table) {
        chunks = input.chunks;
        writer.reset(undefined, input.schema);
    }
    try {
        for (var chunks_2 = tslib_1.__values(chunks), chunks_2_1 = chunks_2.next(); !chunks_2_1.done; chunks_2_1 = chunks_2.next()) {
            var batch = chunks_2_1.value;
            writer.write(batch);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (chunks_2_1 && !chunks_2_1.done && (_a = chunks_2.return)) _a.call(chunks_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return writer.finish();
}
/** @ignore */
function writeAllAsync(writer, batches) {
    var batches_1, batches_1_1;
    var e_5, _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var batch, e_5_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 11]);
                    batches_1 = tslib_1.__asyncValues(batches);
                    _b.label = 1;
                case 1: return [4 /*yield*/, batches_1.next()];
                case 2:
                    if (!(batches_1_1 = _b.sent(), !batches_1_1.done)) return [3 /*break*/, 4];
                    batch = batches_1_1.value;
                    writer.write(batch);
                    _b.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 11];
                case 5:
                    e_5_1 = _b.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 11];
                case 6:
                    _b.trys.push([6, , 9, 10]);
                    if (!(batches_1_1 && !batches_1_1.done && (_a = batches_1.return))) return [3 /*break*/, 8];
                    return [4 /*yield*/, _a.call(batches_1)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (e_5) throw e_5.error;
                    return [7 /*endfinally*/];
                case 10: return [7 /*endfinally*/];
                case 11: return [2 /*return*/, writer.finish()];
            }
        });
    });
}
/** @ignore */
function fieldToJSON(_a) {
    var name = _a.name, type = _a.type, nullable = _a.nullable;
    var assembler = new jsontypeassembler_1.JSONTypeAssembler();
    return {
        'name': name, 'nullable': nullable,
        'type': assembler.visit(type),
        'children': (type.children || []).map(fieldToJSON),
        'dictionary': !type_1.DataType.isDictionary(type) ? undefined : {
            'id': type.id,
            'isOrdered': type.isOrdered,
            'indexType': assembler.visit(type.indices)
        }
    };
}
/** @ignore */
function dictionaryBatchToJSON(dictionary, id, isDelta) {
    if (isDelta === void 0) { isDelta = false; }
    var field = new schema_1.Field("" + id, dictionary.type, dictionary.nullCount > 0);
    var columns = jsonvectorassembler_1.JSONVectorAssembler.assemble(new column_1.Column(field, [dictionary]));
    return JSON.stringify({
        'id': id,
        'isDelta': isDelta,
        'data': {
            'count': dictionary.length,
            'columns': columns
        }
    }, null, 2);
}
/** @ignore */
function recordBatchToJSON(records) {
    return JSON.stringify({
        'count': records.length,
        'columns': jsonvectorassembler_1.JSONVectorAssembler.assemble(records)
    }, null, 2);
}

//# sourceMappingURL=writer.js.map
