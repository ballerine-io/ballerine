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
var Event = {
  WILD_CARD: '*',
  USER_NEXT_STEP: 'USER_NEXT_STEP',
  USER_PREV_STEP: 'USER_PREV_STEP',
  ERROR: 'ERROR',
  STATE_ACTION_STATUS: 'STATE_ACTION_STATUS'
};
var Action = {
  USER_NEXT_STEP: 'USER_NEXT_STEP',
  USER_PREV_STEP: 'USER_PREV_STEP',
  ERROR: 'ERROR'
};
var Error = {
  ERROR: 'ERROR',
  HTTP_ERROR: 'HTTP_ERROR'
};
var Errors = [Error.ERROR, Error.HTTP_ERROR];

export { Action, Error, Errors, Event };
//# sourceMappingURL=enums.js.map
