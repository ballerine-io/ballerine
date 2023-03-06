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
import { inheritsLoose as _inheritsLoose, wrapNativeSuper as _wrapNativeSuper } from '../_virtual/_rollupPluginBabelHelpers.js';

var HttpError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(HttpError, _Error);
  function HttpError(status, message, cause) {
    var _this;
    _this = _Error.call(this, message, {
      cause: cause
    }) || this;
    _this.status = status;
    return _this;
  }
  return HttpError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

export { HttpError };
//# sourceMappingURL=errors.js.map
