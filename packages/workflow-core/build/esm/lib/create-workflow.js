/**
 * workflow-core
 *
 * Copyright (c) Ballerine
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
import { WorkflowRunner } from './workflow-runner.js';

var createWorkflow = function createWorkflow(_ref) {
  var workflowDefinition = _ref.workflowDefinition,
    workflowActions = _ref.workflowActions,
    extensions = _ref.extensions;
  return new WorkflowRunner({
    workflowDefinition: workflowDefinition,
    workflowActions: workflowActions,
    context: {},
    extensions: extensions
  });
};

export { createWorkflow };
//# sourceMappingURL=create-workflow.js.map
