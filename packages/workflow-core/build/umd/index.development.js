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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WorkflowCore = {}));
})(this, (function (exports) { 'use strict';

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;
      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  var id = 0;
  function _classPrivateFieldLooseKey(name) {
    return "__private_" + id++ + "_" + name;
  }
  function _classPrivateFieldLooseBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError("attempted to use private field on non-instance");
    }
    return receiver;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var logicExports = {};
  var logic = {
    get exports(){ return logicExports; },
    set exports(v){ logicExports = v; },
  };

  /* globals define,module */

  (function (module, exports) {
  (function(root, factory) {
  	  {
  	    module.exports = factory();
  	  }
  	}(commonjsGlobal, function() {
  	  /* globals console:false */

  	  if ( ! Array.isArray) {
  	    Array.isArray = function(arg) {
  	      return Object.prototype.toString.call(arg) === "[object Array]";
  	    };
  	  }

  	  /**
  	   * Return an array that contains no duplicates (original not modified)
  	   * @param  {array} array   Original reference array
  	   * @return {array}         New array with no duplicates
  	   */
  	  function arrayUnique(array) {
  	    var a = [];
  	    for (var i=0, l=array.length; i<l; i++) {
  	      if (a.indexOf(array[i]) === -1) {
  	        a.push(array[i]);
  	      }
  	    }
  	    return a;
  	  }

  	  var jsonLogic = {};
  	  var operations = {
  	    "==": function(a, b) {
  	      return a == b;
  	    },
  	    "===": function(a, b) {
  	      return a === b;
  	    },
  	    "!=": function(a, b) {
  	      return a != b;
  	    },
  	    "!==": function(a, b) {
  	      return a !== b;
  	    },
  	    ">": function(a, b) {
  	      return a > b;
  	    },
  	    ">=": function(a, b) {
  	      return a >= b;
  	    },
  	    "<": function(a, b, c) {
  	      return (c === undefined) ? a < b : (a < b) && (b < c);
  	    },
  	    "<=": function(a, b, c) {
  	      return (c === undefined) ? a <= b : (a <= b) && (b <= c);
  	    },
  	    "!!": function(a) {
  	      return jsonLogic.truthy(a);
  	    },
  	    "!": function(a) {
  	      return !jsonLogic.truthy(a);
  	    },
  	    "%": function(a, b) {
  	      return a % b;
  	    },
  	    "log": function(a) {
  	      console.log(a); return a;
  	    },
  	    "in": function(a, b) {
  	      if (!b || typeof b.indexOf === "undefined") return false;
  	      return (b.indexOf(a) !== -1);
  	    },
  	    "cat": function() {
  	      return Array.prototype.join.call(arguments, "");
  	    },
  	    "substr": function(source, start, end) {
  	      if (end < 0) {
  	        // JavaScript doesn't support negative end, this emulates PHP behavior
  	        var temp = String(source).substr(start);
  	        return temp.substr(0, temp.length + end);
  	      }
  	      return String(source).substr(start, end);
  	    },
  	    "+": function() {
  	      return Array.prototype.reduce.call(arguments, function(a, b) {
  	        return parseFloat(a, 10) + parseFloat(b, 10);
  	      }, 0);
  	    },
  	    "*": function() {
  	      return Array.prototype.reduce.call(arguments, function(a, b) {
  	        return parseFloat(a, 10) * parseFloat(b, 10);
  	      });
  	    },
  	    "-": function(a, b) {
  	      if (b === undefined) {
  	        return -a;
  	      } else {
  	        return a - b;
  	      }
  	    },
  	    "/": function(a, b) {
  	      return a / b;
  	    },
  	    "min": function() {
  	      return Math.min.apply(this, arguments);
  	    },
  	    "max": function() {
  	      return Math.max.apply(this, arguments);
  	    },
  	    "merge": function() {
  	      return Array.prototype.reduce.call(arguments, function(a, b) {
  	        return a.concat(b);
  	      }, []);
  	    },
  	    "var": function(a, b) {
  	      var not_found = (b === undefined) ? null : b;
  	      var data = this;
  	      if (typeof a === "undefined" || a==="" || a===null) {
  	        return data;
  	      }
  	      var sub_props = String(a).split(".");
  	      for (var i = 0; i < sub_props.length; i++) {
  	        if (data === null || data === undefined) {
  	          return not_found;
  	        }
  	        // Descending into data
  	        data = data[sub_props[i]];
  	        if (data === undefined) {
  	          return not_found;
  	        }
  	      }
  	      return data;
  	    },
  	    "missing": function() {
  	      /*
  	      Missing can receive many keys as many arguments, like {"missing:[1,2]}
  	      Missing can also receive *one* argument that is an array of keys,
  	      which typically happens if it's actually acting on the output of another command
  	      (like 'if' or 'merge')
  	      */

  	      var missing = [];
  	      var keys = Array.isArray(arguments[0]) ? arguments[0] : arguments;

  	      for (var i = 0; i < keys.length; i++) {
  	        var key = keys[i];
  	        var value = jsonLogic.apply({"var": key}, this);
  	        if (value === null || value === "") {
  	          missing.push(key);
  	        }
  	      }

  	      return missing;
  	    },
  	    "missing_some": function(need_count, options) {
  	      // missing_some takes two arguments, how many (minimum) items must be present, and an array of keys (just like 'missing') to check for presence.
  	      var are_missing = jsonLogic.apply({"missing": options}, this);

  	      if (options.length - are_missing.length >= need_count) {
  	        return [];
  	      } else {
  	        return are_missing;
  	      }
  	    },
  	  };

  	  jsonLogic.is_logic = function(logic) {
  	    return (
  	      typeof logic === "object" && // An object
  	      logic !== null && // but not null
  	      ! Array.isArray(logic) && // and not an array
  	      Object.keys(logic).length === 1 // with exactly one key
  	    );
  	  };

  	  /*
  	  This helper will defer to the JsonLogic spec as a tie-breaker when different language interpreters define different behavior for the truthiness of primitives.  E.g., PHP considers empty arrays to be falsy, but Javascript considers them to be truthy. JsonLogic, as an ecosystem, needs one consistent answer.

  	  Spec and rationale here: http://jsonlogic.com/truthy
  	  */
  	  jsonLogic.truthy = function(value) {
  	    if (Array.isArray(value) && value.length === 0) {
  	      return false;
  	    }
  	    return !! value;
  	  };


  	  jsonLogic.get_operator = function(logic) {
  	    return Object.keys(logic)[0];
  	  };

  	  jsonLogic.get_values = function(logic) {
  	    return logic[jsonLogic.get_operator(logic)];
  	  };

  	  jsonLogic.apply = function(logic, data) {
  	    // Does this array contain logic? Only one way to find out.
  	    if (Array.isArray(logic)) {
  	      return logic.map(function(l) {
  	        return jsonLogic.apply(l, data);
  	      });
  	    }
  	    // You've recursed to a primitive, stop!
  	    if ( ! jsonLogic.is_logic(logic) ) {
  	      return logic;
  	    }

  	    var op = jsonLogic.get_operator(logic);
  	    var values = logic[op];
  	    var i;
  	    var current;
  	    var scopedLogic;
  	    var scopedData;
  	    var initial;

  	    // easy syntax for unary operators, like {"var" : "x"} instead of strict {"var" : ["x"]}
  	    if ( ! Array.isArray(values)) {
  	      values = [values];
  	    }

  	    // 'if', 'and', and 'or' violate the normal rule of depth-first calculating consequents, let each manage recursion as needed.
  	    if (op === "if" || op == "?:") {
  	      /* 'if' should be called with a odd number of parameters, 3 or greater
  	      This works on the pattern:
  	      if( 0 ){ 1 }else{ 2 };
  	      if( 0 ){ 1 }else if( 2 ){ 3 }else{ 4 };
  	      if( 0 ){ 1 }else if( 2 ){ 3 }else if( 4 ){ 5 }else{ 6 };

  	      The implementation is:
  	      For pairs of values (0,1 then 2,3 then 4,5 etc)
  	      If the first evaluates truthy, evaluate and return the second
  	      If the first evaluates falsy, jump to the next pair (e.g, 0,1 to 2,3)
  	      given one parameter, evaluate and return it. (it's an Else and all the If/ElseIf were false)
  	      given 0 parameters, return NULL (not great practice, but there was no Else)
  	      */
  	      for (i = 0; i < values.length - 1; i += 2) {
  	        if ( jsonLogic.truthy( jsonLogic.apply(values[i], data) ) ) {
  	          return jsonLogic.apply(values[i+1], data);
  	        }
  	      }
  	      if (values.length === i+1) {
  	        return jsonLogic.apply(values[i], data);
  	      }
  	      return null;
  	    } else if (op === "and") { // Return first falsy, or last
  	      for (i=0; i < values.length; i+=1) {
  	        current = jsonLogic.apply(values[i], data);
  	        if ( ! jsonLogic.truthy(current)) {
  	          return current;
  	        }
  	      }
  	      return current; // Last
  	    } else if (op === "or") {// Return first truthy, or last
  	      for (i=0; i < values.length; i+=1) {
  	        current = jsonLogic.apply(values[i], data);
  	        if ( jsonLogic.truthy(current) ) {
  	          return current;
  	        }
  	      }
  	      return current; // Last
  	    } else if (op === "filter") {
  	      scopedData = jsonLogic.apply(values[0], data);
  	      scopedLogic = values[1];

  	      if ( ! Array.isArray(scopedData)) {
  	        return [];
  	      }
  	      // Return only the elements from the array in the first argument,
  	      // that return truthy when passed to the logic in the second argument.
  	      // For parity with JavaScript, reindex the returned array
  	      return scopedData.filter(function(datum) {
  	        return jsonLogic.truthy( jsonLogic.apply(scopedLogic, datum));
  	      });
  	    } else if (op === "map") {
  	      scopedData = jsonLogic.apply(values[0], data);
  	      scopedLogic = values[1];

  	      if ( ! Array.isArray(scopedData)) {
  	        return [];
  	      }

  	      return scopedData.map(function(datum) {
  	        return jsonLogic.apply(scopedLogic, datum);
  	      });
  	    } else if (op === "reduce") {
  	      scopedData = jsonLogic.apply(values[0], data);
  	      scopedLogic = values[1];
  	      initial = typeof values[2] !== "undefined" ? values[2] : null;

  	      if ( ! Array.isArray(scopedData)) {
  	        return initial;
  	      }

  	      return scopedData.reduce(
  	        function(accumulator, current) {
  	          return jsonLogic.apply(
  	            scopedLogic,
  	            {current: current, accumulator: accumulator}
  	          );
  	        },
  	        initial
  	      );
  	    } else if (op === "all") {
  	      scopedData = jsonLogic.apply(values[0], data);
  	      scopedLogic = values[1];
  	      // All of an empty set is false. Note, some and none have correct fallback after the for loop
  	      if ( ! Array.isArray(scopedData) || ! scopedData.length) {
  	        return false;
  	      }
  	      for (i=0; i < scopedData.length; i+=1) {
  	        if ( ! jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
  	          return false; // First falsy, short circuit
  	        }
  	      }
  	      return true; // All were truthy
  	    } else if (op === "none") {
  	      scopedData = jsonLogic.apply(values[0], data);
  	      scopedLogic = values[1];

  	      if ( ! Array.isArray(scopedData) || ! scopedData.length) {
  	        return true;
  	      }
  	      for (i=0; i < scopedData.length; i+=1) {
  	        if ( jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
  	          return false; // First truthy, short circuit
  	        }
  	      }
  	      return true; // None were truthy
  	    } else if (op === "some") {
  	      scopedData = jsonLogic.apply(values[0], data);
  	      scopedLogic = values[1];

  	      if ( ! Array.isArray(scopedData) || ! scopedData.length) {
  	        return false;
  	      }
  	      for (i=0; i < scopedData.length; i+=1) {
  	        if ( jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
  	          return true; // First truthy, short circuit
  	        }
  	      }
  	      return false; // None were truthy
  	    }

  	    // Everyone else gets immediate depth-first recursion
  	    values = values.map(function(val) {
  	      return jsonLogic.apply(val, data);
  	    });


  	    // The operation is called with "data" bound to its "this" and "values" passed as arguments.
  	    // Structured commands like % or > can name formal arguments while flexible commands (like missing or merge) can operate on the pseudo-array arguments
  	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
  	    if (operations.hasOwnProperty(op) && typeof operations[op] === "function") {
  	      return operations[op].apply(data, values);
  	    } else if (op.indexOf(".") > 0) { // Contains a dot, and not in the 0th position
  	      var sub_ops = String(op).split(".");
  	      var operation = operations;
  	      for (i = 0; i < sub_ops.length; i++) {
  	        if (!operation.hasOwnProperty(sub_ops[i])) {
  	          throw new Error("Unrecognized operation " + op +
  	            " (failed at " + sub_ops.slice(0, i+1).join(".") + ")");
  	        }
  	        // Descending into operations
  	        operation = operation[sub_ops[i]];
  	      }

  	      return operation.apply(data, values);
  	    }

  	    throw new Error("Unrecognized operation " + op );
  	  };

  	  jsonLogic.uses_data = function(logic) {
  	    var collection = [];

  	    if (jsonLogic.is_logic(logic)) {
  	      var op = jsonLogic.get_operator(logic);
  	      var values = logic[op];

  	      if ( ! Array.isArray(values)) {
  	        values = [values];
  	      }

  	      if (op === "var") {
  	        // This doesn't cover the case where the arg to var is itself a rule.
  	        collection.push(values[0]);
  	      } else {
  	        // Recursion!
  	        values.forEach(function(val) {
  	          collection.push.apply(collection, jsonLogic.uses_data(val) );
  	        });
  	      }
  	    }

  	    return arrayUnique(collection);
  	  };

  	  jsonLogic.add_operation = function(name, code) {
  	    operations[name] = code;
  	  };

  	  jsonLogic.rm_operation = function(name) {
  	    delete operations[name];
  	  };

  	  jsonLogic.rule_like = function(rule, pattern) {
  	    // console.log("Is ". JSON.stringify(rule) . " like " . JSON.stringify(pattern) . "?");
  	    if (pattern === rule) {
  	      return true;
  	    } // TODO : Deep object equivalency?
  	    if (pattern === "@") {
  	      return true;
  	    } // Wildcard!
  	    if (pattern === "number") {
  	      return (typeof rule === "number");
  	    }
  	    if (pattern === "string") {
  	      return (typeof rule === "string");
  	    }
  	    if (pattern === "array") {
  	      // !logic test might be superfluous in JavaScript
  	      return Array.isArray(rule) && ! jsonLogic.is_logic(rule);
  	    }

  	    if (jsonLogic.is_logic(pattern)) {
  	      if (jsonLogic.is_logic(rule)) {
  	        var pattern_op = jsonLogic.get_operator(pattern);
  	        var rule_op = jsonLogic.get_operator(rule);

  	        if (pattern_op === "@" || pattern_op === rule_op) {
  	          // echo "\nOperators match, go deeper\n";
  	          return jsonLogic.rule_like(
  	            jsonLogic.get_values(rule, false),
  	            jsonLogic.get_values(pattern, false)
  	          );
  	        }
  	      }
  	      return false; // pattern is logic, rule isn't, can't be eq
  	    }

  	    if (Array.isArray(pattern)) {
  	      if (Array.isArray(rule)) {
  	        if (pattern.length !== rule.length) {
  	          return false;
  	        }
  	        /*
  	          Note, array order MATTERS, because we're using this array test logic to consider arguments, where order can matter. (e.g., + is commutative, but '-' or 'if' or 'var' are NOT)
  	        */
  	        for (var i = 0; i < pattern.length; i += 1) {
  	          // If any fail, we fail
  	          if ( ! jsonLogic.rule_like(rule[i], pattern[i])) {
  	            return false;
  	          }
  	        }
  	        return true; // If they *all* passed, we pass
  	      } else {
  	        return false; // Pattern is array, rule isn't
  	      }
  	    }

  	    // Not logic, not array, not a === match for rule.
  	    return false;
  	  };

  	  return jsonLogic;
  	}));
  } (logic));

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  }

  var ActionTypes;

  (function (ActionTypes) {
    ActionTypes["Start"] = "xstate.start";
    ActionTypes["Stop"] = "xstate.stop";
    ActionTypes["Raise"] = "xstate.raise";
    ActionTypes["Send"] = "xstate.send";
    ActionTypes["Cancel"] = "xstate.cancel";
    ActionTypes["NullEvent"] = "";
    ActionTypes["Assign"] = "xstate.assign";
    ActionTypes["After"] = "xstate.after";
    ActionTypes["DoneState"] = "done.state";
    ActionTypes["DoneInvoke"] = "done.invoke";
    ActionTypes["Log"] = "xstate.log";
    ActionTypes["Init"] = "xstate.init";
    ActionTypes["Invoke"] = "xstate.invoke";
    ActionTypes["ErrorExecution"] = "error.execution";
    ActionTypes["ErrorCommunication"] = "error.communication";
    ActionTypes["ErrorPlatform"] = "error.platform";
    ActionTypes["ErrorCustom"] = "xstate.error";
    ActionTypes["Update"] = "xstate.update";
    ActionTypes["Pure"] = "xstate.pure";
    ActionTypes["Choose"] = "xstate.choose";
  })(ActionTypes || (ActionTypes = {}));

  var SpecialTargets;

  (function (SpecialTargets) {
    SpecialTargets["Parent"] = "#_parent";
    SpecialTargets["Internal"] = "#_internal";
  })(SpecialTargets || (SpecialTargets = {}));

  var start$1 = ActionTypes.Start;
  var stop$1 = ActionTypes.Stop;
  var raise$1 = ActionTypes.Raise;
  var send$1 = ActionTypes.Send;
  var cancel$1 = ActionTypes.Cancel;
  var nullEvent = ActionTypes.NullEvent;
  var assign = ActionTypes.Assign;
  ActionTypes.After;
  ActionTypes.DoneState;
  var log = ActionTypes.Log;
  var init = ActionTypes.Init;
  var invoke = ActionTypes.Invoke;
  ActionTypes.ErrorExecution;
  var errorPlatform = ActionTypes.ErrorPlatform;
  var error$1 = ActionTypes.ErrorCustom;
  var update = ActionTypes.Update;
  var choose = ActionTypes.Choose;
  var pure = ActionTypes.Pure;

  var STATE_DELIMITER = '.';
  var EMPTY_ACTIVITY_MAP = {};
  var DEFAULT_GUARD_TYPE = 'xstate.guard';
  var TARGETLESS_KEY = '';

  var _a;
  function matchesState(parentStateId, childStateId, delimiter) {
    if (delimiter === void 0) {
      delimiter = STATE_DELIMITER;
    }

    var parentStateValue = toStateValue(parentStateId, delimiter);
    var childStateValue = toStateValue(childStateId, delimiter);

    if (isString(childStateValue)) {
      if (isString(parentStateValue)) {
        return childStateValue === parentStateValue;
      } // Parent more specific than child


      return false;
    }

    if (isString(parentStateValue)) {
      return parentStateValue in childStateValue;
    }

    return Object.keys(parentStateValue).every(function (key) {
      if (!(key in childStateValue)) {
        return false;
      }

      return matchesState(parentStateValue[key], childStateValue[key]);
    });
  }
  function getEventType(event) {
    try {
      return isString(event) || typeof event === 'number' ? "".concat(event) : event.type;
    } catch (e) {
      throw new Error('Events must be strings or objects with a string event.type property.');
    }
  }
  function toStatePath(stateId, delimiter) {
    try {
      if (isArray(stateId)) {
        return stateId;
      }

      return stateId.toString().split(delimiter);
    } catch (e) {
      throw new Error("'".concat(stateId, "' is not a valid state path."));
    }
  }
  function isStateLike(state) {
    return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state && '_event' in state;
  }
  function toStateValue(stateValue, delimiter) {
    if (isStateLike(stateValue)) {
      return stateValue.value;
    }

    if (isArray(stateValue)) {
      return pathToStateValue(stateValue);
    }

    if (typeof stateValue !== 'string') {
      return stateValue;
    }

    var statePath = toStatePath(stateValue, delimiter);
    return pathToStateValue(statePath);
  }
  function pathToStateValue(statePath) {
    if (statePath.length === 1) {
      return statePath[0];
    }

    var value = {};
    var marker = value;

    for (var i = 0; i < statePath.length - 1; i++) {
      if (i === statePath.length - 2) {
        marker[statePath[i]] = statePath[i + 1];
      } else {
        marker[statePath[i]] = {};
        marker = marker[statePath[i]];
      }
    }

    return value;
  }
  function mapValues(collection, iteratee) {
    var result = {};
    var collectionKeys = Object.keys(collection);

    for (var i = 0; i < collectionKeys.length; i++) {
      var key = collectionKeys[i];
      result[key] = iteratee(collection[key], key, collection, i);
    }

    return result;
  }
  function mapFilterValues(collection, iteratee, predicate) {
    var e_1, _a;

    var result = {};

    try {
      for (var _b = __values(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var key = _c.value;
        var item = collection[key];

        if (!predicate(item)) {
          continue;
        }

        result[key] = iteratee(item, key, collection);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return result;
  }
  /**
   * Retrieves a value at the given path.
   * @param props The deep path to the prop of the desired value
   */

  var path = function (props) {
    return function (object) {
      var e_2, _a;

      var result = object;

      try {
        for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
          var prop = props_1_1.value;
          result = result[prop];
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      return result;
    };
  };
  /**
   * Retrieves a value at the given path via the nested accessor prop.
   * @param props The deep path to the prop of the desired value
   */

  function nestedPath(props, accessorProp) {
    return function (object) {
      var e_3, _a;

      var result = object;

      try {
        for (var props_2 = __values(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
          var prop = props_2_1.value;
          result = result[accessorProp][prop];
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
        } finally {
          if (e_3) throw e_3.error;
        }
      }

      return result;
    };
  }
  function toStatePaths(stateValue) {
    if (!stateValue) {
      return [[]];
    }

    if (isString(stateValue)) {
      return [[stateValue]];
    }

    var result = flatten(Object.keys(stateValue).map(function (key) {
      var subStateValue = stateValue[key];

      if (typeof subStateValue !== 'string' && (!subStateValue || !Object.keys(subStateValue).length)) {
        return [[key]];
      }

      return toStatePaths(stateValue[key]).map(function (subPath) {
        return [key].concat(subPath);
      });
    }));
    return result;
  }
  function flatten(array) {
    var _a;

    return (_a = []).concat.apply(_a, __spreadArray([], __read(array), false));
  }
  function toArrayStrict(value) {
    if (isArray(value)) {
      return value;
    }

    return [value];
  }
  function toArray(value) {
    if (value === undefined) {
      return [];
    }

    return toArrayStrict(value);
  }
  function mapContext(mapper, context, _event) {
    var e_5, _a;

    if (isFunction(mapper)) {
      return mapper(context, _event.data);
    }

    var result = {};

    try {
      for (var _b = __values(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var key = _c.value;
        var subMapper = mapper[key];

        if (isFunction(subMapper)) {
          result[key] = subMapper(context, _event.data);
        } else {
          result[key] = subMapper;
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    return result;
  }
  function isBuiltInEvent(eventType) {
    return /^(done|error)\./.test(eventType);
  }
  function isPromiseLike(value) {
    if (value instanceof Promise) {
      return true;
    } // Check if shape matches the Promise/A+ specification for a "thenable".


    if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
      return true;
    }

    return false;
  }
  function isBehavior(value) {
    return value !== null && typeof value === 'object' && 'transition' in value && typeof value.transition === 'function';
  }
  function partition(items, predicate) {
    var e_6, _a;

    var _b = __read([[], []], 2),
        truthy = _b[0],
        falsy = _b[1];

    try {
      for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
        var item = items_1_1.value;

        if (predicate(item)) {
          truthy.push(item);
        } else {
          falsy.push(item);
        }
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    return [truthy, falsy];
  }
  function updateHistoryStates(hist, stateValue) {
    return mapValues(hist.states, function (subHist, key) {
      if (!subHist) {
        return undefined;
      }

      var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) || (subHist ? subHist.current : undefined);

      if (!subStateValue) {
        return undefined;
      }

      return {
        current: subStateValue,
        states: updateHistoryStates(subHist, subStateValue)
      };
    });
  }
  function updateHistoryValue(hist, stateValue) {
    return {
      current: stateValue,
      states: updateHistoryStates(hist, stateValue)
    };
  }
  function updateContext(context, _event, assignActions, state) {
    {
      warn(!!context, 'Attempting to update undefined context');
    }

    var updatedContext = context ? assignActions.reduce(function (acc, assignAction) {
      var e_7, _a;

      var assignment = assignAction.assignment;
      var meta = {
        state: state,
        action: assignAction,
        _event: _event
      };
      var partialUpdate = {};

      if (isFunction(assignment)) {
        partialUpdate = assignment(acc, _event.data, meta);
      } else {
        try {
          for (var _b = __values(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var propAssignment = assignment[key];
            partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_7) throw e_7.error;
          }
        }
      }

      return Object.assign({}, acc, partialUpdate);
    }, context) : context;
    return updatedContext;
  } // tslint:disable-next-line:no-empty

  var warn = function () {};

  {
    warn = function (condition, message) {
      var error = condition instanceof Error ? condition : undefined;

      if (!error && condition) {
        return;
      }

      if (console !== undefined) {
        var args = ["Warning: ".concat(message)];

        if (error) {
          args.push(error);
        } // tslint:disable-next-line:no-console


        console.warn.apply(console, args);
      }
    };
  }
  function isArray(value) {
    return Array.isArray(value);
  } // tslint:disable-next-line:ban-types

  function isFunction(value) {
    return typeof value === 'function';
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function toGuard(condition, guardMap) {
    if (!condition) {
      return undefined;
    }

    if (isString(condition)) {
      return {
        type: DEFAULT_GUARD_TYPE,
        name: condition,
        predicate: guardMap ? guardMap[condition] : undefined
      };
    }

    if (isFunction(condition)) {
      return {
        type: DEFAULT_GUARD_TYPE,
        name: condition.name,
        predicate: condition
      };
    }

    return condition;
  }
  function isObservable(value) {
    try {
      return 'subscribe' in value && isFunction(value.subscribe);
    } catch (e) {
      return false;
    }
  }
  var symbolObservable = /*#__PURE__*/function () {
    return typeof Symbol === 'function' && Symbol.observable || '@@observable';
  }(); // TODO: to be removed in v5, left it out just to minimize the scope of the change and maintain compatibility with older versions of integration paackages

  (_a = {}, _a[symbolObservable] = function () {
    return this;
  }, _a[Symbol.observable] = function () {
    return this;
  }, _a);
  function isMachine(value) {
    return !!value && '__xstatenode' in value;
  }
  function isActor$1(value) {
    return !!value && typeof value.send === 'function';
  }
  function toEventObject(event, payload // id?: TEvent['type']
  ) {
    if (isString(event) || typeof event === 'number') {
      return __assign({
        type: event
      }, payload);
    }

    return event;
  }
  function toSCXMLEvent(event, scxmlEvent) {
    if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
      return event;
    }

    var eventObject = toEventObject(event);
    return __assign({
      name: eventObject.type,
      data: eventObject,
      $$type: 'scxml',
      type: 'external'
    }, scxmlEvent);
  }
  function toTransitionConfigArray(event, configLike) {
    var transitions = toArrayStrict(configLike).map(function (transitionLike) {
      if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string' || isMachine(transitionLike)) {
        return {
          target: transitionLike,
          event: event
        };
      }

      return __assign(__assign({}, transitionLike), {
        event: event
      });
    });
    return transitions;
  }
  function normalizeTarget(target) {
    if (target === undefined || target === TARGETLESS_KEY) {
      return undefined;
    }

    return toArray(target);
  }
  function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
    {
      var originalStackTrace = originalError.stack ? " Stacktrace was '".concat(originalError.stack, "'") : '';

      if (originalError === currentError) {
        // tslint:disable-next-line:no-console
        console.error("Missing onError handler for invocation '".concat(id, "', error was '").concat(originalError, "'.").concat(originalStackTrace));
      } else {
        var stackTrace = currentError.stack ? " Stacktrace was '".concat(currentError.stack, "'") : ''; // tslint:disable-next-line:no-console

        console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(id, "'. ") + "Original error: '".concat(originalError, "'. ").concat(originalStackTrace, " Current error is '").concat(currentError, "'.").concat(stackTrace));
      }
    }
  }
  function evaluateGuard(machine, guard, context, _event, state) {
    var guards = machine.options.guards;
    var guardMeta = {
      state: state,
      cond: guard,
      _event: _event
    }; // TODO: do not hardcode!

    if (guard.type === DEFAULT_GUARD_TYPE) {
      return ((guards === null || guards === void 0 ? void 0 : guards[guard.name]) || guard.predicate)(context, _event.data, guardMeta);
    }

    var condFn = guards === null || guards === void 0 ? void 0 : guards[guard.type];

    if (!condFn) {
      throw new Error("Guard '".concat(guard.type, "' is not implemented on machine '").concat(machine.id, "'."));
    }

    return condFn(context, _event.data, guardMeta);
  }
  function toInvokeSource$1(src) {
    if (typeof src === 'string') {
      return {
        type: src
      };
    }

    return src;
  }
  function toObserver(nextHandler, errorHandler, completionHandler) {
    var noop = function () {};

    var isObserver = typeof nextHandler === 'object';
    var self = isObserver ? nextHandler : null;
    return {
      next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
      error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
      complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
    };
  }
  function createInvokeId(stateNodeId, index) {
    return "".concat(stateNodeId, ":invocation[").concat(index, "]");
  }
  function isRaisableAction(action) {
    return (action.type === raise$1 || action.type === send$1 && action.to === SpecialTargets.Internal) && typeof action.delay !== 'number';
  }

  var initEvent = /*#__PURE__*/toSCXMLEvent({
    type: init
  });
  function getActionFunction(actionType, actionFunctionMap) {
    return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
  }
  function toActionObject(action, actionFunctionMap) {
    var actionObject;

    if (isString(action) || typeof action === 'number') {
      var exec = getActionFunction(action, actionFunctionMap);

      if (isFunction(exec)) {
        actionObject = {
          type: action,
          exec: exec
        };
      } else if (exec) {
        actionObject = exec;
      } else {
        actionObject = {
          type: action,
          exec: undefined
        };
      }
    } else if (isFunction(action)) {
      actionObject = {
        // Convert action to string if unnamed
        type: action.name || action.toString(),
        exec: action
      };
    } else {
      var exec = getActionFunction(action.type, actionFunctionMap);

      if (isFunction(exec)) {
        actionObject = __assign(__assign({}, action), {
          exec: exec
        });
      } else if (exec) {
        var actionType = exec.type || action.type;
        actionObject = __assign(__assign(__assign({}, exec), action), {
          type: actionType
        });
      } else {
        actionObject = action;
      }
    }

    return actionObject;
  }
  var toActionObjects = function (action, actionFunctionMap) {
    if (!action) {
      return [];
    }

    var actions = isArray(action) ? action : [action];
    return actions.map(function (subAction) {
      return toActionObject(subAction, actionFunctionMap);
    });
  };
  function toActivityDefinition(action) {
    var actionObject = toActionObject(action);
    return __assign(__assign({
      id: isString(action) ? action : actionObject.id
    }, actionObject), {
      type: actionObject.type
    });
  }
  /**
   * Raises an event. This places the event in the internal event queue, so that
   * the event is immediately consumed by the machine in the current step.
   *
   * @param eventType The event to raise.
   */

  function raise(event, options) {
    return {
      type: raise$1,
      event: typeof event === 'function' ? event : toEventObject(event),
      delay: options ? options.delay : undefined,
      id: options === null || options === void 0 ? void 0 : options.id
    };
  }
  function resolveRaise(action, ctx, _event, delaysMap) {
    var meta = {
      _event: _event
    };
    var resolvedEvent = toSCXMLEvent(isFunction(action.event) ? action.event(ctx, _event.data, meta) : action.event);
    var resolvedDelay;

    if (isString(action.delay)) {
      var configDelay = delaysMap && delaysMap[action.delay];
      resolvedDelay = isFunction(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
    } else {
      resolvedDelay = isFunction(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
    }

    return __assign(__assign({}, action), {
      type: raise$1,
      _event: resolvedEvent,
      delay: resolvedDelay
    });
  }
  /**
   * Sends an event. This returns an action that will be read by an interpreter to
   * send the event in the next step, after the current step is finished executing.
   *
   * @deprecated Use the `sendTo(...)` action creator instead.
   *
   * @param event The event to send.
   * @param options Options to pass into the send event:
   *  - `id` - The unique send event identifier (used with `cancel()`).
   *  - `delay` - The number of milliseconds to delay the sending of the event.
   *  - `to` - The target of this event (by default, the machine the event was sent from).
   */

  function send(event, options) {
    return {
      to: options ? options.to : undefined,
      type: send$1,
      event: isFunction(event) ? event : toEventObject(event),
      delay: options ? options.delay : undefined,
      // TODO: don't auto-generate IDs here like that
      // there is too big chance of the ID collision
      id: options && options.id !== undefined ? options.id : isFunction(event) ? event.name : getEventType(event)
    };
  }
  function resolveSend(action, ctx, _event, delaysMap) {
    var meta = {
      _event: _event
    }; // TODO: helper function for resolving Expr

    var resolvedEvent = toSCXMLEvent(isFunction(action.event) ? action.event(ctx, _event.data, meta) : action.event);
    var resolvedDelay;

    if (isString(action.delay)) {
      var configDelay = delaysMap && delaysMap[action.delay];
      resolvedDelay = isFunction(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
    } else {
      resolvedDelay = isFunction(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
    }

    var resolvedTarget = isFunction(action.to) ? action.to(ctx, _event.data, meta) : action.to;
    return __assign(__assign({}, action), {
      to: resolvedTarget,
      _event: resolvedEvent,
      event: resolvedEvent.data,
      delay: resolvedDelay
    });
  }
  var resolveLog = function (action, ctx, _event) {
    return __assign(__assign({}, action), {
      value: isString(action.expr) ? action.expr : action.expr(ctx, _event.data, {
        _event: _event
      })
    });
  };
  /**
   * Cancels an in-flight `send(...)` action. A canceled sent action will not
   * be executed, nor will its event be sent, unless it has already been sent
   * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
   *
   * @param sendId The `id` of the `send(...)` action to cancel.
   */

  var cancel = function (sendId) {
    return {
      type: cancel$1,
      sendId: sendId
    };
  };
  /**
   * Starts an activity.
   *
   * @param activity The activity to start.
   */

  function start(activity) {
    var activityDef = toActivityDefinition(activity);
    return {
      type: ActionTypes.Start,
      activity: activityDef,
      exec: undefined
    };
  }
  /**
   * Stops an activity.
   *
   * @param actorRef The activity to stop.
   */

  function stop(actorRef) {
    var activity = isFunction(actorRef) ? actorRef : toActivityDefinition(actorRef);
    return {
      type: ActionTypes.Stop,
      activity: activity,
      exec: undefined
    };
  }
  function resolveStop(action, context, _event) {
    var actorRefOrString = isFunction(action.activity) ? action.activity(context, _event.data) : action.activity;
    var resolvedActorRef = typeof actorRefOrString === 'string' ? {
      id: actorRefOrString
    } : actorRefOrString;
    var actionObject = {
      type: ActionTypes.Stop,
      activity: resolvedActorRef
    };
    return actionObject;
  }
  /**
   * Returns an event type that represents an implicit event that
   * is sent after the specified `delay`.
   *
   * @param delayRef The delay in milliseconds
   * @param id The state node ID where this event is handled
   */

  function after(delayRef, id) {
    var idSuffix = id ? "#".concat(id) : '';
    return "".concat(ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
  }
  /**
   * Returns an event that represents that a final state node
   * has been reached in the parent state node.
   *
   * @param id The final state node's parent state node `id`
   * @param data The data to pass into the event
   */

  function done(id, data) {
    var type = "".concat(ActionTypes.DoneState, ".").concat(id);
    var eventObject = {
      type: type,
      data: data
    };

    eventObject.toString = function () {
      return type;
    };

    return eventObject;
  }
  /**
   * Returns an event that represents that an invoked service has terminated.
   *
   * An invoked service is terminated when it has reached a top-level final state node,
   * but not when it is canceled.
   *
   * @param id The final state node ID
   * @param data The data to pass into the event
   */

  function doneInvoke(id, data) {
    var type = "".concat(ActionTypes.DoneInvoke, ".").concat(id);
    var eventObject = {
      type: type,
      data: data
    };

    eventObject.toString = function () {
      return type;
    };

    return eventObject;
  }
  function error(id, data) {
    var type = "".concat(ActionTypes.ErrorPlatform, ".").concat(id);
    var eventObject = {
      type: type,
      data: data
    };

    eventObject.toString = function () {
      return type;
    };

    return eventObject;
  }

  var pluckAssigns = function (actionBlocks) {
    var e_1, _a;

    var assignActions = [];

    try {
      for (var actionBlocks_1 = __values(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
        var block = actionBlocks_1_1.value;
        var i = 0;

        while (i < block.actions.length) {
          if (block.actions[i].type === assign) {
            assignActions.push(block.actions[i]);
            block.actions.splice(i, 1);
            continue;
          }

          i++;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return assignActions;
  };

  function resolveActions(machine, currentState, currentContext, _event, actionBlocks, predictableExec, preserveActionOrder) {
    if (preserveActionOrder === void 0) {
      preserveActionOrder = false;
    }

    var assignActions = preserveActionOrder ? [] : pluckAssigns(actionBlocks);
    var updatedContext = assignActions.length ? updateContext(currentContext, _event, assignActions, currentState) : currentContext;
    var preservedContexts = preserveActionOrder ? [currentContext] : undefined;
    var deferredToBlockEnd = [];

    function handleAction(blockType, actionObject) {
      var _a;

      switch (actionObject.type) {
        case raise$1:
          {
            var raisedAction = resolveRaise(actionObject, updatedContext, _event, machine.options.delays);

            if (predictableExec && typeof raisedAction.delay === 'number') {
              predictableExec(raisedAction, updatedContext, _event);
            }

            return raisedAction;
          }

        case send$1:
          var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

          {
            var configuredDelay = actionObject.delay; // warn after resolving as we can create better contextual message here

            warn(!isString(configuredDelay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
            "No delay reference for delay expression '".concat(configuredDelay, "' was found on machine '").concat(machine.id, "'"));
          }

          if (predictableExec && sendAction.to !== SpecialTargets.Internal) {
            if (blockType === 'entry') {
              deferredToBlockEnd.push(sendAction);
            } else {
              predictableExec(sendAction, updatedContext, _event);
            }
          }

          return sendAction;

        case log:
          {
            var resolved = resolveLog(actionObject, updatedContext, _event);
            predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, updatedContext, _event);
            return resolved;
          }

        case choose:
          {
            var chooseAction = actionObject;
            var matchedActions = (_a = chooseAction.conds.find(function (condition) {
              var guard = toGuard(condition.cond, machine.options.guards);
              return !guard || evaluateGuard(machine, guard, updatedContext, _event, !predictableExec ? currentState : undefined);
            })) === null || _a === void 0 ? void 0 : _a.actions;

            if (!matchedActions) {
              return [];
            }

            var _b = __read(resolveActions(machine, currentState, updatedContext, _event, [{
              type: blockType,
              actions: toActionObjects(toArray(matchedActions), machine.options.actions)
            }], predictableExec, preserveActionOrder), 2),
                resolvedActionsFromChoose = _b[0],
                resolvedContextFromChoose = _b[1];

            updatedContext = resolvedContextFromChoose;
            preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
            return resolvedActionsFromChoose;
          }

        case pure:
          {
            var matchedActions = actionObject.get(updatedContext, _event.data);

            if (!matchedActions) {
              return [];
            }

            var _c = __read(resolveActions(machine, currentState, updatedContext, _event, [{
              type: blockType,
              actions: toActionObjects(toArray(matchedActions), machine.options.actions)
            }], predictableExec, preserveActionOrder), 2),
                resolvedActionsFromPure = _c[0],
                resolvedContext = _c[1];

            updatedContext = resolvedContext;
            preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
            return resolvedActionsFromPure;
          }

        case stop$1:
          {
            var resolved = resolveStop(actionObject, updatedContext, _event);
            predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, currentContext, _event);
            return resolved;
          }

        case assign:
          {
            updatedContext = updateContext(updatedContext, _event, [actionObject], !predictableExec ? currentState : undefined);
            preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
            break;
          }

        default:
          var resolvedActionObject = toActionObject(actionObject, machine.options.actions);
          var exec_1 = resolvedActionObject.exec;

          if (predictableExec) {
            predictableExec(resolvedActionObject, updatedContext, _event);
          } else if (exec_1 && preservedContexts) {
            var contextIndex_1 = preservedContexts.length - 1;

            var wrapped = __assign(__assign({}, resolvedActionObject), {
              exec: function (_ctx) {
                var args = [];

                for (var _i = 1; _i < arguments.length; _i++) {
                  args[_i - 1] = arguments[_i];
                }

                exec_1.apply(void 0, __spreadArray([preservedContexts[contextIndex_1]], __read(args), false));
              }
            });

            resolvedActionObject = wrapped;
          }

          return resolvedActionObject;
      }
    }

    function processBlock(block) {
      var e_2, _a;

      var resolvedActions = [];

      try {
        for (var _b = __values(block.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
          var action = _c.value;
          var resolved = handleAction(block.type, action);

          if (resolved) {
            resolvedActions = resolvedActions.concat(resolved);
          }
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      deferredToBlockEnd.forEach(function (action) {
        predictableExec(action, updatedContext, _event);
      });
      deferredToBlockEnd.length = 0;
      return resolvedActions;
    }

    var resolvedActions = flatten(actionBlocks.map(processBlock));
    return [resolvedActions, updatedContext];
  }

  /**
   * Maintains a stack of the current service in scope.
   * This is used to provide the correct service to spawn().
   */
  var provide = function (service, fn) {
    var result = fn(service);
    return result;
  };

  function createNullActor(id) {
    var _a;

    return _a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function () {
        return {
          unsubscribe: function () {
            return void 0;
          }
        };
      },
      getSnapshot: function () {
        return undefined;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[symbolObservable] = function () {
      return this;
    }, _a;
  }
  /**
   * Creates a deferred actor that is able to be invoked given the provided
   * invocation information in its `.meta` value.
   *
   * @param invokeDefinition The meta information needed to invoke the actor.
   */

  function createInvocableActor(invokeDefinition, machine, context, _event) {
    var _a;

    var invokeSrc = toInvokeSource$1(invokeDefinition.src);
    var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
    var resolvedData = invokeDefinition.data ? mapContext(invokeDefinition.data, context, _event) : undefined;
    var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

    tempActor.meta = invokeDefinition;
    return tempActor;
  }
  function createDeferredActor(entity, id, data) {
    var tempActor = createNullActor(id); // @ts-ignore

    tempActor.deferred = true;

    if (isMachine(entity)) {
      // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
      var initialState_1 = tempActor.state = provide(undefined, function () {
        return (data ? entity.withContext(data) : entity).initialState;
      });

      tempActor.getSnapshot = function () {
        return initialState_1;
      };
    }

    return tempActor;
  }
  function isActor(item) {
    try {
      return typeof item.send === 'function';
    } catch (e) {
      return false;
    }
  }
  function isSpawnedActor(item) {
    return isActor(item) && 'id' in item;
  } // TODO: refactor the return type, this could be written in a better way but it's best to avoid unneccessary breaking changes now

  function toActorRef(actorRefLike) {
    var _a;

    return __assign((_a = {
      subscribe: function () {
        return {
          unsubscribe: function () {
            return void 0;
          }
        };
      },
      id: 'anonymous',
      getSnapshot: function () {
        return undefined;
      }
    }, _a[symbolObservable] = function () {
      return this;
    }, _a), actorRefLike);
  }

  var isLeafNode = function (stateNode) {
    return stateNode.type === 'atomic' || stateNode.type === 'final';
  };
  function getAllChildren(stateNode) {
    return Object.keys(stateNode.states).map(function (key) {
      return stateNode.states[key];
    });
  }
  function getChildren(stateNode) {
    return getAllChildren(stateNode).filter(function (sn) {
      return sn.type !== 'history';
    });
  }
  function getAllStateNodes(stateNode) {
    var stateNodes = [stateNode];

    if (isLeafNode(stateNode)) {
      return stateNodes;
    }

    return stateNodes.concat(flatten(getChildren(stateNode).map(getAllStateNodes)));
  }
  function getConfiguration(prevStateNodes, stateNodes) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

    var prevConfiguration = new Set(prevStateNodes);
    var prevAdjList = getAdjList(prevConfiguration);
    var configuration = new Set(stateNodes);

    try {
      // add all ancestors
      for (var configuration_1 = __values(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
        var s = configuration_1_1.value;
        var m = s.parent;

        while (m && !configuration.has(m)) {
          configuration.add(m);
          m = m.parent;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    var adjList = getAdjList(configuration);

    try {
      // add descendants
      for (var configuration_2 = __values(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
        var s = configuration_2_1.value; // if previously active, add existing child nodes

        if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
          if (prevAdjList.get(s)) {
            prevAdjList.get(s).forEach(function (sn) {
              return configuration.add(sn);
            });
          } else {
            s.initialStateNodes.forEach(function (sn) {
              return configuration.add(sn);
            });
          }
        } else {
          if (s.type === 'parallel') {
            try {
              for (var _e = (e_3 = void 0, __values(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
                var child = _f.value;

                if (!configuration.has(child)) {
                  configuration.add(child);

                  if (prevAdjList.get(child)) {
                    prevAdjList.get(child).forEach(function (sn) {
                      return configuration.add(sn);
                    });
                  } else {
                    child.initialStateNodes.forEach(function (sn) {
                      return configuration.add(sn);
                    });
                  }
                }
              }
            } catch (e_3_1) {
              e_3 = {
                error: e_3_1
              };
            } finally {
              try {
                if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
              } finally {
                if (e_3) throw e_3.error;
              }
            }
          }
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    try {
      // add all ancestors
      for (var configuration_3 = __values(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
        var s = configuration_3_1.value;
        var m = s.parent;

        while (m && !configuration.has(m)) {
          configuration.add(m);
          m = m.parent;
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    return configuration;
  }

  function getValueFromAdj(baseNode, adjList) {
    var childStateNodes = adjList.get(baseNode);

    if (!childStateNodes) {
      return {}; // todo: fix?
    }

    if (baseNode.type === 'compound') {
      var childStateNode = childStateNodes[0];

      if (childStateNode) {
        if (isLeafNode(childStateNode)) {
          return childStateNode.key;
        }
      } else {
        return {};
      }
    }

    var stateValue = {};
    childStateNodes.forEach(function (csn) {
      stateValue[csn.key] = getValueFromAdj(csn, adjList);
    });
    return stateValue;
  }

  function getAdjList(configuration) {
    var e_5, _a;

    var adjList = new Map();

    try {
      for (var configuration_4 = __values(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
        var s = configuration_4_1.value;

        if (!adjList.has(s)) {
          adjList.set(s, []);
        }

        if (s.parent) {
          if (!adjList.has(s.parent)) {
            adjList.set(s.parent, []);
          }

          adjList.get(s.parent).push(s);
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    return adjList;
  }
  function getValue(rootNode, configuration) {
    var config = getConfiguration([rootNode], configuration);
    return getValueFromAdj(rootNode, getAdjList(config));
  }
  function has(iterable, item) {
    if (Array.isArray(iterable)) {
      return iterable.some(function (member) {
        return member === item;
      });
    }

    if (iterable instanceof Set) {
      return iterable.has(item);
    }

    return false; // TODO: fix
  }
  function nextEvents(configuration) {
    return __spreadArray([], __read(new Set(flatten(__spreadArray([], __read(configuration.map(function (sn) {
      return sn.ownEvents;
    })), false)))), false);
  }
  function isInFinalState(configuration, stateNode) {
    if (stateNode.type === 'compound') {
      return getChildren(stateNode).some(function (s) {
        return s.type === 'final' && has(configuration, s);
      });
    }

    if (stateNode.type === 'parallel') {
      return getChildren(stateNode).every(function (sn) {
        return isInFinalState(configuration, sn);
      });
    }

    return false;
  }
  function getMeta(configuration) {
    if (configuration === void 0) {
      configuration = [];
    }

    return configuration.reduce(function (acc, stateNode) {
      if (stateNode.meta !== undefined) {
        acc[stateNode.id] = stateNode.meta;
      }

      return acc;
    }, {});
  }
  function getTagsFromConfiguration(configuration) {
    return new Set(flatten(configuration.map(function (sn) {
      return sn.tags;
    })));
  }

  function stateValuesEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (a === undefined || b === undefined) {
      return false;
    }

    if (isString(a) || isString(b)) {
      return a === b;
    }

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    return aKeys.length === bKeys.length && aKeys.every(function (key) {
      return stateValuesEqual(a[key], b[key]);
    });
  }
  function isStateConfig(state) {
    if (typeof state !== 'object' || state === null) {
      return false;
    }

    return 'value' in state && '_event' in state;
  }
  function bindActionToState(action, state) {
    var exec = action.exec;

    var boundAction = __assign(__assign({}, action), {
      exec: exec !== undefined ? function () {
        return exec(state.context, state.event, {
          action: action,
          state: state,
          _event: state._event
        });
      } : undefined
    });

    return boundAction;
  }

  var State =
  /*#__PURE__*/

  /** @class */
  function () {
    /**
     * Creates a new State instance.
     * @param value The state value
     * @param context The extended state
     * @param historyValue The tree representing historical values of the state nodes
     * @param history The previous state
     * @param actions An array of action objects to execute as side-effects
     * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
     * @param meta
     * @param events Internal event queue. Should be empty with run-to-completion semantics.
     * @param configuration
     */
    function State(config) {
      var _this = this;

      var _a;

      this.actions = [];
      this.activities = EMPTY_ACTIVITY_MAP;
      this.meta = {};
      this.events = [];
      this.value = config.value;
      this.context = config.context;
      this._event = config._event;
      this._sessionid = config._sessionid;
      this.event = this._event.data;
      this.historyValue = config.historyValue;
      this.history = config.history;
      this.actions = config.actions || [];
      this.activities = config.activities || EMPTY_ACTIVITY_MAP;
      this.meta = getMeta(config.configuration);
      this.events = config.events || [];
      this.matches = this.matches.bind(this);
      this.toStrings = this.toStrings.bind(this);
      this.configuration = config.configuration;
      this.transitions = config.transitions;
      this.children = config.children;
      this.done = !!config.done;
      this.tags = (_a = Array.isArray(config.tags) ? new Set(config.tags) : config.tags) !== null && _a !== void 0 ? _a : new Set();
      this.machine = config.machine;
      Object.defineProperty(this, 'nextEvents', {
        get: function () {
          return nextEvents(_this.configuration);
        }
      });
    }
    /**
     * Creates a new State instance for the given `stateValue` and `context`.
     * @param stateValue
     * @param context
     */


    State.from = function (stateValue, context) {
      if (stateValue instanceof State) {
        if (stateValue.context !== context) {
          return new State({
            value: stateValue.value,
            context: context,
            _event: stateValue._event,
            _sessionid: null,
            historyValue: stateValue.historyValue,
            history: stateValue.history,
            actions: [],
            activities: stateValue.activities,
            meta: {},
            events: [],
            configuration: [],
            transitions: [],
            children: {}
          });
        }

        return stateValue;
      }

      var _event = initEvent;
      return new State({
        value: stateValue,
        context: context,
        _event: _event,
        _sessionid: null,
        historyValue: undefined,
        history: undefined,
        actions: [],
        activities: undefined,
        meta: undefined,
        events: [],
        configuration: [],
        transitions: [],
        children: {}
      });
    };
    /**
     * Creates a new State instance for the given `config`.
     * @param config The state config
     */


    State.create = function (config) {
      return new State(config);
    };
    /**
     * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
     * @param stateValue
     * @param context
     */


    State.inert = function (stateValue, context) {
      if (stateValue instanceof State) {
        if (!stateValue.actions.length) {
          return stateValue;
        }

        var _event = initEvent;
        return new State({
          value: stateValue.value,
          context: context,
          _event: _event,
          _sessionid: null,
          historyValue: stateValue.historyValue,
          history: stateValue.history,
          activities: stateValue.activities,
          configuration: stateValue.configuration,
          transitions: [],
          children: {}
        });
      }

      return State.from(stateValue, context);
    };
    /**
     * Returns an array of all the string leaf state node paths.
     * @param stateValue
     * @param delimiter The character(s) that separate each subpath in the string state node path.
     */


    State.prototype.toStrings = function (stateValue, delimiter) {
      var _this = this;

      if (stateValue === void 0) {
        stateValue = this.value;
      }

      if (delimiter === void 0) {
        delimiter = '.';
      }

      if (isString(stateValue)) {
        return [stateValue];
      }

      var valueKeys = Object.keys(stateValue);
      return valueKeys.concat.apply(valueKeys, __spreadArray([], __read(valueKeys.map(function (key) {
        return _this.toStrings(stateValue[key], delimiter).map(function (s) {
          return key + delimiter + s;
        });
      })), false));
    };

    State.prototype.toJSON = function () {
      var _a = this;
          _a.configuration;
          _a.transitions;
          var tags = _a.tags;
          _a.machine;
          var jsonValues = __rest(_a, ["configuration", "transitions", "tags", "machine"]);

      return __assign(__assign({}, jsonValues), {
        tags: Array.from(tags)
      });
    };

    State.prototype.matches = function (parentStateValue) {
      return matchesState(parentStateValue, this.value);
    };
    /**
     * Whether the current state configuration has a state node with the specified `tag`.
     * @param tag
     */


    State.prototype.hasTag = function (tag) {
      return this.tags.has(tag);
    };
    /**
     * Determines whether sending the `event` will cause a non-forbidden transition
     * to be selected, even if the transitions have no actions nor
     * change the state value.
     *
     * @param event The event to test
     * @returns Whether the event will cause a transition
     */


    State.prototype.can = function (event) {
      var _a;

      var transitionData = (_a = this.machine) === null || _a === void 0 ? void 0 : _a.getTransitionData(this, event);
      return !!(transitionData === null || transitionData === void 0 ? void 0 : transitionData.transitions.length) && // Check that at least one transition is not forbidden
      transitionData.transitions.some(function (t) {
        return t.target !== undefined || t.actions.length;
      });
    };

    return State;
  }();

  var defaultOptions = {
    deferEvents: false
  };

  var Scheduler =
  /*#__PURE__*/

  /** @class */
  function () {
    function Scheduler(options) {
      this.processingEvent = false;
      this.queue = [];
      this.initialized = false;
      this.options = __assign(__assign({}, defaultOptions), options);
    }

    Scheduler.prototype.initialize = function (callback) {
      this.initialized = true;

      if (callback) {
        if (!this.options.deferEvents) {
          this.schedule(callback);
          return;
        }

        this.process(callback);
      }

      this.flushEvents();
    };

    Scheduler.prototype.schedule = function (task) {
      if (!this.initialized || this.processingEvent) {
        this.queue.push(task);
        return;
      }

      if (this.queue.length !== 0) {
        throw new Error('Event queue should be empty when it is not processing events');
      }

      this.process(task);
      this.flushEvents();
    };

    Scheduler.prototype.clear = function () {
      this.queue = [];
    };

    Scheduler.prototype.flushEvents = function () {
      var nextCallback = this.queue.shift();

      while (nextCallback) {
        this.process(nextCallback);
        nextCallback = this.queue.shift();
      }
    };

    Scheduler.prototype.process = function (callback) {
      this.processingEvent = true;

      try {
        callback();
      } catch (e) {
        // there is no use to keep the future events
        // as the situation is not anymore the same
        this.clear();
        throw e;
      } finally {
        this.processingEvent = false;
      }
    };

    return Scheduler;
  }();

  var children = /*#__PURE__*/new Map();
  var sessionIdIndex = 0;
  var registry = {
    bookId: function () {
      return "x:".concat(sessionIdIndex++);
    },
    register: function (id, actor) {
      children.set(id, actor);
      return id;
    },
    get: function (id) {
      return children.get(id);
    },
    free: function (id) {
      children.delete(id);
    }
  };

  function getGlobal() {
    if (typeof globalThis !== 'undefined') {
      return globalThis;
    }

    if (typeof self !== 'undefined') {
      return self;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    if (typeof global !== 'undefined') {
      return global;
    }

    {
      console.warn('XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues');
    }
  }

  function getDevTools() {
    var global = getGlobal();

    if (global && '__xstate__' in global) {
      return global.__xstate__;
    }

    return undefined;
  }

  function registerService(service) {
    if (!getGlobal()) {
      return;
    }

    var devTools = getDevTools();

    if (devTools) {
      devTools.register(service);
    }
  }

  function spawnBehavior(behavior, options) {
    if (options === void 0) {
      options = {};
    }

    var state = behavior.initialState;
    var observers = new Set();
    var mailbox = [];
    var flushing = false;

    var flush = function () {
      if (flushing) {
        return;
      }

      flushing = true;

      while (mailbox.length > 0) {
        var event_1 = mailbox.shift();
        state = behavior.transition(state, event_1, actorCtx);
        observers.forEach(function (observer) {
          return observer.next(state);
        });
      }

      flushing = false;
    };

    var actor = toActorRef({
      id: options.id,
      send: function (event) {
        mailbox.push(event);
        flush();
      },
      getSnapshot: function () {
        return state;
      },
      subscribe: function (next, handleError, complete) {
        var observer = toObserver(next, handleError, complete);
        observers.add(observer);
        observer.next(state);
        return {
          unsubscribe: function () {
            observers.delete(observer);
          }
        };
      }
    });
    var actorCtx = {
      parent: options.parent,
      self: actor,
      id: options.id || 'anonymous',
      observers: observers
    };
    state = behavior.start ? behavior.start(actorCtx) : state;
    return actor;
  }

  var DEFAULT_SPAWN_OPTIONS = {
    sync: false,
    autoForward: false
  };
  var InterpreterStatus;

  (function (InterpreterStatus) {
    InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
    InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
    InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
  })(InterpreterStatus || (InterpreterStatus = {}));

  var Interpreter =
  /*#__PURE__*/

  /** @class */
  function () {
    /**
     * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
     *
     * @param machine The machine to be interpreted
     * @param options Interpreter options
     */
    function Interpreter(machine, options) {
      if (options === void 0) {
        options = Interpreter.defaultOptions;
      }

      var _this = this;

      this.machine = machine;
      this.delayedEventsMap = {};
      this.listeners = new Set();
      this.contextListeners = new Set();
      this.stopListeners = new Set();
      this.doneListeners = new Set();
      this.eventListeners = new Set();
      this.sendListeners = new Set();
      /**
       * Whether the service is started.
       */

      this.initialized = false;
      this.status = InterpreterStatus.NotStarted;
      this.children = new Map();
      this.forwardTo = new Set();
      this._outgoingQueue = [];
      /**
       * Alias for Interpreter.prototype.start
       */

      this.init = this.start;
      /**
       * Sends an event to the running interpreter to trigger a transition.
       *
       * An array of events (batched) can be sent as well, which will send all
       * batched events to the running interpreter. The listeners will be
       * notified only **once** when all events are processed.
       *
       * @param event The event(s) to send
       */

      this.send = function (event, payload) {
        if (isArray(event)) {
          _this.batch(event);

          return _this.state;
        }

        var _event = toSCXMLEvent(toEventObject(event, payload));

        if (_this.status === InterpreterStatus.Stopped) {
          // do nothing
          {
            warn(false, "Event \"".concat(_event.name, "\" was sent to stopped service \"").concat(_this.machine.id, "\". This service has already reached its final state, and will not transition.\nEvent: ").concat(JSON.stringify(_event.data)));
          }

          return _this.state;
        }

        if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
          throw new Error("Event \"".concat(_event.name, "\" was sent to uninitialized service \"").concat(_this.machine.id // tslint:disable-next-line:max-line-length
          , "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ").concat(JSON.stringify(_event.data)));
        }

        _this.scheduler.schedule(function () {
          // Forward copy of event to child actors
          _this.forward(_event);

          var nextState = _this._nextState(_event);

          _this.update(nextState, _event);
        });

        return _this._state; // TODO: deprecate (should return void)
        // tslint:disable-next-line:semicolon
      };

      this.sendTo = function (event, to, immediate) {
        var isParent = _this.parent && (to === SpecialTargets.Parent || _this.parent.id === to);
        var target = isParent ? _this.parent : isString(to) ? to === SpecialTargets.Internal ? _this : _this.children.get(to) || registry.get(to) : isActor$1(to) ? to : undefined;

        if (!target) {
          if (!isParent) {
            throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
          } // tslint:disable-next-line:no-console


          {
            warn(false, "Service '".concat(_this.id, "' has no parent: unable to send event ").concat(event.type));
          }

          return;
        }

        if ('machine' in target) {
          // perhaps those events should be rejected in the parent
          // but atm it doesn't have easy access to all of the information that is required to do it reliably
          if (_this.status !== InterpreterStatus.Stopped || _this.parent !== target || // we need to send events to the parent from exit handlers of a machine that reached its final state
          _this.state.done) {
            // Send SCXML events to machines
            var scxmlEvent = __assign(__assign({}, event), {
              name: event.name === error$1 ? "".concat(error(_this.id)) : event.name,
              origin: _this.sessionId
            });

            if (!immediate && _this.machine.config.predictableActionArguments) {
              _this._outgoingQueue.push([target, scxmlEvent]);
            } else {
              target.send(scxmlEvent);
            }
          }
        } else {
          // Send normal events to other targets
          if (!immediate && _this.machine.config.predictableActionArguments) {
            _this._outgoingQueue.push([target, event.data]);
          } else {
            target.send(event.data);
          }
        }
      };

      this._exec = function (action, context, _event, actionFunctionMap) {
        if (actionFunctionMap === void 0) {
          actionFunctionMap = _this.machine.options.actions;
        }

        var actionOrExec = action.exec || getActionFunction(action.type, actionFunctionMap);
        var exec = isFunction(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

        if (exec) {
          try {
            return exec(context, _event.data, !_this.machine.config.predictableActionArguments ? {
              action: action,
              state: _this.state,
              _event: _event
            } : {
              action: action,
              _event: _event
            });
          } catch (err) {
            if (_this.parent) {
              _this.parent.send({
                type: 'xstate.error',
                data: err
              });
            }

            throw err;
          }
        }

        switch (action.type) {
          case raise$1:
            {
              // if raise action reached the interpreter then it's a delayed one
              var sendAction_1 = action;

              _this.defer(sendAction_1);

              break;
            }

          case send$1:
            var sendAction = action;

            if (typeof sendAction.delay === 'number') {
              _this.defer(sendAction);

              return;
            } else {
              if (sendAction.to) {
                _this.sendTo(sendAction._event, sendAction.to, _event === initEvent);
              } else {
                _this.send(sendAction._event);
              }
            }

            break;

          case cancel$1:
            _this.cancel(action.sendId);

            break;

          case start$1:
            {
              if (_this.status !== InterpreterStatus.Running) {
                return;
              }

              var activity = action.activity; // If the activity will be stopped right after it's started
              // (such as in transient states)
              // don't bother starting the activity.

              if ( // in v4 with `predictableActionArguments` invokes are called eagerly when the `this.state` still points to the previous state
              !_this.machine.config.predictableActionArguments && !_this.state.activities[activity.id || activity.type]) {
                break;
              } // Invoked services


              if (activity.type === ActionTypes.Invoke) {
                var invokeSource = toInvokeSource$1(activity.src);
                var serviceCreator = _this.machine.options.services ? _this.machine.options.services[invokeSource.type] : undefined;
                var id = activity.id,
                    data = activity.data;

                {
                  warn(!('forward' in activity), // tslint:disable-next-line:max-line-length
                  "`forward` property is deprecated (found in invocation of '".concat(activity.src, "' in in machine '").concat(_this.machine.id, "'). ") + "Please use `autoForward` instead.");
                }

                var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

                if (!serviceCreator) {
                  // tslint:disable-next-line:no-console
                  {
                    warn(false, "No service found for invocation '".concat(activity.src, "' in machine '").concat(_this.machine.id, "'."));
                  }

                  return;
                }

                var resolvedData = data ? mapContext(data, context, _event) : undefined;

                if (typeof serviceCreator === 'string') {
                  // TODO: warn
                  return;
                }

                var source = isFunction(serviceCreator) ? serviceCreator(context, _event.data, {
                  data: resolvedData,
                  src: invokeSource,
                  meta: activity.meta
                }) : serviceCreator;

                if (!source) {
                  // TODO: warn?
                  return;
                }

                var options = void 0;

                if (isMachine(source)) {
                  source = resolvedData ? source.withContext(resolvedData) : source;
                  options = {
                    autoForward: autoForward
                  };
                }

                _this.spawn(source, id, options);
              } else {
                _this.spawnActivity(activity);
              }

              break;
            }

          case stop$1:
            {
              _this.stopChild(action.activity.id);

              break;
            }

          case log:
            var _a = action,
                label = _a.label,
                value = _a.value;

            if (label) {
              _this.logger(label, value);
            } else {
              _this.logger(value);
            }

            break;

          default:
            {
              warn(false, "No implementation found for action type '".concat(action.type, "'"));
            }

            break;
        }
      };

      var resolvedOptions = __assign(__assign({}, Interpreter.defaultOptions), options);

      var clock = resolvedOptions.clock,
          logger = resolvedOptions.logger,
          parent = resolvedOptions.parent,
          id = resolvedOptions.id;
      var resolvedId = id !== undefined ? id : machine.id;
      this.id = resolvedId;
      this.logger = logger;
      this.clock = clock;
      this.parent = parent;
      this.options = resolvedOptions;
      this.scheduler = new Scheduler({
        deferEvents: this.options.deferEvents
      });
      this.sessionId = registry.bookId();
    }

    Object.defineProperty(Interpreter.prototype, "initialState", {
      get: function () {
        var _this = this;

        if (this._initialState) {
          return this._initialState;
        }

        return provide(this, function () {
          _this._initialState = _this.machine.initialState;
          return _this._initialState;
        });
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Interpreter.prototype, "state", {
      /**
       * @deprecated Use `.getSnapshot()` instead.
       */
      get: function () {
        {
          warn(this.status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '".concat(this.id, "'. Make sure the service is started first."));
        }

        return this._state;
      },
      enumerable: false,
      configurable: true
    });
    /**
     * Executes the actions of the given state, with that state's `context` and `event`.
     *
     * @param state The state whose actions will be executed
     * @param actionsConfig The action implementations to use
     */

    Interpreter.prototype.execute = function (state, actionsConfig) {
      var e_1, _a;

      try {
        for (var _b = __values(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
          var action = _c.value;
          this.exec(action, state, actionsConfig);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    };

    Interpreter.prototype.update = function (state, _event) {
      var e_2, _a, e_3, _b, e_4, _c, e_5, _d;

      var _this = this; // Attach session ID to state


      state._sessionid = this.sessionId; // Update state

      this._state = state; // Execute actions

      if ((!this.machine.config.predictableActionArguments || // this is currently required to execute initial actions as the `initialState` gets cached
      // we can't just recompute it (and execute actions while doing so) because we try to preserve identity of actors created within initial assigns
      _event === initEvent) && this.options.execute) {
        this.execute(this.state);
      } else {
        var item = void 0;

        while (item = this._outgoingQueue.shift()) {
          item[0].send(item[1]);
        }
      } // Update children


      this.children.forEach(function (child) {
        _this.state.children[child.id] = child;
      }); // Dev tools

      if (this.devTools) {
        this.devTools.send(_event.data, state);
      } // Execute listeners


      if (state.event) {
        try {
          for (var _e = __values(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
            var listener = _f.value;
            listener(state.event);
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }

      try {
        for (var _g = __values(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
          var listener = _h.value;
          listener(state, state.event);
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
        } finally {
          if (e_3) throw e_3.error;
        }
      }

      try {
        for (var _j = __values(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
          var contextListener = _k.value;
          contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
        } finally {
          if (e_4) throw e_4.error;
        }
      }

      if (this.state.done) {
        // get final child state node
        var finalChildStateNode = state.configuration.find(function (sn) {
          return sn.type === 'final' && sn.parent === _this.machine;
        });
        var doneData = finalChildStateNode && finalChildStateNode.doneData ? mapContext(finalChildStateNode.doneData, state.context, _event) : undefined;
        this._doneEvent = doneInvoke(this.id, doneData);

        try {
          for (var _l = __values(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
            var listener = _m.value;
            listener(this._doneEvent);
          }
        } catch (e_5_1) {
          e_5 = {
            error: e_5_1
          };
        } finally {
          try {
            if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
          } finally {
            if (e_5) throw e_5.error;
          }
        }

        this._stop();

        this._stopChildren();

        registry.free(this.sessionId);
      }
    };
    /*
     * Adds a listener that is notified whenever a state transition happens. The listener is called with
     * the next state and the event object that caused the state transition.
     *
     * @param listener The state listener
     */


    Interpreter.prototype.onTransition = function (listener) {
      this.listeners.add(listener); // Send current state to listener

      if (this.status === InterpreterStatus.Running) {
        listener(this.state, this.state.event);
      }

      return this;
    };

    Interpreter.prototype.subscribe = function (nextListenerOrObserver, _, // TODO: error listener
    completeListener) {
      var _this = this;

      var observer = toObserver(nextListenerOrObserver, _, completeListener);
      this.listeners.add(observer.next); // Send current state to listener

      if (this.status !== InterpreterStatus.NotStarted) {
        observer.next(this.state);
      }

      var completeOnce = function () {
        _this.doneListeners.delete(completeOnce);

        _this.stopListeners.delete(completeOnce);

        observer.complete();
      };

      if (this.status === InterpreterStatus.Stopped) {
        observer.complete();
      } else {
        this.onDone(completeOnce);
        this.onStop(completeOnce);
      }

      return {
        unsubscribe: function () {
          _this.listeners.delete(observer.next);

          _this.doneListeners.delete(completeOnce);

          _this.stopListeners.delete(completeOnce);
        }
      };
    };
    /**
     * Adds an event listener that is notified whenever an event is sent to the running interpreter.
     * @param listener The event listener
     */


    Interpreter.prototype.onEvent = function (listener) {
      this.eventListeners.add(listener);
      return this;
    };
    /**
     * Adds an event listener that is notified whenever a `send` event occurs.
     * @param listener The event listener
     */


    Interpreter.prototype.onSend = function (listener) {
      this.sendListeners.add(listener);
      return this;
    };
    /**
     * Adds a context listener that is notified whenever the state context changes.
     * @param listener The context listener
     */


    Interpreter.prototype.onChange = function (listener) {
      this.contextListeners.add(listener);
      return this;
    };
    /**
     * Adds a listener that is notified when the machine is stopped.
     * @param listener The listener
     */


    Interpreter.prototype.onStop = function (listener) {
      this.stopListeners.add(listener);
      return this;
    };
    /**
     * Adds a state listener that is notified when the statechart has reached its final state.
     * @param listener The state listener
     */


    Interpreter.prototype.onDone = function (listener) {
      if (this.status === InterpreterStatus.Stopped && this._doneEvent) {
        listener(this._doneEvent);
      } else {
        this.doneListeners.add(listener);
      }

      return this;
    };
    /**
     * Removes a listener.
     * @param listener The listener to remove
     */


    Interpreter.prototype.off = function (listener) {
      this.listeners.delete(listener);
      this.eventListeners.delete(listener);
      this.sendListeners.delete(listener);
      this.stopListeners.delete(listener);
      this.doneListeners.delete(listener);
      this.contextListeners.delete(listener);
      return this;
    };
    /**
     * Starts the interpreter from the given state, or the initial state.
     * @param initialState The state to start the statechart from
     */


    Interpreter.prototype.start = function (initialState) {
      var _this = this;

      if (this.status === InterpreterStatus.Running) {
        // Do not restart the service if it is already started
        return this;
      } // yes, it's a hack but we need the related cache to be populated for some things to work (like delayed transitions)
      // this is usually called by `machine.getInitialState` but if we rehydrate from a state we might bypass this call
      // we also don't want to call this method here as it resolves the full initial state which might involve calling assign actions
      // and that could potentially lead to some unwanted side-effects (even such as creating some rogue actors)


      this.machine._init();

      registry.register(this.sessionId, this);
      this.initialized = true;
      this.status = InterpreterStatus.Running;
      var resolvedState = initialState === undefined ? this.initialState : provide(this, function () {
        return isStateConfig(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(State.from(initialState, _this.machine.context));
      });

      if (this.options.devTools) {
        this.attachDev();
      }

      this.scheduler.initialize(function () {
        _this.update(resolvedState, initEvent);
      });
      return this;
    };

    Interpreter.prototype._stopChildren = function () {
      // TODO: think about converting those to actions
      this.children.forEach(function (child) {
        if (isFunction(child.stop)) {
          child.stop();
        }
      });
      this.children.clear();
    };

    Interpreter.prototype._stop = function () {
      var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

      try {
        for (var _f = __values(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
          var listener = _g.value;
          this.listeners.delete(listener);
        }
      } catch (e_6_1) {
        e_6 = {
          error: e_6_1
        };
      } finally {
        try {
          if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
        } finally {
          if (e_6) throw e_6.error;
        }
      }

      try {
        for (var _h = __values(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
          var listener = _j.value; // call listener, then remove

          listener();
          this.stopListeners.delete(listener);
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
        } finally {
          if (e_7) throw e_7.error;
        }
      }

      try {
        for (var _k = __values(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
          var listener = _l.value;
          this.contextListeners.delete(listener);
        }
      } catch (e_8_1) {
        e_8 = {
          error: e_8_1
        };
      } finally {
        try {
          if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
        } finally {
          if (e_8) throw e_8.error;
        }
      }

      try {
        for (var _m = __values(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
          var listener = _o.value;
          this.doneListeners.delete(listener);
        }
      } catch (e_9_1) {
        e_9 = {
          error: e_9_1
        };
      } finally {
        try {
          if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
        } finally {
          if (e_9) throw e_9.error;
        }
      }

      if (!this.initialized) {
        // Interpreter already stopped; do nothing
        return this;
      }

      this.initialized = false;
      this.status = InterpreterStatus.Stopped;
      this._initialState = undefined;

      try {
        // we are going to stop within the current sync frame
        // so we can safely just cancel this here as nothing async should be fired anyway
        for (var _p = __values(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
          var key = _q.value;
          this.clock.clearTimeout(this.delayedEventsMap[key]);
        }
      } catch (e_10_1) {
        e_10 = {
          error: e_10_1
        };
      } finally {
        try {
          if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
        } finally {
          if (e_10) throw e_10.error;
        }
      } // clear everything that might be enqueued


      this.scheduler.clear();
      this.scheduler = new Scheduler({
        deferEvents: this.options.deferEvents
      });
    };
    /**
     * Stops the interpreter and unsubscribe all listeners.
     *
     * This will also notify the `onStop` listeners.
     */


    Interpreter.prototype.stop = function () {
      // TODO: add warning for stopping non-root interpreters
      var _this = this; // grab the current scheduler as it will be replaced in _stop


      var scheduler = this.scheduler;

      this._stop(); // let what is currently processed to be finished


      scheduler.schedule(function () {
        // it feels weird to handle this here but we need to handle this even slightly "out of band"
        var _event = toSCXMLEvent({
          type: 'xstate.stop'
        });

        var nextState = provide(_this, function () {
          var exitActions = flatten(__spreadArray([], __read(_this.state.configuration), false).sort(function (a, b) {
            return b.order - a.order;
          }).map(function (stateNode) {
            return toActionObjects(stateNode.onExit, _this.machine.options.actions);
          }));

          var _a = __read(resolveActions(_this.machine, _this.state, _this.state.context, _event, [{
            type: 'exit',
            actions: exitActions
          }], _this.machine.config.predictableActionArguments ? _this._exec : undefined, _this.machine.config.predictableActionArguments || _this.machine.config.preserveActionOrder), 2),
              resolvedActions = _a[0],
              updatedContext = _a[1];

          var newState = new State({
            value: _this.state.value,
            context: updatedContext,
            _event: _event,
            _sessionid: _this.sessionId,
            historyValue: undefined,
            history: _this.state,
            actions: resolvedActions.filter(function (action) {
              return !isRaisableAction(action);
            }),
            activities: {},
            events: [],
            configuration: [],
            transitions: [],
            children: {},
            done: _this.state.done,
            tags: _this.state.tags,
            machine: _this.machine
          });
          newState.changed = true;
          return newState;
        });

        _this.update(nextState, _event);

        _this._stopChildren();

        registry.free(_this.sessionId);
      });
      return this;
    };

    Interpreter.prototype.batch = function (events) {
      var _this = this;

      if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) {
        // tslint:disable-next-line:no-console
        {
          warn(false, "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\" and are deferred. Make sure .start() is called for this service.\nEvent: ").concat(JSON.stringify(event)));
        }
      } else if (this.status !== InterpreterStatus.Running) {
        throw new Error( // tslint:disable-next-line:max-line-length
        "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options."));
      }

      if (!events.length) {
        return;
      }

      var exec = !!this.machine.config.predictableActionArguments && this._exec;
      this.scheduler.schedule(function () {
        var e_11, _a;

        var nextState = _this.state;
        var batchChanged = false;
        var batchedActions = [];

        var _loop_1 = function (event_1) {
          var _event = toSCXMLEvent(event_1);

          _this.forward(_event);

          nextState = provide(_this, function () {
            return _this.machine.transition(nextState, _event, undefined, exec || undefined);
          });
          batchedActions.push.apply(batchedActions, __spreadArray([], __read(_this.machine.config.predictableActionArguments ? nextState.actions : nextState.actions.map(function (a) {
            return bindActionToState(a, nextState);
          })), false));
          batchChanged = batchChanged || !!nextState.changed;
        };

        try {
          for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
            var event_1 = events_1_1.value;

            _loop_1(event_1);
          }
        } catch (e_11_1) {
          e_11 = {
            error: e_11_1
          };
        } finally {
          try {
            if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
          } finally {
            if (e_11) throw e_11.error;
          }
        }

        nextState.changed = batchChanged;
        nextState.actions = batchedActions;

        _this.update(nextState, toSCXMLEvent(events[events.length - 1]));
      });
    };
    /**
     * Returns a send function bound to this interpreter instance.
     *
     * @param event The event to be sent by the sender.
     */


    Interpreter.prototype.sender = function (event) {
      return this.send.bind(this, event);
    };

    Interpreter.prototype._nextState = function (event, exec) {
      var _this = this;

      if (exec === void 0) {
        exec = !!this.machine.config.predictableActionArguments && this._exec;
      }

      var _event = toSCXMLEvent(event);

      if (_event.name.indexOf(errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
        return nextEvent.indexOf(errorPlatform) === 0;
      })) {
        throw _event.data.data;
      }

      var nextState = provide(this, function () {
        return _this.machine.transition(_this.state, _event, undefined, exec || undefined);
      });
      return nextState;
    };
    /**
     * Returns the next state given the interpreter's current state and the event.
     *
     * This is a pure method that does _not_ update the interpreter's state.
     *
     * @param event The event to determine the next state
     */


    Interpreter.prototype.nextState = function (event) {
      return this._nextState(event, false);
    };

    Interpreter.prototype.forward = function (event) {
      var e_12, _a;

      try {
        for (var _b = __values(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
          var id = _c.value;
          var child = this.children.get(id);

          if (!child) {
            throw new Error("Unable to forward event '".concat(event, "' from interpreter '").concat(this.id, "' to nonexistant child '").concat(id, "'."));
          }

          child.send(event);
        }
      } catch (e_12_1) {
        e_12 = {
          error: e_12_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_12) throw e_12.error;
        }
      }
    };

    Interpreter.prototype.defer = function (sendAction) {
      var _this = this;

      var timerId = this.clock.setTimeout(function () {
        if ('to' in sendAction && sendAction.to) {
          _this.sendTo(sendAction._event, sendAction.to, true);
        } else {
          _this.send(sendAction._event);
        }
      }, sendAction.delay);

      if (sendAction.id) {
        this.delayedEventsMap[sendAction.id] = timerId;
      }
    };

    Interpreter.prototype.cancel = function (sendId) {
      this.clock.clearTimeout(this.delayedEventsMap[sendId]);
      delete this.delayedEventsMap[sendId];
    };

    Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
      if (actionFunctionMap === void 0) {
        actionFunctionMap = this.machine.options.actions;
      }

      this._exec(action, state.context, state._event, actionFunctionMap);
    };

    Interpreter.prototype.removeChild = function (childId) {
      var _a;

      this.children.delete(childId);
      this.forwardTo.delete(childId); // this.state might not exist at the time this is called,
      // such as when a child is added then removed while initializing the state

      (_a = this.state) === null || _a === void 0 ? true : delete _a.children[childId];
    };

    Interpreter.prototype.stopChild = function (childId) {
      var child = this.children.get(childId);

      if (!child) {
        return;
      }

      this.removeChild(childId);

      if (isFunction(child.stop)) {
        child.stop();
      }
    };

    Interpreter.prototype.spawn = function (entity, name, options) {
      if (this.status !== InterpreterStatus.Running) {
        return createDeferredActor(entity, name);
      }

      if (isPromiseLike(entity)) {
        return this.spawnPromise(Promise.resolve(entity), name);
      } else if (isFunction(entity)) {
        return this.spawnCallback(entity, name);
      } else if (isSpawnedActor(entity)) {
        return this.spawnActor(entity, name);
      } else if (isObservable(entity)) {
        return this.spawnObservable(entity, name);
      } else if (isMachine(entity)) {
        return this.spawnMachine(entity, __assign(__assign({}, options), {
          id: name
        }));
      } else if (isBehavior(entity)) {
        return this.spawnBehavior(entity, name);
      } else {
        throw new Error("Unable to spawn entity \"".concat(name, "\" of type \"").concat(typeof entity, "\"."));
      }
    };

    Interpreter.prototype.spawnMachine = function (machine, options) {
      var _this = this;

      if (options === void 0) {
        options = {};
      }

      var childService = new Interpreter(machine, __assign(__assign({}, this.options), {
        parent: this,
        id: options.id || machine.id
      }));

      var resolvedOptions = __assign(__assign({}, DEFAULT_SPAWN_OPTIONS), options);

      if (resolvedOptions.sync) {
        childService.onTransition(function (state) {
          _this.send(update, {
            state: state,
            id: childService.id
          });
        });
      }

      var actor = childService;
      this.children.set(childService.id, actor);

      if (resolvedOptions.autoForward) {
        this.forwardTo.add(childService.id);
      }

      childService.onDone(function (doneEvent) {
        _this.removeChild(childService.id);

        _this.send(toSCXMLEvent(doneEvent, {
          origin: childService.id
        }));
      }).start();
      return actor;
    };

    Interpreter.prototype.spawnBehavior = function (behavior, id) {
      var actorRef = spawnBehavior(behavior, {
        id: id,
        parent: this
      });
      this.children.set(id, actorRef);
      return actorRef;
    };

    Interpreter.prototype.spawnPromise = function (promise, id) {
      var _a;

      var _this = this;

      var canceled = false;
      var resolvedData;
      promise.then(function (response) {
        if (!canceled) {
          resolvedData = response;

          _this.removeChild(id);

          _this.send(toSCXMLEvent(doneInvoke(id, response), {
            origin: id
          }));
        }
      }, function (errorData) {
        if (!canceled) {
          _this.removeChild(id);

          var errorEvent = error(id, errorData);

          try {
            // Send "error.platform.id" to this (parent).
            _this.send(toSCXMLEvent(errorEvent, {
              origin: id
            }));
          } catch (error) {
            reportUnhandledExceptionOnInvocation(errorData, error, id);

            if (_this.devTools) {
              _this.devTools.send(errorEvent, _this.state);
            }

            if (_this.machine.strict) {
              // it would be better to always stop the state machine if unhandled
              // exception/promise rejection happens but because we don't want to
              // break existing code so enforce it on strict mode only especially so
              // because documentation says that onError is optional
              _this.stop();
            }
          }
        }
      });
      var actor = (_a = {
        id: id,
        send: function () {
          return void 0;
        },
        subscribe: function (next, handleError, complete) {
          var observer = toObserver(next, handleError, complete);
          var unsubscribed = false;
          promise.then(function (response) {
            if (unsubscribed) {
              return;
            }

            observer.next(response);

            if (unsubscribed) {
              return;
            }

            observer.complete();
          }, function (err) {
            if (unsubscribed) {
              return;
            }

            observer.error(err);
          });
          return {
            unsubscribe: function () {
              return unsubscribed = true;
            }
          };
        },
        stop: function () {
          canceled = true;
        },
        toJSON: function () {
          return {
            id: id
          };
        },
        getSnapshot: function () {
          return resolvedData;
        }
      }, _a[symbolObservable] = function () {
        return this;
      }, _a);
      this.children.set(id, actor);
      return actor;
    };

    Interpreter.prototype.spawnCallback = function (callback, id) {
      var _a;

      var _this = this;

      var canceled = false;
      var receivers = new Set();
      var listeners = new Set();
      var emitted;

      var receive = function (e) {
        emitted = e;
        listeners.forEach(function (listener) {
          return listener(e);
        });

        if (canceled) {
          return;
        }

        _this.send(toSCXMLEvent(e, {
          origin: id
        }));
      };

      var callbackStop;

      try {
        callbackStop = callback(receive, function (newListener) {
          receivers.add(newListener);
        });
      } catch (err) {
        this.send(error(id, err));
      }

      if (isPromiseLike(callbackStop)) {
        // it turned out to be an async function, can't reliably check this before calling `callback`
        // because transpiled async functions are not recognizable
        return this.spawnPromise(callbackStop, id);
      }

      var actor = (_a = {
        id: id,
        send: function (event) {
          return receivers.forEach(function (receiver) {
            return receiver(event);
          });
        },
        subscribe: function (next) {
          var observer = toObserver(next);
          listeners.add(observer.next);
          return {
            unsubscribe: function () {
              listeners.delete(observer.next);
            }
          };
        },
        stop: function () {
          canceled = true;

          if (isFunction(callbackStop)) {
            callbackStop();
          }
        },
        toJSON: function () {
          return {
            id: id
          };
        },
        getSnapshot: function () {
          return emitted;
        }
      }, _a[symbolObservable] = function () {
        return this;
      }, _a);
      this.children.set(id, actor);
      return actor;
    };

    Interpreter.prototype.spawnObservable = function (source, id) {
      var _a;

      var _this = this;

      var emitted;
      var subscription = source.subscribe(function (value) {
        emitted = value;

        _this.send(toSCXMLEvent(value, {
          origin: id
        }));
      }, function (err) {
        _this.removeChild(id);

        _this.send(toSCXMLEvent(error(id, err), {
          origin: id
        }));
      }, function () {
        _this.removeChild(id);

        _this.send(toSCXMLEvent(doneInvoke(id), {
          origin: id
        }));
      });
      var actor = (_a = {
        id: id,
        send: function () {
          return void 0;
        },
        subscribe: function (next, handleError, complete) {
          return source.subscribe(next, handleError, complete);
        },
        stop: function () {
          return subscription.unsubscribe();
        },
        getSnapshot: function () {
          return emitted;
        },
        toJSON: function () {
          return {
            id: id
          };
        }
      }, _a[symbolObservable] = function () {
        return this;
      }, _a);
      this.children.set(id, actor);
      return actor;
    };

    Interpreter.prototype.spawnActor = function (actor, name) {
      this.children.set(name, actor);
      return actor;
    };

    Interpreter.prototype.spawnActivity = function (activity) {
      var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : undefined;

      if (!implementation) {
        {
          warn(false, "No implementation found for activity '".concat(activity.type, "'"));
        } // tslint:disable-next-line:no-console


        return;
      } // Start implementation


      var dispose = implementation(this.state.context, activity);
      this.spawnEffect(activity.id, dispose);
    };

    Interpreter.prototype.spawnEffect = function (id, dispose) {
      var _a;

      this.children.set(id, (_a = {
        id: id,
        send: function () {
          return void 0;
        },
        subscribe: function () {
          return {
            unsubscribe: function () {
              return void 0;
            }
          };
        },
        stop: dispose || undefined,
        getSnapshot: function () {
          return undefined;
        },
        toJSON: function () {
          return {
            id: id
          };
        }
      }, _a[symbolObservable] = function () {
        return this;
      }, _a));
    };

    Interpreter.prototype.attachDev = function () {
      var global = getGlobal();

      if (this.options.devTools && global) {
        if (global.__REDUX_DEVTOOLS_EXTENSION__) {
          var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
          this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect(__assign(__assign({
            name: this.id,
            autoPause: true,
            stateSanitizer: function (state) {
              return {
                value: state.value,
                context: state.context,
                actions: state.actions
              };
            }
          }, devToolsOptions), {
            features: __assign({
              jump: false,
              skip: false
            }, devToolsOptions ? devToolsOptions.features : undefined)
          }), this.machine);
          this.devTools.init(this.state);
        } // add XState-specific dev tooling hook


        registerService(this);
      }
    };

    Interpreter.prototype.toJSON = function () {
      return {
        id: this.id
      };
    };

    Interpreter.prototype[symbolObservable] = function () {
      return this;
    };

    Interpreter.prototype.getSnapshot = function () {
      if (this.status === InterpreterStatus.NotStarted) {
        return this.initialState;
      }

      return this._state;
    };
    /**
     * The default interpreter options:
     *
     * - `clock` uses the global `setTimeout` and `clearTimeout` functions
     * - `logger` uses the global `console.log()` method
     */


    Interpreter.defaultOptions = {
      execute: true,
      deferEvents: true,
      clock: {
        setTimeout: function (fn, ms) {
          return setTimeout(fn, ms);
        },
        clearTimeout: function (id) {
          return clearTimeout(id);
        }
      },
      logger: /*#__PURE__*/console.log.bind(console),
      devTools: false
    };
    Interpreter.interpret = interpret;
    return Interpreter;
  }();
  /**
   * Creates a new Interpreter instance for the given machine with the provided options, if any.
   *
   * @param machine The machine to interpret
   * @param options Interpreter options
   */

  function interpret(machine, options) {
    var interpreter = new Interpreter(machine, options);
    return interpreter;
  }

  function toInvokeSource(src) {
    if (typeof src === 'string') {
      var simpleSrc = {
        type: src
      };

      simpleSrc.toString = function () {
        return src;
      }; // v4 compat - TODO: remove in v5


      return simpleSrc;
    }

    return src;
  }
  function toInvokeDefinition(invokeConfig) {
    return __assign(__assign({
      type: invoke
    }, invokeConfig), {
      toJSON: function () {
        invokeConfig.onDone;
            invokeConfig.onError;
            var invokeDef = __rest(invokeConfig, ["onDone", "onError"]);

        return __assign(__assign({}, invokeDef), {
          type: invoke,
          src: toInvokeSource(invokeConfig.src)
        });
      }
    });
  }

  var NULL_EVENT = '';
  var STATE_IDENTIFIER = '#';
  var WILDCARD = '*';
  var EMPTY_OBJECT = {};

  var isStateId = function (str) {
    return str[0] === STATE_IDENTIFIER;
  };

  var createDefaultOptions = function () {
    return {
      actions: {},
      guards: {},
      services: {},
      activities: {},
      delays: {}
    };
  };

  var validateArrayifiedTransitions = function (stateNode, event, transitions) {
    var hasNonLastUnguardedTarget = transitions.slice(0, -1).some(function (transition) {
      return !('cond' in transition) && !('in' in transition) && (isString(transition.target) || isMachine(transition.target));
    });
    var eventText = event === NULL_EVENT ? 'the transient event' : "event '".concat(event, "'");
    warn(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
  };

  var StateNode =
  /*#__PURE__*/

  /** @class */
  function () {
    function StateNode(
    /**
     * The raw config used to create the machine.
     */
    config, options,
    /**
     * The initial extended state
     */
    _context, // TODO: this is unsafe, but we're removing it in v5 anyway
    _stateInfo) {
      if (_context === void 0) {
        _context = 'context' in config ? config.context : undefined;
      }

      var _this = this;

      var _a;

      this.config = config;
      this._context = _context;
      /**
       * The order this state node appears. Corresponds to the implicit SCXML document order.
       */

      this.order = -1;
      this.__xstatenode = true;
      this.__cache = {
        events: undefined,
        relativeValue: new Map(),
        initialStateValue: undefined,
        initialState: undefined,
        on: undefined,
        transitions: undefined,
        candidates: {},
        delayedTransitions: undefined
      };
      this.idMap = {};
      this.tags = [];
      this.options = Object.assign(createDefaultOptions(), options);
      this.parent = _stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.parent;
      this.key = this.config.key || (_stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.key) || this.config.id || '(machine)';
      this.machine = this.parent ? this.parent.machine : this;
      this.path = this.parent ? this.parent.path.concat(this.key) : [];
      this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : STATE_DELIMITER);
      this.id = this.config.id || __spreadArray([this.machine.key], __read(this.path), false).join(this.delimiter);
      this.version = this.parent ? this.parent.version : this.config.version;
      this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
      this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};
      this.description = this.config.description;

      {
        warn(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. ".concat(this.config.parallel ? "Replace with `type: 'parallel'`" : "Use `type: '".concat(this.type, "'`"), " in the config for state node '").concat(this.id, "' instead."));
      }

      this.initial = this.config.initial;
      this.states = this.config.states ? mapValues(this.config.states, function (stateConfig, key) {
        var _a;

        var stateNode = new StateNode(stateConfig, {}, undefined, {
          parent: _this,
          key: key
        });
        Object.assign(_this.idMap, __assign((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
        return stateNode;
      }) : EMPTY_OBJECT; // Document order

      var order = 0;

      function dfs(stateNode) {
        var e_1, _a;

        stateNode.order = order++;

        try {
          for (var _b = __values(getAllChildren(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            dfs(child);
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }

      dfs(this); // History config

      this.history = this.config.history === true ? 'shallow' : this.config.history || false;
      this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function (_a) {
        var event = _a.event;
        return event === NULL_EVENT;
      }) : NULL_EVENT in this.config.on);
      this.strict = !!this.config.strict; // TODO: deprecate (entry)

      this.onEntry = toArray(this.config.entry || this.config.onEntry).map(function (action) {
        return toActionObject(action);
      }); // TODO: deprecate (exit)

      this.onExit = toArray(this.config.exit || this.config.onExit).map(function (action) {
        return toActionObject(action);
      });
      this.meta = this.config.meta;
      this.doneData = this.type === 'final' ? this.config.data : undefined;
      this.invoke = toArray(this.config.invoke).map(function (invokeConfig, i) {
        var _a, _b;

        if (isMachine(invokeConfig)) {
          var invokeId = createInvokeId(_this.id, i);
          _this.machine.options.services = __assign((_a = {}, _a[invokeId] = invokeConfig, _a), _this.machine.options.services);
          return toInvokeDefinition({
            src: invokeId,
            id: invokeId
          });
        } else if (isString(invokeConfig.src)) {
          var invokeId = invokeConfig.id || createInvokeId(_this.id, i);
          return toInvokeDefinition(__assign(__assign({}, invokeConfig), {
            id: invokeId,
            src: invokeConfig.src
          }));
        } else if (isMachine(invokeConfig.src) || isFunction(invokeConfig.src)) {
          var invokeId = invokeConfig.id || createInvokeId(_this.id, i);
          _this.machine.options.services = __assign((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
          return toInvokeDefinition(__assign(__assign({
            id: invokeId
          }, invokeConfig), {
            src: invokeId
          }));
        } else {
          var invokeSource = invokeConfig.src;
          return toInvokeDefinition(__assign(__assign({
            id: createInvokeId(_this.id, i)
          }, invokeConfig), {
            src: invokeSource
          }));
        }
      });
      this.activities = toArray(this.config.activities).concat(this.invoke).map(function (activity) {
        return toActivityDefinition(activity);
      });
      this.transition = this.transition.bind(this);
      this.tags = toArray(this.config.tags); // TODO: this is the real fix for initialization once
      // state node getters are deprecated
      // if (!this.parent) {
      //   this._init();
      // }
    }

    StateNode.prototype._init = function () {
      if (this.__cache.transitions) {
        return;
      }

      getAllStateNodes(this).forEach(function (stateNode) {
        return stateNode.on;
      });
    };
    /**
     * Clones this state machine with custom options and context.
     *
     * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
     * @param context Custom context (will override predefined context)
     */


    StateNode.prototype.withConfig = function (options, context) {
      var _a = this.options,
          actions = _a.actions,
          activities = _a.activities,
          guards = _a.guards,
          services = _a.services,
          delays = _a.delays;
      return new StateNode(this.config, {
        actions: __assign(__assign({}, actions), options.actions),
        activities: __assign(__assign({}, activities), options.activities),
        guards: __assign(__assign({}, guards), options.guards),
        services: __assign(__assign({}, services), options.services),
        delays: __assign(__assign({}, delays), options.delays)
      }, context !== null && context !== void 0 ? context : this.context);
    };
    /**
     * Clones this state machine with custom context.
     *
     * @param context Custom context (will override predefined context, not recursive)
     */


    StateNode.prototype.withContext = function (context) {
      return new StateNode(this.config, this.options, context);
    };

    Object.defineProperty(StateNode.prototype, "context", {
      get: function () {
        return isFunction(this._context) ? this._context() : this._context;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(StateNode.prototype, "definition", {
      /**
       * The well-structured state node definition.
       */
      get: function () {
        return {
          id: this.id,
          key: this.key,
          version: this.version,
          context: this.context,
          type: this.type,
          initial: this.initial,
          history: this.history,
          states: mapValues(this.states, function (state) {
            return state.definition;
          }),
          on: this.on,
          transitions: this.transitions,
          entry: this.onEntry,
          exit: this.onExit,
          activities: this.activities || [],
          meta: this.meta,
          order: this.order || -1,
          data: this.doneData,
          invoke: this.invoke,
          description: this.description,
          tags: this.tags
        };
      },
      enumerable: false,
      configurable: true
    });

    StateNode.prototype.toJSON = function () {
      return this.definition;
    };

    Object.defineProperty(StateNode.prototype, "on", {
      /**
       * The mapping of events to transitions.
       */
      get: function () {
        if (this.__cache.on) {
          return this.__cache.on;
        }

        var transitions = this.transitions;
        return this.__cache.on = transitions.reduce(function (map, transition) {
          map[transition.eventType] = map[transition.eventType] || [];
          map[transition.eventType].push(transition);
          return map;
        }, {});
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(StateNode.prototype, "after", {
      get: function () {
        return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(StateNode.prototype, "transitions", {
      /**
       * All the transitions that can be taken from this state node.
       */
      get: function () {
        return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
      },
      enumerable: false,
      configurable: true
    });

    StateNode.prototype.getCandidates = function (eventName) {
      if (this.__cache.candidates[eventName]) {
        return this.__cache.candidates[eventName];
      }

      var transient = eventName === NULL_EVENT;
      var candidates = this.transitions.filter(function (transition) {
        var sameEventType = transition.eventType === eventName; // null events should only match against eventless transitions

        return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
      });
      this.__cache.candidates[eventName] = candidates;
      return candidates;
    };
    /**
     * All delayed transitions from the config.
     */


    StateNode.prototype.getDelayedTransitions = function () {
      var _this = this;

      var afterConfig = this.config.after;

      if (!afterConfig) {
        return [];
      }

      var mutateEntryExit = function (delay, i) {
        var delayRef = isFunction(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
        var eventType = after(delayRef, _this.id);

        _this.onEntry.push(send(eventType, {
          delay: delay
        }));

        _this.onExit.push(cancel(eventType));

        return eventType;
      };

      var delayedTransitions = isArray(afterConfig) ? afterConfig.map(function (transition, i) {
        var eventType = mutateEntryExit(transition.delay, i);
        return __assign(__assign({}, transition), {
          event: eventType
        });
      }) : flatten(Object.keys(afterConfig).map(function (delay, i) {
        var configTransition = afterConfig[delay];
        var resolvedTransition = isString(configTransition) ? {
          target: configTransition
        } : configTransition;
        var resolvedDelay = !isNaN(+delay) ? +delay : delay;
        var eventType = mutateEntryExit(resolvedDelay, i);
        return toArray(resolvedTransition).map(function (transition) {
          return __assign(__assign({}, transition), {
            event: eventType,
            delay: resolvedDelay
          });
        });
      }));
      return delayedTransitions.map(function (delayedTransition) {
        var delay = delayedTransition.delay;
        return __assign(__assign({}, _this.formatTransition(delayedTransition)), {
          delay: delay
        });
      });
    };
    /**
     * Returns the state nodes represented by the current state value.
     *
     * @param state The state value or State instance
     */


    StateNode.prototype.getStateNodes = function (state) {
      var _a;

      var _this = this;

      if (!state) {
        return [];
      }

      var stateValue = state instanceof State ? state.value : toStateValue(state, this.delimiter);

      if (isString(stateValue)) {
        var initialStateValue = this.getStateNode(stateValue).initial;
        return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
      }

      var subStateKeys = Object.keys(stateValue);
      var subStateNodes = [this];
      subStateNodes.push.apply(subStateNodes, __spreadArray([], __read(flatten(subStateKeys.map(function (subStateKey) {
        return _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
      }))), false));
      return subStateNodes;
    };
    /**
     * Returns `true` if this state node explicitly handles the given event.
     *
     * @param event The event in question
     */


    StateNode.prototype.handles = function (event) {
      var eventType = getEventType(event);
      return this.events.includes(eventType);
    };
    /**
     * Resolves the given `state` to a new `State` instance relative to this machine.
     *
     * This ensures that `.events` and `.nextEvents` represent the correct values.
     *
     * @param state The state to resolve
     */


    StateNode.prototype.resolveState = function (state) {
      var stateFromConfig = state instanceof State ? state : State.create(state);
      var configuration = Array.from(getConfiguration([], this.getStateNodes(stateFromConfig.value)));
      return new State(__assign(__assign({}, stateFromConfig), {
        value: this.resolve(stateFromConfig.value),
        configuration: configuration,
        done: isInFinalState(configuration, this),
        tags: getTagsFromConfiguration(configuration),
        machine: this.machine
      }));
    };

    StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
      var stateNode = this.getStateNode(stateValue);
      var next = stateNode.next(state, _event);

      if (!next || !next.transitions.length) {
        return this.next(state, _event);
      }

      return next;
    };

    StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
      var subStateKeys = Object.keys(stateValue);
      var stateNode = this.getStateNode(subStateKeys[0]);

      var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);

      if (!next || !next.transitions.length) {
        return this.next(state, _event);
      }

      return next;
    };

    StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
      var e_2, _a;

      var transitionMap = {};

      try {
        for (var _b = __values(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var subStateKey = _c.value;
          var subStateValue = stateValue[subStateKey];

          if (!subStateValue) {
            continue;
          }

          var subStateNode = this.getStateNode(subStateKey);

          var next = subStateNode._transition(subStateValue, state, _event);

          if (next) {
            transitionMap[subStateKey] = next;
          }
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_2) throw e_2.error;
        }
      }

      var stateTransitions = Object.keys(transitionMap).map(function (key) {
        return transitionMap[key];
      });
      var enabledTransitions = flatten(stateTransitions.map(function (st) {
        return st.transitions;
      }));
      var willTransition = stateTransitions.some(function (st) {
        return st.transitions.length > 0;
      });

      if (!willTransition) {
        return this.next(state, _event);
      }

      var configuration = flatten(Object.keys(transitionMap).map(function (key) {
        return transitionMap[key].configuration;
      }));
      return {
        transitions: enabledTransitions,
        exitSet: flatten(stateTransitions.map(function (t) {
          return t.exitSet;
        })),
        configuration: configuration,
        source: state,
        actions: flatten(Object.keys(transitionMap).map(function (key) {
          return transitionMap[key].actions;
        }))
      };
    };

    StateNode.prototype._transition = function (stateValue, state, _event) {
      // leaf node
      if (isString(stateValue)) {
        return this.transitionLeafNode(stateValue, state, _event);
      } // hierarchical node


      if (Object.keys(stateValue).length === 1) {
        return this.transitionCompoundNode(stateValue, state, _event);
      } // orthogonal node


      return this.transitionParallelNode(stateValue, state, _event);
    };

    StateNode.prototype.getTransitionData = function (state, event) {
      return this._transition(state.value, state, toSCXMLEvent(event));
    };

    StateNode.prototype.next = function (state, _event) {
      var e_3, _a;

      var _this = this;

      var eventName = _event.name;
      var actions = [];
      var nextStateNodes = [];
      var selectedTransition;

      try {
        for (var _b = __values(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var candidate = _c.value;
          var cond = candidate.cond,
              stateIn = candidate.in;
          var resolvedContext = state.context;
          var isInState = stateIn ? isString(stateIn) && isStateId(stateIn) ? // Check if in state by ID
          state.matches(toStateValue(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
          matchesState(toStateValue(stateIn, this.delimiter), path(this.path.slice(0, -2))(state.value)) : true;
          var guardPassed = false;

          try {
            guardPassed = !cond || evaluateGuard(this.machine, cond, resolvedContext, _event, state);
          } catch (err) {
            throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
          }

          if (guardPassed && isInState) {
            if (candidate.target !== undefined) {
              nextStateNodes = candidate.target;
            }

            actions.push.apply(actions, __spreadArray([], __read(candidate.actions), false));
            selectedTransition = candidate;
            break;
          }
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_3) throw e_3.error;
        }
      }

      if (!selectedTransition) {
        return undefined;
      }

      if (!nextStateNodes.length) {
        return {
          transitions: [selectedTransition],
          exitSet: [],
          configuration: state.value ? [this] : [],
          source: state,
          actions: actions
        };
      }

      var allNextStateNodes = flatten(nextStateNodes.map(function (stateNode) {
        return _this.getRelativeStateNodes(stateNode, state.historyValue);
      }));
      var isInternal = !!selectedTransition.internal;
      return {
        transitions: [selectedTransition],
        exitSet: isInternal ? [] : flatten(nextStateNodes.map(function (targetNode) {
          return _this.getPotentiallyReenteringNodes(targetNode);
        })),
        configuration: allNextStateNodes,
        source: state,
        actions: actions
      };
    }; // even though the name of this function mentions reentry nodes
    // we are pushing its result into `exitSet`
    // that's because what we exit might be reentered (it's an invariant of reentrancy)


    StateNode.prototype.getPotentiallyReenteringNodes = function (targetNode) {
      if (this.order < targetNode.order) {
        return [this];
      }

      var nodes = [];
      var marker = this;
      var possibleAncestor = targetNode;

      while (marker && marker !== possibleAncestor) {
        nodes.push(marker);
        marker = marker.parent;
      }

      if (marker !== possibleAncestor) {
        // we never got to `possibleAncestor`, therefore the initial `marker` "escapes" it
        // it's in a different part of the tree so no states will be reentered for such an external transition
        return [];
      }

      nodes.push(possibleAncestor);
      return nodes;
    };

    StateNode.prototype.getActions = function (resolvedConfig, isDone, transition, currentContext, _event, prevState, predictableExec) {
      var e_4, _a, e_5, _b;

      var _this = this;

      var prevConfig = prevState ? getConfiguration([], this.getStateNodes(prevState.value)) : [];
      var entrySet = new Set();

      try {
        for (var _c = __values(Array.from(resolvedConfig).sort(function (a, b) {
          return a.order - b.order;
        })), _d = _c.next(); !_d.done; _d = _c.next()) {
          var sn = _d.value;

          if (!has(prevConfig, sn) || has(transition.exitSet, sn) || sn.parent && entrySet.has(sn.parent)) {
            entrySet.add(sn);
          }
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        } finally {
          if (e_4) throw e_4.error;
        }
      }

      try {
        for (var prevConfig_1 = __values(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
          var sn = prevConfig_1_1.value;

          if (!has(resolvedConfig, sn) || has(transition.exitSet, sn.parent)) {
            transition.exitSet.push(sn);
          }
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      transition.exitSet.sort(function (a, b) {
        return b.order - a.order;
      });
      var entryStates = Array.from(entrySet).sort(function (a, b) {
        return a.order - b.order;
      });
      var exitStates = new Set(transition.exitSet);
      var doneEvents = flatten(entryStates.map(function (sn) {
        var events = [];

        if (sn.type !== 'final') {
          return events;
        }

        var parent = sn.parent;

        if (!parent.parent) {
          return events;
        }

        events.push(done(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
        done(parent.id, sn.doneData ? mapContext(sn.doneData, currentContext, _event) : undefined));
        var grandparent = parent.parent;

        if (grandparent.type === 'parallel') {
          if (getChildren(grandparent).every(function (parentNode) {
            return isInFinalState(transition.configuration, parentNode);
          })) {
            events.push(done(grandparent.id));
          }
        }

        return events;
      }));
      var entryActions = entryStates.map(function (stateNode) {
        var entryActions = stateNode.onEntry;
        var invokeActions = stateNode.activities.map(function (activity) {
          return start(activity);
        });
        return {
          type: 'entry',
          actions: toActionObjects(predictableExec ? __spreadArray(__spreadArray([], __read(entryActions), false), __read(invokeActions), false) : __spreadArray(__spreadArray([], __read(invokeActions), false), __read(entryActions), false), _this.machine.options.actions)
        };
      }).concat({
        type: 'state_done',
        actions: doneEvents.map(function (event) {
          return raise(event);
        })
      });
      var exitActions = Array.from(exitStates).map(function (stateNode) {
        return {
          type: 'exit',
          actions: toActionObjects(__spreadArray(__spreadArray([], __read(stateNode.onExit), false), __read(stateNode.activities.map(function (activity) {
            return stop(activity);
          })), false), _this.machine.options.actions)
        };
      });
      var actions = exitActions.concat({
        type: 'transition',
        actions: toActionObjects(transition.actions, this.machine.options.actions)
      }).concat(entryActions);

      if (isDone) {
        var stopActions = toActionObjects(flatten(__spreadArray([], __read(resolvedConfig), false).sort(function (a, b) {
          return b.order - a.order;
        }).map(function (stateNode) {
          return stateNode.onExit;
        })), this.machine.options.actions).filter(function (action) {
          return !isRaisableAction(action);
        });
        return actions.concat({
          type: 'stop',
          actions: stopActions
        });
      }

      return actions;
    };
    /**
     * Determines the next state given the current `state` and sent `event`.
     *
     * @param state The current State instance or state value
     * @param event The event that was sent at the current state
     * @param context The current context (extended state) of the current state
     */


    StateNode.prototype.transition = function (state, event, context, exec) {
      if (state === void 0) {
        state = this.initialState;
      }

      var _event = toSCXMLEvent(event);

      var currentState;

      if (state instanceof State) {
        currentState = context === undefined ? state : this.resolveState(State.from(state, context));
      } else {
        var resolvedStateValue = isString(state) ? this.resolve(pathToStateValue(this.getResolvedPath(state))) : this.resolve(state);
        var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
        currentState = this.resolveState(State.from(resolvedStateValue, resolvedContext));
      }

      if (_event.name === WILDCARD) {
        throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
      }

      if (this.strict) {
        if (!this.events.includes(_event.name) && !isBuiltInEvent(_event.name)) {
          throw new Error("Machine '".concat(this.id, "' does not accept event '").concat(_event.name, "'"));
        }
      }

      var stateTransition = this._transition(currentState.value, currentState, _event) || {
        transitions: [],
        configuration: [],
        exitSet: [],
        source: currentState,
        actions: []
      };
      var prevConfig = getConfiguration([], this.getStateNodes(currentState.value));
      var resolvedConfig = stateTransition.configuration.length ? getConfiguration(prevConfig, stateTransition.configuration) : prevConfig;
      stateTransition.configuration = __spreadArray([], __read(resolvedConfig), false);
      return this.resolveTransition(stateTransition, currentState, currentState.context, exec, _event);
    };

    StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent, predictableExec) {
      var _a;

      var currentActions = state.actions;
      state = this.transition(state, _event, undefined, predictableExec); // Save original event to state
      // TODO: this should be the raised event! Delete in V5 (breaking)

      state._event = originalEvent;
      state.event = originalEvent.data;

      (_a = state.actions).unshift.apply(_a, __spreadArray([], __read(currentActions), false));

      return state;
    };

    StateNode.prototype.resolveTransition = function (stateTransition, currentState, context, predictableExec, _event) {
      var e_6, _a, e_7, _b;

      var _this = this;

      if (_event === void 0) {
        _event = initEvent;
      }

      var configuration = stateTransition.configuration; // Transition will "apply" if:
      // - this is the initial state (there is no current state)
      // - OR there are transitions

      var willTransition = !currentState || stateTransition.transitions.length > 0;
      var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
      var isDone = isInFinalState(resolvedConfiguration, this);
      var resolvedStateValue = willTransition ? getValue(this.machine, configuration) : undefined;
      var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
      var actionBlocks = this.getActions(new Set(resolvedConfiguration), isDone, stateTransition, context, _event, currentState, predictableExec);
      var activities = currentState ? __assign({}, currentState.activities) : {};

      try {
        for (var actionBlocks_1 = __values(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
          var block = actionBlocks_1_1.value;

          try {
            for (var _c = (e_7 = void 0, __values(block.actions)), _d = _c.next(); !_d.done; _d = _c.next()) {
              var action = _d.value;

              if (action.type === start$1) {
                activities[action.activity.id || action.activity.type] = action;
              } else if (action.type === stop$1) {
                activities[action.activity.id || action.activity.type] = false;
              }
            }
          } catch (e_7_1) {
            e_7 = {
              error: e_7_1
            };
          } finally {
            try {
              if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            } finally {
              if (e_7) throw e_7.error;
            }
          }
        }
      } catch (e_6_1) {
        e_6 = {
          error: e_6_1
        };
      } finally {
        try {
          if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
        } finally {
          if (e_6) throw e_6.error;
        }
      }

      var _e = __read(resolveActions(this, currentState, context, _event, actionBlocks, predictableExec, this.machine.config.predictableActionArguments || this.machine.config.preserveActionOrder), 2),
          resolvedActions = _e[0],
          updatedContext = _e[1];

      var _f = __read(partition(resolvedActions, isRaisableAction), 2),
          raisedEvents = _f[0],
          nonRaisedActions = _f[1];

      var invokeActions = resolvedActions.filter(function (action) {
        var _a;

        return action.type === start$1 && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === invoke;
      });
      var children = invokeActions.reduce(function (acc, action) {
        acc[action.activity.id] = createInvocableActor(action.activity, _this.machine, updatedContext, _event);
        return acc;
      }, currentState ? __assign({}, currentState.children) : {});
      var nextState = new State({
        value: resolvedStateValue || currentState.value,
        context: updatedContext,
        _event: _event,
        // Persist _sessionid between states
        _sessionid: currentState ? currentState._sessionid : null,
        historyValue: resolvedStateValue ? historyValue ? updateHistoryValue(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
        history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
        actions: resolvedStateValue ? nonRaisedActions : [],
        activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
        events: [],
        configuration: resolvedConfiguration,
        transitions: stateTransition.transitions,
        children: children,
        done: isDone,
        tags: getTagsFromConfiguration(resolvedConfiguration),
        machine: this
      });
      var didUpdateContext = context !== updatedContext;
      nextState.changed = _event.name === update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

      var history = nextState.history;

      if (history) {
        delete history.history;
      } // There are transient transitions if the machine is not in a final state
      // and if some of the state nodes have transient ("always") transitions.


      var hasAlwaysTransitions = !isDone && (this._transient || configuration.some(function (stateNode) {
        return stateNode._transient;
      })); // If there are no enabled transitions, check if there are transient transitions.
      // If there are transient transitions, continue checking for more transitions
      // because an transient transition should be triggered even if there are no
      // enabled transitions.
      //
      // If we're already working on an transient transition then stop to prevent an infinite loop.
      //
      // Otherwise, if there are no enabled nor transient transitions, we are done.

      if (!willTransition && (!hasAlwaysTransitions || _event.name === NULL_EVENT)) {
        return nextState;
      }

      var maybeNextState = nextState;

      if (!isDone) {
        if (hasAlwaysTransitions) {
          maybeNextState = this.resolveRaisedTransition(maybeNextState, {
            type: nullEvent
          }, _event, predictableExec);
        }

        while (raisedEvents.length) {
          var raisedEvent = raisedEvents.shift();
          maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event, predictableExec);
        }
      } // Detect if state changed


      var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !stateValuesEqual(maybeNextState.value, history.value) : undefined);
      maybeNextState.changed = changed; // Preserve original history after raised events

      maybeNextState.history = history;
      return maybeNextState;
    };
    /**
     * Returns the child state node from its relative `stateKey`, or throws.
     */


    StateNode.prototype.getStateNode = function (stateKey) {
      if (isStateId(stateKey)) {
        return this.machine.getStateNodeById(stateKey);
      }

      if (!this.states) {
        throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(this.id, "'; no child states exist."));
      }

      var result = this.states[stateKey];

      if (!result) {
        throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
      }

      return result;
    };
    /**
     * Returns the state node with the given `stateId`, or throws.
     *
     * @param stateId The state ID. The prefix "#" is removed.
     */


    StateNode.prototype.getStateNodeById = function (stateId) {
      var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;

      if (resolvedStateId === this.id) {
        return this;
      }

      var stateNode = this.machine.idMap[resolvedStateId];

      if (!stateNode) {
        throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
      }

      return stateNode;
    };
    /**
     * Returns the relative state node from the given `statePath`, or throws.
     *
     * @param statePath The string or string array relative path to the state node.
     */


    StateNode.prototype.getStateNodeByPath = function (statePath) {
      if (typeof statePath === 'string' && isStateId(statePath)) {
        try {
          return this.getStateNodeById(statePath.slice(1));
        } catch (e) {// try individual paths
          // throw e;
        }
      }

      var arrayStatePath = toStatePath(statePath, this.delimiter).slice();
      var currentStateNode = this;

      while (arrayStatePath.length) {
        var key = arrayStatePath.shift();

        if (!key.length) {
          break;
        }

        currentStateNode = currentStateNode.getStateNode(key);
      }

      return currentStateNode;
    };
    /**
     * Resolves a partial state value with its full representation in this machine.
     *
     * @param stateValue The partial state value to resolve.
     */


    StateNode.prototype.resolve = function (stateValue) {
      var _a;

      var _this = this;

      if (!stateValue) {
        return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
      }

      switch (this.type) {
        case 'parallel':
          return mapValues(this.initialStateValue, function (subStateValue, subStateKey) {
            return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
          });

        case 'compound':
          if (isString(stateValue)) {
            var subStateNode = this.getStateNode(stateValue);

            if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
              return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
            }

            return stateValue;
          }

          if (!Object.keys(stateValue).length) {
            return this.initialStateValue || {};
          }

          return mapValues(stateValue, function (subStateValue, subStateKey) {
            return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
          });

        default:
          return stateValue || EMPTY_OBJECT;
      }
    };

    StateNode.prototype.getResolvedPath = function (stateIdentifier) {
      if (isStateId(stateIdentifier)) {
        var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];

        if (!stateNode) {
          throw new Error("Unable to find state node '".concat(stateIdentifier, "'"));
        }

        return stateNode.path;
      }

      return toStatePath(stateIdentifier, this.delimiter);
    };

    Object.defineProperty(StateNode.prototype, "initialStateValue", {
      get: function () {
        var _a;

        if (this.__cache.initialStateValue) {
          return this.__cache.initialStateValue;
        }

        var initialStateValue;

        if (this.type === 'parallel') {
          initialStateValue = mapFilterValues(this.states, function (state) {
            return state.initialStateValue || EMPTY_OBJECT;
          }, function (stateNode) {
            return !(stateNode.type === 'history');
          });
        } else if (this.initial !== undefined) {
          if (!this.states[this.initial]) {
            throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
          }

          initialStateValue = isLeafNode(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
        } else {
          // The finite state value of a machine without child states is just an empty object
          initialStateValue = {};
        }

        this.__cache.initialStateValue = initialStateValue;
        return this.__cache.initialStateValue;
      },
      enumerable: false,
      configurable: true
    });

    StateNode.prototype.getInitialState = function (stateValue, context) {
      this._init(); // TODO: this should be in the constructor (see note in constructor)


      var configuration = this.getStateNodes(stateValue);
      return this.resolveTransition({
        configuration: configuration,
        exitSet: [],
        transitions: [],
        source: undefined,
        actions: []
      }, undefined, context !== null && context !== void 0 ? context : this.machine.context, undefined);
    };

    Object.defineProperty(StateNode.prototype, "initialState", {
      /**
       * The initial State instance, which includes all actions to be executed from
       * entering the initial state.
       */
      get: function () {
        var initialStateValue = this.initialStateValue;

        if (!initialStateValue) {
          throw new Error("Cannot retrieve initial state from simple state '".concat(this.id, "'."));
        }

        return this.getInitialState(initialStateValue);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(StateNode.prototype, "target", {
      /**
       * The target state value of the history state node, if it exists. This represents the
       * default state value to transition to if no history value exists yet.
       */
      get: function () {
        var target;

        if (this.type === 'history') {
          var historyConfig = this.config;

          if (isString(historyConfig.target)) {
            target = isStateId(historyConfig.target) ? pathToStateValue(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
          } else {
            target = historyConfig.target;
          }
        }

        return target;
      },
      enumerable: false,
      configurable: true
    });
    /**
     * Returns the leaf nodes from a state path relative to this state node.
     *
     * @param relativeStateId The relative state path to retrieve the state nodes
     * @param history The previous state to retrieve history
     * @param resolve Whether state nodes should resolve to initial child state nodes
     */

    StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
      if (resolve === void 0) {
        resolve = true;
      }

      return resolve ? relativeStateId.type === 'history' ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
    };

    Object.defineProperty(StateNode.prototype, "initialStateNodes", {
      get: function () {
        var _this = this;

        if (isLeafNode(this)) {
          return [this];
        } // Case when state node is compound but no initial state is defined


        if (this.type === 'compound' && !this.initial) {
          {
            warn(false, "Compound state node '".concat(this.id, "' has no initial state."));
          }

          return [this];
        }

        var initialStateNodePaths = toStatePaths(this.initialStateValue);
        return flatten(initialStateNodePaths.map(function (initialPath) {
          return _this.getFromRelativePath(initialPath);
        }));
      },
      enumerable: false,
      configurable: true
    });
    /**
     * Retrieves state nodes from a relative path to this state node.
     *
     * @param relativePath The relative path from this state node
     * @param historyValue
     */

    StateNode.prototype.getFromRelativePath = function (relativePath) {
      if (!relativePath.length) {
        return [this];
      }

      var _a = __read(relativePath),
          stateKey = _a[0],
          childStatePath = _a.slice(1);

      if (!this.states) {
        throw new Error("Cannot retrieve subPath '".concat(stateKey, "' from node with no states"));
      }

      var childStateNode = this.getStateNode(stateKey);

      if (childStateNode.type === 'history') {
        return childStateNode.resolveHistory();
      }

      if (!this.states[stateKey]) {
        throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
      }

      return this.states[stateKey].getFromRelativePath(childStatePath);
    };

    StateNode.prototype.historyValue = function (relativeStateValue) {
      if (!Object.keys(this.states).length) {
        return undefined;
      }

      return {
        current: relativeStateValue || this.initialStateValue,
        states: mapFilterValues(this.states, function (stateNode, key) {
          if (!relativeStateValue) {
            return stateNode.historyValue();
          }

          var subStateValue = isString(relativeStateValue) ? undefined : relativeStateValue[key];
          return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
        }, function (stateNode) {
          return !stateNode.history;
        })
      };
    };
    /**
     * Resolves to the historical value(s) of the parent state node,
     * represented by state nodes.
     *
     * @param historyValue
     */


    StateNode.prototype.resolveHistory = function (historyValue) {
      var _this = this;

      if (this.type !== 'history') {
        return [this];
      }

      var parent = this.parent;

      if (!historyValue) {
        var historyTarget = this.target;
        return historyTarget ? flatten(toStatePaths(historyTarget).map(function (relativeChildPath) {
          return parent.getFromRelativePath(relativeChildPath);
        })) : parent.initialStateNodes;
      }

      var subHistoryValue = nestedPath(parent.path, 'states')(historyValue).current;

      if (isString(subHistoryValue)) {
        return [parent.getStateNode(subHistoryValue)];
      }

      return flatten(toStatePaths(subHistoryValue).map(function (subStatePath) {
        return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
      }));
    };

    Object.defineProperty(StateNode.prototype, "stateIds", {
      /**
       * All the state node IDs of this state node and its descendant state nodes.
       */
      get: function () {
        var _this = this;

        var childStateIds = flatten(Object.keys(this.states).map(function (stateKey) {
          return _this.states[stateKey].stateIds;
        }));
        return [this.id].concat(childStateIds);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(StateNode.prototype, "events", {
      /**
       * All the event types accepted by this state node and its descendants.
       */
      get: function () {
        var e_8, _a, e_9, _b;

        if (this.__cache.events) {
          return this.__cache.events;
        }

        var states = this.states;
        var events = new Set(this.ownEvents);

        if (states) {
          try {
            for (var _c = __values(Object.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
              var stateId = _d.value;
              var state = states[stateId];

              if (state.states) {
                try {
                  for (var _e = (e_9 = void 0, __values(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var event_1 = _f.value;
                    events.add("".concat(event_1));
                  }
                } catch (e_9_1) {
                  e_9 = {
                    error: e_9_1
                  };
                } finally {
                  try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                  } finally {
                    if (e_9) throw e_9.error;
                  }
                }
              }
            }
          } catch (e_8_1) {
            e_8 = {
              error: e_8_1
            };
          } finally {
            try {
              if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            } finally {
              if (e_8) throw e_8.error;
            }
          }
        }

        return this.__cache.events = Array.from(events);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(StateNode.prototype, "ownEvents", {
      /**
       * All the events that have transitions directly from this state node.
       *
       * Excludes any inert events.
       */
      get: function () {
        var events = new Set(this.transitions.filter(function (transition) {
          return !(!transition.target && !transition.actions.length && transition.internal);
        }).map(function (transition) {
          return transition.eventType;
        }));
        return Array.from(events);
      },
      enumerable: false,
      configurable: true
    });

    StateNode.prototype.resolveTarget = function (_target) {
      var _this = this;

      if (_target === undefined) {
        // an undefined target signals that the state node should not transition from that state when receiving that event
        return undefined;
      }

      return _target.map(function (target) {
        if (!isString(target)) {
          return target;
        }

        var isInternalTarget = target[0] === _this.delimiter; // If internal target is defined on machine,
        // do not include machine key on target

        if (isInternalTarget && !_this.parent) {
          return _this.getStateNodeByPath(target.slice(1));
        }

        var resolvedTarget = isInternalTarget ? _this.key + target : target;

        if (_this.parent) {
          try {
            var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);

            return targetStateNode;
          } catch (err) {
            throw new Error("Invalid transition definition for state node '".concat(_this.id, "':\n").concat(err.message));
          }
        } else {
          return _this.getStateNodeByPath(resolvedTarget);
        }
      });
    };

    StateNode.prototype.formatTransition = function (transitionConfig) {
      var _this = this;

      var normalizedTarget = normalizeTarget(transitionConfig.target);
      var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
        return isString(_target) && _target[0] === _this.delimiter;
      }) : true;
      var guards = this.machine.options.guards;
      var target = this.resolveTarget(normalizedTarget);

      var transition = __assign(__assign({}, transitionConfig), {
        actions: toActionObjects(toArray(transitionConfig.actions)),
        cond: toGuard(transitionConfig.cond, guards),
        target: target,
        source: this,
        internal: internal,
        eventType: transitionConfig.event,
        toJSON: function () {
          return __assign(__assign({}, transition), {
            target: transition.target ? transition.target.map(function (t) {
              return "#".concat(t.id);
            }) : undefined,
            source: "#".concat(_this.id)
          });
        }
      });

      return transition;
    };

    StateNode.prototype.formatTransitions = function () {
      var e_10, _a;

      var _this = this;

      var onConfig;

      if (!this.config.on) {
        onConfig = [];
      } else if (Array.isArray(this.config.on)) {
        onConfig = this.config.on;
      } else {
        var _b = this.config.on,
            _c = WILDCARD,
            _d = _b[_c],
            wildcardConfigs = _d === void 0 ? [] : _d,
            strictTransitionConfigs_1 = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);

        onConfig = flatten(Object.keys(strictTransitionConfigs_1).map(function (key) {
          if (key === NULL_EVENT) {
            warn(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + "Please check the `on` configuration for \"#".concat(_this.id, "\"."));
          }

          var transitionConfigArray = toTransitionConfigArray(key, strictTransitionConfigs_1[key]);

          {
            validateArrayifiedTransitions(_this, key, transitionConfigArray);
          }

          return transitionConfigArray;
        }).concat(toTransitionConfigArray(WILDCARD, wildcardConfigs)));
      }

      var eventlessConfig = this.config.always ? toTransitionConfigArray('', this.config.always) : [];
      var doneConfig = this.config.onDone ? toTransitionConfigArray(String(done(this.id)), this.config.onDone) : [];

      {
        warn(!(this.config.onDone && !this.parent), "Root nodes cannot have an \".onDone\" transition. Please check the config of \"".concat(this.id, "\"."));
      }

      var invokeConfig = flatten(this.invoke.map(function (invokeDef) {
        var settleTransitions = [];

        if (invokeDef.onDone) {
          settleTransitions.push.apply(settleTransitions, __spreadArray([], __read(toTransitionConfigArray(String(doneInvoke(invokeDef.id)), invokeDef.onDone)), false));
        }

        if (invokeDef.onError) {
          settleTransitions.push.apply(settleTransitions, __spreadArray([], __read(toTransitionConfigArray(String(error(invokeDef.id)), invokeDef.onError)), false));
        }

        return settleTransitions;
      }));
      var delayedTransitions = this.after;
      var formattedTransitions = flatten(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(doneConfig), false), __read(invokeConfig), false), __read(onConfig), false), __read(eventlessConfig), false).map(function (transitionConfig) {
        return toArray(transitionConfig).map(function (transition) {
          return _this.formatTransition(transition);
        });
      }));

      try {
        for (var delayedTransitions_1 = __values(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
          var delayedTransition = delayedTransitions_1_1.value;
          formattedTransitions.push(delayedTransition);
        }
      } catch (e_10_1) {
        e_10 = {
          error: e_10_1
        };
      } finally {
        try {
          if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
        } finally {
          if (e_10) throw e_10.error;
        }
      }

      return formattedTransitions;
    };

    return StateNode;
  }();

  var warned = false;
  function createMachine(config, options) {
    if (!('predictableActionArguments' in config) && !warned) {
      warned = true;
      console.warn('It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html');
    }

    return new StateNode(config, options);
  }

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

  var Error$1 = {
    ERROR: 'ERROR',
    HTTP_ERROR: 'HTTP_ERROR'
  };
  var Errors = [Error$1.ERROR, Error$1.HTTP_ERROR];

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
                  type = Error$1.HTTP_ERROR;
                  return _context4.abrupt("break", 15);
                case 13:
                  type = Error$1.ERROR;
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
        return logicExports.apply(cond.name,
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

  exports.Error = Error$1;
  exports.Errors = Errors;
  exports.HttpError = HttpError;
  exports.createWorkflow = createWorkflow;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.development.js.map
