"use strict";
/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.ByteWidthVisitor = void 0;
var tslib_1 = require("tslib");
var visitor_1 = require("../visitor");
var enum_1 = require("../enum");
/** @ignore */ var sum = function (x, y) { return x + y; };
/** @ignore */ var variableWidthColumnErrorMessage = function (type) { return "Cannot compute the byte width of variable-width column " + type; };
/** @ignore */
var ByteWidthVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(ByteWidthVisitor, _super);
    function ByteWidthVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ByteWidthVisitor.prototype.visitNull = function (____) { return 0; };
    ByteWidthVisitor.prototype.visitInt = function (type) { return type.bitWidth / 8; };
    ByteWidthVisitor.prototype.visitFloat = function (type) { return type.ArrayType.BYTES_PER_ELEMENT; };
    ByteWidthVisitor.prototype.visitBinary = function (type) { throw new Error(variableWidthColumnErrorMessage(type)); };
    ByteWidthVisitor.prototype.visitUtf8 = function (type) { throw new Error(variableWidthColumnErrorMessage(type)); };
    ByteWidthVisitor.prototype.visitBool = function (____) { return 1 / 8; };
    ByteWidthVisitor.prototype.visitDecimal = function (____) { return 16; };
    ByteWidthVisitor.prototype.visitDate = function (type) { return (type.unit + 1) * 4; };
    ByteWidthVisitor.prototype.visitTime = function (type) { return type.bitWidth / 8; };
    ByteWidthVisitor.prototype.visitTimestamp = function (type) { return type.unit === enum_1.TimeUnit.SECOND ? 4 : 8; };
    ByteWidthVisitor.prototype.visitInterval = function (type) { return (type.unit + 1) * 4; };
    ByteWidthVisitor.prototype.visitList = function (type) { throw new Error(variableWidthColumnErrorMessage(type)); };
    ByteWidthVisitor.prototype.visitStruct = function (type) { return this.visitFields(type.children).reduce(sum, 0); };
    ByteWidthVisitor.prototype.visitUnion = function (type) { return this.visitFields(type.children).reduce(sum, 0); };
    ByteWidthVisitor.prototype.visitFixedSizeBinary = function (type) { return type.byteWidth; };
    ByteWidthVisitor.prototype.visitFixedSizeList = function (type) { return type.listSize * this.visitFields(type.children).reduce(sum, 0); };
    ByteWidthVisitor.prototype.visitMap = function (type) { return this.visitFields(type.children).reduce(sum, 0); };
    ByteWidthVisitor.prototype.visitDictionary = function (type) { return this.visit(type.indices); };
    ByteWidthVisitor.prototype.visitFields = function (fields) {
        var _this = this;
        return (fields || []).map(function (field) { return _this.visit(field.type); });
    };
    ByteWidthVisitor.prototype.visitSchema = function (schema) { return this.visitFields(schema.fields).reduce(sum, 0); };
    return ByteWidthVisitor;
}(visitor_1.Visitor));
exports.ByteWidthVisitor = ByteWidthVisitor;
/** @ignore */
exports.instance = new ByteWidthVisitor();

//# sourceMappingURL=bytewidth.js.map
