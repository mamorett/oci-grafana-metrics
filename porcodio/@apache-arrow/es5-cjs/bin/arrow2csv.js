#! /usr/bin/env node
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
var tslib_1 = require("tslib");
var fs = require("fs");
var stream = require("stream");
var pretty_1 = require("../util/pretty");
var Arrow_node_1 = require("../Arrow.node");
/* eslint-disable @typescript-eslint/no-require-imports */
var padLeft = require('pad-left');
var bignumJSONParse = require('json-bignum').parse;
var argv = require("command-line-args")(cliOpts(), { partial: true });
var files = argv.help ? [] : tslib_1.__spread((argv.file || []), (argv._unknown || [])).filter(Boolean);
var state = tslib_1.__assign(tslib_1.__assign({}, argv), { closed: false, maxColWidths: [10] });
(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var sources, reader, hasReaders, sources_1, sources_1_1, source, _a, _b, transformToString, e_1_1, e_2_1;
    var e_2, _c;
    var e_1, _d;
    return tslib_1.__generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                sources = argv.help ? [] : tslib_1.__spread(files.map(function (file) { return function () { return fs.createReadStream(file); }; }), (process.stdin.isTTY ? [] : [function () { return process.stdin; }])).filter(Boolean);
                hasReaders = false;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 18, 19, 20]);
                sources_1 = tslib_1.__values(sources), sources_1_1 = sources_1.next();
                _e.label = 2;
            case 2:
                if (!!sources_1_1.done) return [3 /*break*/, 17];
                source = sources_1_1.value;
                if (state.closed) {
                    return [3 /*break*/, 17];
                }
                _e.label = 3;
            case 3:
                _e.trys.push([3, 9, 10, 15]);
                _a = (e_1 = void 0, tslib_1.__asyncValues(recordBatchReaders(source)));
                _e.label = 4;
            case 4: return [4 /*yield*/, _a.next()];
            case 5:
                if (!(_b = _e.sent(), !_b.done)) return [3 /*break*/, 8];
                reader = _b.value;
                hasReaders = true;
                transformToString = batchesToString(state, reader.schema);
                return [4 /*yield*/, pipeTo(reader.pipe(transformToString), process.stdout, { end: false }).catch(function () { return state.closed = true; })];
            case 6:
                _e.sent(); // Handle EPIPE errors
                _e.label = 7;
            case 7: return [3 /*break*/, 4];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 15];
            case 10:
                _e.trys.push([10, , 13, 14]);
                if (!(_b && !_b.done && (_d = _a.return))) return [3 /*break*/, 12];
                return [4 /*yield*/, _d.call(_a)];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15:
                if (state.closed) {
                    return [3 /*break*/, 17];
                }
                _e.label = 16;
            case 16:
                sources_1_1 = sources_1.next();
                return [3 /*break*/, 2];
            case 17: return [3 /*break*/, 20];
            case 18:
                e_2_1 = _e.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 20];
            case 19:
                try {
                    if (sources_1_1 && !sources_1_1.done && (_c = sources_1.return)) _c.call(sources_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7 /*endfinally*/];
            case 20: return [2 /*return*/, hasReaders ? 0 : print_usage()];
        }
    });
}); })()
    .then(function (x) { return +x || 0; }, function (err) {
    if (err) {
        console.error("" + (err && err.stack || err));
    }
    return process.exitCode || 1;
}).then(function (code) { return process.exit(code); });
function pipeTo(source, sink, opts) {
    return new Promise(function (resolve, reject) {
        source.on('end', onEnd).pipe(sink, opts).on('error', onErr);
        function onEnd() { done(undefined, resolve); }
        function onErr(err) { done(err, reject); }
        function done(e, cb) {
            source.removeListener('end', onEnd);
            sink.removeListener('error', onErr);
            cb(e);
        }
    });
}
function recordBatchReaders(createSourceStream) {
    return tslib_1.__asyncGenerator(this, arguments, function recordBatchReaders_1() {
        var json, stream, source, reader, readers, _a, _b, _c, e_3_1, e_4, _d, _e, _f, _g, _h, _j, e_5_1, e_6;
        var e_3, _k, e_5, _l;
        return tslib_1.__generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    json = new Arrow_node_1.AsyncByteQueue();
                    stream = new Arrow_node_1.AsyncByteQueue();
                    source = createSourceStream();
                    reader = null;
                    readers = null;
                    // tee the input source, just in case it's JSON
                    source.on('end', function () { return [stream, json].forEach(function (y) { return y.close(); }); })
                        .on('data', function (x) { return [stream, json].forEach(function (y) { return y.write(x); }); })
                        .on('error', function (e) { return [stream, json].forEach(function (y) { return y.abort(e); }); });
                    _m.label = 1;
                case 1:
                    _m.trys.push([1, 19, , 20]);
                    _m.label = 2;
                case 2:
                    _m.trys.push([2, 10, 11, 16]);
                    _a = tslib_1.__asyncValues(Arrow_node_1.RecordBatchReader.readAll(stream));
                    _m.label = 3;
                case 3: return [4 /*yield*/, tslib_1.__await(_a.next())];
                case 4:
                    if (!(_b = _m.sent(), !_b.done)) return [3 /*break*/, 9];
                    reader = _b.value;
                    _c = reader;
                    if (!_c) return [3 /*break*/, 7];
                    return [4 /*yield*/, tslib_1.__await(reader)];
                case 5: return [4 /*yield*/, _m.sent()];
                case 6:
                    _c = (_m.sent());
                    _m.label = 7;
                case 7:
                    _c;
                    _m.label = 8;
                case 8: return [3 /*break*/, 3];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_3_1 = _m.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _m.trys.push([11, , 14, 15]);
                    if (!(_b && !_b.done && (_k = _a.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, tslib_1.__await(_k.call(_a))];
                case 12:
                    _m.sent();
                    _m.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    if (!reader) return [3 /*break*/, 18];
                    return [4 /*yield*/, tslib_1.__await(void 0)];
                case 17: return [2 /*return*/, _m.sent()];
                case 18: return [3 /*break*/, 20];
                case 19:
                    e_4 = _m.sent();
                    readers = null;
                    return [3 /*break*/, 20];
                case 20:
                    if (!!readers) return [3 /*break*/, 40];
                    return [4 /*yield*/, tslib_1.__await(json.closed)];
                case 21:
                    _m.sent();
                    if (source instanceof fs.ReadStream) {
                        source.close();
                    }
                    _m.label = 22;
                case 22:
                    _m.trys.push([22, 39, , 40]);
                    _m.label = 23;
                case 23:
                    _m.trys.push([23, 32, 33, 38]);
                    _g = (_f = Arrow_node_1.RecordBatchReader).readAll;
                    _h = bignumJSONParse;
                    return [4 /*yield*/, tslib_1.__await(json.toString())];
                case 24:
                    _d = tslib_1.__asyncValues.apply(void 0, [_g.apply(_f, [_h.apply(void 0, [_m.sent()])])]);
                    _m.label = 25;
                case 25: return [4 /*yield*/, tslib_1.__await(_d.next())];
                case 26:
                    if (!(_e = _m.sent(), !_e.done)) return [3 /*break*/, 31];
                    reader = _e.value;
                    _j = reader;
                    if (!_j) return [3 /*break*/, 29];
                    return [4 /*yield*/, tslib_1.__await(reader)];
                case 27: return [4 /*yield*/, _m.sent()];
                case 28:
                    _j = (_m.sent());
                    _m.label = 29;
                case 29:
                    _j;
                    _m.label = 30;
                case 30: return [3 /*break*/, 25];
                case 31: return [3 /*break*/, 38];
                case 32:
                    e_5_1 = _m.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 38];
                case 33:
                    _m.trys.push([33, , 36, 37]);
                    if (!(_e && !_e.done && (_l = _d.return))) return [3 /*break*/, 35];
                    return [4 /*yield*/, tslib_1.__await(_l.call(_d))];
                case 34:
                    _m.sent();
                    _m.label = 35;
                case 35: return [3 /*break*/, 37];
                case 36:
                    if (e_5) throw e_5.error;
                    return [7 /*endfinally*/];
                case 37: return [7 /*endfinally*/];
                case 38: return [3 /*break*/, 40];
                case 39:
                    e_6 = _m.sent();
                    readers = null;
                    return [3 /*break*/, 40];
                case 40: return [2 /*return*/];
            }
        });
    });
}
function batchesToString(state, schema) {
    var rowId = 0;
    var batchId = -1;
    var maxColWidths = [10];
    var hr = state.hr, sep = state.sep;
    var header = tslib_1.__spread(['row_id'], schema.fields.map(function (f) { return "" + f; })).map(pretty_1.valueToString);
    state.maxColWidths = header.map(function (x, i) { return Math.max(maxColWidths[i] || 0, x.length); });
    return new stream.Transform({
        encoding: 'utf8',
        writableObjectMode: true,
        readableObjectMode: false,
        final: function (cb) {
            // if there were no batches, then print the Schema, and metadata
            if (batchId === -1) {
                hr && this.push(horizontalRule(state.maxColWidths, hr, sep) + "\n\n");
                this.push(formatRow(header, maxColWidths, sep) + "\n");
                if (state.metadata && schema.metadata.size > 0) {
                    this.push("metadata:\n" + formatMetadata(schema.metadata) + "\n");
                }
            }
            hr && this.push(horizontalRule(state.maxColWidths, hr, sep) + "\n\n");
            cb();
        },
        transform: function (batch, _enc, cb) {
            var e_7, _a;
            batch = !(state.schema && state.schema.length) ? batch : batch.select.apply(batch, tslib_1.__spread(state.schema));
            if (state.closed) {
                return cb(undefined, null);
            }
            // Pass one to convert to strings and count max column widths
            state.maxColWidths = measureColumnWidths(rowId, batch, header.map(function (x, i) { return Math.max(maxColWidths[i] || 0, x.length); }));
            // If this is the first batch in a stream, print a top horizontal rule, schema metadata, and
            if (++batchId === 0) {
                hr && this.push(horizontalRule(state.maxColWidths, hr, sep) + "\n");
                if (state.metadata && batch.schema.metadata.size > 0) {
                    this.push("metadata:\n" + formatMetadata(batch.schema.metadata) + "\n");
                    hr && this.push(horizontalRule(state.maxColWidths, hr, sep) + "\n");
                }
                if (batch.length <= 0 || batch.numCols <= 0) {
                    this.push(formatRow(header, maxColWidths = state.maxColWidths, sep) + "\n");
                }
            }
            if (batch.length > 0 && batch.numCols > 0) {
                // If any of the column widths changed, print the header again
                if (rowId % 350 !== 0 && JSON.stringify(state.maxColWidths) !== JSON.stringify(maxColWidths)) {
                    this.push(formatRow(header, state.maxColWidths, sep) + "\n");
                }
                maxColWidths = state.maxColWidths;
                try {
                    for (var batch_1 = tslib_1.__values(batch), batch_1_1 = batch_1.next(); !batch_1_1.done; batch_1_1 = batch_1.next()) {
                        var row = batch_1_1.value;
                        if (state.closed) {
                            break;
                        }
                        else if (!row) {
                            continue;
                        }
                        if (rowId++ % 350 === 0) {
                            this.push(formatRow(header, maxColWidths, sep) + "\n");
                        }
                        this.push(formatRow(tslib_1.__spread([rowId], row.toArray()).map(pretty_1.valueToString), maxColWidths, sep) + "\n");
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (batch_1_1 && !batch_1_1.done && (_a = batch_1.return)) _a.call(batch_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            cb();
        }
    });
}
function horizontalRule(maxColWidths, hr, sep) {
    if (hr === void 0) { hr = ''; }
    if (sep === void 0) { sep = ' | '; }
    return " " + padLeft('', maxColWidths.reduce(function (x, y) { return x + y; }, -2 + maxColWidths.length * sep.length), hr);
}
function formatRow(row, maxColWidths, sep) {
    if (row === void 0) { row = []; }
    if (maxColWidths === void 0) { maxColWidths = []; }
    if (sep === void 0) { sep = ' | '; }
    return "" + row.map(function (x, j) { return padLeft(x, maxColWidths[j]); }).join(sep);
}
function formatMetadata(metadata) {
    return tslib_1.__spread(metadata).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), key = _b[0], val = _b[1];
        return "  " + key + ": " + formatMetadataValue(val);
    }).join(',  \n');
    function formatMetadataValue(value) {
        if (value === void 0) { value = ''; }
        var parsed = value;
        try {
            parsed = JSON.stringify(JSON.parse(value), null, 2);
        }
        catch (e) {
            parsed = value;
        }
        return pretty_1.valueToString(parsed).split('\n').join('\n  ');
    }
}
function measureColumnWidths(rowId, batch, maxColWidths) {
    var e_8, _a, e_9, _b;
    if (maxColWidths === void 0) { maxColWidths = []; }
    var val, j = 0;
    try {
        for (var batch_2 = tslib_1.__values(batch), batch_2_1 = batch_2.next(); !batch_2_1.done; batch_2_1 = batch_2.next()) {
            var row = batch_2_1.value;
            if (!row) {
                continue;
            }
            maxColWidths[j = 0] = Math.max(maxColWidths[0] || 0, ("" + rowId++).length);
            try {
                for (var row_1 = (e_9 = void 0, tslib_1.__values(row)), row_1_1 = row_1.next(); !row_1_1.done; row_1_1 = row_1.next()) {
                    val = row_1_1.value;
                    if (val && typedArrayElementWidths.has(val.constructor) && (typeof val[Symbol.toPrimitive] !== 'function')) {
                        // If we're printing a column of TypedArrays, ensure the column is wide enough to accommodate
                        // the widest possible element for a given byte size, since JS omits leading zeroes. For example:
                        // 1 |  [1137743649,2170567488,244696391,2122556476]
                        // 2 |                                          null
                        // 3 |   [637174007,2142281880,961736230,2912449282]
                        // 4 |    [1035112265,21832886,412842672,2207710517]
                        // 5 |                                          null
                        // 6 |                                          null
                        // 7 |     [2755142991,4192423256,2994359,467878370]
                        var elementWidth = typedArrayElementWidths.get(val.constructor);
                        maxColWidths[j + 1] = Math.max(maxColWidths[j + 1] || 0, 2 + // brackets on each end
                            (val.length - 1) + // commas between elements
                            (val.length * elementWidth) // width of stringified 2^N-1
                        );
                    }
                    else {
                        maxColWidths[j + 1] = Math.max(maxColWidths[j + 1] || 0, pretty_1.valueToString(val).length);
                    }
                    ++j;
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (row_1_1 && !row_1_1.done && (_b = row_1.return)) _b.call(row_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (batch_2_1 && !batch_2_1.done && (_a = batch_2.return)) _a.call(batch_2);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return maxColWidths;
}
// Measure the stringified representation of 2^N-1 for each TypedArray variant
var typedArrayElementWidths = (function () {
    var maxElementWidth = function (ArrayType) {
        var octets = Array.from({ length: ArrayType.BYTES_PER_ELEMENT - 1 }, function (_) { return 255; });
        return ("" + new ArrayType(new Uint8Array(tslib_1.__spread(octets, [254])).buffer)[0]).length;
    };
    return new Map([
        [Int8Array, maxElementWidth(Int8Array)],
        [Int16Array, maxElementWidth(Int16Array)],
        [Int32Array, maxElementWidth(Int32Array)],
        [Uint8Array, maxElementWidth(Uint8Array)],
        [Uint16Array, maxElementWidth(Uint16Array)],
        [Uint32Array, maxElementWidth(Uint32Array)],
        [Float32Array, maxElementWidth(Float32Array)],
        [Float64Array, maxElementWidth(Float64Array)],
        [Uint8ClampedArray, maxElementWidth(Uint8ClampedArray)]
    ]);
})();
function cliOpts() {
    return [
        {
            type: String,
            name: 'schema', alias: 's',
            optional: true, multiple: true,
            typeLabel: '{underline columns}',
            description: 'A space-delimited list of column names'
        },
        {
            type: String,
            name: 'file', alias: 'f',
            optional: true, multiple: true,
            description: 'The Arrow file to read'
        },
        {
            type: String,
            name: 'sep', optional: true, default: ' | ',
            description: 'The column separator character (default: " | ")'
        },
        {
            type: String,
            name: 'hr', optional: true, default: '',
            description: 'The horizontal border character (default: "")'
        },
        {
            type: Boolean,
            name: 'metadata', alias: 'm',
            optional: true, default: false,
            description: 'Flag to print Schema metadata (default: false)'
        },
        {
            type: Boolean,
            name: 'help', optional: true, default: false,
            description: 'Print this usage guide.'
        }
    ];
}
function print_usage() {
    console.log(require('command-line-usage')([
        {
            header: 'arrow2csv',
            content: 'Print a CSV from an Arrow file'
        },
        {
            header: 'Synopsis',
            content: [
                '$ arrow2csv {underline file.arrow} [{bold --schema} column_name ...]',
                '$ arrow2csv [{bold --schema} column_name ...] [{bold --file} {underline file.arrow}]',
                '$ arrow2csv {bold -s} column_1 {bold -s} column_2 [{bold -f} {underline file.arrow}]',
                '$ arrow2csv [{bold --help}]'
            ]
        },
        {
            header: 'Options',
            optionList: cliOpts()
        },
        {
            header: 'Example',
            content: [
                '$ arrow2csv --schema foo baz --sep " , " -f simple.arrow',
                '>   "row_id", "foo: Int32", "baz: Utf8"',
                '>          0,            1,        "aa"',
                '>          1,         null,        null',
                '>          2,            3,        null',
                '>          3,            4,       "bbb"',
                '>          4,            5,      "cccc"',
            ]
        }
    ]));
    return 1;
}

//# sourceMappingURL=arrow2csv.js.map
