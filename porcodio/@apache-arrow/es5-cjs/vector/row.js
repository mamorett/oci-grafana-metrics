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
exports.StructRow = exports.MapRow = void 0;
var tslib_1 = require("tslib");
var pretty_1 = require("../util/pretty");
/** @ignore */ var kParent = Symbol.for('parent');
/** @ignore */ var kRowIndex = Symbol.for('rowIndex');
/** @ignore */ var kKeyToIdx = Symbol.for('keyToIdx');
/** @ignore */ var kIdxToVal = Symbol.for('idxToVal');
/** @ignore */ var kCustomInspect = Symbol.for('nodejs.util.inspect.custom');
var Row = /** @class */ (function () {
    function Row(parent, numKeys) {
        this[kParent] = parent;
        this.size = numKeys;
    }
    Row.prototype.entries = function () { return this[Symbol.iterator](); };
    Row.prototype.has = function (key) { return this.get(key) !== undefined; };
    Row.prototype.get = function (key) {
        var val = undefined;
        if (key !== null && key !== undefined) {
            var ktoi = this[kKeyToIdx] || (this[kKeyToIdx] = new Map());
            var idx = ktoi.get(key);
            if (idx !== undefined) {
                var itov = this[kIdxToVal] || (this[kIdxToVal] = new Array(this.size));
                ((val = itov[idx]) !== undefined) || (itov[idx] = val = this.getValue(idx));
            }
            else if ((idx = this.getIndex(key)) > -1) {
                ktoi.set(key, idx);
                var itov = this[kIdxToVal] || (this[kIdxToVal] = new Array(this.size));
                ((val = itov[idx]) !== undefined) || (itov[idx] = val = this.getValue(idx));
            }
        }
        return val;
    };
    Row.prototype.set = function (key, val) {
        if (key !== null && key !== undefined) {
            var ktoi = this[kKeyToIdx] || (this[kKeyToIdx] = new Map());
            var idx = ktoi.get(key);
            if (idx === undefined) {
                ktoi.set(key, idx = this.getIndex(key));
            }
            if (idx > -1) {
                var itov = this[kIdxToVal] || (this[kIdxToVal] = new Array(this.size));
                itov[idx] = this.setValue(idx, val);
            }
        }
        return this;
    };
    Row.prototype.clear = function () { throw new Error("Clearing " + this[Symbol.toStringTag] + " not supported."); };
    Row.prototype.delete = function (_) { throw new Error("Deleting " + this[Symbol.toStringTag] + " values not supported."); };
    Row.prototype[Symbol.iterator] = function () {
        var ki, vi, ktoi, itov, k, v, i, kr, vr;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ki = this.keys();
                    vi = this.values();
                    ktoi = this[kKeyToIdx] || (this[kKeyToIdx] = new Map());
                    itov = this[kIdxToVal] || (this[kIdxToVal] = new Array(this.size));
                    k = void 0, v = void 0, i = 0, kr = void 0, vr = void 0;
                    _a.label = 1;
                case 1:
                    if (!!((kr = ki.next()).done || (vr = vi.next()).done)) return [3 /*break*/, 4];
                    k = kr.value;
                    v = vr.value;
                    itov[i] = v;
                    ktoi.has(k) || ktoi.set(k, i);
                    return [4 /*yield*/, [k, v]];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    Row.prototype.forEach = function (callbackfn, thisArg) {
        var ki = this.keys();
        var vi = this.values();
        var callback = thisArg === undefined ? callbackfn :
            function (v, k, m) { return callbackfn.call(thisArg, v, k, m); };
        var ktoi = this[kKeyToIdx] || (this[kKeyToIdx] = new Map());
        var itov = this[kIdxToVal] || (this[kIdxToVal] = new Array(this.size));
        for (var k = void 0, v = void 0, i = 0, kr = void 0, vr = void 0; !((kr = ki.next()).done || (vr = vi.next()).done); ++i) {
            k = kr.value;
            v = vr.value;
            itov[i] = v;
            ktoi.has(k) || ktoi.set(k, i);
            callback(v, k, this);
        }
    };
    Row.prototype.toArray = function () { return tslib_1.__spread(this.values()); };
    Row.prototype.toJSON = function () {
        var obj = {};
        this.forEach(function (val, key) { return obj[key] = val; });
        return obj;
    };
    Row.prototype.inspect = function () { return this.toString(); };
    Row.prototype[kCustomInspect] = function () { return this.toString(); };
    Row.prototype.toString = function () {
        var str = [];
        this.forEach(function (val, key) {
            key = pretty_1.valueToString(key);
            val = pretty_1.valueToString(val);
            str.push(key + ": " + val);
        });
        return "{ " + str.join(', ') + " }";
    };
    Row[Symbol.toStringTag] = (function (proto) {
        var _a;
        Object.defineProperties(proto, (_a = {
                'size': { writable: true, enumerable: false, configurable: false, value: 0 }
            },
            _a[kParent] = { writable: true, enumerable: false, configurable: false, value: null },
            _a[kRowIndex] = { writable: true, enumerable: false, configurable: false, value: -1 },
            _a));
        return proto[Symbol.toStringTag] = 'Row';
    })(Row.prototype);
    return Row;
}());
var MapRow = /** @class */ (function (_super) {
    tslib_1.__extends(MapRow, _super);
    function MapRow(slice) {
        var _this = _super.call(this, slice, slice.length) || this;
        return createRowProxy(_this);
    }
    MapRow.prototype.keys = function () {
        return this[kParent].getChildAt(0)[Symbol.iterator]();
    };
    MapRow.prototype.values = function () {
        return this[kParent].getChildAt(1)[Symbol.iterator]();
    };
    MapRow.prototype.getKey = function (idx) {
        return this[kParent].getChildAt(0).get(idx);
    };
    MapRow.prototype.getIndex = function (key) {
        return this[kParent].getChildAt(0).indexOf(key);
    };
    MapRow.prototype.getValue = function (index) {
        return this[kParent].getChildAt(1).get(index);
    };
    MapRow.prototype.setValue = function (index, value) {
        this[kParent].getChildAt(1).set(index, value);
    };
    return MapRow;
}(Row));
exports.MapRow = MapRow;
var StructRow = /** @class */ (function (_super) {
    tslib_1.__extends(StructRow, _super);
    function StructRow(parent) {
        var _this = _super.call(this, parent, parent.type.children.length) || this;
        return defineRowProxyProperties(_this);
    }
    StructRow.prototype.keys = function () {
        var _a, _b, field, e_1_1;
        var e_1, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = tslib_1.__values(this[kParent].type.children), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    field = _b.value;
                    return [4 /*yield*/, field.name];
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
    };
    StructRow.prototype.values = function () {
        var _a, _b, field, e_2_1;
        var e_2, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = tslib_1.__values(this[kParent].type.children), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    field = _b.value;
                    return [4 /*yield*/, this[field.name]];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_2_1 = _d.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    StructRow.prototype.getKey = function (idx) {
        return this[kParent].type.children[idx].name;
    };
    StructRow.prototype.getIndex = function (key) {
        return this[kParent].type.children.findIndex(function (f) { return f.name === key; });
    };
    StructRow.prototype.getValue = function (index) {
        return this[kParent].getChildAt(index).get(this[kRowIndex]);
    };
    StructRow.prototype.setValue = function (index, value) {
        return this[kParent].getChildAt(index).set(this[kRowIndex], value);
    };
    return StructRow;
}(Row));
exports.StructRow = StructRow;
Object.setPrototypeOf(Row.prototype, Map.prototype);
/** @ignore */
var defineRowProxyProperties = (function () {
    var desc = { enumerable: true, configurable: false, get: null, set: null };
    return function (row) {
        var e_3, _a;
        var idx = -1;
        var ktoi = row[kKeyToIdx] || (row[kKeyToIdx] = new Map());
        var getter = function (key) { return function () { return this.get(key); }; };
        var setter = function (key) { return function (val) { return this.set(key, val); }; };
        try {
            for (var _b = tslib_1.__values(row.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                ktoi.set(key, ++idx);
                desc.get = getter(key);
                desc.set = setter(key);
                Object.prototype.hasOwnProperty.call(row, key) || (desc.enumerable = true, Object.defineProperty(row, key, desc));
                Object.prototype.hasOwnProperty.call(row, idx) || (desc.enumerable = false, Object.defineProperty(row, idx, desc));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        desc.get = desc.set = null;
        return row;
    };
})();
/** @ignore */
var createRowProxy = (function () {
    if (typeof Proxy === 'undefined') {
        return defineRowProxyProperties;
    }
    var has = Row.prototype.has;
    var get = Row.prototype.get;
    var set = Row.prototype.set;
    var getKey = Row.prototype.getKey;
    var RowProxyHandler = {
        isExtensible: function () { return false; },
        deleteProperty: function () { return false; },
        preventExtensions: function () { return true; },
        ownKeys: function (row) { return tslib_1.__spread(row.keys()).map(function (x) { return "" + x; }); },
        has: function (row, key) {
            switch (key) {
                case 'getKey':
                case 'getIndex':
                case 'getValue':
                case 'setValue':
                case 'toArray':
                case 'toJSON':
                case 'inspect':
                case 'constructor':
                case 'isPrototypeOf':
                case 'propertyIsEnumerable':
                case 'toString':
                case 'toLocaleString':
                case 'valueOf':
                case 'size':
                case 'has':
                case 'get':
                case 'set':
                case 'clear':
                case 'delete':
                case 'keys':
                case 'values':
                case 'entries':
                case 'forEach':
                case '__proto__':
                case '__defineGetter__':
                case '__defineSetter__':
                case 'hasOwnProperty':
                case '__lookupGetter__':
                case '__lookupSetter__':
                case Symbol.iterator:
                case Symbol.toStringTag:
                case kParent:
                case kRowIndex:
                case kIdxToVal:
                case kKeyToIdx:
                case kCustomInspect:
                    return true;
            }
            if (typeof key === 'number' && !row.has(key)) {
                key = row.getKey(key);
            }
            return row.has(key);
        },
        get: function (row, key, receiver) {
            switch (key) {
                case 'getKey':
                case 'getIndex':
                case 'getValue':
                case 'setValue':
                case 'toArray':
                case 'toJSON':
                case 'inspect':
                case 'constructor':
                case 'isPrototypeOf':
                case 'propertyIsEnumerable':
                case 'toString':
                case 'toLocaleString':
                case 'valueOf':
                case 'size':
                case 'has':
                case 'get':
                case 'set':
                case 'clear':
                case 'delete':
                case 'keys':
                case 'values':
                case 'entries':
                case 'forEach':
                case '__proto__':
                case '__defineGetter__':
                case '__defineSetter__':
                case 'hasOwnProperty':
                case '__lookupGetter__':
                case '__lookupSetter__':
                case Symbol.iterator:
                case Symbol.toStringTag:
                case kParent:
                case kRowIndex:
                case kIdxToVal:
                case kKeyToIdx:
                case kCustomInspect:
                    return Reflect.get(row, key, receiver);
            }
            if (typeof key === 'number' && !has.call(receiver, key)) {
                key = getKey.call(receiver, key);
            }
            return get.call(receiver, key);
        },
        set: function (row, key, val, receiver) {
            switch (key) {
                case kParent:
                case kRowIndex:
                case kIdxToVal:
                case kKeyToIdx:
                    return Reflect.set(row, key, val, receiver);
                case 'getKey':
                case 'getIndex':
                case 'getValue':
                case 'setValue':
                case 'toArray':
                case 'toJSON':
                case 'inspect':
                case 'constructor':
                case 'isPrototypeOf':
                case 'propertyIsEnumerable':
                case 'toString':
                case 'toLocaleString':
                case 'valueOf':
                case 'size':
                case 'has':
                case 'get':
                case 'set':
                case 'clear':
                case 'delete':
                case 'keys':
                case 'values':
                case 'entries':
                case 'forEach':
                case '__proto__':
                case '__defineGetter__':
                case '__defineSetter__':
                case 'hasOwnProperty':
                case '__lookupGetter__':
                case '__lookupSetter__':
                case Symbol.iterator:
                case Symbol.toStringTag:
                    return false;
            }
            if (typeof key === 'number' && !has.call(receiver, key)) {
                key = getKey.call(receiver, key);
            }
            return has.call(receiver, key) ? !!set.call(receiver, key, val) : false;
        },
    };
    return function (row) { return new Proxy(row, RowProxyHandler); };
})();

//# sourceMappingURL=row.js.map
