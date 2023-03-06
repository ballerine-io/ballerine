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

var workflowBrowserSdk = require('./workflow-browser-sdk.js');

var createWorkflow = function createWorkflow(options) {
  return new workflowBrowserSdk.WorkflowBrowserSDK(options);
};

exports.createWorkflow = createWorkflow;
//# sourceMappingURL=create-workflow.js.map
