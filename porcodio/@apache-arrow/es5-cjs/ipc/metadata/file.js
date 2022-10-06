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
exports.FileBlock = exports.Footer = void 0;
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/naming-convention */
var File_1 = require("../../fb/File");
var flatbuffers_1 = require("flatbuffers");
var Long = flatbuffers_1.flatbuffers.Long;
var Builder = flatbuffers_1.flatbuffers.Builder;
var ByteBuffer = flatbuffers_1.flatbuffers.ByteBuffer;
var schema_1 = require("../../schema");
var enum_1 = require("../../enum");
var buffer_1 = require("../../util/buffer");
/** @ignore */
var Footer_ = /** @class */ (function () {
    function Footer_(schema, version, recordBatches, dictionaryBatches) {
        if (version === void 0) { version = enum_1.MetadataVersion.V4; }
        this.schema = schema;
        this.version = version;
        recordBatches && (this._recordBatches = recordBatches);
        dictionaryBatches && (this._dictionaryBatches = dictionaryBatches);
    }
    /** @nocollapse */
    Footer_.decode = function (buf) {
        buf = new ByteBuffer(buffer_1.toUint8Array(buf));
        var footer = File_1.Footer.getRootAsFooter(buf);
        var schema = schema_1.Schema.decode(footer.schema());
        return new OffHeapFooter(schema, footer);
    };
    /** @nocollapse */
    Footer_.encode = function (footer) {
        var b = new Builder();
        var schemaOffset = schema_1.Schema.encode(b, footer.schema);
        File_1.Footer.startRecordBatchesVector(b, footer.numRecordBatches);
        tslib_1.__spread(footer.recordBatches()).slice().reverse().forEach(function (rb) { return FileBlock.encode(b, rb); });
        var recordBatchesOffset = b.endVector();
        File_1.Footer.startDictionariesVector(b, footer.numDictionaries);
        tslib_1.__spread(footer.dictionaryBatches()).slice().reverse().forEach(function (db) { return FileBlock.encode(b, db); });
        var dictionaryBatchesOffset = b.endVector();
        File_1.Footer.startFooter(b);
        File_1.Footer.addSchema(b, schemaOffset);
        File_1.Footer.addVersion(b, enum_1.MetadataVersion.V4);
        File_1.Footer.addRecordBatches(b, recordBatchesOffset);
        File_1.Footer.addDictionaries(b, dictionaryBatchesOffset);
        File_1.Footer.finishFooterBuffer(b, File_1.Footer.endFooter(b));
        return b.asUint8Array();
    };
    Object.defineProperty(Footer_.prototype, "numRecordBatches", {
        get: function () { return this._recordBatches.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Footer_.prototype, "numDictionaries", {
        get: function () { return this._dictionaryBatches.length; },
        enumerable: false,
        configurable: true
    });
    Footer_.prototype.recordBatches = function () {
        var block, i, n;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    block = void 0, i = -1, n = this.numRecordBatches;
                    _a.label = 1;
                case 1:
                    if (!(++i < n)) return [3 /*break*/, 4];
                    if (!(block = this.getRecordBatch(i))) return [3 /*break*/, 3];
                    return [4 /*yield*/, block];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    Footer_.prototype.dictionaryBatches = function () {
        var block, i, n;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    block = void 0, i = -1, n = this.numDictionaries;
                    _a.label = 1;
                case 1:
                    if (!(++i < n)) return [3 /*break*/, 4];
                    if (!(block = this.getDictionaryBatch(i))) return [3 /*break*/, 3];
                    return [4 /*yield*/, block];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    Footer_.prototype.getRecordBatch = function (index) {
        return index >= 0
            && index < this.numRecordBatches
            && this._recordBatches[index] || null;
    };
    Footer_.prototype.getDictionaryBatch = function (index) {
        return index >= 0
            && index < this.numDictionaries
            && this._dictionaryBatches[index] || null;
    };
    return Footer_;
}());
exports.Footer = Footer_;
/** @ignore */
var OffHeapFooter = /** @class */ (function (_super) {
    tslib_1.__extends(OffHeapFooter, _super);
    function OffHeapFooter(schema, _footer) {
        var _this = _super.call(this, schema, _footer.version()) || this;
        _this._footer = _footer;
        return _this;
    }
    Object.defineProperty(OffHeapFooter.prototype, "numRecordBatches", {
        get: function () { return this._footer.recordBatchesLength(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OffHeapFooter.prototype, "numDictionaries", {
        get: function () { return this._footer.dictionariesLength(); },
        enumerable: false,
        configurable: true
    });
    OffHeapFooter.prototype.getRecordBatch = function (index) {
        if (index >= 0 && index < this.numRecordBatches) {
            var fileBlock = this._footer.recordBatches(index);
            if (fileBlock) {
                return FileBlock.decode(fileBlock);
            }
        }
        return null;
    };
    OffHeapFooter.prototype.getDictionaryBatch = function (index) {
        if (index >= 0 && index < this.numDictionaries) {
            var fileBlock = this._footer.dictionaries(index);
            if (fileBlock) {
                return FileBlock.decode(fileBlock);
            }
        }
        return null;
    };
    return OffHeapFooter;
}(Footer_));
/** @ignore */
var FileBlock = /** @class */ (function () {
    function FileBlock(metaDataLength, bodyLength, offset) {
        this.metaDataLength = metaDataLength;
        this.offset = typeof offset === 'number' ? offset : offset.low;
        this.bodyLength = typeof bodyLength === 'number' ? bodyLength : bodyLength.low;
    }
    /** @nocollapse */
    FileBlock.decode = function (block) {
        return new FileBlock(block.metaDataLength(), block.bodyLength(), block.offset());
    };
    /** @nocollapse */
    FileBlock.encode = function (b, fileBlock) {
        var metaDataLength = fileBlock.metaDataLength;
        var offset = new Long(fileBlock.offset, 0);
        var bodyLength = new Long(fileBlock.bodyLength, 0);
        return File_1.Block.createBlock(b, offset, metaDataLength, bodyLength);
    };
    return FileBlock;
}());
exports.FileBlock = FileBlock;

//# sourceMappingURL=file.js.map
