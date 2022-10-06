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
exports.JSONVectorAssembler = void 0;
var tslib_1 = require("tslib");
var bn_1 = require("../util/bn");
var column_1 = require("../column");
var vector_1 = require("../vector");
var visitor_1 = require("../visitor");
var enum_1 = require("../enum");
var recordbatch_1 = require("../recordbatch");
var enum_2 = require("../enum");
var bit_1 = require("../util/bit");
var args_1 = require("../util/args");
var type_1 = require("../type");
/** @ignore */
var JSONVectorAssembler = /** @class */ (function (_super) {
    tslib_1.__extends(JSONVectorAssembler, _super);
    function JSONVectorAssembler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @nocollapse */
    JSONVectorAssembler.assemble = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new JSONVectorAssembler().visitMany(args_1.selectColumnChildrenArgs(recordbatch_1.RecordBatch, args));
    };
    JSONVectorAssembler.prototype.visit = function (column) {
        var _a;
        var data = column.data, name = column.name, length = column.length;
        var offset = data.offset, nullCount = data.nullCount, nullBitmap = data.nullBitmap;
        var type = type_1.DataType.isDictionary(column.type) ? column.type.indices : column.type;
        var buffers = Object.assign([], data.buffers, (_a = {}, _a[enum_1.BufferType.VALIDITY] = undefined, _a));
        return tslib_1.__assign({ 'name': name, 'count': length, 'VALIDITY': type_1.DataType.isNull(type) ? undefined
                : nullCount <= 0 ? Array.from({ length: length }, function () { return 1; })
                    : tslib_1.__spread(new bit_1.BitIterator(nullBitmap, offset, length, null, bit_1.getBit)) }, _super.prototype.visit.call(this, vector_1.Vector.new(data.clone(type, offset, length, 0, buffers))));
    };
    JSONVectorAssembler.prototype.visitNull = function () { return {}; };
    JSONVectorAssembler.prototype.visitBool = function (_a) {
        var values = _a.values, offset = _a.offset, length = _a.length;
        return { 'DATA': tslib_1.__spread(new bit_1.BitIterator(values, offset, length, null, bit_1.getBool)) };
    };
    JSONVectorAssembler.prototype.visitInt = function (vector) {
        return {
            'DATA': vector.type.bitWidth < 64
                ? tslib_1.__spread(vector.values) : tslib_1.__spread(bigNumsToStrings(vector.values, 2))
        };
    };
    JSONVectorAssembler.prototype.visitFloat = function (vector) {
        return { 'DATA': tslib_1.__spread(vector.values) };
    };
    JSONVectorAssembler.prototype.visitUtf8 = function (vector) {
        return { 'DATA': tslib_1.__spread(vector), 'OFFSET': tslib_1.__spread(vector.valueOffsets) };
    };
    JSONVectorAssembler.prototype.visitBinary = function (vector) {
        return { 'DATA': tslib_1.__spread(binaryToString(vector)), OFFSET: tslib_1.__spread(vector.valueOffsets) };
    };
    JSONVectorAssembler.prototype.visitFixedSizeBinary = function (vector) {
        return { 'DATA': tslib_1.__spread(binaryToString(vector)) };
    };
    JSONVectorAssembler.prototype.visitDate = function (vector) {
        return {
            'DATA': vector.type.unit === enum_2.DateUnit.DAY
                ? tslib_1.__spread(vector.values) : tslib_1.__spread(bigNumsToStrings(vector.values, 2))
        };
    };
    JSONVectorAssembler.prototype.visitTimestamp = function (vector) {
        return { 'DATA': tslib_1.__spread(bigNumsToStrings(vector.values, 2)) };
    };
    JSONVectorAssembler.prototype.visitTime = function (vector) {
        return {
            'DATA': vector.type.unit < enum_2.TimeUnit.MICROSECOND
                ? tslib_1.__spread(vector.values) : tslib_1.__spread(bigNumsToStrings(vector.values, 2))
        };
    };
    JSONVectorAssembler.prototype.visitDecimal = function (vector) {
        return { 'DATA': tslib_1.__spread(bigNumsToStrings(vector.values, 4)) };
    };
    JSONVectorAssembler.prototype.visitList = function (vector) {
        var _this = this;
        return {
            'OFFSET': tslib_1.__spread(vector.valueOffsets),
            'children': vector.type.children.map(function (f, i) {
                return _this.visit(new column_1.Column(f, [vector.getChildAt(i)]));
            })
        };
    };
    JSONVectorAssembler.prototype.visitStruct = function (vector) {
        var _this = this;
        return {
            'children': vector.type.children.map(function (f, i) {
                return _this.visit(new column_1.Column(f, [vector.getChildAt(i)]));
            })
        };
    };
    JSONVectorAssembler.prototype.visitUnion = function (vector) {
        var _this = this;
        return {
            'TYPE': tslib_1.__spread(vector.typeIds),
            'OFFSET': vector.type.mode === enum_2.UnionMode.Dense ? tslib_1.__spread(vector.valueOffsets) : undefined,
            'children': vector.type.children.map(function (f, i) { return _this.visit(new column_1.Column(f, [vector.getChildAt(i)])); })
        };
    };
    JSONVectorAssembler.prototype.visitInterval = function (vector) {
        return { 'DATA': tslib_1.__spread(vector.values) };
    };
    JSONVectorAssembler.prototype.visitFixedSizeList = function (vector) {
        var _this = this;
        return {
            'children': vector.type.children.map(function (f, i) {
                return _this.visit(new column_1.Column(f, [vector.getChildAt(i)]));
            })
        };
    };
    JSONVectorAssembler.prototype.visitMap = function (vector) {
        var _this = this;
        return {
            'OFFSET': tslib_1.__spread(vector.valueOffsets),
            'children': vector.type.children.map(function (f, i) {
                return _this.visit(new column_1.Column(f, [vector.getChildAt(i)]));
            })
        };
    };
    return JSONVectorAssembler;
}(visitor_1.Visitor));
exports.JSONVectorAssembler = JSONVectorAssembler;
/** @ignore */
function binaryToString(vector) {
    var _a, _b, octets, e_1_1;
    var e_1, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, 6, 7]);
                _a = tslib_1.__values(vector), _b = _a.next();
                _d.label = 1;
            case 1:
                if (!!_b.done) return [3 /*break*/, 4];
                octets = _b.value;
                return [4 /*yield*/, octets.reduce(function (str, byte) {
                        return "" + str + ('0' + (byte & 0xFF).toString(16)).slice(-2);
                    }, '').toUpperCase()];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _b = _a.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
/** @ignore */
function bigNumsToStrings(values, stride) {
    var i, n;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = -1, n = values.length / stride;
                _a.label = 1;
            case 1:
                if (!(++i < n)) return [3 /*break*/, 4];
                return [4 /*yield*/, "" + bn_1.BN.new(values.subarray((i + 0) * stride, (i + 1) * stride), false)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}

//# sourceMappingURL=jsonvectorassembler.js.map
