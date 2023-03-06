/**
 * workflow-browser-sdk
 *
 * Copyright (c) Ballerine
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var workflowCore = require('@ballerine/workflow-core');
var createWorkflow = require('./lib/create-workflow.js');
var enums = require('./lib/enums.js');
var workflowBrowserSdk = require('./lib/workflow-browser-sdk.js');



Object.defineProperty(exports, 'Error', {
	enumerable: true,
	get: function () { return workflowCore.Error; }
});
Object.defineProperty(exports, 'Errors', {
	enumerable: true,
	get: function () { return workflowCore.Errors; }
});
Object.defineProperty(exports, 'HttpError', {
	enumerable: true,
	get: function () { return workflowCore.HttpError; }
});
exports.createWorkflow = createWorkflow.createWorkflow;
exports.Action = enums.Action;
exports.Event = enums.Event;
exports.WorkflowBrowserSDK = workflowBrowserSdk.WorkflowBrowserSDK;
//# sourceMappingURL=index.js.map
