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
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('../_virtual/_rollupPluginBabelHelpers.js');

var HttpError = /*#__PURE__*/function (_Error) {
  _rollupPluginBabelHelpers.inheritsLoose(HttpError, _Error);
  function HttpError(status, message, cause) {
    var _this;
    _this = _Error.call(this, message, {
      cause: cause
    }) || this;
    _this.status = status;
    return _this;
  }
  return HttpError;
}( /*#__PURE__*/_rollupPluginBabelHelpers.wrapNativeSuper(Error));

exports.HttpError = HttpError;
//# sourceMappingURL=errors.js.map
