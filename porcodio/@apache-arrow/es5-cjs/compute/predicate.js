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
exports.custom = exports.or = exports.and = exports.col = exports.lit = exports.CustomPredicate = exports.Not = exports.GTeq = exports.LTeq = exports.Equals = exports.Or = exports.And = exports.CombinationPredicate = exports.ComparisonPredicate = exports.Predicate = exports.Col = exports.Literal = exports.Value = void 0;
var tslib_1 = require("tslib");
var dictionary_1 = require("../vector/dictionary");
/** @ignore */
var Value = /** @class */ (function () {
    function Value() {
    }
    Value.prototype.eq = function (other) {
        if (!(other instanceof Value)) {
            other = new Literal(other);
        }
        return new Equals(this, other);
    };
    Value.prototype.le = function (other) {
        if (!(other instanceof Value)) {
            other = new Literal(other);
        }
        return new LTeq(this, other);
    };
    Value.prototype.ge = function (other) {
        if (!(other instanceof Value)) {
            other = new Literal(other);
        }
        return new GTeq(this, other);
    };
    Value.prototype.lt = function (other) {
        return new Not(this.ge(other));
    };
    Value.prototype.gt = function (other) {
        return new Not(this.le(other));
    };
    Value.prototype.ne = function (other) {
        return new Not(this.eq(other));
    };
    return Value;
}());
exports.Value = Value;
/** @ignore */
var Literal = /** @class */ (function (_super) {
    tslib_1.__extends(Literal, _super);
    function Literal(v) {
        var _this = _super.call(this) || this;
        _this.v = v;
        return _this;
    }
    return Literal;
}(Value));
exports.Literal = Literal;
/** @ignore */
var Col = /** @class */ (function (_super) {
    tslib_1.__extends(Col, _super);
    function Col(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        return _this;
    }
    Col.prototype.bind = function (batch) {
        if (!this.colidx) {
            // Assume column index doesn't change between calls to bind
            //this.colidx = cols.findIndex(v => v.name.indexOf(this.name) != -1);
            this.colidx = -1;
            var fields = batch.schema.fields;
            for (var idx = -1; ++idx < fields.length;) {
                if (fields[idx].name === this.name) {
                    this.colidx = idx;
                    break;
                }
            }
            if (this.colidx < 0) {
                throw new Error("Failed to bind Col \"" + this.name + "\"");
            }
        }
        var vec = this.vector = batch.getChildAt(this.colidx);
        return function (idx) { return vec.get(idx); };
    };
    return Col;
}(Value));
exports.Col = Col;
/** @ignore */
var Predicate = /** @class */ (function () {
    function Predicate() {
    }
    Predicate.prototype.and = function () {
        var expr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expr[_i] = arguments[_i];
        }
        return new (And.bind.apply(And, tslib_1.__spread([void 0, this], expr)))();
    };
    Predicate.prototype.or = function () {
        var expr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expr[_i] = arguments[_i];
        }
        return new (Or.bind.apply(Or, tslib_1.__spread([void 0, this], expr)))();
    };
    Predicate.prototype.not = function () { return new Not(this); };
    return Predicate;
}());
exports.Predicate = Predicate;
/** @ignore */
var ComparisonPredicate = /** @class */ (function (_super) {
    tslib_1.__extends(ComparisonPredicate, _super);
    function ComparisonPredicate(left, right) {
        var _this = _super.call(this) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    ComparisonPredicate.prototype.bind = function (batch) {
        if (this.left instanceof Literal) {
            if (this.right instanceof Literal) {
                return this._bindLitLit(batch, this.left, this.right);
            }
            else { // right is a Col
                return this._bindLitCol(batch, this.left, this.right);
            }
        }
        else { // left is a Col
            if (this.right instanceof Literal) {
                return this._bindColLit(batch, this.left, this.right);
            }
            else { // right is a Col
                return this._bindColCol(batch, this.left, this.right);
            }
        }
    };
    return ComparisonPredicate;
}(Predicate));
exports.ComparisonPredicate = ComparisonPredicate;
/** @ignore */
var CombinationPredicate = /** @class */ (function (_super) {
    tslib_1.__extends(CombinationPredicate, _super);
    function CombinationPredicate() {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
    }
    return CombinationPredicate;
}(Predicate));
exports.CombinationPredicate = CombinationPredicate;
// add children to prototype so it doesn't get mangled in es2015/umd
CombinationPredicate.prototype.children = Object.freeze([]); // freeze for safety
/** @ignore */
var And = /** @class */ (function (_super) {
    tslib_1.__extends(And, _super);
    function And() {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        var _this = this;
        // Flatten any Ands
        children = children.reduce(function (accum, p) {
            return accum.concat(p instanceof And ? p.children : p);
        }, []);
        _this = _super.apply(this, tslib_1.__spread(children)) || this;
        return _this;
    }
    And.prototype.bind = function (batch) {
        var bound = this.children.map(function (p) { return p.bind(batch); });
        return function (idx, batch) { return bound.every(function (p) { return p(idx, batch); }); };
    };
    return And;
}(CombinationPredicate));
exports.And = And;
/** @ignore */
var Or = /** @class */ (function (_super) {
    tslib_1.__extends(Or, _super);
    function Or() {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        var _this = this;
        // Flatten any Ors
        children = children.reduce(function (accum, p) {
            return accum.concat(p instanceof Or ? p.children : p);
        }, []);
        _this = _super.apply(this, tslib_1.__spread(children)) || this;
        return _this;
    }
    Or.prototype.bind = function (batch) {
        var bound = this.children.map(function (p) { return p.bind(batch); });
        return function (idx, batch) { return bound.some(function (p) { return p(idx, batch); }); };
    };
    return Or;
}(CombinationPredicate));
exports.Or = Or;
/** @ignore */
var Equals = /** @class */ (function (_super) {
    tslib_1.__extends(Equals, _super);
    function Equals() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Equals.prototype._bindLitLit = function (_batch, left, right) {
        var rtrn = left.v == right.v;
        return function () { return rtrn; };
    };
    Equals.prototype._bindColCol = function (batch, left, right) {
        var left_func = left.bind(batch);
        var right_func = right.bind(batch);
        return function (idx, batch) { return left_func(idx, batch) == right_func(idx, batch); };
    };
    Equals.prototype._bindColLit = function (batch, col, lit) {
        var col_func = col.bind(batch);
        if (col.vector instanceof dictionary_1.DictionaryVector) {
            var key_1;
            var vector_1 = col.vector;
            if (vector_1.dictionary !== this.lastDictionary) {
                key_1 = vector_1.reverseLookup(lit.v);
                this.lastDictionary = vector_1.dictionary;
                this.lastKey = key_1;
            }
            else {
                key_1 = this.lastKey;
            }
            if (key_1 === -1) {
                // the value doesn't exist in the dictionary - always return
                // false
                // TODO: special-case of PredicateFunc that encapsulates this
                // "always false" behavior. That way filtering operations don't
                // have to bother checking
                return function () { return false; };
            }
            else {
                return function (idx) {
                    return vector_1.getKey(idx) === key_1;
                };
            }
        }
        else {
            return function (idx, cols) { return col_func(idx, cols) == lit.v; };
        }
    };
    Equals.prototype._bindLitCol = function (batch, lit, col) {
        // Equals is commutative
        return this._bindColLit(batch, col, lit);
    };
    return Equals;
}(ComparisonPredicate));
exports.Equals = Equals;
/** @ignore */
var LTeq = /** @class */ (function (_super) {
    tslib_1.__extends(LTeq, _super);
    function LTeq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LTeq.prototype._bindLitLit = function (_batch, left, right) {
        var rtrn = left.v <= right.v;
        return function () { return rtrn; };
    };
    LTeq.prototype._bindColCol = function (batch, left, right) {
        var left_func = left.bind(batch);
        var right_func = right.bind(batch);
        return function (idx, cols) { return left_func(idx, cols) <= right_func(idx, cols); };
    };
    LTeq.prototype._bindColLit = function (batch, col, lit) {
        var col_func = col.bind(batch);
        return function (idx, cols) { return col_func(idx, cols) <= lit.v; };
    };
    LTeq.prototype._bindLitCol = function (batch, lit, col) {
        var col_func = col.bind(batch);
        return function (idx, cols) { return lit.v <= col_func(idx, cols); };
    };
    return LTeq;
}(ComparisonPredicate));
exports.LTeq = LTeq;
/** @ignore */
var GTeq = /** @class */ (function (_super) {
    tslib_1.__extends(GTeq, _super);
    function GTeq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GTeq.prototype._bindLitLit = function (_batch, left, right) {
        var rtrn = left.v >= right.v;
        return function () { return rtrn; };
    };
    GTeq.prototype._bindColCol = function (batch, left, right) {
        var left_func = left.bind(batch);
        var right_func = right.bind(batch);
        return function (idx, cols) { return left_func(idx, cols) >= right_func(idx, cols); };
    };
    GTeq.prototype._bindColLit = function (batch, col, lit) {
        var col_func = col.bind(batch);
        return function (idx, cols) { return col_func(idx, cols) >= lit.v; };
    };
    GTeq.prototype._bindLitCol = function (batch, lit, col) {
        var col_func = col.bind(batch);
        return function (idx, cols) { return lit.v >= col_func(idx, cols); };
    };
    return GTeq;
}(ComparisonPredicate));
exports.GTeq = GTeq;
/** @ignore */
var Not = /** @class */ (function (_super) {
    tslib_1.__extends(Not, _super);
    function Not(child) {
        var _this = _super.call(this) || this;
        _this.child = child;
        return _this;
    }
    Not.prototype.bind = function (batch) {
        var func = this.child.bind(batch);
        return function (idx, batch) { return !func(idx, batch); };
    };
    return Not;
}(Predicate));
exports.Not = Not;
/** @ignore */
var CustomPredicate = /** @class */ (function (_super) {
    tslib_1.__extends(CustomPredicate, _super);
    function CustomPredicate(next, bind_) {
        var _this = _super.call(this) || this;
        _this.next = next;
        _this.bind_ = bind_;
        return _this;
    }
    CustomPredicate.prototype.bind = function (batch) {
        this.bind_(batch);
        return this.next;
    };
    return CustomPredicate;
}(Predicate));
exports.CustomPredicate = CustomPredicate;
function lit(v) { return new Literal(v); }
exports.lit = lit;
function col(n) { return new Col(n); }
exports.col = col;
function and() {
    var p = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        p[_i] = arguments[_i];
    }
    return new (And.bind.apply(And, tslib_1.__spread([void 0], p)))();
}
exports.and = and;
function or() {
    var p = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        p[_i] = arguments[_i];
    }
    return new (Or.bind.apply(Or, tslib_1.__spread([void 0], p)))();
}
exports.or = or;
function custom(next, bind) {
    return new CustomPredicate(next, bind);
}
exports.custom = custom;

//# sourceMappingURL=predicate.js.map
