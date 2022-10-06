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
var adapters_1 = require("./io/adapters");
var index_1 = require("./builder/index");
var reader_1 = require("./ipc/reader");
var writer_1 = require("./ipc/writer");
var iterable_1 = require("./io/node/iterable");
var builder_1 = require("./io/node/builder");
var reader_2 = require("./io/node/reader");
var writer_2 = require("./io/node/writer");
adapters_1.default.toNodeStream = iterable_1.toNodeStream;
index_1.Builder['throughNode'] = builder_1.builderThroughNodeStream;
reader_1.RecordBatchReader['throughNode'] = reader_2.recordBatchReaderThroughNodeStream;
writer_1.RecordBatchWriter['throughNode'] = writer_2.recordBatchWriterThroughNodeStream;
tslib_1.__exportStar(require("./Arrow.dom"), exports);

//# sourceMappingURL=Arrow.node.js.map
