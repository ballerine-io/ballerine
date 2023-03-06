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

var _rollupPluginBabelHelpers = require('../_virtual/_rollupPluginBabelHelpers.js');
var workflowCore = require('@ballerine/workflow-core');
var xstate = require('xstate');
var backendOptions = require('./backend-options.js');
var enums = require('./enums.js');

var _excluded = ["backend"];
var _subscribers = /*#__PURE__*/_rollupPluginBabelHelpers.classPrivateFieldLooseKey("__subscribers");
var _service = /*#__PURE__*/_rollupPluginBabelHelpers.classPrivateFieldLooseKey("__service");
var _backendOptions = /*#__PURE__*/_rollupPluginBabelHelpers.classPrivateFieldLooseKey("__backendOptions");
var _notify = /*#__PURE__*/_rollupPluginBabelHelpers.classPrivateFieldLooseKey("__notify");
var _injectUserStepActionsToStates = /*#__PURE__*/_rollupPluginBabelHelpers.classPrivateFieldLooseKey("__injectUserStepActionsToStates");
var WorkflowBrowserSDK = /*#__PURE__*/function () {
  function WorkflowBrowserSDK(_ref) {
    var _backend$endpoints,
      _backend$endpoints2,
      _options$workflowDefi,
      _options$workflowDefi2,
      _options$persistState,
      _this = this,
      _workflowActions;
    var backend = _ref.backend,
      options = _rollupPluginBabelHelpers.objectWithoutPropertiesLoose(_ref, _excluded);
    /**
     * Adds the `USER_NEXT_STEP` and `USER_PREV_STEP` actions to
     * the machine states which include `on.USER_NEXT_STEP` and `on.USER_PREV_STEP`.
     * @param states
     * @private
     */
    Object.defineProperty(this, _injectUserStepActionsToStates, {
      value: _injectUserStepActionsToStates2
    });
    Object.defineProperty(this, _notify, {
      value: _notify2
    });
    Object.defineProperty(this, _subscribers, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _service, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _backendOptions, {
      writable: true,
      value: void 0
    });
    _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _backendOptions)[_backendOptions] = _rollupPluginBabelHelpers["extends"]({}, backendOptions.backendOptions, backend, {
      endpoints: {
        persist: _rollupPluginBabelHelpers["extends"]({}, backendOptions.backendOptions.endpoints.persist, backend == null ? void 0 : (_backend$endpoints = backend.endpoints) == null ? void 0 : _backend$endpoints.persist),
        submit: _rollupPluginBabelHelpers["extends"]({}, backendOptions.backendOptions.endpoints.submit, backend == null ? void 0 : (_backend$endpoints2 = backend.endpoints) == null ? void 0 : _backend$endpoints2.submit)
      },
      headers: _rollupPluginBabelHelpers["extends"]({}, backendOptions.backendOptions.headers, backend == null ? void 0 : backend.headers)
    });

    // Actions defined within the machine's `states` object.
    var _states = _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _injectUserStepActionsToStates)[_injectUserStepActionsToStates]((_options$workflowDefi = options == null ? void 0 : (_options$workflowDefi2 = options.workflowDefinition) == null ? void 0 : _options$workflowDefi2.states) != null ? _options$workflowDefi : {});
    // const states = this.#__injectSubmitActorToStates(states);

    // Actions defined within `createMachine`'s second argument (config object).

    _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _service)[_service] = workflowCore.createWorkflow(_rollupPluginBabelHelpers["extends"]({}, options, {
      extensions: {
        statePlugins: [{
          stateNames: (_options$persistState = options == null ? void 0 : options.persistStates) != null ? _options$persistState : [],
          name: 'persist',
          when: 'entry',
          action: function () {
            var _action = _rollupPluginBabelHelpers.asyncToGenerator( /*#__PURE__*/_rollupPluginBabelHelpers.regeneratorRuntime().mark(function _callee(_ref2) {
              var _endpoints$persist;
              var context, _classPrivateFieldLoo, baseUrl, endpoints, headers, _ref3, endpoint, method, url, res;
              return _rollupPluginBabelHelpers.regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    context = _ref2.context;
                    _classPrivateFieldLoo = _rollupPluginBabelHelpers.classPrivateFieldLooseBase(_this, _backendOptions)[_backendOptions], baseUrl = _classPrivateFieldLoo.baseUrl, endpoints = _classPrivateFieldLoo.endpoints, headers = _classPrivateFieldLoo.headers;
                    _ref3 = (_endpoints$persist = endpoints == null ? void 0 : endpoints.persist) != null ? _endpoints$persist : {}, endpoint = _ref3.endpoint, method = _ref3.method;
                    url = baseUrl ? new URL(endpoint, baseUrl) : endpoint;
                    _context.prev = 4;
                    _context.next = 7;
                    return new Promise(function (resolve) {
                      return setTimeout(resolve, 2000);
                    });
                  case 7:
                    _context.next = 9;
                    return fetch(url, {
                      method: method,
                      body: JSON.stringify(context),
                      headers: _rollupPluginBabelHelpers["extends"]({
                        'Content-Type': 'application/json'
                      }, headers)
                    });
                  case 9:
                    res = _context.sent;
                    if (res.ok) {
                      _context.next = 12;
                      break;
                    }
                    throw res;
                  case 12:
                    _context.next = 19;
                    break;
                  case 14:
                    _context.prev = 14;
                    _context.t0 = _context["catch"](4);
                    if (_context.t0 instanceof Response) {
                      _context.next = 18;
                      break;
                    }
                    throw _context.t0;
                  case 18:
                    throw new workflowCore.HttpError(_context.t0.status, "Response error: " + _context.t0.statusText + " (" + _context.t0.status + ")", {
                      cause: _context.t0
                    });
                  case 19:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[4, 14]]);
            }));
            function action(_x) {
              return _action.apply(this, arguments);
            }
            return action;
          }()
        }],
        globalPlugins: []
      },
      workflowDefinition: _rollupPluginBabelHelpers["extends"]({}, options == null ? void 0 : options.workflowDefinition, {
        states: _states
      }),
      workflowActions: (_workflowActions = {}, _workflowActions[enums.Action.USER_NEXT_STEP] = xstate.assign(function (context, event) {
        context = _rollupPluginBabelHelpers["extends"]({}, context, event.payload);
        return context;
      }), _workflowActions[enums.Action.USER_PREV_STEP] = xstate.assign(function (context, event) {
        context = _rollupPluginBabelHelpers["extends"]({}, context, event.payload);
        return context;
      }), _workflowActions)
    }));
    _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _service)[_service].subscribe(function (event) {
      _rollupPluginBabelHelpers.classPrivateFieldLooseBase(_this, _notify)[_notify](event);
    });
  }
  var _proto = WorkflowBrowserSDK.prototype;
  _proto.subscribe = function subscribe(event, cb) {
    _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _subscribers)[_subscribers].push({
      event: event,
      cb: cb
    });
  };
  _proto.sendEvent = function sendEvent(event) {
    _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _service)[_service].sendEvent(event);
  };
  _proto.getSnapshot = function getSnapshot() {
    return _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _service)[_service].getSnapshot();
  };
  return WorkflowBrowserSDK;
}();
function _notify2(_ref4) {
  var type = _ref4.type,
    payload = _ref4.payload,
    state = _ref4.state,
    error = _ref4.error;
  _rollupPluginBabelHelpers.classPrivateFieldLooseBase(this, _subscribers)[_subscribers].forEach(function (sub) {
    if (sub.event !== enums.Event.WILD_CARD && !(sub.event === enums.Event.ERROR && workflowCore.Errors.includes(type)) && sub.event !== type) {
      return;
    }
    sub.cb({
      type: sub.event === enums.Event.WILD_CARD || sub.event === enums.Event.ERROR ? type : undefined,
      payload: payload,
      state: state,
      error: error
    });
  });
}
function _injectUserStepActionsToStates2(states) {
  /**
   * Make sure to not override existing actions.
   * Actions may be a string, an array of strings or undefined.
   * @param actions
   * @param action - `USER_NEXT_STEP`, `USER_PREV_STEP`, or user defined action.
   */
  var getActions = function getActions(actions, action) {
    // Don't modify unrelated user defined actions.
    if (action !== enums.Action.USER_NEXT_STEP && action !== enums.Action.USER_PREV_STEP) {
      return actions;
    }

    // Push the `USER_NEXT_STEP` or `USER_PREV_STEP` action to
    // the existing `actions` array.
    if (Array.isArray(actions)) return [].concat(actions, [action]);

    // Create a new array with the USER_NEXT_STEP/USER_PREV_STEP action,
    // and the existing user defined action.
    if (!!actions) return [actions, action];

    // Fallback to unchanged actions.
    return action;
  };

  /**
   * Traverses multiple levels of the state machine's `states` object,
   * injects the `USER_NEXT_STEP` and `USER_PREV_STEP` actions if needed,
   * without overriding unrelated props which may be defined within the `on` object or an event's props which are not `target` or `actions`.
   * @param outerKey
   * @param outerValue
   */
  var reduceStateOnProp = function reduceStateOnProp(_ref5) {
    var _Object$entries, _outerValue$on;
    var outerKey = _ref5[0],
      outerValue = _ref5[1];
    var on = (_Object$entries = Object.entries((_outerValue$on = outerValue == null ? void 0 : outerValue.on) != null ? _outerValue$on : {})) == null ? void 0 : _Object$entries.reduce(function (state, _ref6) {
      var _target$event;
      var event = _ref6[0],
        target = _ref6[1];
      var nextTarget = (_target$event = target == null ? void 0 : target[event]) != null ? _target$event : target == null ? void 0 : target.target;
      var eventProps = typeof target === 'string' ? {
        target: target
      } : // i.e. the value of { USER_NEXT_STEP: [TARGET] }
      _rollupPluginBabelHelpers["extends"]({}, target, nextTarget ? {
        target: nextTarget
      } : {});
      // Inject actions and honor user defined actions.
      var actions = getActions(eventProps == null ? void 0 : eventProps.actions, event);

      // Construct the new `on` object.
      state[event] = _rollupPluginBabelHelpers["extends"]({}, eventProps, !(eventProps != null && eventProps.invoke) ? {
        actions: actions
      } : {});
      return state;
    }, {});

    // i.e. { WELCOME: { ..., on: { ... }, ... } }
    var injected = _rollupPluginBabelHelpers["extends"]({}, outerValue, Object.keys(on).length ? {
      on: on
    } : {});
    return [outerKey, injected];
  };
  var statesEntries = Object.entries(states)
  // Construct a new `on` object for each state.
  .map(reduceStateOnProp);
  return Object.fromEntries(statesEntries);
}

exports.WorkflowBrowserSDK = WorkflowBrowserSDK;
//# sourceMappingURL=workflow-browser-sdk.js.map
