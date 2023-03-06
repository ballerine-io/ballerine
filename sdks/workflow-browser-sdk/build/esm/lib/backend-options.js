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
var backendOptions = {
  baseUrl: 'https://api-dev.ballerine.io',
  endpoints: {
    submit: {
      endpoint: '/workflows/submit',
      method: 'POST'
    },
    persist: {
      endpoint: '/workflows/persist',
      method: 'POST'
    }
  },
  headers: {
    Authorization: 'Bearer 123',
    credentials: 'include'
  }
};

export { backendOptions };
//# sourceMappingURL=backend-options.js.map
