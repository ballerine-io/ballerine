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
import { createClass as _createClass, classPrivateFieldLooseBase as _classPrivateFieldLooseBase, createForOfIteratorHelperLoose as _createForOfIteratorHelperLoose, extends as _extends, classPrivateFieldLooseKey as _classPrivateFieldLooseKey, asyncToGenerator as _asyncToGenerator, regeneratorRuntime as _regeneratorRuntime } from '../_virtual/_rollupPluginBabelHelpers.js';
import * as jsonLogic from 'json-logic-js';
import { interpret, createMachine } from 'xstate';
import { HttpError } from './errors.js';
import { Error } from './types.js';

var _subscription = /*#__PURE__*/_classPrivateFieldLooseKey("__subscription");
var _workflow = /*#__PURE__*/_classPrivateFieldLooseKey("__workflow");
var _currentStateNode = /*#__PURE__*/_classPrivateFieldLooseKey("__currentStateNode");
var _currentState = /*#__PURE__*/_classPrivateFieldLooseKey("__currentState");
var _context = /*#__PURE__*/_classPrivateFieldLooseKey("__context");
var _callback = /*#__PURE__*/_classPrivateFieldLooseKey("__callback");
var _extensions = /*#__PURE__*/_classPrivateFieldLooseKey("__extensions");
var _debugMode = /*#__PURE__*/_classPrivateFieldLooseKey("__debugMode");
var _extendedWorkflow = /*#__PURE__*/_classPrivateFieldLooseKey("__extendedWorkflow");
var WorkflowRunner = /*#__PURE__*/function () {
  function WorkflowRunner(_ref, debugMode) {
    var workflowDefinition = _ref.workflowDefinition,
      _workflowActions = _ref.workflowActions,
      _ref$context = _ref.context,
      _context2 = _ref$context === void 0 ? {} : _ref$context,
      _state = _ref.state,
      _extensions2 = _ref.extensions;
    if (debugMode === void 0) {
      debugMode = true;
    }
    Object.defineProperty(this, _extendedWorkflow, {
      value: _extendedWorkflow2
    });
    Object.defineProperty(this, _subscription, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _workflow, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _currentStateNode, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _currentState, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _context, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _callback, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _extensions, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _debugMode, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _workflow)[_workflow] = _classPrivateFieldLooseBase(this, _extendedWorkflow)[_extendedWorkflow]({
      workflow: workflowDefinition,
      workflowActions: _workflowActions,
      extensions: _extensions2
    });

    // use initial context or provided context
    _classPrivateFieldLooseBase(this, _context)[_context] = Object.keys(_context2).length ? _context2 : workflowDefinition.context || {};

    // use initial state or provided state
    _classPrivateFieldLooseBase(this, _currentState)[_currentState] = _state ? _state : workflowDefinition.initial;

    // global and state specific extensions
    _classPrivateFieldLooseBase(this, _extensions)[_extensions] = _extensions2 || {
      globalPlugins: [],
      statePlugins: []
    };
    _classPrivateFieldLooseBase(this, _debugMode)[_debugMode] = debugMode;
  }
  var _proto = WorkflowRunner.prototype;
  _proto.sendEvent = /*#__PURE__*/function () {
    var _sendEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
      var _this = this;
      var workflow, service, _iterator, _step, ext, _iterator2, _step2, _ext;
      return _regeneratorRuntime().wrap(function _callee$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            workflow = _classPrivateFieldLooseBase(this, _workflow)[_workflow].withContext(_classPrivateFieldLooseBase(this, _context)[_context]);
            console.log('Current state:', _classPrivateFieldLooseBase(this, _currentState)[_currentState]);
            service = interpret(workflow).start(_classPrivateFieldLooseBase(this, _currentState)[_currentState]).onTransition(function (state) {
              if (state.changed) {
                var _state$configuration, _state$configuration$;
                console.log('Transitioned into', state.value);
                if (((_state$configuration = state.configuration) == null ? void 0 : (_state$configuration$ = _state$configuration[0]) == null ? void 0 : _state$configuration$['type']) == 'final') {
                  console.log('Reached final state');
                }
                if (_classPrivateFieldLooseBase(_this, _callback)[_callback]) {
                  var _state$configuration$2, _state$configuration2, _state$configuration3;
                  // TODO: clean it up
                  var name = (_state$configuration$2 = (_state$configuration2 = state.configuration) == null ? void 0 : (_state$configuration3 = _state$configuration2[0]) == null ? void 0 : _state$configuration3['key']) != null ? _state$configuration$2 : '';
                  _classPrivateFieldLooseBase(_this, _callback)[_callback](_extends({}, event, {
                    state: name
                  }));
                }
              }
              _classPrivateFieldLooseBase(_this, _currentStateNode)[_currentStateNode] = state;
              _classPrivateFieldLooseBase(_this, _currentState)[_currentState] = state.value;
            }); // all sends() will be deferred until the workflow is started
            service.start();
            _iterator = _createForOfIteratorHelperLoose(_classPrivateFieldLooseBase(this, _extensions)[_extensions].globalPlugins);
          case 5:
            if ((_step = _iterator()).done) {
              _context3.next = 12;
              break;
            }
            ext = _step.value;
            if (!(ext.when == 'pre')) {
              _context3.next = 10;
              break;
            }
            _context3.next = 10;
            return ext.action({
              context: service.getSnapshot().context,
              event: event,
              currentState: _classPrivateFieldLooseBase(this, _currentStateNode)[_currentStateNode]
            });
          case 10:
            _context3.next = 5;
            break;
          case 12:
            service.send(event);
            _classPrivateFieldLooseBase(this, _context)[_context] = service.getSnapshot().context;
            if (_classPrivateFieldLooseBase(this, _debugMode)[_debugMode]) {
              console.log('context:', _classPrivateFieldLooseBase(this, _context)[_context]);
            }
            _iterator2 = _createForOfIteratorHelperLoose(_classPrivateFieldLooseBase(this, _extensions)[_extensions].globalPlugins);
          case 16:
            if ((_step2 = _iterator2()).done) {
              _context3.next = 23;
              break;
            }
            _ext = _step2.value;
            if (!(_ext.when == 'post')) {
              _context3.next = 21;
              break;
            }
            _context3.next = 21;
            return _ext.action({
              context: _classPrivateFieldLooseBase(this, _context)[_context],
              event: event,
              currentState: _classPrivateFieldLooseBase(this, _currentStateNode)[_currentStateNode]
            });
          case 21:
            _context3.next = 16;
            break;
          case 23:
          case "end":
            return _context3.stop();
        }
      }, _callee, this);
    }));
    function sendEvent(_x) {
      return _sendEvent.apply(this, arguments);
    }
    return sendEvent;
  }();
  _proto.subscribe = function subscribe(callback) {
    _classPrivateFieldLooseBase(this, _callback)[_callback] = callback;
    // Not currently in use.
    _classPrivateFieldLooseBase(this, _subscription)[_subscription].push(callback);
  };
  _proto.getSnapshot = function getSnapshot() {
    var service = interpret(_classPrivateFieldLooseBase(this, _workflow)[_workflow].withContext(_classPrivateFieldLooseBase(this, _context)[_context]));
    service.start(_classPrivateFieldLooseBase(this, _currentState)[_currentState]);
    return service.getSnapshot();
  };
  _createClass(WorkflowRunner, [{
    key: "workflow",
    get: function get() {
      return _classPrivateFieldLooseBase(this, _workflow)[_workflow];
    }
  }, {
    key: "state",
    get: function get() {
      return _classPrivateFieldLooseBase(this, _currentState)[_currentState];
    }
  }]);
  return WorkflowRunner;
}();
function _extendedWorkflow2(_ref2) {
  var _this2 = this;
  var workflow = _ref2.workflow,
    workflowActions = _ref2.workflowActions,
    _ref2$extensions = _ref2.extensions,
    extensions = _ref2$extensions === void 0 ? {
      statePlugins: [],
      globalPlugins: []
    } : _ref2$extensions;
  var extended = workflow;
  var onEnter = ['ping'];
  var onExit = ['pong'];
  var stateActions = {};
  for (var state in extended.states) {
    var _workflow$states$stat, _workflow$states$stat2;
    extended.states[state].entry = Array.from(new Set([].concat((_workflow$states$stat = workflow.states[state].entry) != null ? _workflow$states$stat : [], onEnter)));
    extended.states[state].exit = Array.from(new Set([].concat((_workflow$states$stat2 = workflow.states[state].exit) != null ? _workflow$states$stat2 : [], onExit)));
  }
  var _loop = function _loop() {
    var statePlugin = _step3.value;
    for (var _iterator6 = _createForOfIteratorHelperLoose(statePlugin.stateNames), _step6; !(_step6 = _iterator6()).done;) {
      var _stateName = _step6.value;
      // E.g { state: { entry: [...,plugin.name] } }
      extended.states[_stateName][statePlugin.when] = Array.from(new Set([].concat(extended.states[_stateName][statePlugin.when], [statePlugin.name])));

      // workflow-core
      // { actions: { persist: action } }
      stateActions[statePlugin.name] = /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(context, event) {
          var _classPrivateFieldLoo, _classPrivateFieldLoo2;
          var _classPrivateFieldLoo3, _classPrivateFieldLoo4, type, _classPrivateFieldLoo5, _classPrivateFieldLoo6;
          return _regeneratorRuntime().wrap(function _callee2$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(_this2, _callback))[_callback]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, {
                  type: 'STATE_ACTION_STATUS',
                  state: _classPrivateFieldLooseBase(_this2, _currentState)[_currentState],
                  payload: {
                    status: 'PENDING'
                  }
                });
                _context4.prev = 1;
                _context4.next = 4;
                return statePlugin.action({
                  context: context,
                  event: event,
                  currentState: _classPrivateFieldLooseBase(_this2, _currentState)[_currentState]
                });
              case 4:
                _context4.next = 16;
                break;
              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4["catch"](1);
                _context4.t1 = true;
                _context4.next = _context4.t1 === _context4.t0 instanceof HttpError ? 11 : 13;
                break;
              case 11:
                type = Error.HTTP_ERROR;
                return _context4.abrupt("break", 15);
              case 13:
                type = Error.ERROR;
                return _context4.abrupt("break", 15);
              case 15:
                (_classPrivateFieldLoo3 = (_classPrivateFieldLoo4 = _classPrivateFieldLooseBase(_this2, _callback))[_callback]) == null ? void 0 : _classPrivateFieldLoo3.call(_classPrivateFieldLoo4, {
                  type: type,
                  state: _classPrivateFieldLooseBase(_this2, _currentState)[_currentState],
                  error: _context4.t0
                });
              case 16:
                _context4.prev = 16;
                (_classPrivateFieldLoo5 = (_classPrivateFieldLoo6 = _classPrivateFieldLooseBase(_this2, _callback))[_callback]) == null ? void 0 : _classPrivateFieldLoo5.call(_classPrivateFieldLoo6, {
                  type: 'STATE_ACTION_STATUS',
                  state: _classPrivateFieldLooseBase(_this2, _currentState)[_currentState],
                  payload: {
                    status: 'IDLE'
                  }
                });
                return _context4.finish(16);
              case 19:
              case "end":
                return _context4.stop();
            }
          }, _callee2, null, [[1, 6, 16, 19]]);
        }));
        return function (_x2, _x3) {
          return _ref5.apply(this, arguments);
        };
      }();
    }
  };
  for (var _iterator3 = _createForOfIteratorHelperLoose(extensions.statePlugins), _step3; !(_step3 = _iterator3()).done;) {
    _loop();
  }
  for (var _iterator4 = _createForOfIteratorHelperLoose(extensions.statePlugins), _step4; !(_step4 = _iterator4()).done;) {
    var statePlugin = _step4.value;
    for (var _iterator5 = _createForOfIteratorHelperLoose(statePlugin.stateNames), _step5; !(_step5 = _iterator5()).done;) {
      var stateName = _step5.value;
      // E.g { state: { entry: [...,plugin.name] } }
      extended.states[stateName][statePlugin.when] = Array.from(new Set([].concat(extended.states[stateName][statePlugin.when], [statePlugin.name])));

      // { actions: { persist: action } }
      stateActions[statePlugin.name] = statePlugin.action;
    }
  }
  var actions = _extends({}, workflowActions, stateActions, {
    ping: function ping() {
      console.log('Global state entry handler');
    },
    pong: function pong() {
      console.log('Global state exit handler');
    }
  });
  var guards = {
    'json-rule': function jsonRule(ctx, _ref3, _ref4) {
      var payload = _ref3.payload;
      var cond = _ref4.cond;
      var data = _extends({}, ctx, payload);
      return jsonLogic.apply(cond.name,
      // Rule
      data // Data
      );
    }
  };

  return createMachine(_extends({
    predictableActionArguments: false
  }, extended), {
    actions: actions,
    guards: guards
  });
}

export { WorkflowRunner };
//# sourceMappingURL=workflow-runner.js.map
