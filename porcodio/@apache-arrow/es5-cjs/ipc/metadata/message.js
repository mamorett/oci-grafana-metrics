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
exports.FieldNode = exports.BufferRegion = exports.DictionaryBatch = exports.RecordBatch = exports.Message = void 0;
var tslib_1 = require("tslib");
/* eslint-disable brace-style */
var flatbuffers_1 = require("flatbuffers");
var Schema_1 = require("../../fb/Schema");
var Message_1 = require("../../fb/Message");
var schema_1 = require("../../schema");
var buffer_1 = require("../../util/buffer");
var enum_1 = require("../../enum");
var typeassembler_1 = require("../../visitor/typeassembler");
var json_1 = require("./json");
var Long = flatbuffers_1.flatbuffers.Long;
var Builder = flatbuffers_1.flatbuffers.Builder;
var ByteBuffer = flatbuffers_1.flatbuffers.ByteBuffer;
var type_1 = require("../../type");
/**
 * @ignore
 * @private
 **/
var Message = /** @class */ (function () {
    function Message(bodyLength, version, headerType, header) {
        this._version = version;
        this._headerType = headerType;
        this.body = new Uint8Array(0);
        header && (this._createHeader = function () { return header; });
        this._bodyLength = typeof bodyLength === 'number' ? bodyLength : bodyLength.low;
    }
    /** @nocollapse */
    Message.fromJSON = function (msg, headerType) {
        var message = new Message(0, enum_1.MetadataVersion.V4, headerType);
        message._createHeader = messageHeaderFromJSON(msg, headerType);
        return message;
    };
    /** @nocollapse */
    Message.decode = function (buf) {
        buf = new ByteBuffer(buffer_1.toUint8Array(buf));
        var _message = Message_1.Message.getRootAsMessage(buf);
        var bodyLength = _message.bodyLength();
        var version = _message.version();
        var headerType = _message.headerType();
        var message = new Message(bodyLength, version, headerType);
        message._createHeader = decodeMessageHeader(_message, headerType);
        return message;
    };
    /** @nocollapse */
    Message.encode = function (message) {
        var b = new Builder();
        var headerOffset = -1;
        if (message.isSchema()) {
            headerOffset = schema_1.Schema.encode(b, message.header());
        }
        else if (message.isRecordBatch()) {
            headerOffset = RecordBatch.encode(b, message.header());
        }
        else if (message.isDictionaryBatch()) {
            headerOffset = DictionaryBatch.encode(b, message.header());
        }
        Message_1.Message.startMessage(b);
        Message_1.Message.addVersion(b, enum_1.MetadataVersion.V4);
        Message_1.Message.addHeader(b, headerOffset);
        Message_1.Message.addHeaderType(b, message.headerType);
        Message_1.Message.addBodyLength(b, new Long(message.bodyLength, 0));
        Message_1.Message.finishMessageBuffer(b, Message_1.Message.endMessage(b));
        return b.asUint8Array();
    };
    /** @nocollapse */
    Message.from = function (header, bodyLength) {
        if (bodyLength === void 0) { bodyLength = 0; }
        if (header instanceof schema_1.Schema) {
            return new Message(0, enum_1.MetadataVersion.V4, enum_1.MessageHeader.Schema, header);
        }
        if (header instanceof RecordBatch) {
            return new Message(bodyLength, enum_1.MetadataVersion.V4, enum_1.MessageHeader.RecordBatch, header);
        }
        if (header instanceof DictionaryBatch) {
            return new Message(bodyLength, enum_1.MetadataVersion.V4, enum_1.MessageHeader.DictionaryBatch, header);
        }
        throw new Error("Unrecognized Message header: " + header);
    };
    Object.defineProperty(Message.prototype, "type", {
        get: function () { return this.headerType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "version", {
        get: function () { return this._version; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "headerType", {
        get: function () { return this._headerType; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "bodyLength", {
        get: function () { return this._bodyLength; },
        enumerable: false,
        configurable: true
    });
    Message.prototype.header = function () { return this._createHeader(); };
    Message.prototype.isSchema = function () { return this.headerType === enum_1.MessageHeader.Schema; };
    Message.prototype.isRecordBatch = function () { return this.headerType === enum_1.MessageHeader.RecordBatch; };
    Message.prototype.isDictionaryBatch = function () { return this.headerType === enum_1.MessageHeader.DictionaryBatch; };
    return Message;
}());
exports.Message = Message;
/**
 * @ignore
 * @private
 **/
var RecordBatch = /** @class */ (function () {
    function RecordBatch(length, nodes, buffers) {
        this._nodes = nodes;
        this._buffers = buffers;
        this._length = typeof length === 'number' ? length : length.low;
    }
    Object.defineProperty(RecordBatch.prototype, "nodes", {
        get: function () { return this._nodes; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatch.prototype, "length", {
        get: function () { return this._length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordBatch.prototype, "buffers", {
        get: function () { return this._buffers; },
        enumerable: false,
        configurable: true
    });
    return RecordBatch;
}());
exports.RecordBatch = RecordBatch;
/**
 * @ignore
 * @private
 **/
var DictionaryBatch = /** @class */ (function () {
    function DictionaryBatch(data, id, isDelta) {
        if (isDelta === void 0) { isDelta = false; }
        this._data = data;
        this._isDelta = isDelta;
        this._id = typeof id === 'number' ? id : id.low;
    }
    Object.defineProperty(DictionaryBatch.prototype, "id", {
        get: function () { return this._id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBatch.prototype, "data", {
        get: function () { return this._data; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBatch.prototype, "isDelta", {
        get: function () { return this._isDelta; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBatch.prototype, "length", {
        get: function () { return this.data.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBatch.prototype, "nodes", {
        get: function () { return this.data.nodes; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictionaryBatch.prototype, "buffers", {
        get: function () { return this.data.buffers; },
        enumerable: false,
        configurable: true
    });
    return DictionaryBatch;
}());
exports.DictionaryBatch = DictionaryBatch;
/**
 * @ignore
 * @private
 **/
var BufferRegion = /** @class */ (function () {
    function BufferRegion(offset, length) {
        this.offset = typeof offset === 'number' ? offset : offset.low;
        this.length = typeof length === 'number' ? length : length.low;
    }
    return BufferRegion;
}());
exports.BufferRegion = BufferRegion;
/**
 * @ignore
 * @private
 **/
var FieldNode = /** @class */ (function () {
    function FieldNode(length, nullCount) {
        this.length = typeof length === 'number' ? length : length.low;
        this.nullCount = typeof nullCount === 'number' ? nullCount : nullCount.low;
    }
    return FieldNode;
}());
exports.FieldNode = FieldNode;
/** @ignore */
function messageHeaderFromJSON(message, type) {
    return (function () {
        switch (type) {
            case enum_1.MessageHeader.Schema: return schema_1.Schema.fromJSON(message);
            case enum_1.MessageHeader.RecordBatch: return RecordBatch.fromJSON(message);
            case enum_1.MessageHeader.DictionaryBatch: return DictionaryBatch.fromJSON(message);
        }
        throw new Error("Unrecognized Message type: { name: " + enum_1.MessageHeader[type] + ", type: " + type + " }");
    });
}
/** @ignore */
function decodeMessageHeader(message, type) {
    return (function () {
        switch (type) {
            case enum_1.MessageHeader.Schema: return schema_1.Schema.decode(message.header(new Schema_1.Schema()));
            case enum_1.MessageHeader.RecordBatch: return RecordBatch.decode(message.header(new Message_1.RecordBatch()), message.version());
            case enum_1.MessageHeader.DictionaryBatch: return DictionaryBatch.decode(message.header(new Message_1.DictionaryBatch()), message.version());
        }
        throw new Error("Unrecognized Message type: { name: " + enum_1.MessageHeader[type] + ", type: " + type + " }");
    });
}
schema_1.Field['encode'] = encodeField;
schema_1.Field['decode'] = decodeField;
schema_1.Field['fromJSON'] = json_1.fieldFromJSON;
schema_1.Schema['encode'] = encodeSchema;
schema_1.Schema['decode'] = decodeSchema;
schema_1.Schema['fromJSON'] = json_1.schemaFromJSON;
RecordBatch['encode'] = encodeRecordBatch;
RecordBatch['decode'] = decodeRecordBatch;
RecordBatch['fromJSON'] = json_1.recordBatchFromJSON;
DictionaryBatch['encode'] = encodeDictionaryBatch;
DictionaryBatch['decode'] = decodeDictionaryBatch;
DictionaryBatch['fromJSON'] = json_1.dictionaryBatchFromJSON;
FieldNode['encode'] = encodeFieldNode;
FieldNode['decode'] = decodeFieldNode;
BufferRegion['encode'] = encodeBufferRegion;
BufferRegion['decode'] = decodeBufferRegion;
/** @ignore */
function decodeSchema(_schema, dictionaries) {
    if (dictionaries === void 0) { dictionaries = new Map(); }
    var fields = decodeSchemaFields(_schema, dictionaries);
    return new schema_1.Schema(fields, decodeCustomMetadata(_schema), dictionaries);
}
/** @ignore */
function decodeRecordBatch(batch, version) {
    if (version === void 0) { version = enum_1.MetadataVersion.V4; }
    return new RecordBatch(batch.length(), decodeFieldNodes(batch), decodeBuffers(batch, version));
}
/** @ignore */
function decodeDictionaryBatch(batch, version) {
    if (version === void 0) { version = enum_1.MetadataVersion.V4; }
    return new DictionaryBatch(RecordBatch.decode(batch.data(), version), batch.id(), batch.isDelta());
}
/** @ignore */
function decodeBufferRegion(b) {
    return new BufferRegion(b.offset(), b.length());
}
/** @ignore */
function decodeFieldNode(f) {
    return new FieldNode(f.length(), f.nullCount());
}
/** @ignore */
function decodeFieldNodes(batch) {
    var nodes = [];
    for (var f = void 0, i = -1, j = -1, n = batch.nodesLength(); ++i < n;) {
        if (f = batch.nodes(i)) {
            nodes[++j] = FieldNode.decode(f);
        }
    }
    return nodes;
}
/** @ignore */
function decodeBuffers(batch, version) {
    var bufferRegions = [];
    for (var b = void 0, i = -1, j = -1, n = batch.buffersLength(); ++i < n;) {
        if (b = batch.buffers(i)) {
            // If this Arrow buffer was written before version 4,
            // advance the buffer's bb_pos 8 bytes to skip past
            // the now-removed page_id field
            if (version < enum_1.MetadataVersion.V4) {
                b.bb_pos += (8 * (i + 1));
            }
            bufferRegions[++j] = BufferRegion.decode(b);
        }
    }
    return bufferRegions;
}
/** @ignore */
function decodeSchemaFields(schema, dictionaries) {
    var fields = [];
    for (var f = void 0, i = -1, j = -1, n = schema.fieldsLength(); ++i < n;) {
        if (f = schema.fields(i)) {
            fields[++j] = schema_1.Field.decode(f, dictionaries);
        }
    }
    return fields;
}
/** @ignore */
function decodeFieldChildren(field, dictionaries) {
    var children = [];
    for (var f = void 0, i = -1, j = -1, n = field.childrenLength(); ++i < n;) {
        if (f = field.children(i)) {
            children[++j] = schema_1.Field.decode(f, dictionaries);
        }
    }
    return children;
}
/** @ignore */
function decodeField(f, dictionaries) {
    var id;
    var field;
    var type;
    var keys;
    var dictType;
    var dictMeta;
    // If no dictionary encoding
    if (!dictionaries || !(dictMeta = f.dictionary())) {
        type = decodeFieldType(f, decodeFieldChildren(f, dictionaries));
        field = new schema_1.Field(f.name(), type, f.nullable(), decodeCustomMetadata(f));
    }
    // If dictionary encoded and the first time we've seen this dictionary id, decode
    // the data type and child fields, then wrap in a Dictionary type and insert the
    // data type into the dictionary types map.
    else if (!dictionaries.has(id = dictMeta.id().low)) {
        // a dictionary index defaults to signed 32 bit int if unspecified
        keys = (keys = dictMeta.indexType()) ? decodeIndexType(keys) : new type_1.Int32();
        dictionaries.set(id, type = decodeFieldType(f, decodeFieldChildren(f, dictionaries)));
        dictType = new type_1.Dictionary(type, keys, id, dictMeta.isOrdered());
        field = new schema_1.Field(f.name(), dictType, f.nullable(), decodeCustomMetadata(f));
    }
    // If dictionary encoded, and have already seen this dictionary Id in the schema, then reuse the
    // data type and wrap in a new Dictionary type and field.
    else {
        // a dictionary index defaults to signed 32 bit int if unspecified
        keys = (keys = dictMeta.indexType()) ? decodeIndexType(keys) : new type_1.Int32();
        dictType = new type_1.Dictionary(dictionaries.get(id), keys, id, dictMeta.isOrdered());
        field = new schema_1.Field(f.name(), dictType, f.nullable(), decodeCustomMetadata(f));
    }
    return field || null;
}
/** @ignore */
function decodeCustomMetadata(parent) {
    var data = new Map();
    if (parent) {
        for (var entry = void 0, key = void 0, i = -1, n = parent.customMetadataLength() | 0; ++i < n;) {
            if ((entry = parent.customMetadata(i)) && (key = entry.key()) != null) {
                data.set(key, entry.value());
            }
        }
    }
    return data;
}
/** @ignore */
function decodeIndexType(_type) {
    return new type_1.Int(_type.isSigned(), _type.bitWidth());
}
/** @ignore */
function decodeFieldType(f, children) {
    var typeId = f.typeType();
    switch (typeId) {
        case Schema_1.Type['NONE']: return new type_1.Null();
        case Schema_1.Type['Null']: return new type_1.Null();
        case Schema_1.Type['Binary']: return new type_1.Binary();
        case Schema_1.Type['Utf8']: return new type_1.Utf8();
        case Schema_1.Type['Bool']: return new type_1.Bool();
        case Schema_1.Type['List']: return new type_1.List((children || [])[0]);
        case Schema_1.Type['Struct_']: return new type_1.Struct(children || []);
    }
    switch (typeId) {
        case Schema_1.Type['Int']: {
            var t = f.type(new Schema_1.Int());
            return new type_1.Int(t.isSigned(), t.bitWidth());
        }
        case Schema_1.Type['FloatingPoint']: {
            var t = f.type(new Schema_1.FloatingPoint());
            return new type_1.Float(t.precision());
        }
        case Schema_1.Type['Decimal']: {
            var t = f.type(new Schema_1.Decimal());
            return new type_1.Decimal(t.scale(), t.precision());
        }
        case Schema_1.Type['Date']: {
            var t = f.type(new Schema_1.Date());
            return new type_1.Date_(t.unit());
        }
        case Schema_1.Type['Time']: {
            var t = f.type(new Schema_1.Time());
            return new type_1.Time(t.unit(), t.bitWidth());
        }
        case Schema_1.Type['Timestamp']: {
            var t = f.type(new Schema_1.Timestamp());
            return new type_1.Timestamp(t.unit(), t.timezone());
        }
        case Schema_1.Type['Interval']: {
            var t = f.type(new Schema_1.Interval());
            return new type_1.Interval(t.unit());
        }
        case Schema_1.Type['Union']: {
            var t = f.type(new Schema_1.Union());
            return new type_1.Union(t.mode(), t.typeIdsArray() || [], children || []);
        }
        case Schema_1.Type['FixedSizeBinary']: {
            var t = f.type(new Schema_1.FixedSizeBinary());
            return new type_1.FixedSizeBinary(t.byteWidth());
        }
        case Schema_1.Type['FixedSizeList']: {
            var t = f.type(new Schema_1.FixedSizeList());
            return new type_1.FixedSizeList(t.listSize(), (children || [])[0]);
        }
        case Schema_1.Type['Map']: {
            var t = f.type(new Schema_1.Map());
            return new type_1.Map_((children || [])[0], t.keysSorted());
        }
    }
    throw new Error("Unrecognized type: \"" + Schema_1.Type[typeId] + "\" (" + typeId + ")");
}
/** @ignore */
function encodeSchema(b, schema) {
    var fieldOffsets = schema.fields.map(function (f) { return schema_1.Field.encode(b, f); });
    Schema_1.Schema.startFieldsVector(b, fieldOffsets.length);
    var fieldsVectorOffset = Schema_1.Schema.createFieldsVector(b, fieldOffsets);
    var metadataOffset = !(schema.metadata && schema.metadata.size > 0) ? -1 :
        Schema_1.Schema.createCustomMetadataVector(b, tslib_1.__spread(schema.metadata).map(function (_a) {
            var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
            var key = b.createString("" + k);
            var val = b.createString("" + v);
            Schema_1.KeyValue.startKeyValue(b);
            Schema_1.KeyValue.addKey(b, key);
            Schema_1.KeyValue.addValue(b, val);
            return Schema_1.KeyValue.endKeyValue(b);
        }));
    Schema_1.Schema.startSchema(b);
    Schema_1.Schema.addFields(b, fieldsVectorOffset);
    Schema_1.Schema.addEndianness(b, platformIsLittleEndian ? Schema_1.Endianness.Little : Schema_1.Endianness.Big);
    if (metadataOffset !== -1) {
        Schema_1.Schema.addCustomMetadata(b, metadataOffset);
    }
    return Schema_1.Schema.endSchema(b);
}
/** @ignore */
function encodeField(b, field) {
    var nameOffset = -1;
    var typeOffset = -1;
    var dictionaryOffset = -1;
    var type = field.type;
    var typeId = field.typeId;
    if (!type_1.DataType.isDictionary(type)) {
        typeOffset = typeassembler_1.instance.visit(type, b);
    }
    else {
        typeId = type.dictionary.typeId;
        dictionaryOffset = typeassembler_1.instance.visit(type, b);
        typeOffset = typeassembler_1.instance.visit(type.dictionary, b);
    }
    var childOffsets = (type.children || []).map(function (f) { return schema_1.Field.encode(b, f); });
    var childrenVectorOffset = Schema_1.Field.createChildrenVector(b, childOffsets);
    var metadataOffset = !(field.metadata && field.metadata.size > 0) ? -1 :
        Schema_1.Field.createCustomMetadataVector(b, tslib_1.__spread(field.metadata).map(function (_a) {
            var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
            var key = b.createString("" + k);
            var val = b.createString("" + v);
            Schema_1.KeyValue.startKeyValue(b);
            Schema_1.KeyValue.addKey(b, key);
            Schema_1.KeyValue.addValue(b, val);
            return Schema_1.KeyValue.endKeyValue(b);
        }));
    if (field.name) {
        nameOffset = b.createString(field.name);
    }
    Schema_1.Field.startField(b);
    Schema_1.Field.addType(b, typeOffset);
    Schema_1.Field.addTypeType(b, typeId);
    Schema_1.Field.addChildren(b, childrenVectorOffset);
    Schema_1.Field.addNullable(b, !!field.nullable);
    if (nameOffset !== -1) {
        Schema_1.Field.addName(b, nameOffset);
    }
    if (dictionaryOffset !== -1) {
        Schema_1.Field.addDictionary(b, dictionaryOffset);
    }
    if (metadataOffset !== -1) {
        Schema_1.Field.addCustomMetadata(b, metadataOffset);
    }
    return Schema_1.Field.endField(b);
}
/** @ignore */
function encodeRecordBatch(b, recordBatch) {
    var nodes = recordBatch.nodes || [];
    var buffers = recordBatch.buffers || [];
    Message_1.RecordBatch.startNodesVector(b, nodes.length);
    nodes.slice().reverse().forEach(function (n) { return FieldNode.encode(b, n); });
    var nodesVectorOffset = b.endVector();
    Message_1.RecordBatch.startBuffersVector(b, buffers.length);
    buffers.slice().reverse().forEach(function (b_) { return BufferRegion.encode(b, b_); });
    var buffersVectorOffset = b.endVector();
    Message_1.RecordBatch.startRecordBatch(b);
    Message_1.RecordBatch.addLength(b, new Long(recordBatch.length, 0));
    Message_1.RecordBatch.addNodes(b, nodesVectorOffset);
    Message_1.RecordBatch.addBuffers(b, buffersVectorOffset);
    return Message_1.RecordBatch.endRecordBatch(b);
}
/** @ignore */
function encodeDictionaryBatch(b, dictionaryBatch) {
    var dataOffset = RecordBatch.encode(b, dictionaryBatch.data);
    Message_1.DictionaryBatch.startDictionaryBatch(b);
    Message_1.DictionaryBatch.addId(b, new Long(dictionaryBatch.id, 0));
    Message_1.DictionaryBatch.addIsDelta(b, dictionaryBatch.isDelta);
    Message_1.DictionaryBatch.addData(b, dataOffset);
    return Message_1.DictionaryBatch.endDictionaryBatch(b);
}
/** @ignore */
function encodeFieldNode(b, node) {
    return Message_1.FieldNode.createFieldNode(b, new Long(node.length, 0), new Long(node.nullCount, 0));
}
/** @ignore */
function encodeBufferRegion(b, node) {
    return Schema_1.Buffer.createBuffer(b, new Long(node.offset, 0), new Long(node.length, 0));
}
/** @ignore */
var platformIsLittleEndian = (function () {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
    // Int16Array uses the platform's endianness.
    return new Int16Array(buffer)[0] === 256;
})();

//# sourceMappingURL=message.js.map
