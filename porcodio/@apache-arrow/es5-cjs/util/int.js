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
exports.Int128 = exports.Int64 = exports.Uint64 = exports.BaseInt64 = void 0;
var tslib_1 = require("tslib");
/** @ignore */
var carryBit16 = 1 << 16;
/** @ignore */
function intAsHex(value) {
    if (value < 0) {
        value = 0xFFFFFFFF + value + 1;
    }
    return "0x" + value.toString(16);
}
/** @ignore */
var kInt32DecimalDigits = 8;
/** @ignore */
var kPowersOfTen = [1,
    10,
    100,
    1000,
    10000,
    100000,
    1000000,
    10000000,
    100000000];
/** @ignore */
var BaseInt64 = /** @class */ (function () {
    function BaseInt64(buffer) {
        this.buffer = buffer;
    }
    BaseInt64.prototype.high = function () { return this.buffer[1]; };
    BaseInt64.prototype.low = function () { return this.buffer[0]; };
    BaseInt64.prototype._times = function (other) {
        // Break the left and right numbers into 16 bit chunks
        // so that we can multiply them without overflow.
        var L = new Uint32Array([
            this.buffer[1] >>> 16,
            this.buffer[1] & 0xFFFF,
            this.buffer[0] >>> 16,
            this.buffer[0] & 0xFFFF
        ]);
        var R = new Uint32Array([
            other.buffer[1] >>> 16,
            other.buffer[1] & 0xFFFF,
            other.buffer[0] >>> 16,
            other.buffer[0] & 0xFFFF
        ]);
        var product = L[3] * R[3];
        this.buffer[0] = product & 0xFFFF;
        var sum = product >>> 16;
        product = L[2] * R[3];
        sum += product;
        product = (L[3] * R[2]) >>> 0;
        sum += product;
        this.buffer[0] += sum << 16;
        this.buffer[1] = (sum >>> 0 < product ? carryBit16 : 0);
        this.buffer[1] += sum >>> 16;
        this.buffer[1] += L[1] * R[3] + L[2] * R[2] + L[3] * R[1];
        this.buffer[1] += (L[0] * R[3] + L[1] * R[2] + L[2] * R[1] + L[3] * R[0]) << 16;
        return this;
    };
    BaseInt64.prototype._plus = function (other) {
        var sum = (this.buffer[0] + other.buffer[0]) >>> 0;
        this.buffer[1] += other.buffer[1];
        if (sum < (this.buffer[0] >>> 0)) {
            ++this.buffer[1];
        }
        this.buffer[0] = sum;
    };
    BaseInt64.prototype.lessThan = function (other) {
        return this.buffer[1] < other.buffer[1] ||
            (this.buffer[1] === other.buffer[1] && this.buffer[0] < other.buffer[0]);
    };
    BaseInt64.prototype.equals = function (other) {
        return this.buffer[1] === other.buffer[1] && this.buffer[0] == other.buffer[0];
    };
    BaseInt64.prototype.greaterThan = function (other) {
        return other.lessThan(this);
    };
    BaseInt64.prototype.hex = function () {
        return intAsHex(this.buffer[1]) + " " + intAsHex(this.buffer[0]);
    };
    return BaseInt64;
}());
exports.BaseInt64 = BaseInt64;
/** @ignore */
var Uint64 = /** @class */ (function (_super) {
    tslib_1.__extends(Uint64, _super);
    function Uint64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint64.prototype.times = function (other) {
        this._times(other);
        return this;
    };
    Uint64.prototype.plus = function (other) {
        this._plus(other);
        return this;
    };
    /** @nocollapse */
    Uint64.from = function (val, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(2); }
        return Uint64.fromString(typeof (val) === 'string' ? val : val.toString(), out_buffer);
    };
    /** @nocollapse */
    Uint64.fromNumber = function (num, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(2); }
        // Always parse numbers as strings - pulling out high and low bits
        // directly seems to lose precision sometimes
        // For example:
        //     > -4613034156400212000 >>> 0
        //     721782784
        // The correct lower 32-bits are 721782752
        return Uint64.fromString(num.toString(), out_buffer);
    };
    /** @nocollapse */
    Uint64.fromString = function (str, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(2); }
        var length = str.length;
        var out = new Uint64(out_buffer);
        for (var posn = 0; posn < length;) {
            var group = kInt32DecimalDigits < length - posn ?
                kInt32DecimalDigits : length - posn;
            var chunk = new Uint64(new Uint32Array([parseInt(str.substr(posn, group), 10), 0]));
            var multiple = new Uint64(new Uint32Array([kPowersOfTen[group], 0]));
            out.times(multiple);
            out.plus(chunk);
            posn += group;
        }
        return out;
    };
    /** @nocollapse */
    Uint64.convertArray = function (values) {
        var data = new Uint32Array(values.length * 2);
        for (var i = -1, n = values.length; ++i < n;) {
            Uint64.from(values[i], new Uint32Array(data.buffer, data.byteOffset + 2 * i * 4, 2));
        }
        return data;
    };
    /** @nocollapse */
    Uint64.multiply = function (left, right) {
        var rtrn = new Uint64(new Uint32Array(left.buffer));
        return rtrn.times(right);
    };
    /** @nocollapse */
    Uint64.add = function (left, right) {
        var rtrn = new Uint64(new Uint32Array(left.buffer));
        return rtrn.plus(right);
    };
    return Uint64;
}(BaseInt64));
exports.Uint64 = Uint64;
/** @ignore */
var Int64 = /** @class */ (function (_super) {
    tslib_1.__extends(Int64, _super);
    function Int64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Int64.prototype.negate = function () {
        this.buffer[0] = ~this.buffer[0] + 1;
        this.buffer[1] = ~this.buffer[1];
        if (this.buffer[0] == 0) {
            ++this.buffer[1];
        }
        return this;
    };
    Int64.prototype.times = function (other) {
        this._times(other);
        return this;
    };
    Int64.prototype.plus = function (other) {
        this._plus(other);
        return this;
    };
    Int64.prototype.lessThan = function (other) {
        // force high bytes to be signed
        var this_high = this.buffer[1] << 0;
        var other_high = other.buffer[1] << 0;
        return this_high < other_high ||
            (this_high === other_high && this.buffer[0] < other.buffer[0]);
    };
    /** @nocollapse */
    Int64.from = function (val, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(2); }
        return Int64.fromString(typeof (val) === 'string' ? val : val.toString(), out_buffer);
    };
    /** @nocollapse */
    Int64.fromNumber = function (num, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(2); }
        // Always parse numbers as strings - pulling out high and low bits
        // directly seems to lose precision sometimes
        // For example:
        //     > -4613034156400212000 >>> 0
        //     721782784
        // The correct lower 32-bits are 721782752
        return Int64.fromString(num.toString(), out_buffer);
    };
    /** @nocollapse */
    Int64.fromString = function (str, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(2); }
        // TODO: Assert that out_buffer is 0 and length = 2
        var negate = str.startsWith('-');
        var length = str.length;
        var out = new Int64(out_buffer);
        for (var posn = negate ? 1 : 0; posn < length;) {
            var group = kInt32DecimalDigits < length - posn ?
                kInt32DecimalDigits : length - posn;
            var chunk = new Int64(new Uint32Array([parseInt(str.substr(posn, group), 10), 0]));
            var multiple = new Int64(new Uint32Array([kPowersOfTen[group], 0]));
            out.times(multiple);
            out.plus(chunk);
            posn += group;
        }
        return negate ? out.negate() : out;
    };
    /** @nocollapse */
    Int64.convertArray = function (values) {
        var data = new Uint32Array(values.length * 2);
        for (var i = -1, n = values.length; ++i < n;) {
            Int64.from(values[i], new Uint32Array(data.buffer, data.byteOffset + 2 * i * 4, 2));
        }
        return data;
    };
    /** @nocollapse */
    Int64.multiply = function (left, right) {
        var rtrn = new Int64(new Uint32Array(left.buffer));
        return rtrn.times(right);
    };
    /** @nocollapse */
    Int64.add = function (left, right) {
        var rtrn = new Int64(new Uint32Array(left.buffer));
        return rtrn.plus(right);
    };
    return Int64;
}(BaseInt64));
exports.Int64 = Int64;
/** @ignore */
var Int128 = /** @class */ (function () {
    function Int128(buffer) {
        this.buffer = buffer;
        // buffer[3] MSB (high)
        // buffer[2]
        // buffer[1]
        // buffer[0] LSB (low)
    }
    Int128.prototype.high = function () {
        return new Int64(new Uint32Array(this.buffer.buffer, this.buffer.byteOffset + 8, 2));
    };
    Int128.prototype.low = function () {
        return new Int64(new Uint32Array(this.buffer.buffer, this.buffer.byteOffset, 2));
    };
    Int128.prototype.negate = function () {
        this.buffer[0] = ~this.buffer[0] + 1;
        this.buffer[1] = ~this.buffer[1];
        this.buffer[2] = ~this.buffer[2];
        this.buffer[3] = ~this.buffer[3];
        if (this.buffer[0] == 0) {
            ++this.buffer[1];
        }
        if (this.buffer[1] == 0) {
            ++this.buffer[2];
        }
        if (this.buffer[2] == 0) {
            ++this.buffer[3];
        }
        return this;
    };
    Int128.prototype.times = function (other) {
        // Break the left and right numbers into 32 bit chunks
        // so that we can multiply them without overflow.
        var L0 = new Uint64(new Uint32Array([this.buffer[3], 0]));
        var L1 = new Uint64(new Uint32Array([this.buffer[2], 0]));
        var L2 = new Uint64(new Uint32Array([this.buffer[1], 0]));
        var L3 = new Uint64(new Uint32Array([this.buffer[0], 0]));
        var R0 = new Uint64(new Uint32Array([other.buffer[3], 0]));
        var R1 = new Uint64(new Uint32Array([other.buffer[2], 0]));
        var R2 = new Uint64(new Uint32Array([other.buffer[1], 0]));
        var R3 = new Uint64(new Uint32Array([other.buffer[0], 0]));
        var product = Uint64.multiply(L3, R3);
        this.buffer[0] = product.low();
        var sum = new Uint64(new Uint32Array([product.high(), 0]));
        product = Uint64.multiply(L2, R3);
        sum.plus(product);
        product = Uint64.multiply(L3, R2);
        sum.plus(product);
        this.buffer[1] = sum.low();
        this.buffer[3] = (sum.lessThan(product) ? 1 : 0);
        this.buffer[2] = sum.high();
        var high = new Uint64(new Uint32Array(this.buffer.buffer, this.buffer.byteOffset + 8, 2));
        high.plus(Uint64.multiply(L1, R3))
            .plus(Uint64.multiply(L2, R2))
            .plus(Uint64.multiply(L3, R1));
        this.buffer[3] += Uint64.multiply(L0, R3)
            .plus(Uint64.multiply(L1, R2))
            .plus(Uint64.multiply(L2, R1))
            .plus(Uint64.multiply(L3, R0)).low();
        return this;
    };
    Int128.prototype.plus = function (other) {
        var sums = new Uint32Array(4);
        sums[3] = (this.buffer[3] + other.buffer[3]) >>> 0;
        sums[2] = (this.buffer[2] + other.buffer[2]) >>> 0;
        sums[1] = (this.buffer[1] + other.buffer[1]) >>> 0;
        sums[0] = (this.buffer[0] + other.buffer[0]) >>> 0;
        if (sums[0] < (this.buffer[0] >>> 0)) {
            ++sums[1];
        }
        if (sums[1] < (this.buffer[1] >>> 0)) {
            ++sums[2];
        }
        if (sums[2] < (this.buffer[2] >>> 0)) {
            ++sums[3];
        }
        this.buffer[3] = sums[3];
        this.buffer[2] = sums[2];
        this.buffer[1] = sums[1];
        this.buffer[0] = sums[0];
        return this;
    };
    Int128.prototype.hex = function () {
        return intAsHex(this.buffer[3]) + " " + intAsHex(this.buffer[2]) + " " + intAsHex(this.buffer[1]) + " " + intAsHex(this.buffer[0]);
    };
    /** @nocollapse */
    Int128.multiply = function (left, right) {
        var rtrn = new Int128(new Uint32Array(left.buffer));
        return rtrn.times(right);
    };
    /** @nocollapse */
    Int128.add = function (left, right) {
        var rtrn = new Int128(new Uint32Array(left.buffer));
        return rtrn.plus(right);
    };
    /** @nocollapse */
    Int128.from = function (val, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(4); }
        return Int128.fromString(typeof (val) === 'string' ? val : val.toString(), out_buffer);
    };
    /** @nocollapse */
    Int128.fromNumber = function (num, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(4); }
        // Always parse numbers as strings - pulling out high and low bits
        // directly seems to lose precision sometimes
        // For example:
        //     > -4613034156400212000 >>> 0
        //     721782784
        // The correct lower 32-bits are 721782752
        return Int128.fromString(num.toString(), out_buffer);
    };
    /** @nocollapse */
    Int128.fromString = function (str, out_buffer) {
        if (out_buffer === void 0) { out_buffer = new Uint32Array(4); }
        // TODO: Assert that out_buffer is 0 and length = 4
        var negate = str.startsWith('-');
        var length = str.length;
        var out = new Int128(out_buffer);
        for (var posn = negate ? 1 : 0; posn < length;) {
            var group = kInt32DecimalDigits < length - posn ?
                kInt32DecimalDigits : length - posn;
            var chunk = new Int128(new Uint32Array([parseInt(str.substr(posn, group), 10), 0, 0, 0]));
            var multiple = new Int128(new Uint32Array([kPowersOfTen[group], 0, 0, 0]));
            out.times(multiple);
            out.plus(chunk);
            posn += group;
        }
        return negate ? out.negate() : out;
    };
    /** @nocollapse */
    Int128.convertArray = function (values) {
        // TODO: Distinguish between string and number at compile-time
        var data = new Uint32Array(values.length * 4);
        for (var i = -1, n = values.length; ++i < n;) {
            Int128.from(values[i], new Uint32Array(data.buffer, data.byteOffset + 4 * 4 * i, 4));
        }
        return data;
    };
    return Int128;
}());
exports.Int128 = Int128;

//# sourceMappingURL=int.js.map
