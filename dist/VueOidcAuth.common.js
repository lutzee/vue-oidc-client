module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "dd17":
/***/ (function(module, exports, __webpack_require__) {

!function webpackUniversalModuleDefinition(e,t){if(true)module.exports=t();else { var i, r; }}(window,function(){return function(e){var t={};function __webpack_require__(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,__webpack_require__),i.l=!0,i.exports}return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},__webpack_require__.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,t){if(1&t&&(e=__webpack_require__(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(__webpack_require__.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)__webpack_require__.d(r,i,function(t){return e[t]}.bind(null,i));return r},__webpack_require__.n=function(e){var t=e&&e.__esModule?function getDefault(){return e.default}:function getModuleExports(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=45)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}();var n={debug:function debug(){},info:function info(){},warn:function warn(){},error:function error(){}},o=void 0,s=void 0;(t.Log=function(){function Log(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Log)}return Log.reset=function reset(){s=3,o=n},Log.debug=function debug(){if(s>=4){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];o.debug.apply(o,Array.from(t))}},Log.info=function info(){if(s>=3){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];o.info.apply(o,Array.from(t))}},Log.warn=function warn(){if(s>=2){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];o.warn.apply(o,Array.from(t))}},Log.error=function error(){if(s>=1){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];o.error.apply(o,Array.from(t))}},i(Log,null,[{key:"NONE",get:function get(){return 0}},{key:"ERROR",get:function get(){return 1}},{key:"WARN",get:function get(){return 2}},{key:"INFO",get:function get(){return 3}},{key:"DEBUG",get:function get(){return 4}},{key:"level",get:function get(){return s},set:function set(e){if(!(0<=e&&e<=4))throw new Error("Invalid log level");s=e}},{key:"logger",get:function get(){return o},set:function set(e){if(!e.debug&&e.info&&(e.debug=e.info),!(e.debug&&e.info&&e.warn&&e.error))throw new Error("Invalid logger");o=e}}]),Log}()).reset()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}();var n={setInterval:function(e){function setInterval(t,r){return e.apply(this,arguments)}return setInterval.toString=function(){return e.toString()},setInterval}(function(e,t){return setInterval(e,t)}),clearInterval:function(e){function clearInterval(t){return e.apply(this,arguments)}return clearInterval.toString=function(){return e.toString()},clearInterval}(function(e){return clearInterval(e)})},o=!1,s=null;t.Global=function(){function Global(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Global)}return Global._testing=function _testing(){o=!0},Global.setXMLHttpRequest=function setXMLHttpRequest(e){s=e},i(Global,null,[{key:"location",get:function get(){if(!o)return location}},{key:"localStorage",get:function get(){if(!o&&"undefined"!=typeof window)return localStorage}},{key:"sessionStorage",get:function get(){if(!o&&"undefined"!=typeof window)return sessionStorage}},{key:"XMLHttpRequest",get:function get(){if(!o&&"undefined"!=typeof window)return s||XMLHttpRequest}},{key:"timer",get:function get(){if(!o)return n}}]),Global}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UrlUtility=void 0;var i=r(0),n=r(1);t.UrlUtility=function(){function UrlUtility(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,UrlUtility)}return UrlUtility.addQueryParam=function addQueryParam(e,t,r){return e.indexOf("?")<0&&(e+="?"),"?"!==e[e.length-1]&&(e+="&"),e+=encodeURIComponent(t),e+="=",e+=encodeURIComponent(r)},UrlUtility.parseUrlFragment=function parseUrlFragment(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"#",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:n.Global;"string"!=typeof e&&(e=r.location.href);var o=e.lastIndexOf(t);o>=0&&(e=e.substr(o+1));for(var s,a={},u=/([^&=]+)=([^&]*)/g,c=0;s=u.exec(e);)if(a[decodeURIComponent(s[1])]=decodeURIComponent(s[2]),c++>50)return i.Log.error("UrlUtility.parseUrlFragment: response exceeded expected number of parameters",e),{error:"Response exceeded expected number of parameters"};for(var h in a)return a;return{}},UrlUtility}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MetadataService=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(17);t.MetadataService=function(){function MetadataService(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.JsonService;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,MetadataService),!e)throw n.Log.error("MetadataService: No settings passed to MetadataService"),new Error("settings");this._settings=e,this._jsonService=new t(["application/jwk-set+json"])}return MetadataService.prototype.getMetadata=function getMetadata(){var e=this;return this._settings.metadata?(n.Log.debug("MetadataService.getMetadata: Returning metadata from settings"),Promise.resolve(this._settings.metadata)):this.metadataUrl?(n.Log.debug("MetadataService.getMetadata: getting metadata from",this.metadataUrl),this._jsonService.getJson(this.metadataUrl).then(function(t){return n.Log.debug("MetadataService.getMetadata: json received"),e._settings.metadata=t,t})):(n.Log.error("MetadataService.getMetadata: No authority or metadataUrl configured on settings"),Promise.reject(new Error("No authority or metadataUrl configured on settings")))},MetadataService.prototype.getIssuer=function getIssuer(){return this._getMetadataProperty("issuer")},MetadataService.prototype.getAuthorizationEndpoint=function getAuthorizationEndpoint(){return this._getMetadataProperty("authorization_endpoint")},MetadataService.prototype.getUserInfoEndpoint=function getUserInfoEndpoint(){return this._getMetadataProperty("userinfo_endpoint")},MetadataService.prototype.getTokenEndpoint=function getTokenEndpoint(){return this._getMetadataProperty("token_endpoint",!0)},MetadataService.prototype.getCheckSessionIframe=function getCheckSessionIframe(){return this._getMetadataProperty("check_session_iframe",!0)},MetadataService.prototype.getEndSessionEndpoint=function getEndSessionEndpoint(){return this._getMetadataProperty("end_session_endpoint",!0)},MetadataService.prototype.getRevocationEndpoint=function getRevocationEndpoint(){return this._getMetadataProperty("revocation_endpoint",!0)},MetadataService.prototype._getMetadataProperty=function _getMetadataProperty(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return n.Log.debug("MetadataService.getMetadataProperty for: "+e),this.getMetadata().then(function(r){if(n.Log.debug("MetadataService.getMetadataProperty: metadata recieved"),void 0===r[e]){if(!0===t)return void n.Log.warn("MetadataService.getMetadataProperty: Metadata does not contain optional property "+e);throw n.Log.error("MetadataService.getMetadataProperty: Metadata does not contain property "+e),new Error("Metadata does not contain property "+e)}return r[e]})},MetadataService.prototype.getSigningKeys=function getSigningKeys(){var e=this;return this._settings.signingKeys?(n.Log.debug("MetadataService.getSigningKeys: Returning signingKeys from settings"),Promise.resolve(this._settings.signingKeys)):this._getMetadataProperty("jwks_uri").then(function(t){return n.Log.debug("MetadataService.getSigningKeys: jwks_uri received",t),e._jsonService.getJson(t).then(function(t){if(n.Log.debug("MetadataService.getSigningKeys: key set received",t),!t.keys)throw n.Log.error("MetadataService.getSigningKeys: Missing keys on keyset"),new Error("Missing keys on keyset");return e._settings.signingKeys=t.keys,e._settings.signingKeys})})},i(MetadataService,[{key:"metadataUrl",get:function get(){return this._metadataUrl||(this._settings.metadataUrl?this._metadataUrl=this._settings.metadataUrl:(this._metadataUrl=this._settings.authority,this._metadataUrl&&this._metadataUrl.indexOf(".well-known/openid-configuration")<0&&("/"!==this._metadataUrl[this._metadataUrl.length-1]&&(this._metadataUrl+="/"),this._metadataUrl+=".well-known/openid-configuration"))),this._metadataUrl}}]),MetadataService}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.State=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}(r(14));t.State=function(){function State(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.id,r=e.data,i=e.created;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,State),this._id=t||(0,o.default)(),this._data=r,this._created="number"==typeof i&&i>0?i:parseInt(Date.now()/1e3)}return State.prototype.toStorageString=function toStorageString(){return n.Log.debug("State.toStorageString"),JSON.stringify({id:this.id,data:this.data,created:this.created})},State.fromStorageString=function fromStorageString(e){return n.Log.debug("State.fromStorageString"),new State(JSON.parse(e))},State.clearStaleState=function clearStaleState(e,t){var r=Date.now()/1e3-t;return e.getAllKeys().then(function(t){n.Log.debug("State.clearStaleState: got keys",t);for(var i=[],o=function _loop(o){var s=t[o];a=e.get(s).then(function(t){var i=!1;if(t)try{var o=State.fromStorageString(t);n.Log.debug("State.clearStaleState: got item from key: ",s,o.created),o.created<=r&&(i=!0)}catch(e){n.Log.error("State.clearStaleState: Error parsing state for key",s,e.message),i=!0}else n.Log.debug("State.clearStaleState: no item in storage for key: ",s),i=!0;if(i)return n.Log.debug("State.clearStaleState: removed item for key: ",s),e.remove(s)}),i.push(a)},s=0;s<t.length;s++){var a;o(s)}return n.Log.debug("State.clearStaleState: waiting on promise count:",i.length),Promise.all(i)})},i(State,[{key:"id",get:function get(){return this._id}},{key:"data",get:function get(){return this._data}},{key:"created",get:function get(){return this._created}}]),State}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebStorageStateStore=void 0;var i=r(0),n=r(1);t.WebStorageStateStore=function(){function WebStorageStateStore(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.prefix,r=void 0===t?"oidc.":t,i=e.store,o=void 0===i?n.Global.localStorage:i;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,WebStorageStateStore),this._store=o,this._prefix=r}return WebStorageStateStore.prototype.set=function set(e,t){return i.Log.debug("WebStorageStateStore.set",e),e=this._prefix+e,this._store.setItem(e,t),Promise.resolve()},WebStorageStateStore.prototype.get=function get(e){i.Log.debug("WebStorageStateStore.get",e),e=this._prefix+e;var t=this._store.getItem(e);return Promise.resolve(t)},WebStorageStateStore.prototype.remove=function remove(e){i.Log.debug("WebStorageStateStore.remove",e),e=this._prefix+e;var t=this._store.getItem(e);return this._store.removeItem(e),Promise.resolve(t)},WebStorageStateStore.prototype.getAllKeys=function getAllKeys(){i.Log.debug("WebStorageStateStore.getAllKeys");for(var e=[],t=0;t<this._store.length;t++){var r=this._store.key(t);0===r.indexOf(this._prefix)&&e.push(r.substr(this._prefix.length))}return Promise.resolve(e)},WebStorageStateStore}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OidcClientSettings=void 0;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),o=r(0),s=r(5),a=r(44),u=r(3);var c="id_token",h="openid",l=900,f=300;t.OidcClientSettings=function(){function OidcClientSettings(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.authority,r=e.metadataUrl,n=e.metadata,o=e.signingKeys,g=e.client_id,p=e.client_secret,d=e.response_type,v=void 0===d?c:d,y=e.scope,m=void 0===y?h:y,S=e.redirect_uri,b=e.post_logout_redirect_uri,F=e.prompt,_=e.display,w=e.max_age,E=e.ui_locales,x=e.acr_values,A=e.resource,C=e.filterProtocolClaims,P=void 0===C||C,I=e.loadUserInfo,B=void 0===I||I,k=e.staleStateAge,R=void 0===k?l:k,T=e.clockSkew,U=void 0===T?f:T,D=e.stateStore,M=void 0===D?new s.WebStorageStateStore:D,L=e.ResponseValidatorCtor,N=void 0===L?a.ResponseValidator:L,O=e.MetadataServiceCtor,H=void 0===O?u.MetadataService:O,j=e.extraQueryParams,K=void 0===j?{}:j;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,OidcClientSettings),this._authority=t,this._metadataUrl=r,this._metadata=n,this._signingKeys=o,this._client_id=g,this._client_secret=p,this._response_type=v,this._scope=m,this._redirect_uri=S,this._post_logout_redirect_uri=b,this._prompt=F,this._display=_,this._max_age=w,this._ui_locales=E,this._acr_values=x,this._resource=A,this._filterProtocolClaims=!!P,this._loadUserInfo=!!B,this._staleStateAge=R,this._clockSkew=U,this._stateStore=M,this._validator=new N(this),this._metadataService=new H(this),this._extraQueryParams="object"===(void 0===K?"undefined":i(K))?K:{}}return n(OidcClientSettings,[{key:"client_id",get:function get(){return this._client_id},set:function set(e){if(this._client_id)throw o.Log.error("OidcClientSettings.set_client_id: client_id has already been assigned."),new Error("client_id has already been assigned.");this._client_id=e}},{key:"client_secret",get:function get(){return this._client_secret}},{key:"response_type",get:function get(){return this._response_type}},{key:"scope",get:function get(){return this._scope}},{key:"redirect_uri",get:function get(){return this._redirect_uri}},{key:"post_logout_redirect_uri",get:function get(){return this._post_logout_redirect_uri}},{key:"prompt",get:function get(){return this._prompt}},{key:"display",get:function get(){return this._display}},{key:"max_age",get:function get(){return this._max_age}},{key:"ui_locales",get:function get(){return this._ui_locales}},{key:"acr_values",get:function get(){return this._acr_values}},{key:"resource",get:function get(){return this._resource}},{key:"authority",get:function get(){return this._authority},set:function set(e){if(this._authority)throw o.Log.error("OidcClientSettings.set_authority: authority has already been assigned."),new Error("authority has already been assigned.");this._authority=e}},{key:"metadataUrl",get:function get(){return this._metadataUrl||(this._metadataUrl=this.authority,this._metadataUrl&&this._metadataUrl.indexOf(".well-known/openid-configuration")<0&&("/"!==this._metadataUrl[this._metadataUrl.length-1]&&(this._metadataUrl+="/"),this._metadataUrl+=".well-known/openid-configuration")),this._metadataUrl}},{key:"metadata",get:function get(){return this._metadata},set:function set(e){this._metadata=e}},{key:"signingKeys",get:function get(){return this._signingKeys},set:function set(e){this._signingKeys=e}},{key:"filterProtocolClaims",get:function get(){return this._filterProtocolClaims}},{key:"loadUserInfo",get:function get(){return this._loadUserInfo}},{key:"staleStateAge",get:function get(){return this._staleStateAge}},{key:"clockSkew",get:function get(){return this._clockSkew}},{key:"stateStore",get:function get(){return this._stateStore}},{key:"validator",get:function get(){return this._validator}},{key:"metadataService",get:function get(){return this._metadataService}},{key:"extraQueryParams",get:function get(){return this._extraQueryParams},set:function set(e){"object"===(void 0===e?"undefined":i(e))?this._extraQueryParams=e:this._extraQueryParams={}}}]),OidcClientSettings}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CordovaPopupWindow=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0);var o="location=no,toolbar=no,zoom=no",s="_blank";t.CordovaPopupWindow=function(){function CordovaPopupWindow(e){var t=this;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,CordovaPopupWindow),this._promise=new Promise(function(e,r){t._resolve=e,t._reject=r}),this.features=e.popupWindowFeatures||o,this.target=e.popupWindowTarget||s,this.redirect_uri=e.startUrl,n.Log.debug("CordovaPopupWindow.ctor: redirect_uri: "+this.redirect_uri)}return CordovaPopupWindow.prototype._isInAppBrowserInstalled=function _isInAppBrowserInstalled(e){return["cordova-plugin-inappbrowser","cordova-plugin-inappbrowser.inappbrowser","org.apache.cordova.inappbrowser"].some(function(t){return e.hasOwnProperty(t)})},CordovaPopupWindow.prototype.navigate=function navigate(e){if(e&&e.url){if(!window.cordova)return this._error("cordova is undefined");var t=window.cordova.require("cordova/plugin_list").metadata;if(!1===this._isInAppBrowserInstalled(t))return this._error("InAppBrowser plugin not found");this._popup=cordova.InAppBrowser.open(e.url,this.target,this.features),this._popup?(n.Log.debug("CordovaPopupWindow.navigate: popup successfully created"),this._exitCallbackEvent=this._exitCallback.bind(this),this._loadStartCallbackEvent=this._loadStartCallback.bind(this),this._popup.addEventListener("exit",this._exitCallbackEvent,!1),this._popup.addEventListener("loadstart",this._loadStartCallbackEvent,!1)):this._error("Error opening popup window")}else this._error("No url provided");return this.promise},CordovaPopupWindow.prototype._loadStartCallback=function _loadStartCallback(e){0===e.url.indexOf(this.redirect_uri)&&this._success({url:e.url})},CordovaPopupWindow.prototype._exitCallback=function _exitCallback(e){this._error(e)},CordovaPopupWindow.prototype._success=function _success(e){this._cleanup(),n.Log.debug("CordovaPopupWindow: Successful response from cordova popup window"),this._resolve(e)},CordovaPopupWindow.prototype._error=function _error(e){this._cleanup(),n.Log.error(e),this._reject(new Error(e))},CordovaPopupWindow.prototype.close=function close(){this._cleanup()},CordovaPopupWindow.prototype._cleanup=function _cleanup(){this._popup&&(n.Log.debug("CordovaPopupWindow: cleaning up popup"),this._popup.removeEventListener("exit",this._exitCallbackEvent,!1),this._popup.removeEventListener("loadstart",this._loadStartCallbackEvent,!1),this._popup.close()),this._popup=null},i(CordovaPopupWindow,[{key:"promise",get:function get(){return this._promise}}]),CordovaPopupWindow}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.TokenRevocationClient=void 0;var i=r(0),n=r(3),o=r(1);t.TokenRevocationClient=function(){function TokenRevocationClient(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.Global.XMLHttpRequest,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:n.MetadataService;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,TokenRevocationClient),!e)throw i.Log.error("TokenRevocationClient.ctor: No settings provided"),new Error("No settings provided.");this._settings=e,this._XMLHttpRequestCtor=t,this._metadataService=new r(this._settings)}return TokenRevocationClient.prototype.revoke=function revoke(e,t){var r=this;if(!e)throw i.Log.error("TokenRevocationClient.revoke: No accessToken provided"),new Error("No accessToken provided.");return this._metadataService.getRevocationEndpoint().then(function(n){if(n){i.Log.error("TokenRevocationClient.revoke: Revoking access token");var o=r._settings.client_id,s=r._settings.client_secret;return r._revoke(n,o,s,e)}if(t)throw i.Log.error("TokenRevocationClient.revoke: Revocation not supported"),new Error("Revocation not supported")})},TokenRevocationClient.prototype._revoke=function _revoke(e,t,r,n){var o=this;return new Promise(function(s,a){var u=new o._XMLHttpRequestCtor;u.open("POST",e),u.onload=function(){i.Log.debug("TokenRevocationClient.revoke: HTTP response received, status",u.status),200===u.status?s():a(Error(u.statusText+" ("+u.status+")"))};var c="client_id="+encodeURIComponent(t);r&&(c+="&client_secret="+encodeURIComponent(r)),c+="&token_type_hint="+encodeURIComponent("access_token"),c+="&token="+encodeURIComponent(n),u.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),u.send(c)})},TokenRevocationClient}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CheckSessionIFrame=void 0;var i=r(0);var n=2e3;t.CheckSessionIFrame=function(){function CheckSessionIFrame(e,t,r,i){var o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,CheckSessionIFrame),this._callback=e,this._client_id=t,this._url=r,this._interval=i||n,this._stopOnError=o;var s=r.indexOf("/",r.indexOf("//")+2);this._frame_origin=r.substr(0,s),this._frame=window.document.createElement("iframe"),this._frame.style.visibility="hidden",this._frame.style.position="absolute",this._frame.style.display="none",this._frame.style.width=0,this._frame.style.height=0,this._frame.src=r}return CheckSessionIFrame.prototype.load=function load(){var e=this;return new Promise(function(t){e._frame.onload=function(){t()},window.document.body.appendChild(e._frame),e._boundMessageEvent=e._message.bind(e),window.addEventListener("message",e._boundMessageEvent,!1)})},CheckSessionIFrame.prototype._message=function _message(e){e.origin===this._frame_origin&&e.source===this._frame.contentWindow&&("error"===e.data?(i.Log.error("CheckSessionIFrame: error message from check session op iframe"),this._stopOnError&&this.stop()):"changed"===e.data?(i.Log.debug("CheckSessionIFrame: changed message from check session op iframe"),this.stop(),this._callback()):i.Log.debug("CheckSessionIFrame: "+e.data+" message from check session op iframe"))},CheckSessionIFrame.prototype.start=function start(e){var t=this;if(this._session_state!==e){i.Log.debug("CheckSessionIFrame.start"),this.stop(),this._session_state=e;var r=function send(){t._frame.contentWindow.postMessage(t._client_id+" "+t._session_state,t._frame_origin)};r(),this._timer=window.setInterval(r,this._interval)}},CheckSessionIFrame.prototype.stop=function stop(){this._session_state=null,this._timer&&(i.Log.debug("CheckSessionIFrame.stop"),window.clearInterval(this._timer),this._timer=null)},CheckSessionIFrame}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SessionMonitor=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(9);t.SessionMonitor=function(){function SessionMonitor(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.CheckSessionIFrame;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SessionMonitor),!e)throw n.Log.error("SessionMonitor.ctor: No user manager passed to SessionMonitor"),new Error("userManager");this._userManager=e,this._CheckSessionIFrameCtor=r,this._userManager.events.addUserLoaded(this._start.bind(this)),this._userManager.events.addUserUnloaded(this._stop.bind(this)),this._userManager.getUser().then(function(e){e&&t._start(e)}).catch(function(e){n.Log.error("SessionMonitor ctor: error from getUser:",e.message)})}return SessionMonitor.prototype._start=function _start(e){var t=this,r=e.session_state;r&&(this._sub=e.profile.sub,this._sid=e.profile.sid,n.Log.debug("SessionMonitor._start: session_state:",r,", sub:",this._sub),this._checkSessionIFrame?this._checkSessionIFrame.start(r):this._metadataService.getCheckSessionIframe().then(function(e){if(e){n.Log.debug("SessionMonitor._start: Initializing check session iframe");var i=t._client_id,o=t._checkSessionInterval,s=t._stopCheckSessionOnError;t._checkSessionIFrame=new t._CheckSessionIFrameCtor(t._callback.bind(t),i,e,o,s),t._checkSessionIFrame.load().then(function(){t._checkSessionIFrame.start(r)})}else n.Log.warn("SessionMonitor._start: No check session iframe found in the metadata")}).catch(function(e){n.Log.error("SessionMonitor._start: Error from getCheckSessionIframe:",e.message)}))},SessionMonitor.prototype._stop=function _stop(){this._sub=null,this._sid=null,this._checkSessionIFrame&&(n.Log.debug("SessionMonitor._stop"),this._checkSessionIFrame.stop())},SessionMonitor.prototype._callback=function _callback(){var e=this;this._userManager.querySessionStatus().then(function(t){var r=!0;t?t.sub===e._sub?(r=!1,e._checkSessionIFrame.start(t.session_state),t.sid===e._sid?n.Log.debug("SessionMonitor._callback: Same sub still logged in at OP, restarting check session iframe; session_state:",t.session_state):(n.Log.debug("SessionMonitor._callback: Same sub still logged in at OP, session state has changed, restarting check session iframe; session_state:",t.session_state),e._userManager.events._raiseUserSessionChanged())):n.Log.debug("SessionMonitor._callback: Different subject signed into OP:",t.sub):n.Log.debug("SessionMonitor._callback: Subject no longer signed into OP"),r&&(n.Log.debug("SessionMonitor._callback: SessionMonitor._callback; raising signed out event"),e._userManager.events._raiseUserSignedOut())}).catch(function(t){n.Log.debug("SessionMonitor._callback: Error calling queryCurrentSigninSession; raising signed out event",t.message),e._userManager.events._raiseUserSignedOut()})},i(SessionMonitor,[{key:"_settings",get:function get(){return this._userManager.settings}},{key:"_metadataService",get:function get(){return this._userManager.metadataService}},{key:"_client_id",get:function get(){return this._settings.client_id}},{key:"_checkSessionInterval",get:function get(){return this._settings.checkSessionInterval}},{key:"_stopCheckSessionOnError",get:function get(){return this._settings.stopCheckSessionOnError}}]),SessionMonitor}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Event=void 0;var i=r(0);t.Event=function(){function Event(e){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Event),this._name=e,this._callbacks=[]}return Event.prototype.addHandler=function addHandler(e){this._callbacks.push(e)},Event.prototype.removeHandler=function removeHandler(e){var t=this._callbacks.findIndex(function(t){return t===e});t>=0&&this._callbacks.splice(t,1)},Event.prototype.raise=function raise(){i.Log.debug("Event: Raising event: "+this._name);for(var e=0;e<this._callbacks.length;e++){var t;(t=this._callbacks)[e].apply(t,arguments)}},Event}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.AccessTokenEvents=void 0;var i=r(0),n=r(22);var o=60;t.AccessTokenEvents=function(){function AccessTokenEvents(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.accessTokenExpiringNotificationTime,r=void 0===t?o:t,i=e.accessTokenExpiringTimer,s=void 0===i?new n.Timer("Access token expiring"):i,a=e.accessTokenExpiredTimer,u=void 0===a?new n.Timer("Access token expired"):a;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,AccessTokenEvents),this._accessTokenExpiringNotificationTime=r,this._accessTokenExpiring=s,this._accessTokenExpired=u}return AccessTokenEvents.prototype.load=function load(e){if(e.access_token&&void 0!==e.expires_in){var t=e.expires_in;if(i.Log.debug("AccessTokenEvents.load: access token present, remaining duration:",t),t>0){var r=t-this._accessTokenExpiringNotificationTime;r<=0&&(r=1),i.Log.debug("AccessTokenEvents.load: registering expiring timer in:",r),this._accessTokenExpiring.init(r)}else i.Log.debug("AccessTokenEvents.load: canceling existing expiring timer becase we're past expiration."),this._accessTokenExpiring.cancel();var n=t+1;i.Log.debug("AccessTokenEvents.load: registering expired timer in:",n),this._accessTokenExpired.init(n)}else this._accessTokenExpiring.cancel(),this._accessTokenExpired.cancel()},AccessTokenEvents.prototype.unload=function unload(){i.Log.debug("AccessTokenEvents.unload: canceling existing access token timers"),this._accessTokenExpiring.cancel(),this._accessTokenExpired.cancel()},AccessTokenEvents.prototype.addAccessTokenExpiring=function addAccessTokenExpiring(e){this._accessTokenExpiring.addHandler(e)},AccessTokenEvents.prototype.removeAccessTokenExpiring=function removeAccessTokenExpiring(e){this._accessTokenExpiring.removeHandler(e)},AccessTokenEvents.prototype.addAccessTokenExpired=function addAccessTokenExpired(e){this._accessTokenExpired.addHandler(e)},AccessTokenEvents.prototype.removeAccessTokenExpired=function removeAccessTokenExpired(e){this._accessTokenExpired.removeHandler(e)},AccessTokenEvents}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.User=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0);t.User=function(){function User(e){var t=e.id_token,r=e.session_state,i=e.access_token,n=e.token_type,o=e.scope,s=e.profile,a=e.expires_at,u=e.state;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,User),this.id_token=t,this.session_state=r,this.access_token=i,this.token_type=n,this.scope=o,this.profile=s,this.expires_at=a,this.state=u}return User.prototype.toStorageString=function toStorageString(){return n.Log.debug("User.toStorageString"),JSON.stringify({id_token:this.id_token,session_state:this.session_state,access_token:this.access_token,token_type:this.token_type,scope:this.scope,profile:this.profile,expires_at:this.expires_at})},User.fromStorageString=function fromStorageString(e){return n.Log.debug("User.fromStorageString"),new User(JSON.parse(e))},i(User,[{key:"expires_in",get:function get(){if(this.expires_at){var e=parseInt(Date.now()/1e3);return this.expires_at-e}}},{key:"expired",get:function get(){var e=this.expires_in;if(void 0!==e)return e<=0}},{key:"scopes",get:function get(){return(this.scope||"").split(" ")}}]),User}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=
// @preserve Copyright (c) Microsoft Open Technologies, Inc.
function random(){for(var e="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx",t="0123456789abcdef",r=0,i="",n=0;n<e.length;n++)"-"!==e[n]&&"4"!==e[n]&&(r=16*Math.random()|0),"x"===e[n]?i+=t[r]:"y"===e[n]?(r&=3,i+=t[r|=8]):i+=e[n];return i},e.exports=t.default},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SigninState=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(4),s=function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}(r(14));t.SigninState=function(e){function SigninState(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.nonce,i=t.authority,n=t.client_id;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SigninState);var o=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,arguments[0]));return!0===r?o._nonce=(0,s.default)():r&&(o._nonce=r),o._authority=i,o._client_id=n,o}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(SigninState,e),SigninState.prototype.toStorageString=function toStorageString(){return n.Log.debug("SigninState.toStorageString"),JSON.stringify({id:this.id,data:this.data,created:this.created,nonce:this.nonce,authority:this.authority,client_id:this.client_id})},SigninState.fromStorageString=function fromStorageString(e){return n.Log.debug("SigninState.fromStorageString"),new SigninState(JSON.parse(e))},i(SigninState,[{key:"nonce",get:function get(){return this._nonce}},{key:"authority",get:function get(){return this._authority}},{key:"client_id",get:function get(){return this._client_id}}]),SigninState}(o.State)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ErrorResponse=void 0;var i=r(0);t.ErrorResponse=function(e){function ErrorResponse(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.error,n=t.error_description,o=t.error_uri,s=t.state;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,ErrorResponse),!r)throw i.Log.error("No error passed to ErrorResponse"),new Error("error");var a=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n||r));return a.name="ErrorResponse",a.error=r,a.error_description=n,a.error_uri=o,a.state=s,a}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(ErrorResponse,e),ErrorResponse}(Error)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.JsonService=void 0;var i=r(0),n=r(1);t.JsonService=function(){function JsonService(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n.Global.XMLHttpRequest;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,JsonService),e&&Array.isArray(e)?this._contentTypes=e.slice():this._contentTypes=[],this._contentTypes.push("application/json"),this._XMLHttpRequest=t}return JsonService.prototype.getJson=function getJson(e,t){var r=this;if(!e)throw i.Log.error("JsonService.getJson: No url passed"),new Error("url");return i.Log.debug("JsonService.getJson, url: ",e),new Promise(function(n,o){var s=new r._XMLHttpRequest;s.open("GET",e);var a=r._contentTypes;s.onload=function(){if(i.Log.debug("JsonService.getJson: HTTP response received, status",s.status),200===s.status){var t=s.getResponseHeader("Content-Type");if(t)if(a.find(function(e){if(t.startsWith(e))return!0}))try{return void n(JSON.parse(s.responseText))}catch(e){return i.Log.error("JsonService.getJson: Error parsing JSON response",e.message),void o(e)}o(Error("Invalid response Content-Type: "+t+", from URL: "+e))}else o(Error(s.statusText+" ("+s.status+")"))},s.onerror=function(){i.Log.error("JsonService.getJson: network error"),o(Error("Network Error"))},t&&(i.Log.debug("JsonService.getJson: token passed, setting Authorization header"),s.setRequestHeader("Authorization","Bearer "+t)),s.send()})},JsonService}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OidcClient=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(6),s=r(16),a=r(35),u=r(34),c=r(33),h=r(32),l=r(15),f=r(4);t.OidcClient=function(){function OidcClient(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,OidcClient),e instanceof o.OidcClientSettings?this._settings=e:this._settings=new o.OidcClientSettings(e)}return OidcClient.prototype.createSigninRequest=function createSigninRequest(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.response_type,i=t.scope,o=t.redirect_uri,s=t.data,u=t.state,c=t.prompt,h=t.display,l=t.max_age,f=t.ui_locales,g=t.id_token_hint,p=t.login_hint,d=t.acr_values,v=t.resource,y=t.request,m=t.request_uri,S=t.extraQueryParams,b=arguments[1];n.Log.debug("OidcClient.createSigninRequest");var F=this._settings.client_id;r=r||this._settings.response_type,i=i||this._settings.scope,o=o||this._settings.redirect_uri,c=c||this._settings.prompt,h=h||this._settings.display,l=l||this._settings.max_age,f=f||this._settings.ui_locales,d=d||this._settings.acr_values,v=v||this._settings.resource,S=S||this._settings.extraQueryParams;var _=this._settings.authority;return this._metadataService.getAuthorizationEndpoint().then(function(t){n.Log.debug("OidcClient.createSigninRequest: Received authorization endpoint",t);var w=new a.SigninRequest({url:t,client_id:F,redirect_uri:o,response_type:r,scope:i,data:s||u,authority:_,prompt:c,display:h,max_age:l,ui_locales:f,id_token_hint:g,login_hint:p,acr_values:d,resource:v,request:y,request_uri:m,extraQueryParams:S}),E=w.state;return(b=b||e._stateStore).set(E.id,E.toStorageString()).then(function(){return w})})},OidcClient.prototype.processSigninResponse=function processSigninResponse(e,t){var r=this;n.Log.debug("OidcClient.processSigninResponse");var i=new u.SigninResponse(e);return i.state?(t=t||this._stateStore).remove(i.state).then(function(e){if(!e)throw n.Log.error("OidcClient.processSigninResponse: No matching state found in storage"),new Error("No matching state found in storage");var t=l.SigninState.fromStorageString(e);return n.Log.debug("OidcClient.processSigninResponse: Received state from storage; validating response"),r._validator.validateSigninResponse(t,i)}):(n.Log.error("OidcClient.processSigninResponse: No state in response"),Promise.reject(new Error("No state in response")))},OidcClient.prototype.createSignoutRequest=function createSignoutRequest(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.id_token_hint,i=t.data,o=t.state,s=t.post_logout_redirect_uri,a=arguments[1];return n.Log.debug("OidcClient.createSignoutRequest"),s=s||this._settings.post_logout_redirect_uri,this._metadataService.getEndSessionEndpoint().then(function(t){if(!t)throw n.Log.error("OidcClient.createSignoutRequest: No end session endpoint url returned"),new Error("no end session endpoint");n.Log.debug("OidcClient.createSignoutRequest: Received end session endpoint",t);var u=new c.SignoutRequest({url:t,id_token_hint:r,post_logout_redirect_uri:s,data:i||o}),h=u.state;return h&&(n.Log.debug("OidcClient.createSignoutRequest: Signout request has state to persist"),(a=a||e._stateStore).set(h.id,h.toStorageString())),u})},OidcClient.prototype.processSignoutResponse=function processSignoutResponse(e,t){var r=this;n.Log.debug("OidcClient.processSignoutResponse");var i=new h.SignoutResponse(e);if(!i.state)return n.Log.debug("OidcClient.processSignoutResponse: No state in response"),i.error?(n.Log.warn("OidcClient.processSignoutResponse: Response was error: ",i.error),Promise.reject(new s.ErrorResponse(i))):Promise.resolve(i);var o=i.state;return(t=t||this._stateStore).remove(o).then(function(e){if(!e)throw n.Log.error("OidcClient.processSignoutResponse: No matching state found in storage"),new Error("No matching state found in storage");var t=f.State.fromStorageString(e);return n.Log.debug("OidcClient.processSignoutResponse: Received state from storage; validating response"),r._validator.validateSignoutResponse(t,i)})},OidcClient.prototype.clearStaleState=function clearStaleState(e){return n.Log.debug("OidcClient.clearStaleState"),e=e||this._stateStore,f.State.clearStaleState(e,this.settings.staleStateAge)},i(OidcClient,[{key:"_stateStore",get:function get(){return this.settings.stateStore}},{key:"_validator",get:function get(){return this.settings.validator}},{key:"_metadataService",get:function get(){return this.settings.metadataService}},{key:"settings",get:function get(){return this._settings}},{key:"metadataService",get:function get(){return this._metadataService}}]),OidcClient}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CordovaIFrameNavigator=void 0;var i=r(7);t.CordovaIFrameNavigator=function(){function CordovaIFrameNavigator(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,CordovaIFrameNavigator)}return CordovaIFrameNavigator.prototype.prepare=function prepare(e){e.popupWindowFeatures="hidden=yes";var t=new i.CordovaPopupWindow(e);return Promise.resolve(t)},CordovaIFrameNavigator}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CordovaPopupNavigator=void 0;var i=r(7);t.CordovaPopupNavigator=function(){function CordovaPopupNavigator(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,CordovaPopupNavigator)}return CordovaPopupNavigator.prototype.prepare=function prepare(e){var t=new i.CordovaPopupWindow(e);return Promise.resolve(t)},CordovaPopupNavigator}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SilentRenewService=void 0;var i=r(0);t.SilentRenewService=function(){function SilentRenewService(e){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SilentRenewService),this._userManager=e}return SilentRenewService.prototype.start=function start(){this._callback||(this._callback=this._tokenExpiring.bind(this),this._userManager.events.addAccessTokenExpiring(this._callback),this._userManager.getUser().then(function(e){}).catch(function(e){i.Log.error("SilentRenewService.start: Error from getUser:",e.message)}))},SilentRenewService.prototype.stop=function stop(){this._callback&&(this._userManager.events.removeAccessTokenExpiring(this._callback),delete this._callback)},SilentRenewService.prototype._tokenExpiring=function _tokenExpiring(){var e=this;this._userManager.signinSilent().then(function(e){i.Log.debug("SilentRenewService._tokenExpiring: Silent token renewal successful")},function(t){i.Log.error("SilentRenewService._tokenExpiring: Error from signinSilent:",t.message),e._userManager.events._raiseSilentRenewError(t)})},SilentRenewService}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Timer=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(1),s=r(11);t.Timer=function(e){function Timer(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.Global.timer,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Timer);var n=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,t));return n._timer=r,n._nowFunc=i||function(){return Date.now()/1e3},n}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(Timer,e),Timer.prototype.init=function init(e){e<=0&&(e=1),e=parseInt(e);var t=this.now+e;if(this.expiration===t&&this._timerHandle)n.Log.debug("Timer.init timer "+this._name+" skipping initialization since already initialized for expiration:",this.expiration);else{this.cancel(),n.Log.debug("Timer.init timer "+this._name+" for duration:",e),this._expiration=t;var r=5;e<r&&(r=e),this._timerHandle=this._timer.setInterval(this._callback.bind(this),1e3*r)}},Timer.prototype.cancel=function cancel(){this._timerHandle&&(n.Log.debug("Timer.cancel: ",this._name),this._timer.clearInterval(this._timerHandle),this._timerHandle=null)},Timer.prototype._callback=function _callback(){var t=this._expiration-this.now;n.Log.debug("Timer.callback; "+this._name+" timer expires in:",t),this._expiration<=this.now&&(this.cancel(),e.prototype.raise.call(this))},i(Timer,[{key:"now",get:function get(){return parseInt(this._nowFunc())}},{key:"expiration",get:function get(){return this._expiration}}]),Timer}(s.Event)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UserManagerEvents=void 0;var i=r(0),n=r(12),o=r(11);t.UserManagerEvents=function(e){function UserManagerEvents(t){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,UserManagerEvents);var r=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,t));return r._userLoaded=new o.Event("User loaded"),r._userUnloaded=new o.Event("User unloaded"),r._silentRenewError=new o.Event("Silent renew error"),r._userSignedOut=new o.Event("User signed out"),r._userSessionChanged=new o.Event("User session changed"),r}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(UserManagerEvents,e),UserManagerEvents.prototype.load=function load(t){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];i.Log.debug("UserManagerEvents.load"),e.prototype.load.call(this,t),r&&this._userLoaded.raise(t)},UserManagerEvents.prototype.unload=function unload(){i.Log.debug("UserManagerEvents.unload"),e.prototype.unload.call(this),this._userUnloaded.raise()},UserManagerEvents.prototype.addUserLoaded=function addUserLoaded(e){this._userLoaded.addHandler(e)},UserManagerEvents.prototype.removeUserLoaded=function removeUserLoaded(e){this._userLoaded.removeHandler(e)},UserManagerEvents.prototype.addUserUnloaded=function addUserUnloaded(e){this._userUnloaded.addHandler(e)},UserManagerEvents.prototype.removeUserUnloaded=function removeUserUnloaded(e){this._userUnloaded.removeHandler(e)},UserManagerEvents.prototype.addSilentRenewError=function addSilentRenewError(e){this._silentRenewError.addHandler(e)},UserManagerEvents.prototype.removeSilentRenewError=function removeSilentRenewError(e){this._silentRenewError.removeHandler(e)},UserManagerEvents.prototype._raiseSilentRenewError=function _raiseSilentRenewError(e){i.Log.debug("UserManagerEvents._raiseSilentRenewError",e.message),this._silentRenewError.raise(e)},UserManagerEvents.prototype.addUserSignedOut=function addUserSignedOut(e){this._userSignedOut.addHandler(e)},UserManagerEvents.prototype.removeUserSignedOut=function removeUserSignedOut(e){this._userSignedOut.removeHandler(e)},UserManagerEvents.prototype._raiseUserSignedOut=function _raiseUserSignedOut(e){i.Log.debug("UserManagerEvents._raiseUserSignedOut"),this._userSignedOut.raise(e)},UserManagerEvents.prototype.addUserSessionChanged=function addUserSessionChanged(e){this._userSessionChanged.addHandler(e)},UserManagerEvents.prototype.removeUserSessionChanged=function removeUserSessionChanged(e){this._userSessionChanged.removeHandler(e)},UserManagerEvents.prototype._raiseUserSessionChanged=function _raiseUserSessionChanged(e){i.Log.debug("UserManagerEvents._raiseUserSessionChanged"),this._userSessionChanged.raise(e)},UserManagerEvents}(n.AccessTokenEvents)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IFrameWindow=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0);t.IFrameWindow=function(){function IFrameWindow(e){var t=this;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,IFrameWindow),this._promise=new Promise(function(e,r){t._resolve=e,t._reject=r}),this._boundMessageEvent=this._message.bind(this),window.addEventListener("message",this._boundMessageEvent,!1),this._frame=window.document.createElement("iframe"),this._frame.style.visibility="hidden",this._frame.style.position="absolute",this._frame.style.display="none",this._frame.style.width=0,this._frame.style.height=0,window.document.body.appendChild(this._frame)}return IFrameWindow.prototype.navigate=function navigate(e){if(e&&e.url){var t=e.silentRequestTimeout||1e4;n.Log.debug("IFrameWindow.navigate: Using timeout of:",t),this._timer=window.setTimeout(this._timeout.bind(this),t),this._frame.src=e.url}else this._error("No url provided");return this.promise},IFrameWindow.prototype._success=function _success(e){this._cleanup(),n.Log.debug("IFrameWindow: Successful response from frame window"),this._resolve(e)},IFrameWindow.prototype._error=function _error(e){this._cleanup(),n.Log.error(e),this._reject(new Error(e))},IFrameWindow.prototype.close=function close(){this._cleanup()},IFrameWindow.prototype._cleanup=function _cleanup(){this._frame&&(n.Log.debug("IFrameWindow: cleanup"),window.removeEventListener("message",this._boundMessageEvent,!1),window.clearTimeout(this._timer),window.document.body.removeChild(this._frame),this._timer=null,this._frame=null,this._boundMessageEvent=null)},IFrameWindow.prototype._timeout=function _timeout(){n.Log.debug("IFrameWindow.timeout"),this._error("Frame window timed out")},IFrameWindow.prototype._message=function _message(e){if(n.Log.debug("IFrameWindow.message"),this._timer&&e.origin===this._origin&&e.source===this._frame.contentWindow){var t=e.data;t?this._success({url:t}):this._error("Invalid response from frame")}},IFrameWindow.notifyParent=function notifyParent(e){n.Log.debug("IFrameWindow.notifyParent"),window.parent&&window!==window.parent&&(e=e||window.location.href)&&(n.Log.debug("IFrameWindow.notifyParent: posting url message to parent"),window.parent.postMessage(e,location.protocol+"//"+location.host))},i(IFrameWindow,[{key:"promise",get:function get(){return this._promise}},{key:"_origin",get:function get(){return location.protocol+"//"+location.host}}]),IFrameWindow}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IFrameNavigator=void 0;var i=r(0),n=r(24);t.IFrameNavigator=function(){function IFrameNavigator(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,IFrameNavigator)}return IFrameNavigator.prototype.prepare=function prepare(e){var t=new n.IFrameWindow(e);return Promise.resolve(t)},IFrameNavigator.prototype.callback=function callback(e){i.Log.debug("IFrameNavigator.callback");try{return n.IFrameWindow.notifyParent(e),Promise.resolve()}catch(e){return Promise.reject(e)}},IFrameNavigator}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PopupWindow=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(2);var s=500,a="location=no,toolbar=no,width=500,height=500,left=100,top=100;",u="_blank";t.PopupWindow=function(){function PopupWindow(e){var t=this;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,PopupWindow),this._promise=new Promise(function(e,r){t._resolve=e,t._reject=r});var r=e.popupWindowTarget||u,i=e.popupWindowFeatures||a;this._popup=window.open("",r,i),this._popup&&(n.Log.debug("PopupWindow.ctor: popup successfully created"),this._checkForPopupClosedTimer=window.setInterval(this._checkForPopupClosed.bind(this),s))}return PopupWindow.prototype.navigate=function navigate(e){return this._popup?e&&e.url?(n.Log.debug("PopupWindow.navigate: Setting URL in popup"),this._id=e.id,this._id&&(window["popupCallback_"+e.id]=this._callback.bind(this)),this._popup.focus(),this._popup.window.location=e.url):(this._error("PopupWindow.navigate: no url provided"),this._error("No url provided")):this._error("PopupWindow.navigate: Error opening popup window"),this.promise},PopupWindow.prototype._success=function _success(e){n.Log.debug("PopupWindow.callback: Successful response from popup window"),this._cleanup(),this._resolve(e)},PopupWindow.prototype._error=function _error(e){n.Log.error("PopupWindow.error: ",e),this._cleanup(),this._reject(new Error(e))},PopupWindow.prototype.close=function close(){this._cleanup(!1)},PopupWindow.prototype._cleanup=function _cleanup(e){n.Log.debug("PopupWindow.cleanup"),window.clearInterval(this._checkForPopupClosedTimer),this._checkForPopupClosedTimer=null,delete window["popupCallback_"+this._id],this._popup&&!e&&this._popup.close(),this._popup=null},PopupWindow.prototype._checkForPopupClosed=function _checkForPopupClosed(){this._popup&&!this._popup.closed||this._error("Popup window closed")},PopupWindow.prototype._callback=function _callback(e,t){this._cleanup(t),e?(n.Log.debug("PopupWindow.callback success"),this._success({url:e})):(n.Log.debug("PopupWindow.callback: Invalid response from popup"),this._error("Invalid response from popup"))},PopupWindow.notifyOpener=function notifyOpener(e,t,r){if(window.opener){if(e=e||window.location.href){var i=o.UrlUtility.parseUrlFragment(e,r);if(i.state){var s="popupCallback_"+i.state,a=window.opener[s];a?(n.Log.debug("PopupWindow.notifyOpener: passing url message to opener"),a(e,t)):n.Log.warn("PopupWindow.notifyOpener: no matching callback found on opener")}else n.Log.warn("PopupWindow.notifyOpener: no state found in response url")}}else n.Log.warn("PopupWindow.notifyOpener: no window.opener. Can't complete notification.")},i(PopupWindow,[{key:"promise",get:function get(){return this._promise}}]),PopupWindow}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PopupNavigator=void 0;var i=r(0),n=r(26);t.PopupNavigator=function(){function PopupNavigator(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,PopupNavigator)}return PopupNavigator.prototype.prepare=function prepare(e){var t=new n.PopupWindow(e);return Promise.resolve(t)},PopupNavigator.prototype.callback=function callback(e,t,r){i.Log.debug("PopupNavigator.callback");try{return n.PopupWindow.notifyOpener(e,t,r),Promise.resolve()}catch(e){return Promise.reject(e)}},PopupNavigator}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.RedirectNavigator=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0);t.RedirectNavigator=function(){function RedirectNavigator(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,RedirectNavigator)}return RedirectNavigator.prototype.prepare=function prepare(){return Promise.resolve(this)},RedirectNavigator.prototype.navigate=function navigate(e){return e&&e.url?(window.location=e.url,Promise.resolve()):(n.Log.error("RedirectNavigator.navigate: No url provided"),Promise.reject(new Error("No url provided")))},i(RedirectNavigator,[{key:"url",get:function get(){return window.location.href}}]),RedirectNavigator}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UserManagerSettings=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=(r(0),r(6)),o=r(28),s=r(27),a=r(25),u=r(5),c=r(1);var h=60,l=2e3,f="id_token";t.UserManagerSettings=function(e){function UserManagerSettings(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.popup_redirect_uri,i=t.popup_post_logout_redirect_uri,n=t.popupWindowFeatures,g=t.popupWindowTarget,p=t.silent_redirect_uri,d=t.silentRequestTimeout,v=t.automaticSilentRenew,y=void 0!==v&&v,m=t.includeIdTokenInSilentRenew,S=void 0===m||m,b=t.monitorSession,F=void 0===b||b,_=t.checkSessionInterval,w=void 0===_?l:_,E=t.stopCheckSessionOnError,x=void 0===E||E,A=t.query_status_response_type,C=void 0===A?f:A,P=t.revokeAccessTokenOnSignout,I=void 0!==P&&P,B=t.accessTokenExpiringNotificationTime,k=void 0===B?h:B,R=t.redirectNavigator,T=void 0===R?new o.RedirectNavigator:R,U=t.popupNavigator,D=void 0===U?new s.PopupNavigator:U,M=t.iframeNavigator,L=void 0===M?new a.IFrameNavigator:M,N=t.userStore,O=void 0===N?new u.WebStorageStateStore({store:c.Global.sessionStorage}):N;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,UserManagerSettings);var H=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,arguments[0]));return H._popup_redirect_uri=r,H._popup_post_logout_redirect_uri=i,H._popupWindowFeatures=n,H._popupWindowTarget=g,H._silent_redirect_uri=p,H._silentRequestTimeout=d,H._automaticSilentRenew=!!y,H._includeIdTokenInSilentRenew=S,H._accessTokenExpiringNotificationTime=k,H._monitorSession=F,H._checkSessionInterval=w,H._stopCheckSessionOnError=x,H._query_status_response_type=C,H._revokeAccessTokenOnSignout=I,H._redirectNavigator=T,H._popupNavigator=D,H._iframeNavigator=L,H._userStore=O,H}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(UserManagerSettings,e),i(UserManagerSettings,[{key:"popup_redirect_uri",get:function get(){return this._popup_redirect_uri}},{key:"popup_post_logout_redirect_uri",get:function get(){return this._popup_post_logout_redirect_uri}},{key:"popupWindowFeatures",get:function get(){return this._popupWindowFeatures}},{key:"popupWindowTarget",get:function get(){return this._popupWindowTarget}},{key:"silent_redirect_uri",get:function get(){return this._silent_redirect_uri}},{key:"silentRequestTimeout",get:function get(){return this._silentRequestTimeout}},{key:"automaticSilentRenew",get:function get(){return!(!this.silent_redirect_uri||!this._automaticSilentRenew)}},{key:"includeIdTokenInSilentRenew",get:function get(){return this._includeIdTokenInSilentRenew}},{key:"accessTokenExpiringNotificationTime",get:function get(){return this._accessTokenExpiringNotificationTime}},{key:"monitorSession",get:function get(){return this._monitorSession}},{key:"checkSessionInterval",get:function get(){return this._checkSessionInterval}},{key:"stopCheckSessionOnError",get:function get(){return this._stopCheckSessionOnError}},{key:"query_status_response_type",get:function get(){return this._query_status_response_type}},{key:"revokeAccessTokenOnSignout",get:function get(){return this._revokeAccessTokenOnSignout}},{key:"redirectNavigator",get:function get(){return this._redirectNavigator}},{key:"popupNavigator",get:function get(){return this._popupNavigator}},{key:"iframeNavigator",get:function get(){return this._iframeNavigator}},{key:"userStore",get:function get(){return this._userStore}}]),UserManagerSettings}(n.OidcClientSettings)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UserManager=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0),o=r(18),s=r(29),a=r(13),u=r(23),c=r(21),h=r(10),l=r(8);t.UserManager=function(e){function UserManager(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c.SilentRenewService,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:h.SessionMonitor,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:l.TokenRevocationClient;!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,UserManager),t instanceof s.UserManagerSettings||(t=new s.UserManagerSettings(t));var a=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,t));return a._events=new u.UserManagerEvents(t),a._silentRenewService=new r(a),a.settings.automaticSilentRenew&&(n.Log.debug("UserManager.ctor: automaticSilentRenew is configured, setting up silent renew"),a.startSilentRenew()),a.settings.monitorSession&&(n.Log.debug("UserManager.ctor: monitorSession is configured, setting up session monitor"),a._sessionMonitor=new i(a)),a._tokenRevocationClient=new o(a._settings),a}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(UserManager,e),UserManager.prototype.getUser=function getUser(){var e=this;return this._loadUser().then(function(t){return t?(n.Log.info("UserManager.getUser: user loaded"),e._events.load(t,!1),t):(n.Log.info("UserManager.getUser: user not found in storage"),null)})},UserManager.prototype.removeUser=function removeUser(){var e=this;return this.storeUser(null).then(function(){n.Log.info("UserManager.removeUser: user removed from storage"),e._events.unload()})},UserManager.prototype.signinRedirect=function signinRedirect(e){return this._signinStart(e,this._redirectNavigator).then(function(){n.Log.info("UserManager.signinRedirect: successful")})},UserManager.prototype.signinRedirectCallback=function signinRedirectCallback(e){return this._signinEnd(e||this._redirectNavigator.url).then(function(e){return e&&(e.profile&&e.profile.sub?n.Log.info("UserManager.signinRedirectCallback: successful, signed in sub: ",e.profile.sub):n.Log.info("UserManager.signinRedirectCallback: no sub")),e})},UserManager.prototype.signinPopup=function signinPopup(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.redirect_uri||this.settings.popup_redirect_uri||this.settings.redirect_uri;return t?(e.redirect_uri=t,e.display="popup",this._signin(e,this._popupNavigator,{startUrl:t,popupWindowFeatures:e.popupWindowFeatures||this.settings.popupWindowFeatures,popupWindowTarget:e.popupWindowTarget||this.settings.popupWindowTarget}).then(function(e){return e&&(e.profile&&e.profile.sub?n.Log.info("UserManager.signinPopup: signinPopup successful, signed in sub: ",e.profile.sub):n.Log.info("UserManager.signinPopup: no sub")),e})):(n.Log.error("UserManager.signinPopup: No popup_redirect_uri or redirect_uri configured"),Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured")))},UserManager.prototype.signinPopupCallback=function signinPopupCallback(e){return this._signinCallback(e,this._popupNavigator).then(function(e){return e&&(e.profile&&e.profile.sub?n.Log.info("UserManager.signinPopupCallback: successful, signed in sub: ",e.profile.sub):n.Log.info("UserManager.signinPopupCallback: no sub")),e}).catch(function(e){n.Log.error("UserManager.signinPopupCallback error: "+e&&e.message)})},UserManager.prototype.signinSilent=function signinSilent(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.redirect_uri||this.settings.silent_redirect_uri;if(!r)return n.Log.error("UserManager.signinSilent: No silent_redirect_uri configured"),Promise.reject(new Error("No silent_redirect_uri configured"));t.redirect_uri=r,t.prompt="none";return(t.id_token_hint||!this.settings.includeIdTokenInSilentRenew?Promise.resolve():this._loadUser().then(function(e){t.id_token_hint=e&&e.id_token})).then(function(){return e._signin(t,e._iframeNavigator,{startUrl:r,silentRequestTimeout:t.silentRequestTimeout||e.settings.silentRequestTimeout})}).then(function(e){return e&&(e.profile&&e.profile.sub?n.Log.info("UserManager.signinSilent: successful, signed in sub: ",e.profile.sub):n.Log.info("UserManager.signinSilent: no sub")),e})},UserManager.prototype.signinSilentCallback=function signinSilentCallback(e){return this._signinCallback(e,this._iframeNavigator).then(function(e){return e&&(e.profile&&e.profile.sub?n.Log.info("UserManager.signinSilentCallback: successful, signed in sub: ",e.profile.sub):n.Log.info("UserManager.signinSilentCallback: no sub")),e})},UserManager.prototype.querySessionStatus=function querySessionStatus(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.redirect_uri||this.settings.silent_redirect_uri;return r?(t.redirect_uri=r,t.prompt="none",t.response_type=t.response_type||this.settings.query_status_response_type,t.scope="openid",this._signinStart(t,this._iframeNavigator,{startUrl:r,silentRequestTimeout:t.silentRequestTimeout||this.settings.silentRequestTimeout}).then(function(t){return e.processSigninResponse(t.url).then(function(e){if(n.Log.debug("UserManager.querySessionStatus: got signin response"),e.session_state&&e.profile.sub)return n.Log.info("UserManager.querySessionStatus: querySessionStatus success for sub: ",e.profile.sub),{session_state:e.session_state,sub:e.profile.sub,sid:e.profile.sid};n.Log.info("querySessionStatus successful, user not authenticated")})})):(n.Log.error("UserManager.querySessionStatus: No silent_redirect_uri configured"),Promise.reject(new Error("No silent_redirect_uri configured")))},UserManager.prototype._signin=function _signin(e,t){var r=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return this._signinStart(e,t,i).then(function(e){return r._signinEnd(e.url)})},UserManager.prototype._signinStart=function _signinStart(e,t){var r=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return t.prepare(i).then(function(t){return n.Log.debug("UserManager._signinStart: got navigator window handle"),r.createSigninRequest(e).then(function(e){return n.Log.debug("UserManager._signinStart: got signin request"),i.url=e.url,i.id=e.state.id,t.navigate(i)}).catch(function(e){throw t.close&&(n.Log.debug("UserManager._signinStart: Error after preparing navigator, closing navigator window"),t.close()),e})})},UserManager.prototype._signinEnd=function _signinEnd(e){var t=this;return this.processSigninResponse(e).then(function(e){n.Log.debug("UserManager._signinEnd: got signin response");var r=new a.User(e);return t.storeUser(r).then(function(){return n.Log.debug("UserManager._signinEnd: user stored"),t._events.load(r),r})})},UserManager.prototype._signinCallback=function _signinCallback(e,t){return n.Log.debug("UserManager._signinCallback"),t.callback(e)},UserManager.prototype.signoutRedirect=function signoutRedirect(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.post_logout_redirect_uri||this.settings.post_logout_redirect_uri;return t&&(e.post_logout_redirect_uri=t),this._signoutStart(e,this._redirectNavigator).then(function(){n.Log.info("UserManager.signoutRedirect: successful")})},UserManager.prototype.signoutRedirectCallback=function signoutRedirectCallback(e){return this._signoutEnd(e||this._redirectNavigator.url).then(function(e){return n.Log.info("UserManager.signoutRedirectCallback: successful"),e})},UserManager.prototype.signoutPopup=function signoutPopup(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.post_logout_redirect_uri||this.settings.popup_post_logout_redirect_uri||this.settings.post_logout_redirect_uri;return e.post_logout_redirect_uri=t,e.display="popup",e.post_logout_redirect_uri&&(e.state=e.state||{}),this._signout(e,this._popupNavigator,{startUrl:t,popupWindowFeatures:e.popupWindowFeatures||this.settings.popupWindowFeatures,popupWindowTarget:e.popupWindowTarget||this.settings.popupWindowTarget}).then(function(){n.Log.info("UserManager.signoutPopup: successful")})},UserManager.prototype.signoutPopupCallback=function signoutPopupCallback(e,t){void 0===t&&"boolean"==typeof e&&(t=e,e=null);return this._popupNavigator.callback(e,t,"?").then(function(){n.Log.info("UserManager.signoutPopupCallback: successful")})},UserManager.prototype._signout=function _signout(e,t){var r=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return this._signoutStart(e,t,i).then(function(e){return r._signoutEnd(e.url)})},UserManager.prototype._signoutStart=function _signoutStart(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=this,r=arguments[1],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return r.prepare(i).then(function(r){return n.Log.debug("UserManager._signoutStart: got navigator window handle"),t._loadUser().then(function(o){return n.Log.debug("UserManager._signoutStart: loaded current user from storage"),(t._settings.revokeAccessTokenOnSignout?t._revokeInternal(o):Promise.resolve()).then(function(){var s=e.id_token_hint||o&&o.id_token;return s&&(n.Log.debug("UserManager._signoutStart: Setting id_token into signout request"),e.id_token_hint=s),t.removeUser().then(function(){return n.Log.debug("UserManager._signoutStart: user removed, creating signout request"),t.createSignoutRequest(e).then(function(e){return n.Log.debug("UserManager._signoutStart: got signout request"),i.url=e.url,e.state&&(i.id=e.state.id),r.navigate(i)})})})}).catch(function(e){throw r.close&&(n.Log.debug("UserManager._signoutStart: Error after preparing navigator, closing navigator window"),r.close()),e})})},UserManager.prototype._signoutEnd=function _signoutEnd(e){return this.processSignoutResponse(e).then(function(e){return n.Log.debug("UserManager._signoutEnd: got signout response"),e})},UserManager.prototype.revokeAccessToken=function revokeAccessToken(){var e=this;return this._loadUser().then(function(t){return e._revokeInternal(t,!0).then(function(r){if(r)return n.Log.debug("UserManager.revokeAccessToken: removing token properties from user and re-storing"),t.access_token=null,t.expires_at=null,t.token_type=null,e.storeUser(t).then(function(){n.Log.debug("UserManager.revokeAccessToken: user stored"),e._events.load(t)})})}).then(function(){n.Log.info("UserManager.revokeAccessToken: access token revoked successfully")})},UserManager.prototype._revokeInternal=function _revokeInternal(e,t){var r=e&&e.access_token;return!r||r.indexOf(".")>=0?(n.Log.debug("UserManager.revokeAccessToken: no need to revoke due to no user, token, or JWT format"),Promise.resolve(!1)):this._tokenRevocationClient.revoke(r,t).then(function(){return!0})},UserManager.prototype.startSilentRenew=function startSilentRenew(){this._silentRenewService.start()},UserManager.prototype.stopSilentRenew=function stopSilentRenew(){this._silentRenewService.stop()},UserManager.prototype._loadUser=function _loadUser(){return this._userStore.get(this._userStoreKey).then(function(e){return e?(n.Log.debug("UserManager._loadUser: user storageString loaded"),a.User.fromStorageString(e)):(n.Log.debug("UserManager._loadUser: no user storageString"),null)})},UserManager.prototype.storeUser=function storeUser(e){if(e){n.Log.debug("UserManager.storeUser: storing user");var t=e.toStorageString();return this._userStore.set(this._userStoreKey,t)}return n.Log.debug("storeUser.storeUser: removing user"),this._userStore.remove(this._userStoreKey)},i(UserManager,[{key:"_redirectNavigator",get:function get(){return this.settings.redirectNavigator}},{key:"_popupNavigator",get:function get(){return this.settings.popupNavigator}},{key:"_iframeNavigator",get:function get(){return this.settings.iframeNavigator}},{key:"_userStore",get:function get(){return this.settings.userStore}},{key:"events",get:function get(){return this._events}},{key:"_userStoreKey",get:function get(){return"user:"+this.settings.authority+":"+this.settings.client_id}}]),UserManager}(o.OidcClient)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.InMemoryWebStorage=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(0);t.InMemoryWebStorage=function(){function InMemoryWebStorage(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,InMemoryWebStorage),this._data={}}return InMemoryWebStorage.prototype.getItem=function getItem(e){return n.Log.debug("InMemoryWebStorage.getItem",e),this._data[e]},InMemoryWebStorage.prototype.setItem=function setItem(e,t){n.Log.debug("InMemoryWebStorage.setItem",e),this._data[e]=t},InMemoryWebStorage.prototype.removeItem=function removeItem(e){n.Log.debug("InMemoryWebStorage.removeItem",e),delete this._data[e]},InMemoryWebStorage.prototype.key=function key(e){return Object.getOwnPropertyNames(this._data)[e]},i(InMemoryWebStorage,[{key:"length",get:function get(){return Object.getOwnPropertyNames(this._data).length}}]),InMemoryWebStorage}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SignoutResponse=void 0;var i=r(2);t.SignoutResponse=function SignoutResponse(e){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SignoutResponse);var t=i.UrlUtility.parseUrlFragment(e,"?");this.error=t.error,this.error_description=t.error_description,this.error_uri=t.error_uri,this.state=t.state}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SignoutRequest=void 0;var i=r(0),n=r(2),o=r(4);t.SignoutRequest=function SignoutRequest(e){var t=e.url,r=e.id_token_hint,s=e.post_logout_redirect_uri,a=e.data;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SignoutRequest),!t)throw i.Log.error("SignoutRequest.ctor: No url passed"),new Error("url");r&&(t=n.UrlUtility.addQueryParam(t,"id_token_hint",r)),s&&(t=n.UrlUtility.addQueryParam(t,"post_logout_redirect_uri",s),a&&(this.state=new o.State({data:a}),t=n.UrlUtility.addQueryParam(t,"state",this.state.id))),this.url=t}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SigninResponse=void 0;var i=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(2);t.SigninResponse=function(){function SigninResponse(e){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SigninResponse);var t=n.UrlUtility.parseUrlFragment(e,"#");this.error=t.error,this.error_description=t.error_description,this.error_uri=t.error_uri,this.state=t.state,this.id_token=t.id_token,this.session_state=t.session_state,this.access_token=t.access_token,this.token_type=t.token_type,this.scope=t.scope,this.profile=void 0;var r=parseInt(t.expires_in);if("number"==typeof r&&r>0){var i=parseInt(Date.now()/1e3);this.expires_at=i+r}}return i(SigninResponse,[{key:"expires_in",get:function get(){if(this.expires_at){var e=parseInt(Date.now()/1e3);return this.expires_at-e}}},{key:"expired",get:function get(){var e=this.expires_in;if(void 0!==e)return e<=0}},{key:"scopes",get:function get(){return(this.scope||"").split(" ")}},{key:"isOpenIdConnect",get:function get(){return this.scopes.indexOf("openid")>=0||!!this.id_token}}]),SigninResponse}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SigninRequest=void 0;var i=r(0),n=r(2),o=r(15);t.SigninRequest=function(){function SigninRequest(e){var t=e.url,r=e.client_id,s=e.redirect_uri,a=e.response_type,u=e.scope,c=e.authority,h=e.data,l=e.prompt,f=e.display,g=e.max_age,p=e.ui_locales,d=e.id_token_hint,v=e.login_hint,y=e.acr_values,m=e.resource,S=e.request,b=e.request_uri,F=e.extraQueryParams;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,SigninRequest),!t)throw i.Log.error("SigninRequest.ctor: No url passed"),new Error("url");if(!r)throw i.Log.error("SigninRequest.ctor: No client_id passed"),new Error("client_id");if(!s)throw i.Log.error("SigninRequest.ctor: No redirect_uri passed"),new Error("redirect_uri");if(!a)throw i.Log.error("SigninRequest.ctor: No response_type passed"),new Error("response_type");if(!u)throw i.Log.error("SigninRequest.ctor: No scope passed"),new Error("scope");if(!c)throw i.Log.error("SigninRequest.ctor: No authority passed"),new Error("authority");var _=SigninRequest.isOidc(a);this.state=new o.SigninState({nonce:_,data:h,client_id:r,authority:c}),t=n.UrlUtility.addQueryParam(t,"client_id",r),t=n.UrlUtility.addQueryParam(t,"redirect_uri",s),t=n.UrlUtility.addQueryParam(t,"response_type",a),t=n.UrlUtility.addQueryParam(t,"scope",u),t=n.UrlUtility.addQueryParam(t,"state",this.state.id),_&&(t=n.UrlUtility.addQueryParam(t,"nonce",this.state.nonce));var w={prompt:l,display:f,max_age:g,ui_locales:p,id_token_hint:d,login_hint:v,acr_values:y,resource:m,request:S,request_uri:b};for(var E in w)w[E]&&(t=n.UrlUtility.addQueryParam(t,E,w[E]));for(var x in F)t=n.UrlUtility.addQueryParam(t,x,F[x]);this.url=t}return SigninRequest.isOidc=function isOidc(e){return!!e.split(/\s+/g).filter(function(e){return"id_token"===e})[0]},SigninRequest.isOAuth=function isOAuth(e){return!!e.split(/\s+/g).filter(function(e){return"token"===e})[0]},SigninRequest}()},function(e,t){var r={}.toString;e.exports=Array.isArray||function(e){return"[object Array]"==r.call(e)}},function(e,t){t.read=function(e,t,r,i,n){var o,s,a=8*n-i-1,u=(1<<a)-1,c=u>>1,h=-7,l=r?n-1:0,f=r?-1:1,g=e[t+l];for(l+=f,o=g&(1<<-h)-1,g>>=-h,h+=a;h>0;o=256*o+e[t+l],l+=f,h-=8);for(s=o&(1<<-h)-1,o>>=-h,h+=i;h>0;s=256*s+e[t+l],l+=f,h-=8);if(0===o)o=1-c;else{if(o===u)return s?NaN:1/0*(g?-1:1);s+=Math.pow(2,i),o-=c}return(g?-1:1)*s*Math.pow(2,o-i)},t.write=function(e,t,r,i,n,o){var s,a,u,c=8*o-n-1,h=(1<<c)-1,l=h>>1,f=23===n?Math.pow(2,-24)-Math.pow(2,-77):0,g=i?0:o-1,p=i?1:-1,d=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,s=h):(s=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-s))<1&&(s--,u*=2),(t+=s+l>=1?f/u:f*Math.pow(2,1-l))*u>=2&&(s++,u/=2),s+l>=h?(a=0,s=h):s+l>=1?(a=(t*u-1)*Math.pow(2,n),s+=l):(a=t*Math.pow(2,l-1)*Math.pow(2,n),s=0));n>=8;e[r+g]=255&a,g+=p,a/=256,n-=8);for(s=s<<n|a,c+=n;c>0;e[r+g]=255&s,g+=p,s/=256,c-=8);e[r+g-p]|=128*d}},function(e,t,r){"use strict";t.byteLength=function byteLength(e){var t=getLens(e),r=t[0],i=t[1];return 3*(r+i)/4-i},t.toByteArray=function toByteArray(e){for(var t,r=getLens(e),i=r[0],s=r[1],a=new o(function _byteLength(e,t,r){return 3*(t+r)/4-r}(0,i,s)),u=0,c=s>0?i-4:i,h=0;h<c;h+=4)t=n[e.charCodeAt(h)]<<18|n[e.charCodeAt(h+1)]<<12|n[e.charCodeAt(h+2)]<<6|n[e.charCodeAt(h+3)],a[u++]=t>>16&255,a[u++]=t>>8&255,a[u++]=255&t;2===s&&(t=n[e.charCodeAt(h)]<<2|n[e.charCodeAt(h+1)]>>4,a[u++]=255&t);1===s&&(t=n[e.charCodeAt(h)]<<10|n[e.charCodeAt(h+1)]<<4|n[e.charCodeAt(h+2)]>>2,a[u++]=t>>8&255,a[u++]=255&t);return a},t.fromByteArray=function fromByteArray(e){for(var t,r=e.length,n=r%3,o=[],s=0,a=r-n;s<a;s+=16383)o.push(encodeChunk(e,s,s+16383>a?a:s+16383));1===n?(t=e[r-1],o.push(i[t>>2]+i[t<<4&63]+"==")):2===n&&(t=(e[r-2]<<8)+e[r-1],o.push(i[t>>10]+i[t>>4&63]+i[t<<2&63]+"="));return o.join("")};for(var i=[],n=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,u=s.length;a<u;++a)i[a]=s[a],n[s.charCodeAt(a)]=a;function getLens(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function tripletToBase64(e){return i[e>>18&63]+i[e>>12&63]+i[e>>6&63]+i[63&e]}function encodeChunk(e,t,r){for(var i,n=[],o=t;o<r;o+=3)i=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),n.push(tripletToBase64(i));return n.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},function(e,t){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){"use strict";(function(e){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var i=r(38),n=r(37),o=r(36);function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function createBuffer(e,t){if(kMaxLength()<t)throw new RangeError("Invalid typed array length");return Buffer.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t)).__proto__=Buffer.prototype:(null===e&&(e=new Buffer(t)),e.length=t),e}function Buffer(e,t,r){if(!(Buffer.TYPED_ARRAY_SUPPORT||this instanceof Buffer))return new Buffer(e,t,r);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return allocUnsafe(this,e)}return from(this,e,t,r)}function from(e,t,r,i){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?function fromArrayBuffer(e,t,r,i){if(t.byteLength,r<0||t.byteLength<r)throw new RangeError("'offset' is out of bounds");if(t.byteLength<r+(i||0))throw new RangeError("'length' is out of bounds");t=void 0===r&&void 0===i?new Uint8Array(t):void 0===i?new Uint8Array(t,r):new Uint8Array(t,r,i);Buffer.TYPED_ARRAY_SUPPORT?(e=t).__proto__=Buffer.prototype:e=fromArrayLike(e,t);return e}(e,t,r,i):"string"==typeof t?function fromString(e,t,r){"string"==typeof r&&""!==r||(r="utf8");if(!Buffer.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var i=0|byteLength(t,r),n=(e=createBuffer(e,i)).write(t,r);n!==i&&(e=e.slice(0,n));return e}(e,t,r):function fromObject(e,t){if(Buffer.isBuffer(t)){var r=0|checked(t.length);return 0===(e=createBuffer(e,r)).length?e:(t.copy(e,0,0,r),e)}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||function isnan(e){return e!=e}(t.length)?createBuffer(e,0):fromArrayLike(e,t);if("Buffer"===t.type&&o(t.data))return fromArrayLike(e,t.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(e,t)}function assertSize(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function allocUnsafe(e,t){if(assertSize(t),e=createBuffer(e,t<0?0:0|checked(t)),!Buffer.TYPED_ARRAY_SUPPORT)for(var r=0;r<t;++r)e[r]=0;return e}function fromArrayLike(e,t){var r=t.length<0?0:0|checked(t.length);e=createBuffer(e,r);for(var i=0;i<r;i+=1)e[i]=255&t[i];return e}function checked(e){if(e>=kMaxLength())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+kMaxLength().toString(16)+" bytes");return 0|e}function byteLength(e,t){if(Buffer.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var r=e.length;if(0===r)return 0;for(var i=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(e).length;default:if(i)return utf8ToBytes(e).length;t=(""+t).toLowerCase(),i=!0}}function swap(e,t,r){var i=e[t];e[t]=e[r],e[r]=i}function bidirectionalIndexOf(e,t,r,i,n){if(0===e.length)return-1;if("string"==typeof r?(i=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=n?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(n)return-1;r=e.length-1}else if(r<0){if(!n)return-1;r=0}if("string"==typeof t&&(t=Buffer.from(t,i)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(e,t,r,i,n);if("number"==typeof t)return t&=255,Buffer.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?n?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):arrayIndexOf(e,[t],r,i,n);throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,t,r,i,n){var o,s=1,a=e.length,u=t.length;if(void 0!==i&&("ucs2"===(i=String(i).toLowerCase())||"ucs-2"===i||"utf16le"===i||"utf-16le"===i)){if(e.length<2||t.length<2)return-1;s=2,a/=2,u/=2,r/=2}function read(e,t){return 1===s?e[t]:e.readUInt16BE(t*s)}if(n){var c=-1;for(o=r;o<a;o++)if(read(e,o)===read(t,-1===c?0:o-c)){if(-1===c&&(c=o),o-c+1===u)return c*s}else-1!==c&&(o-=o-c),c=-1}else for(r+u>a&&(r=a-u),o=r;o>=0;o--){for(var h=!0,l=0;l<u;l++)if(read(e,o+l)!==read(t,l)){h=!1;break}if(h)return o}return-1}function hexWrite(e,t,r,i){r=Number(r)||0;var n=e.length-r;i?(i=Number(i))>n&&(i=n):i=n;var o=t.length;if(o%2!=0)throw new TypeError("Invalid hex string");i>o/2&&(i=o/2);for(var s=0;s<i;++s){var a=parseInt(t.substr(2*s,2),16);if(isNaN(a))return s;e[r+s]=a}return s}function utf8Write(e,t,r,i){return blitBuffer(utf8ToBytes(t,e.length-r),e,r,i)}function asciiWrite(e,t,r,i){return blitBuffer(function asciiToBytes(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,i)}function latin1Write(e,t,r,i){return asciiWrite(e,t,r,i)}function base64Write(e,t,r,i){return blitBuffer(base64ToBytes(t),e,r,i)}function ucs2Write(e,t,r,i){return blitBuffer(function utf16leToBytes(e,t){for(var r,i,n,o=[],s=0;s<e.length&&!((t-=2)<0);++s)r=e.charCodeAt(s),i=r>>8,n=r%256,o.push(n),o.push(i);return o}(t,e.length-r),e,r,i)}function base64Slice(e,t,r){return 0===t&&r===e.length?i.fromByteArray(e):i.fromByteArray(e.slice(t,r))}function utf8Slice(e,t,r){r=Math.min(e.length,r);for(var i=[],n=t;n<r;){var o,a,u,c,h=e[n],l=null,f=h>239?4:h>223?3:h>191?2:1;if(n+f<=r)switch(f){case 1:h<128&&(l=h);break;case 2:128==(192&(o=e[n+1]))&&(c=(31&h)<<6|63&o)>127&&(l=c);break;case 3:o=e[n+1],a=e[n+2],128==(192&o)&&128==(192&a)&&(c=(15&h)<<12|(63&o)<<6|63&a)>2047&&(c<55296||c>57343)&&(l=c);break;case 4:o=e[n+1],a=e[n+2],u=e[n+3],128==(192&o)&&128==(192&a)&&128==(192&u)&&(c=(15&h)<<18|(63&o)<<12|(63&a)<<6|63&u)>65535&&c<1114112&&(l=c)}null===l?(l=65533,f=1):l>65535&&(l-=65536,i.push(l>>>10&1023|55296),l=56320|1023&l),i.push(l),n+=f}return function decodeCodePointsArray(e){var t=e.length;if(t<=s)return String.fromCharCode.apply(String,e);var r="",i=0;for(;i<t;)r+=String.fromCharCode.apply(String,e.slice(i,i+=s));return r}(i)}t.Buffer=Buffer,t.SlowBuffer=function SlowBuffer(e){+e!=e&&(e=0);return Buffer.alloc(+e)},t.INSPECT_MAX_BYTES=50,Buffer.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:function typedArraySupport(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(e){return!1}}(),t.kMaxLength=kMaxLength(),Buffer.poolSize=8192,Buffer._augment=function(e){return e.__proto__=Buffer.prototype,e},Buffer.from=function(e,t,r){return from(null,e,t,r)},Buffer.TYPED_ARRAY_SUPPORT&&(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0})),Buffer.alloc=function(e,t,r){return function alloc(e,t,r,i){return assertSize(t),t<=0?createBuffer(e,t):void 0!==r?"string"==typeof i?createBuffer(e,t).fill(r,i):createBuffer(e,t).fill(r):createBuffer(e,t)}(null,e,t,r)},Buffer.allocUnsafe=function(e){return allocUnsafe(null,e)},Buffer.allocUnsafeSlow=function(e){return allocUnsafe(null,e)},Buffer.isBuffer=function isBuffer(e){return!(null==e||!e._isBuffer)},Buffer.compare=function compare(e,t){if(!Buffer.isBuffer(e)||!Buffer.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var r=e.length,i=t.length,n=0,o=Math.min(r,i);n<o;++n)if(e[n]!==t[n]){r=e[n],i=t[n];break}return r<i?-1:i<r?1:0},Buffer.isEncoding=function isEncoding(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function concat(e,t){if(!o(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Buffer.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var i=Buffer.allocUnsafe(t),n=0;for(r=0;r<e.length;++r){var s=e[r];if(!Buffer.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(i,n),n+=s.length}return i},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function swap16(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)swap(this,t,t+1);return this},Buffer.prototype.swap32=function swap32(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)swap(this,t,t+3),swap(this,t+1,t+2);return this},Buffer.prototype.swap64=function swap64(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)swap(this,t,t+7),swap(this,t+1,t+6),swap(this,t+2,t+5),swap(this,t+3,t+4);return this},Buffer.prototype.toString=function toString(){var e=0|this.length;return 0===e?"":0===arguments.length?utf8Slice(this,0,e):function slowToString(e,t,r){var i=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return hexSlice(this,t,r);case"utf8":case"utf-8":return utf8Slice(this,t,r);case"ascii":return asciiSlice(this,t,r);case"latin1":case"binary":return latin1Slice(this,t,r);case"base64":return base64Slice(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,t,r);default:if(i)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),i=!0}}.apply(this,arguments)},Buffer.prototype.equals=function equals(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===Buffer.compare(this,e)},Buffer.prototype.inspect=function inspect(){var e="",r=t.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(e+=" ... ")),"<Buffer "+e+">"},Buffer.prototype.compare=function compare(e,t,r,i,n){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===i&&(i=0),void 0===n&&(n=this.length),t<0||r>e.length||i<0||n>this.length)throw new RangeError("out of range index");if(i>=n&&t>=r)return 0;if(i>=n)return-1;if(t>=r)return 1;if(t>>>=0,r>>>=0,i>>>=0,n>>>=0,this===e)return 0;for(var o=n-i,s=r-t,a=Math.min(o,s),u=this.slice(i,n),c=e.slice(t,r),h=0;h<a;++h)if(u[h]!==c[h]){o=u[h],s=c[h];break}return o<s?-1:s<o?1:0},Buffer.prototype.includes=function includes(e,t,r){return-1!==this.indexOf(e,t,r)},Buffer.prototype.indexOf=function indexOf(e,t,r){return bidirectionalIndexOf(this,e,t,r,!0)},Buffer.prototype.lastIndexOf=function lastIndexOf(e,t,r){return bidirectionalIndexOf(this,e,t,r,!1)},Buffer.prototype.write=function write(e,t,r,i){if(void 0===t)i="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)i=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(r)?(r|=0,void 0===i&&(i="utf8")):(i=r,r=void 0)}var n=this.length-t;if((void 0===r||r>n)&&(r=n),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");i||(i="utf8");for(var o=!1;;)switch(i){case"hex":return hexWrite(this,e,t,r);case"utf8":case"utf-8":return utf8Write(this,e,t,r);case"ascii":return asciiWrite(this,e,t,r);case"latin1":case"binary":return latin1Write(this,e,t,r);case"base64":return base64Write(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,t,r);default:if(o)throw new TypeError("Unknown encoding: "+i);i=(""+i).toLowerCase(),o=!0}},Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var s=4096;function asciiSlice(e,t,r){var i="";r=Math.min(e.length,r);for(var n=t;n<r;++n)i+=String.fromCharCode(127&e[n]);return i}function latin1Slice(e,t,r){var i="";r=Math.min(e.length,r);for(var n=t;n<r;++n)i+=String.fromCharCode(e[n]);return i}function hexSlice(e,t,r){var i=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>i)&&(r=i);for(var n="",o=t;o<r;++o)n+=toHex(e[o]);return n}function utf16leSlice(e,t,r){for(var i=e.slice(t,r),n="",o=0;o<i.length;o+=2)n+=String.fromCharCode(i[o]+256*i[o+1]);return n}function checkOffset(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(e,t,r,i,n,o){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>n||t<o)throw new RangeError('"value" argument is out of bounds');if(r+i>e.length)throw new RangeError("Index out of range")}function objectWriteUInt16(e,t,r,i){t<0&&(t=65535+t+1);for(var n=0,o=Math.min(e.length-r,2);n<o;++n)e[r+n]=(t&255<<8*(i?n:1-n))>>>8*(i?n:1-n)}function objectWriteUInt32(e,t,r,i){t<0&&(t=4294967295+t+1);for(var n=0,o=Math.min(e.length-r,4);n<o;++n)e[r+n]=t>>>8*(i?n:3-n)&255}function checkIEEE754(e,t,r,i,n,o){if(r+i>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function writeFloat(e,t,r,i,o){return o||checkIEEE754(e,0,r,4),n.write(e,t,r,i,23,4),r+4}function writeDouble(e,t,r,i,o){return o||checkIEEE754(e,0,r,8),n.write(e,t,r,i,52,8),r+8}Buffer.prototype.slice=function slice(e,t){var r,i=this.length;if(e=~~e,t=void 0===t?i:~~t,e<0?(e+=i)<0&&(e=0):e>i&&(e=i),t<0?(t+=i)<0&&(t=0):t>i&&(t=i),t<e&&(t=e),Buffer.TYPED_ARRAY_SUPPORT)(r=this.subarray(e,t)).__proto__=Buffer.prototype;else{var n=t-e;r=new Buffer(n,void 0);for(var o=0;o<n;++o)r[o]=this[o+e]}return r},Buffer.prototype.readUIntLE=function readUIntLE(e,t,r){e|=0,t|=0,r||checkOffset(e,t,this.length);for(var i=this[e],n=1,o=0;++o<t&&(n*=256);)i+=this[e+o]*n;return i},Buffer.prototype.readUIntBE=function readUIntBE(e,t,r){e|=0,t|=0,r||checkOffset(e,t,this.length);for(var i=this[e+--t],n=1;t>0&&(n*=256);)i+=this[e+--t]*n;return i},Buffer.prototype.readUInt8=function readUInt8(e,t){return t||checkOffset(e,1,this.length),this[e]},Buffer.prototype.readUInt16LE=function readUInt16LE(e,t){return t||checkOffset(e,2,this.length),this[e]|this[e+1]<<8},Buffer.prototype.readUInt16BE=function readUInt16BE(e,t){return t||checkOffset(e,2,this.length),this[e]<<8|this[e+1]},Buffer.prototype.readUInt32LE=function readUInt32LE(e,t){return t||checkOffset(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},Buffer.prototype.readUInt32BE=function readUInt32BE(e,t){return t||checkOffset(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},Buffer.prototype.readIntLE=function readIntLE(e,t,r){e|=0,t|=0,r||checkOffset(e,t,this.length);for(var i=this[e],n=1,o=0;++o<t&&(n*=256);)i+=this[e+o]*n;return i>=(n*=128)&&(i-=Math.pow(2,8*t)),i},Buffer.prototype.readIntBE=function readIntBE(e,t,r){e|=0,t|=0,r||checkOffset(e,t,this.length);for(var i=t,n=1,o=this[e+--i];i>0&&(n*=256);)o+=this[e+--i]*n;return o>=(n*=128)&&(o-=Math.pow(2,8*t)),o},Buffer.prototype.readInt8=function readInt8(e,t){return t||checkOffset(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},Buffer.prototype.readInt16LE=function readInt16LE(e,t){t||checkOffset(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function readInt16BE(e,t){t||checkOffset(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function readInt32LE(e,t){return t||checkOffset(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},Buffer.prototype.readInt32BE=function readInt32BE(e,t){return t||checkOffset(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},Buffer.prototype.readFloatLE=function readFloatLE(e,t){return t||checkOffset(e,4,this.length),n.read(this,e,!0,23,4)},Buffer.prototype.readFloatBE=function readFloatBE(e,t){return t||checkOffset(e,4,this.length),n.read(this,e,!1,23,4)},Buffer.prototype.readDoubleLE=function readDoubleLE(e,t){return t||checkOffset(e,8,this.length),n.read(this,e,!0,52,8)},Buffer.prototype.readDoubleBE=function readDoubleBE(e,t){return t||checkOffset(e,8,this.length),n.read(this,e,!1,52,8)},Buffer.prototype.writeUIntLE=function writeUIntLE(e,t,r,i){(e=+e,t|=0,r|=0,i)||checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);var n=1,o=0;for(this[t]=255&e;++o<r&&(n*=256);)this[t+o]=e/n&255;return t+r},Buffer.prototype.writeUIntBE=function writeUIntBE(e,t,r,i){(e=+e,t|=0,r|=0,i)||checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);var n=r-1,o=1;for(this[t+n]=255&e;--n>=0&&(o*=256);)this[t+n]=e/o&255;return t+r},Buffer.prototype.writeUInt8=function writeUInt8(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},Buffer.prototype.writeUInt16LE=function writeUInt16LE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):objectWriteUInt16(this,e,t,!0),t+2},Buffer.prototype.writeUInt16BE=function writeUInt16BE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):objectWriteUInt16(this,e,t,!1),t+2},Buffer.prototype.writeUInt32LE=function writeUInt32LE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):objectWriteUInt32(this,e,t,!0),t+4},Buffer.prototype.writeUInt32BE=function writeUInt32BE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):objectWriteUInt32(this,e,t,!1),t+4},Buffer.prototype.writeIntLE=function writeIntLE(e,t,r,i){if(e=+e,t|=0,!i){var n=Math.pow(2,8*r-1);checkInt(this,e,t,r,n-1,-n)}var o=0,s=1,a=0;for(this[t]=255&e;++o<r&&(s*=256);)e<0&&0===a&&0!==this[t+o-1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+r},Buffer.prototype.writeIntBE=function writeIntBE(e,t,r,i){if(e=+e,t|=0,!i){var n=Math.pow(2,8*r-1);checkInt(this,e,t,r,n-1,-n)}var o=r-1,s=1,a=0;for(this[t+o]=255&e;--o>=0&&(s*=256);)e<0&&0===a&&0!==this[t+o+1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+r},Buffer.prototype.writeInt8=function writeInt8(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},Buffer.prototype.writeInt16LE=function writeInt16LE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):objectWriteUInt16(this,e,t,!0),t+2},Buffer.prototype.writeInt16BE=function writeInt16BE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):objectWriteUInt16(this,e,t,!1),t+2},Buffer.prototype.writeInt32LE=function writeInt32LE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):objectWriteUInt32(this,e,t,!0),t+4},Buffer.prototype.writeInt32BE=function writeInt32BE(e,t,r){return e=+e,t|=0,r||checkInt(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),Buffer.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):objectWriteUInt32(this,e,t,!1),t+4},Buffer.prototype.writeFloatLE=function writeFloatLE(e,t,r){return writeFloat(this,e,t,!0,r)},Buffer.prototype.writeFloatBE=function writeFloatBE(e,t,r){return writeFloat(this,e,t,!1,r)},Buffer.prototype.writeDoubleLE=function writeDoubleLE(e,t,r){return writeDouble(this,e,t,!0,r)},Buffer.prototype.writeDoubleBE=function writeDoubleBE(e,t,r){return writeDouble(this,e,t,!1,r)},Buffer.prototype.copy=function copy(e,t,r,i){if(r||(r=0),i||0===i||(i=this.length),t>=e.length&&(t=e.length),t||(t=0),i>0&&i<r&&(i=r),i===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(i<0)throw new RangeError("sourceEnd out of bounds");i>this.length&&(i=this.length),e.length-t<i-r&&(i=e.length-t+r);var n,o=i-r;if(this===e&&r<t&&t<i)for(n=o-1;n>=0;--n)e[n+t]=this[n+r];else if(o<1e3||!Buffer.TYPED_ARRAY_SUPPORT)for(n=0;n<o;++n)e[n+t]=this[n+r];else Uint8Array.prototype.set.call(e,this.subarray(r,r+o),t);return o},Buffer.prototype.fill=function fill(e,t,r,i){if("string"==typeof e){if("string"==typeof t?(i=t,t=0,r=this.length):"string"==typeof r&&(i=r,r=this.length),1===e.length){var n=e.charCodeAt(0);n<256&&(e=n)}if(void 0!==i&&"string"!=typeof i)throw new TypeError("encoding must be a string");if("string"==typeof i&&!Buffer.isEncoding(i))throw new TypeError("Unknown encoding: "+i)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;var o;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{var s=Buffer.isBuffer(e)?e:utf8ToBytes(new Buffer(e,i).toString()),a=s.length;for(o=0;o<r-t;++o)this[o+t]=s[o%a]}return this};var a=/[^+\/0-9A-Za-z-_]/g;function toHex(e){return e<16?"0"+e.toString(16):e.toString(16)}function utf8ToBytes(e,t){var r;t=t||1/0;for(var i=e.length,n=null,o=[],s=0;s<i;++s){if((r=e.charCodeAt(s))>55295&&r<57344){if(!n){if(r>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(s+1===i){(t-=3)>-1&&o.push(239,191,189);continue}n=r;continue}if(r<56320){(t-=3)>-1&&o.push(239,191,189),n=r;continue}r=65536+(n-55296<<10|r-56320)}else n&&(t-=3)>-1&&o.push(239,191,189);if(n=null,r<128){if((t-=1)<0)break;o.push(r)}else if(r<2048){if((t-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function base64ToBytes(e){return i.toByteArray(function base64clean(e){if((e=function stringtrim(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}(e).replace(a,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function blitBuffer(e,t,r,i){for(var n=0;n<i&&!(n+r>=t.length||n>=e.length);++n)t[n+r]=e[n];return n}}).call(this,r(39))},function(e,t,r){"use strict";(function(i){var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u={userAgent:!1},p={};
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
if(void 0===v)var v={};v.lang={extend:function extend(t,r,i){if(!r||!t)throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");var n=function d(){};if(n.prototype=r.prototype,t.prototype=new n,t.prototype.constructor=t,t.superclass=r.prototype,r.prototype.constructor==Object.prototype.constructor&&(r.prototype.constructor=r),i){var o;for(o in i)t.prototype[o]=i[o];var s=function e(){},a=["toString","valueOf"];try{/MSIE/.test(u.userAgent)&&(s=function e(t,r){for(o=0;o<a.length;o+=1){var i=a[o],n=r[i];"function"==typeof n&&n!=Object.prototype[i]&&(t[i]=n)}})}catch(e){}s(t.prototype,i)}}};
/*! CryptoJS v3.1.2 core-fix.js
 * code.google.com/p/crypto-js
 * (c) 2009-2013 by Jeff Mott. All rights reserved.
 * code.google.com/p/crypto-js/wiki/License
 * THIS IS FIX of 'core.js' to fix Hmac issue.
 * https://code.google.com/p/crypto-js/issues/detail?id=84
 * https://crypto-js.googlecode.com/svn-history/r667/branches/3.x/src/core.js
 */
var y=y||function(e,t){var r={},i=r.lib={},n=i.Base=function(){function n(){}return{extend:function extend(e){n.prototype=this;var t=new n;return e&&t.mixIn(e),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function create(){var e=this.extend();return e.init.apply(e,arguments),e},init:function init(){},mixIn:function mixIn(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function clone(){return this.init.prototype.extend(this)}}}(),o=i.WordArray=n.extend({init:function init(e,t){e=this.words=e||[],this.sigBytes=void 0!=t?t:4*e.length},toString:function toString(e){return(e||a).stringify(this)},concat:function concat(e){var t=this.words,r=e.words,i=this.sigBytes,n=e.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++){var s=r[o>>>2]>>>24-o%4*8&255;t[i+o>>>2]|=s<<24-(i+o)%4*8}else for(o=0;o<n;o+=4)t[i+o>>>2]=r[o>>>2];return this.sigBytes+=n,this},clamp:function clamp(){var t=this.words,r=this.sigBytes;t[r>>>2]&=4294967295<<32-r%4*8,t.length=e.ceil(r/4)},clone:function clone(){var e=n.clone.call(this);return e.words=this.words.slice(0),e},random:function random(t){for(var r=[],i=0;i<t;i+=4)r.push(4294967296*e.random()|0);return new o.init(r,t)}}),s=r.enc={},a=s.Hex={stringify:function stringify(e){for(var t=e.words,r=e.sigBytes,i=[],n=0;n<r;n++){var o=t[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function parse(e){for(var t=e.length,r=[],i=0;i<t;i+=2)r[i>>>3]|=parseInt(e.substr(i,2),16)<<24-i%8*4;return new o.init(r,t/2)}},u=s.Latin1={stringify:function stringify(e){for(var t=e.words,r=e.sigBytes,i=[],n=0;n<r;n++){var o=t[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(o))}return i.join("")},parse:function parse(e){for(var t=e.length,r=[],i=0;i<t;i++)r[i>>>2]|=(255&e.charCodeAt(i))<<24-i%4*8;return new o.init(r,t)}},c=s.Utf8={stringify:function stringify(e){try{return decodeURIComponent(escape(u.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function parse(e){return u.parse(unescape(encodeURIComponent(e)))}},h=i.BufferedBlockAlgorithm=n.extend({reset:function reset(){this._data=new o.init,this._nDataBytes=0},_append:function _append(e){"string"==typeof e&&(e=c.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function _process(t){var r=this._data,i=r.words,n=r.sigBytes,s=this.blockSize,a=n/(4*s),u=(a=t?e.ceil(a):e.max((0|a)-this._minBufferSize,0))*s,c=e.min(4*u,n);if(u){for(var h=0;h<u;h+=s)this._doProcessBlock(i,h);var l=i.splice(0,u);r.sigBytes-=c}return new o.init(l,c)},clone:function clone(){var e=n.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),l=(i.Hasher=h.extend({cfg:n.extend(),init:function init(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function reset(){h.reset.call(this),this._doReset()},update:function update(e){return this._append(e),this._process(),this},finalize:function finalize(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function _createHelper(e){return function(t,r){return new e.init(r).finalize(t)}},_createHmacHelper:function _createHmacHelper(e){return function(t,r){return new l.HMAC.init(e,r).finalize(t)}}}),r.algo={});return r}(Math);!function(e){var t,r=(t=y).lib,i=r.Base,n=r.WordArray;(t=t.x64={}).Word=i.extend({init:function init(e,t){this.high=e,this.low=t}}),t.WordArray=i.extend({init:function init(e,t){e=this.words=e||[],this.sigBytes=void 0!=t?t:8*e.length},toX32:function toX32(){for(var e=this.words,t=e.length,r=[],i=0;i<t;i++){var o=e[i];r.push(o.high),r.push(o.low)}return n.create(r,this.sigBytes)},clone:function clone(){for(var e=i.clone.call(this),t=e.words=this.words.slice(0),r=t.length,n=0;n<r;n++)t[n]=t[n].clone();return e}})}(),function(){var e=y,t=e.lib.WordArray;e.enc.Base64={stringify:function stringify(e){var t=e.words,r=e.sigBytes,i=this._map;e.clamp(),e=[];for(var n=0;n<r;n+=3)for(var o=(t[n>>>2]>>>24-n%4*8&255)<<16|(t[n+1>>>2]>>>24-(n+1)%4*8&255)<<8|t[n+2>>>2]>>>24-(n+2)%4*8&255,s=0;4>s&&n+.75*s<r;s++)e.push(i.charAt(o>>>6*(3-s)&63));if(t=i.charAt(64))for(;e.length%4;)e.push(t);return e.join("")},parse:function parse(e){var r=e.length,i=this._map;(n=i.charAt(64))&&(-1!=(n=e.indexOf(n))&&(r=n));for(var n=[],o=0,s=0;s<r;s++)if(s%4){var a=i.indexOf(e.charAt(s-1))<<s%4*2,u=i.indexOf(e.charAt(s))>>>6-s%4*2;n[o>>>2]|=(a|u)<<24-o%4*8,o++}return t.create(n,o)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(e){for(var t=y,r=(n=t.lib).WordArray,i=n.Hasher,n=t.algo,o=[],s=[],a=function u(e){return 4294967296*(e-(0|e))|0},u=2,c=0;64>c;){var h;e:{h=u;for(var l=e.sqrt(h),f=2;f<=l;f++)if(!(h%f)){h=!1;break e}h=!0}h&&(8>c&&(o[c]=a(e.pow(u,.5))),s[c]=a(e.pow(u,1/3)),c++),u++}var g=[];n=n.SHA256=i.extend({_doReset:function _doReset(){this._hash=new r.init(o.slice(0))},_doProcessBlock:function _doProcessBlock(e,t){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],a=r[3],u=r[4],c=r[5],h=r[6],l=r[7],f=0;64>f;f++){if(16>f)g[f]=0|e[t+f];else{var p=g[f-15],d=g[f-2];g[f]=((p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3)+g[f-7]+((d<<15|d>>>17)^(d<<13|d>>>19)^d>>>10)+g[f-16]}p=l+((u<<26|u>>>6)^(u<<21|u>>>11)^(u<<7|u>>>25))+(u&c^~u&h)+s[f]+g[f],d=((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+(i&n^i&o^n&o),l=h,h=c,c=u,u=a+p|0,a=o,o=n,n=i,i=p+d|0}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+a|0,r[4]=r[4]+u|0,r[5]=r[5]+c|0,r[6]=r[6]+h|0,r[7]=r[7]+l|0},_doFinalize:function _doFinalize(){var t=this._data,r=t.words,i=8*this._nDataBytes,n=8*t.sigBytes;return r[n>>>5]|=128<<24-n%32,r[14+(n+64>>>9<<4)]=e.floor(i/4294967296),r[15+(n+64>>>9<<4)]=i,t.sigBytes=4*r.length,this._process(),this._hash},clone:function clone(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});t.SHA256=i._createHelper(n),t.HmacSHA256=i._createHmacHelper(n)}(Math),function(){function a(){return r.create.apply(r,arguments)}for(var e=y,t=e.lib.Hasher,r=(n=e.x64).Word,i=n.WordArray,n=e.algo,o=[a(1116352408,3609767458),a(1899447441,602891725),a(3049323471,3964484399),a(3921009573,2173295548),a(961987163,4081628472),a(1508970993,3053834265),a(2453635748,2937671579),a(2870763221,3664609560),a(3624381080,2734883394),a(310598401,1164996542),a(607225278,1323610764),a(1426881987,3590304994),a(1925078388,4068182383),a(2162078206,991336113),a(2614888103,633803317),a(3248222580,3479774868),a(3835390401,2666613458),a(4022224774,944711139),a(264347078,2341262773),a(604807628,2007800933),a(770255983,1495990901),a(1249150122,1856431235),a(1555081692,3175218132),a(1996064986,2198950837),a(2554220882,3999719339),a(2821834349,766784016),a(2952996808,2566594879),a(3210313671,3203337956),a(3336571891,1034457026),a(3584528711,2466948901),a(113926993,3758326383),a(338241895,168717936),a(666307205,1188179964),a(773529912,1546045734),a(1294757372,1522805485),a(1396182291,2643833823),a(1695183700,2343527390),a(1986661051,1014477480),a(2177026350,1206759142),a(2456956037,344077627),a(2730485921,1290863460),a(2820302411,3158454273),a(3259730800,3505952657),a(3345764771,106217008),a(3516065817,3606008344),a(3600352804,1432725776),a(4094571909,1467031594),a(275423344,851169720),a(430227734,3100823752),a(506948616,1363258195),a(659060556,3750685593),a(883997877,3785050280),a(958139571,3318307427),a(1322822218,3812723403),a(1537002063,2003034995),a(1747873779,3602036899),a(1955562222,1575990012),a(2024104815,1125592928),a(2227730452,2716904306),a(2361852424,442776044),a(2428436474,593698344),a(2756734187,3733110249),a(3204031479,2999351573),a(3329325298,3815920427),a(3391569614,3928383900),a(3515267271,566280711),a(3940187606,3454069534),a(4118630271,4000239992),a(116418474,1914138554),a(174292421,2731055270),a(289380356,3203993006),a(460393269,320620315),a(685471733,587496836),a(852142971,1086792851),a(1017036298,365543100),a(1126000580,2618297676),a(1288033470,3409855158),a(1501505948,4234509866),a(1607167915,987167468),a(1816402316,1246189591)],s=[],u=0;80>u;u++)s[u]=a();n=n.SHA512=t.extend({_doReset:function _doReset(){this._hash=new i.init([new r.init(1779033703,4089235720),new r.init(3144134277,2227873595),new r.init(1013904242,4271175723),new r.init(2773480762,1595750129),new r.init(1359893119,2917565137),new r.init(2600822924,725511199),new r.init(528734635,4215389547),new r.init(1541459225,327033209)])},_doProcessBlock:function _doProcessBlock(e,t){for(var r=(l=this._hash.words)[0],i=l[1],n=l[2],a=l[3],u=l[4],c=l[5],h=l[6],l=l[7],f=r.high,g=r.low,p=i.high,d=i.low,v=n.high,y=n.low,m=a.high,S=a.low,b=u.high,F=u.low,_=c.high,w=c.low,E=h.high,x=h.low,A=l.high,C=l.low,P=f,I=g,B=p,k=d,R=v,T=y,U=m,D=S,M=b,L=F,N=_,O=w,H=E,j=x,K=A,V=C,q=0;80>q;q++){var W=s[q];if(16>q)var J=W.high=0|e[t+2*q],z=W.low=0|e[t+2*q+1];else{J=((z=(J=s[q-15]).high)>>>1|(Y=J.low)<<31)^(z>>>8|Y<<24)^z>>>7;var Y=(Y>>>1|z<<31)^(Y>>>8|z<<24)^(Y>>>7|z<<25),G=((z=(G=s[q-2]).high)>>>19|(X=G.low)<<13)^(z<<3|X>>>29)^z>>>6,X=(X>>>19|z<<13)^(X<<3|z>>>29)^(X>>>6|z<<26),$=(z=s[q-7]).high,Q=(Z=s[q-16]).high,Z=Z.low;J=(J=(J=J+$+((z=Y+z.low)>>>0<Y>>>0?1:0))+G+((z=z+X)>>>0<X>>>0?1:0))+Q+((z=z+Z)>>>0<Z>>>0?1:0);W.high=J,W.low=z}$=M&N^~M&H,Z=L&O^~L&j,W=P&B^P&R^B&R;var ee=I&k^I&T^k&T,te=(Y=(P>>>28|I<<4)^(P<<30|I>>>2)^(P<<25|I>>>7),G=(I>>>28|P<<4)^(I<<30|P>>>2)^(I<<25|P>>>7),(X=o[q]).high),re=X.low;Q=(Q=(Q=(Q=K+((M>>>14|L<<18)^(M>>>18|L<<14)^(M<<23|L>>>9))+((X=V+((L>>>14|M<<18)^(L>>>18|M<<14)^(L<<23|M>>>9)))>>>0<V>>>0?1:0))+$+((X=X+Z)>>>0<Z>>>0?1:0))+te+((X=X+re)>>>0<re>>>0?1:0))+J+((X=X+z)>>>0<z>>>0?1:0),W=Y+W+((z=G+ee)>>>0<G>>>0?1:0),K=H,V=j,H=N,j=O,N=M,O=L,M=U+Q+((L=D+X|0)>>>0<D>>>0?1:0)|0,U=R,D=T,R=B,T=k,B=P,k=I,P=Q+W+((I=X+z|0)>>>0<X>>>0?1:0)|0}g=r.low=g+I,r.high=f+P+(g>>>0<I>>>0?1:0),d=i.low=d+k,i.high=p+B+(d>>>0<k>>>0?1:0),y=n.low=y+T,n.high=v+R+(y>>>0<T>>>0?1:0),S=a.low=S+D,a.high=m+U+(S>>>0<D>>>0?1:0),F=u.low=F+L,u.high=b+M+(F>>>0<L>>>0?1:0),w=c.low=w+O,c.high=_+N+(w>>>0<O>>>0?1:0),x=h.low=x+j,h.high=E+H+(x>>>0<j>>>0?1:0),C=l.low=C+V,l.high=A+K+(C>>>0<V>>>0?1:0)},_doFinalize:function _doFinalize(){var e=this._data,t=e.words,r=8*this._nDataBytes,i=8*e.sigBytes;return t[i>>>5]|=128<<24-i%32,t[30+(i+128>>>10<<5)]=Math.floor(r/4294967296),t[31+(i+128>>>10<<5)]=r,e.sigBytes=4*t.length,this._process(),this._hash.toX32()},clone:function clone(){var e=t.clone.call(this);return e._hash=this._hash.clone(),e},blockSize:32}),e.SHA512=t._createHelper(n),e.HmacSHA512=t._createHmacHelper(n)}(),function(){var e=y,t=(n=e.x64).Word,r=n.WordArray,i=(n=e.algo).SHA512,n=n.SHA384=i.extend({_doReset:function _doReset(){this._hash=new r.init([new t.init(3418070365,3238371032),new t.init(1654270250,914150663),new t.init(2438529370,812702999),new t.init(355462360,4144912697),new t.init(1731405415,4290775857),new t.init(2394180231,1750603025),new t.init(3675008525,1694076839),new t.init(1203062813,3204075428)])},_doFinalize:function _doFinalize(){var e=i._doFinalize.call(this);return e.sigBytes-=16,e}});e.SHA384=i._createHelper(n),e.HmacSHA384=i._createHmacHelper(n)}();
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
var S,F="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_="=";function hex2b64(e){var t,r,i="";for(t=0;t+3<=e.length;t+=3)r=parseInt(e.substring(t,t+3),16),i+=F.charAt(r>>6)+F.charAt(63&r);if(t+1==e.length?(r=parseInt(e.substring(t,t+1),16),i+=F.charAt(r<<2)):t+2==e.length&&(r=parseInt(e.substring(t,t+2),16),i+=F.charAt(r>>2)+F.charAt((3&r)<<4)),_)for(;(3&i.length)>0;)i+=_;return i}function b64tohex(e){var t,r,i,n="",o=0;for(t=0;t<e.length&&e.charAt(t)!=_;++t)(i=F.indexOf(e.charAt(t)))<0||(0==o?(n+=int2char(i>>2),r=3&i,o=1):1==o?(n+=int2char(r<<2|i>>4),r=15&i,o=2):2==o?(n+=int2char(r),n+=int2char(i>>2),r=3&i,o=3):(n+=int2char(r<<2|i>>4),n+=int2char(15&i),o=0));return 1==o&&(n+=int2char(r<<2)),n}function b64toBA(e){var t,r=b64tohex(e),i=new Array;for(t=0;2*t<r.length;++t)i[t]=parseInt(r.substring(2*t,2*t+2),16);return i}function BigInteger(e,t,r){null!=e&&("number"==typeof e?this.fromNumber(e,t,r):null==t&&"string"!=typeof e?this.fromString(e,256):this.fromString(e,t))}function nbi(){return new BigInteger(null)}"Microsoft Internet Explorer"==u.appName?(BigInteger.prototype.am=function am2(e,t,r,i,n,o){for(var s=32767&t,a=t>>15;--o>=0;){var u=32767&this[e],c=this[e++]>>15,h=a*u+c*s;n=((u=s*u+((32767&h)<<15)+r[i]+(1073741823&n))>>>30)+(h>>>15)+a*c+(n>>>30),r[i++]=1073741823&u}return n},S=30):"Netscape"!=u.appName?(BigInteger.prototype.am=function am1(e,t,r,i,n,o){for(;--o>=0;){var s=t*this[e++]+r[i]+n;n=Math.floor(s/67108864),r[i++]=67108863&s}return n},S=26):(BigInteger.prototype.am=function am3(e,t,r,i,n,o){for(var s=16383&t,a=t>>14;--o>=0;){var u=16383&this[e],c=this[e++]>>14,h=a*u+c*s;n=((u=s*u+((16383&h)<<14)+r[i]+n)>>28)+(h>>14)+a*c,r[i++]=268435455&u}return n},S=28),BigInteger.prototype.DB=S,BigInteger.prototype.DM=(1<<S)-1,BigInteger.prototype.DV=1<<S;BigInteger.prototype.FV=Math.pow(2,52),BigInteger.prototype.F1=52-S,BigInteger.prototype.F2=2*S-52;var w,E,C="0123456789abcdefghijklmnopqrstuvwxyz",P=new Array;for(w="0".charCodeAt(0),E=0;E<=9;++E)P[w++]=E;for(w="a".charCodeAt(0),E=10;E<36;++E)P[w++]=E;for(w="A".charCodeAt(0),E=10;E<36;++E)P[w++]=E;function int2char(e){return C.charAt(e)}function intAt(e,t){var r=P[e.charCodeAt(t)];return null==r?-1:r}function nbv(e){var t=nbi();return t.fromInt(e),t}function nbits(e){var t,r=1;return 0!=(t=e>>>16)&&(e=t,r+=16),0!=(t=e>>8)&&(e=t,r+=8),0!=(t=e>>4)&&(e=t,r+=4),0!=(t=e>>2)&&(e=t,r+=2),0!=(t=e>>1)&&(e=t,r+=1),r}function Classic(e){this.m=e}function Montgomery(e){this.m=e,this.mp=e.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<e.DB-15)-1,this.mt2=2*e.t}function op_and(e,t){return e&t}function op_or(e,t){return e|t}function op_xor(e,t){return e^t}function op_andnot(e,t){return e&~t}function lbit(e){if(0==e)return-1;var t=0;return 0==(65535&e)&&(e>>=16,t+=16),0==(255&e)&&(e>>=8,t+=8),0==(15&e)&&(e>>=4,t+=4),0==(3&e)&&(e>>=2,t+=2),0==(1&e)&&++t,t}function cbit(e){for(var t=0;0!=e;)e&=e-1,++t;return t}function NullExp(){}function nNop(e){return e}function Barrett(e){this.r2=nbi(),this.q3=nbi(),BigInteger.ONE.dlShiftTo(2*e.t,this.r2),this.mu=this.r2.divide(e),this.m=e}Classic.prototype.convert=function cConvert(e){return e.s<0||e.compareTo(this.m)>=0?e.mod(this.m):e},Classic.prototype.revert=function cRevert(e){return e},Classic.prototype.reduce=function cReduce(e){e.divRemTo(this.m,null,e)},Classic.prototype.mulTo=function cMulTo(e,t,r){e.multiplyTo(t,r),this.reduce(r)},Classic.prototype.sqrTo=function cSqrTo(e,t){e.squareTo(t),this.reduce(t)},Montgomery.prototype.convert=function montConvert(e){var t=nbi();return e.abs().dlShiftTo(this.m.t,t),t.divRemTo(this.m,null,t),e.s<0&&t.compareTo(BigInteger.ZERO)>0&&this.m.subTo(t,t),t},Montgomery.prototype.revert=function montRevert(e){var t=nbi();return e.copyTo(t),this.reduce(t),t},Montgomery.prototype.reduce=function montReduce(e){for(;e.t<=this.mt2;)e[e.t++]=0;for(var t=0;t<this.m.t;++t){var r=32767&e[t],i=r*this.mpl+((r*this.mph+(e[t]>>15)*this.mpl&this.um)<<15)&e.DM;for(e[r=t+this.m.t]+=this.m.am(0,i,e,t,0,this.m.t);e[r]>=e.DV;)e[r]-=e.DV,e[++r]++}e.clamp(),e.drShiftTo(this.m.t,e),e.compareTo(this.m)>=0&&e.subTo(this.m,e)},Montgomery.prototype.mulTo=function montMulTo(e,t,r){e.multiplyTo(t,r),this.reduce(r)},Montgomery.prototype.sqrTo=function montSqrTo(e,t){e.squareTo(t),this.reduce(t)},BigInteger.prototype.copyTo=function bnpCopyTo(e){for(var t=this.t-1;t>=0;--t)e[t]=this[t];e.t=this.t,e.s=this.s},BigInteger.prototype.fromInt=function bnpFromInt(e){this.t=1,this.s=e<0?-1:0,e>0?this[0]=e:e<-1?this[0]=e+this.DV:this.t=0},BigInteger.prototype.fromString=function bnpFromString(e,t){var r;if(16==t)r=4;else if(8==t)r=3;else if(256==t)r=8;else if(2==t)r=1;else if(32==t)r=5;else{if(4!=t)return void this.fromRadix(e,t);r=2}this.t=0,this.s=0;for(var i=e.length,n=!1,o=0;--i>=0;){var s=8==r?255&e[i]:intAt(e,i);s<0?"-"==e.charAt(i)&&(n=!0):(n=!1,0==o?this[this.t++]=s:o+r>this.DB?(this[this.t-1]|=(s&(1<<this.DB-o)-1)<<o,this[this.t++]=s>>this.DB-o):this[this.t-1]|=s<<o,(o+=r)>=this.DB&&(o-=this.DB))}8==r&&0!=(128&e[0])&&(this.s=-1,o>0&&(this[this.t-1]|=(1<<this.DB-o)-1<<o)),this.clamp(),n&&BigInteger.ZERO.subTo(this,this)},BigInteger.prototype.clamp=function bnpClamp(){for(var e=this.s&this.DM;this.t>0&&this[this.t-1]==e;)--this.t},BigInteger.prototype.dlShiftTo=function bnpDLShiftTo(e,t){var r;for(r=this.t-1;r>=0;--r)t[r+e]=this[r];for(r=e-1;r>=0;--r)t[r]=0;t.t=this.t+e,t.s=this.s},BigInteger.prototype.drShiftTo=function bnpDRShiftTo(e,t){for(var r=e;r<this.t;++r)t[r-e]=this[r];t.t=Math.max(this.t-e,0),t.s=this.s},BigInteger.prototype.lShiftTo=function bnpLShiftTo(e,t){var r,i=e%this.DB,n=this.DB-i,o=(1<<n)-1,s=Math.floor(e/this.DB),a=this.s<<i&this.DM;for(r=this.t-1;r>=0;--r)t[r+s+1]=this[r]>>n|a,a=(this[r]&o)<<i;for(r=s-1;r>=0;--r)t[r]=0;t[s]=a,t.t=this.t+s+1,t.s=this.s,t.clamp()},BigInteger.prototype.rShiftTo=function bnpRShiftTo(e,t){t.s=this.s;var r=Math.floor(e/this.DB);if(r>=this.t)t.t=0;else{var i=e%this.DB,n=this.DB-i,o=(1<<i)-1;t[0]=this[r]>>i;for(var s=r+1;s<this.t;++s)t[s-r-1]|=(this[s]&o)<<n,t[s-r]=this[s]>>i;i>0&&(t[this.t-r-1]|=(this.s&o)<<n),t.t=this.t-r,t.clamp()}},BigInteger.prototype.subTo=function bnpSubTo(e,t){for(var r=0,i=0,n=Math.min(e.t,this.t);r<n;)i+=this[r]-e[r],t[r++]=i&this.DM,i>>=this.DB;if(e.t<this.t){for(i-=e.s;r<this.t;)i+=this[r],t[r++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;r<e.t;)i-=e[r],t[r++]=i&this.DM,i>>=this.DB;i-=e.s}t.s=i<0?-1:0,i<-1?t[r++]=this.DV+i:i>0&&(t[r++]=i),t.t=r,t.clamp()},BigInteger.prototype.multiplyTo=function bnpMultiplyTo(e,t){var r=this.abs(),i=e.abs(),n=r.t;for(t.t=n+i.t;--n>=0;)t[n]=0;for(n=0;n<i.t;++n)t[n+r.t]=r.am(0,i[n],t,n,0,r.t);t.s=0,t.clamp(),this.s!=e.s&&BigInteger.ZERO.subTo(t,t)},BigInteger.prototype.squareTo=function bnpSquareTo(e){for(var t=this.abs(),r=e.t=2*t.t;--r>=0;)e[r]=0;for(r=0;r<t.t-1;++r){var i=t.am(r,t[r],e,2*r,0,1);(e[r+t.t]+=t.am(r+1,2*t[r],e,2*r+1,i,t.t-r-1))>=t.DV&&(e[r+t.t]-=t.DV,e[r+t.t+1]=1)}e.t>0&&(e[e.t-1]+=t.am(r,t[r],e,2*r,0,1)),e.s=0,e.clamp()},BigInteger.prototype.divRemTo=function bnpDivRemTo(e,t,r){var i=e.abs();if(!(i.t<=0)){var n=this.abs();if(n.t<i.t)return null!=t&&t.fromInt(0),void(null!=r&&this.copyTo(r));null==r&&(r=nbi());var o=nbi(),s=this.s,a=e.s,u=this.DB-nbits(i[i.t-1]);u>0?(i.lShiftTo(u,o),n.lShiftTo(u,r)):(i.copyTo(o),n.copyTo(r));var c=o.t,h=o[c-1];if(0!=h){var l=h*(1<<this.F1)+(c>1?o[c-2]>>this.F2:0),f=this.FV/l,g=(1<<this.F1)/l,p=1<<this.F2,d=r.t,v=d-c,y=null==t?nbi():t;for(o.dlShiftTo(v,y),r.compareTo(y)>=0&&(r[r.t++]=1,r.subTo(y,r)),BigInteger.ONE.dlShiftTo(c,y),y.subTo(o,o);o.t<c;)o[o.t++]=0;for(;--v>=0;){var m=r[--d]==h?this.DM:Math.floor(r[d]*f+(r[d-1]+p)*g);if((r[d]+=o.am(0,m,r,v,0,c))<m)for(o.dlShiftTo(v,y),r.subTo(y,r);r[d]<--m;)r.subTo(y,r)}null!=t&&(r.drShiftTo(c,t),s!=a&&BigInteger.ZERO.subTo(t,t)),r.t=c,r.clamp(),u>0&&r.rShiftTo(u,r),s<0&&BigInteger.ZERO.subTo(r,r)}}},BigInteger.prototype.invDigit=function bnpInvDigit(){if(this.t<1)return 0;var e=this[0];if(0==(1&e))return 0;var t=3&e;return(t=(t=(t=(t=t*(2-(15&e)*t)&15)*(2-(255&e)*t)&255)*(2-((65535&e)*t&65535))&65535)*(2-e*t%this.DV)%this.DV)>0?this.DV-t:-t},BigInteger.prototype.isEven=function bnpIsEven(){return 0==(this.t>0?1&this[0]:this.s)},BigInteger.prototype.exp=function bnpExp(e,t){if(e>4294967295||e<1)return BigInteger.ONE;var r=nbi(),i=nbi(),n=t.convert(this),o=nbits(e)-1;for(n.copyTo(r);--o>=0;)if(t.sqrTo(r,i),(e&1<<o)>0)t.mulTo(i,n,r);else{var s=r;r=i,i=s}return t.revert(r)},BigInteger.prototype.toString=function bnToString(e){if(this.s<0)return"-"+this.negate().toString(e);var t;if(16==e)t=4;else if(8==e)t=3;else if(2==e)t=1;else if(32==e)t=5;else{if(4!=e)return this.toRadix(e);t=2}var r,i=(1<<t)-1,n=!1,o="",s=this.t,a=this.DB-s*this.DB%t;if(s-- >0)for(a<this.DB&&(r=this[s]>>a)>0&&(n=!0,o=int2char(r));s>=0;)a<t?(r=(this[s]&(1<<a)-1)<<t-a,r|=this[--s]>>(a+=this.DB-t)):(r=this[s]>>(a-=t)&i,a<=0&&(a+=this.DB,--s)),r>0&&(n=!0),n&&(o+=int2char(r));return n?o:"0"},BigInteger.prototype.negate=function bnNegate(){var e=nbi();return BigInteger.ZERO.subTo(this,e),e},BigInteger.prototype.abs=function bnAbs(){return this.s<0?this.negate():this},BigInteger.prototype.compareTo=function bnCompareTo(e){var t=this.s-e.s;if(0!=t)return t;var r=this.t;if(0!=(t=r-e.t))return this.s<0?-t:t;for(;--r>=0;)if(0!=(t=this[r]-e[r]))return t;return 0},BigInteger.prototype.bitLength=function bnBitLength(){return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)},BigInteger.prototype.mod=function bnMod(e){var t=nbi();return this.abs().divRemTo(e,null,t),this.s<0&&t.compareTo(BigInteger.ZERO)>0&&e.subTo(t,t),t},BigInteger.prototype.modPowInt=function bnModPowInt(e,t){var r;return r=e<256||t.isEven()?new Classic(t):new Montgomery(t),this.exp(e,r)},BigInteger.ZERO=nbv(0),BigInteger.ONE=nbv(1),NullExp.prototype.convert=nNop,NullExp.prototype.revert=nNop,NullExp.prototype.mulTo=function nMulTo(e,t,r){e.multiplyTo(t,r)},NullExp.prototype.sqrTo=function nSqrTo(e,t){e.squareTo(t)},Barrett.prototype.convert=function barrettConvert(e){if(e.s<0||e.t>2*this.m.t)return e.mod(this.m);if(e.compareTo(this.m)<0)return e;var t=nbi();return e.copyTo(t),this.reduce(t),t},Barrett.prototype.revert=function barrettRevert(e){return e},Barrett.prototype.reduce=function barrettReduce(e){for(e.drShiftTo(this.m.t-1,this.r2),e.t>this.m.t+1&&(e.t=this.m.t+1,e.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);e.compareTo(this.r2)<0;)e.dAddOffset(1,this.m.t+1);for(e.subTo(this.r2,e);e.compareTo(this.m)>=0;)e.subTo(this.m,e)},Barrett.prototype.mulTo=function barrettMulTo(e,t,r){e.multiplyTo(t,r),this.reduce(r)},Barrett.prototype.sqrTo=function barrettSqrTo(e,t){e.squareTo(t),this.reduce(t)};var I=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],R=(1<<26)/I[I.length-1];
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function Arcfour(){this.i=0,this.j=0,this.S=new Array}BigInteger.prototype.chunkSize=function bnpChunkSize(e){return Math.floor(Math.LN2*this.DB/Math.log(e))},BigInteger.prototype.toRadix=function bnpToRadix(e){if(null==e&&(e=10),0==this.signum()||e<2||e>36)return"0";var t=this.chunkSize(e),r=Math.pow(e,t),i=nbv(r),n=nbi(),o=nbi(),s="";for(this.divRemTo(i,n,o);n.signum()>0;)s=(r+o.intValue()).toString(e).substr(1)+s,n.divRemTo(i,n,o);return o.intValue().toString(e)+s},BigInteger.prototype.fromRadix=function bnpFromRadix(e,t){this.fromInt(0),null==t&&(t=10);for(var r=this.chunkSize(t),i=Math.pow(t,r),n=!1,o=0,s=0,a=0;a<e.length;++a){var u=intAt(e,a);u<0?"-"==e.charAt(a)&&0==this.signum()&&(n=!0):(s=t*s+u,++o>=r&&(this.dMultiply(i),this.dAddOffset(s,0),o=0,s=0))}o>0&&(this.dMultiply(Math.pow(t,o)),this.dAddOffset(s,0)),n&&BigInteger.ZERO.subTo(this,this)},BigInteger.prototype.fromNumber=function bnpFromNumber(e,t,r){if("number"==typeof t)if(e<2)this.fromInt(1);else for(this.fromNumber(e,r),this.testBit(e-1)||this.bitwiseTo(BigInteger.ONE.shiftLeft(e-1),op_or,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(t);)this.dAddOffset(2,0),this.bitLength()>e&&this.subTo(BigInteger.ONE.shiftLeft(e-1),this);else{var i=new Array,n=7&e;i.length=1+(e>>3),t.nextBytes(i),n>0?i[0]&=(1<<n)-1:i[0]=0,this.fromString(i,256)}},BigInteger.prototype.bitwiseTo=function bnpBitwiseTo(e,t,r){var i,n,o=Math.min(e.t,this.t);for(i=0;i<o;++i)r[i]=t(this[i],e[i]);if(e.t<this.t){for(n=e.s&this.DM,i=o;i<this.t;++i)r[i]=t(this[i],n);r.t=this.t}else{for(n=this.s&this.DM,i=o;i<e.t;++i)r[i]=t(n,e[i]);r.t=e.t}r.s=t(this.s,e.s),r.clamp()},BigInteger.prototype.changeBit=function bnpChangeBit(e,t){var r=BigInteger.ONE.shiftLeft(e);return this.bitwiseTo(r,t,r),r},BigInteger.prototype.addTo=function bnpAddTo(e,t){for(var r=0,i=0,n=Math.min(e.t,this.t);r<n;)i+=this[r]+e[r],t[r++]=i&this.DM,i>>=this.DB;if(e.t<this.t){for(i+=e.s;r<this.t;)i+=this[r],t[r++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;r<e.t;)i+=e[r],t[r++]=i&this.DM,i>>=this.DB;i+=e.s}t.s=i<0?-1:0,i>0?t[r++]=i:i<-1&&(t[r++]=this.DV+i),t.t=r,t.clamp()},BigInteger.prototype.dMultiply=function bnpDMultiply(e){this[this.t]=this.am(0,e-1,this,0,0,this.t),++this.t,this.clamp()},BigInteger.prototype.dAddOffset=function bnpDAddOffset(e,t){if(0!=e){for(;this.t<=t;)this[this.t++]=0;for(this[t]+=e;this[t]>=this.DV;)this[t]-=this.DV,++t>=this.t&&(this[this.t++]=0),++this[t]}},BigInteger.prototype.multiplyLowerTo=function bnpMultiplyLowerTo(e,t,r){var i,n=Math.min(this.t+e.t,t);for(r.s=0,r.t=n;n>0;)r[--n]=0;for(i=r.t-this.t;n<i;++n)r[n+this.t]=this.am(0,e[n],r,n,0,this.t);for(i=Math.min(e.t,t);n<i;++n)this.am(0,e[n],r,n,0,t-n);r.clamp()},BigInteger.prototype.multiplyUpperTo=function bnpMultiplyUpperTo(e,t,r){--t;var i=r.t=this.t+e.t-t;for(r.s=0;--i>=0;)r[i]=0;for(i=Math.max(t-this.t,0);i<e.t;++i)r[this.t+i-t]=this.am(t-i,e[i],r,0,0,this.t+i-t);r.clamp(),r.drShiftTo(1,r)},BigInteger.prototype.modInt=function bnpModInt(e){if(e<=0)return 0;var t=this.DV%e,r=this.s<0?e-1:0;if(this.t>0)if(0==t)r=this[0]%e;else for(var i=this.t-1;i>=0;--i)r=(t*r+this[i])%e;return r},BigInteger.prototype.millerRabin=function bnpMillerRabin(e){var t=this.subtract(BigInteger.ONE),r=t.getLowestSetBit();if(r<=0)return!1;var i=t.shiftRight(r);(e=e+1>>1)>I.length&&(e=I.length);for(var n=nbi(),o=0;o<e;++o){n.fromInt(I[Math.floor(Math.random()*I.length)]);var s=n.modPow(i,this);if(0!=s.compareTo(BigInteger.ONE)&&0!=s.compareTo(t)){for(var a=1;a++<r&&0!=s.compareTo(t);)if(0==(s=s.modPowInt(2,this)).compareTo(BigInteger.ONE))return!1;if(0!=s.compareTo(t))return!1}}return!0},BigInteger.prototype.clone=
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function bnClone(){var e=nbi();return this.copyTo(e),e},BigInteger.prototype.intValue=function bnIntValue(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},BigInteger.prototype.byteValue=function bnByteValue(){return 0==this.t?this.s:this[0]<<24>>24},BigInteger.prototype.shortValue=function bnShortValue(){return 0==this.t?this.s:this[0]<<16>>16},BigInteger.prototype.signum=function bnSigNum(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1},BigInteger.prototype.toByteArray=function bnToByteArray(){var e=this.t,t=new Array;t[0]=this.s;var r,i=this.DB-e*this.DB%8,n=0;if(e-- >0)for(i<this.DB&&(r=this[e]>>i)!=(this.s&this.DM)>>i&&(t[n++]=r|this.s<<this.DB-i);e>=0;)i<8?(r=(this[e]&(1<<i)-1)<<8-i,r|=this[--e]>>(i+=this.DB-8)):(r=this[e]>>(i-=8)&255,i<=0&&(i+=this.DB,--e)),0!=(128&r)&&(r|=-256),0==n&&(128&this.s)!=(128&r)&&++n,(n>0||r!=this.s)&&(t[n++]=r);return t},BigInteger.prototype.equals=function bnEquals(e){return 0==this.compareTo(e)},BigInteger.prototype.min=function bnMin(e){return this.compareTo(e)<0?this:e},BigInteger.prototype.max=function bnMax(e){return this.compareTo(e)>0?this:e},BigInteger.prototype.and=function bnAnd(e){var t=nbi();return this.bitwiseTo(e,op_and,t),t},BigInteger.prototype.or=function bnOr(e){var t=nbi();return this.bitwiseTo(e,op_or,t),t},BigInteger.prototype.xor=function bnXor(e){var t=nbi();return this.bitwiseTo(e,op_xor,t),t},BigInteger.prototype.andNot=function bnAndNot(e){var t=nbi();return this.bitwiseTo(e,op_andnot,t),t},BigInteger.prototype.not=function bnNot(){for(var e=nbi(),t=0;t<this.t;++t)e[t]=this.DM&~this[t];return e.t=this.t,e.s=~this.s,e},BigInteger.prototype.shiftLeft=function bnShiftLeft(e){var t=nbi();return e<0?this.rShiftTo(-e,t):this.lShiftTo(e,t),t},BigInteger.prototype.shiftRight=function bnShiftRight(e){var t=nbi();return e<0?this.lShiftTo(-e,t):this.rShiftTo(e,t),t},BigInteger.prototype.getLowestSetBit=function bnGetLowestSetBit(){for(var e=0;e<this.t;++e)if(0!=this[e])return e*this.DB+lbit(this[e]);return this.s<0?this.t*this.DB:-1},BigInteger.prototype.bitCount=function bnBitCount(){for(var e=0,t=this.s&this.DM,r=0;r<this.t;++r)e+=cbit(this[r]^t);return e},BigInteger.prototype.testBit=function bnTestBit(e){var t=Math.floor(e/this.DB);return t>=this.t?0!=this.s:0!=(this[t]&1<<e%this.DB)},BigInteger.prototype.setBit=function bnSetBit(e){return this.changeBit(e,op_or)},BigInteger.prototype.clearBit=function bnClearBit(e){return this.changeBit(e,op_andnot)},BigInteger.prototype.flipBit=function bnFlipBit(e){return this.changeBit(e,op_xor)},BigInteger.prototype.add=function bnAdd(e){var t=nbi();return this.addTo(e,t),t},BigInteger.prototype.subtract=function bnSubtract(e){var t=nbi();return this.subTo(e,t),t},BigInteger.prototype.multiply=function bnMultiply(e){var t=nbi();return this.multiplyTo(e,t),t},BigInteger.prototype.divide=function bnDivide(e){var t=nbi();return this.divRemTo(e,t,null),t},BigInteger.prototype.remainder=function bnRemainder(e){var t=nbi();return this.divRemTo(e,null,t),t},BigInteger.prototype.divideAndRemainder=function bnDivideAndRemainder(e){var t=nbi(),r=nbi();return this.divRemTo(e,t,r),new Array(t,r)},BigInteger.prototype.modPow=function bnModPow(e,t){var r,i,n=e.bitLength(),o=nbv(1);if(n<=0)return o;r=n<18?1:n<48?3:n<144?4:n<768?5:6,i=n<8?new Classic(t):t.isEven()?new Barrett(t):new Montgomery(t);var s=new Array,a=3,u=r-1,c=(1<<r)-1;if(s[1]=i.convert(this),r>1){var h=nbi();for(i.sqrTo(s[1],h);a<=c;)s[a]=nbi(),i.mulTo(h,s[a-2],s[a]),a+=2}var l,f,g=e.t-1,p=!0,d=nbi();for(n=nbits(e[g])-1;g>=0;){for(n>=u?l=e[g]>>n-u&c:(l=(e[g]&(1<<n+1)-1)<<u-n,g>0&&(l|=e[g-1]>>this.DB+n-u)),a=r;0==(1&l);)l>>=1,--a;if((n-=a)<0&&(n+=this.DB,--g),p)s[l].copyTo(o),p=!1;else{for(;a>1;)i.sqrTo(o,d),i.sqrTo(d,o),a-=2;a>0?i.sqrTo(o,d):(f=o,o=d,d=f),i.mulTo(d,s[l],o)}for(;g>=0&&0==(e[g]&1<<n);)i.sqrTo(o,d),f=o,o=d,d=f,--n<0&&(n=this.DB-1,--g)}return i.revert(o)},BigInteger.prototype.modInverse=function bnModInverse(e){var t=e.isEven();if(this.isEven()&&t||0==e.signum())return BigInteger.ZERO;for(var r=e.clone(),i=this.clone(),n=nbv(1),o=nbv(0),s=nbv(0),a=nbv(1);0!=r.signum();){for(;r.isEven();)r.rShiftTo(1,r),t?(n.isEven()&&o.isEven()||(n.addTo(this,n),o.subTo(e,o)),n.rShiftTo(1,n)):o.isEven()||o.subTo(e,o),o.rShiftTo(1,o);for(;i.isEven();)i.rShiftTo(1,i),t?(s.isEven()&&a.isEven()||(s.addTo(this,s),a.subTo(e,a)),s.rShiftTo(1,s)):a.isEven()||a.subTo(e,a),a.rShiftTo(1,a);r.compareTo(i)>=0?(r.subTo(i,r),t&&n.subTo(s,n),o.subTo(a,o)):(i.subTo(r,i),t&&s.subTo(n,s),a.subTo(o,a))}return 0!=i.compareTo(BigInteger.ONE)?BigInteger.ZERO:a.compareTo(e)>=0?a.subtract(e):a.signum()<0?(a.addTo(e,a),a.signum()<0?a.add(e):a):a},BigInteger.prototype.pow=function bnPow(e){return this.exp(e,new NullExp)},BigInteger.prototype.gcd=function bnGCD(e){var t=this.s<0?this.negate():this.clone(),r=e.s<0?e.negate():e.clone();if(t.compareTo(r)<0){var i=t;t=r,r=i}var n=t.getLowestSetBit(),o=r.getLowestSetBit();if(o<0)return t;for(n<o&&(o=n),o>0&&(t.rShiftTo(o,t),r.rShiftTo(o,r));t.signum()>0;)(n=t.getLowestSetBit())>0&&t.rShiftTo(n,t),(n=r.getLowestSetBit())>0&&r.rShiftTo(n,r),t.compareTo(r)>=0?(t.subTo(r,t),t.rShiftTo(1,t)):(r.subTo(t,r),r.rShiftTo(1,r));return o>0&&r.lShiftTo(o,r),r},BigInteger.prototype.isProbablePrime=function bnIsProbablePrime(e){var t,r=this.abs();if(1==r.t&&r[0]<=I[I.length-1]){for(t=0;t<I.length;++t)if(r[0]==I[t])return!0;return!1}if(r.isEven())return!1;for(t=1;t<I.length;){for(var i=I[t],n=t+1;n<I.length&&i<R;)i*=I[n++];for(i=r.modInt(i);t<n;)if(i%I[t++]==0)return!1}return r.millerRabin(e)},BigInteger.prototype.square=function bnSquare(){var e=nbi();return this.squareTo(e),e},Arcfour.prototype.init=function ARC4init(e){var t,r,i;for(t=0;t<256;++t)this.S[t]=t;for(r=0,t=0;t<256;++t)r=r+this.S[t]+e[t%e.length]&255,i=this.S[t],this.S[t]=this.S[r],this.S[r]=i;this.i=0,this.j=0},Arcfour.prototype.next=function ARC4next(){var e;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,e=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=e,this.S[e+this.S[this.i]&255]};var T,U,D,M=256;
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */function rng_seed_time(){!function rng_seed_int(e){U[D++]^=255&e,U[D++]^=e>>8&255,U[D++]^=e>>16&255,U[D++]^=e>>24&255,D>=M&&(D-=M)}((new Date).getTime())}if(null==U){var L;if(U=new Array,D=0,void 0!==p&&(void 0!==p.crypto||void 0!==p.msCrypto)){var N=p.crypto||p.msCrypto;if(N.getRandomValues){var O=new Uint8Array(32);for(N.getRandomValues(O),L=0;L<32;++L)U[D++]=O[L]}else if("Netscape"==u.appName&&u.appVersion<"5"){var H=p.crypto.random(32);for(L=0;L<H.length;++L)U[D++]=255&H.charCodeAt(L)}}for(;D<M;)L=Math.floor(65536*Math.random()),U[D++]=L>>>8,U[D++]=255&L;D=0,rng_seed_time()}function rng_get_byte(){if(null==T){for(rng_seed_time(),(T=function prng_newstate(){return new Arcfour}()).init(U),D=0;D<U.length;++D)U[D]=0;D=0}return T.next()}function SecureRandom(){}
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function parseBigInt(e,t){return new BigInteger(e,t)}function oaep_mgf1_arr(e,t,r){for(var i="",n=0;i.length<t;)i+=r(String.fromCharCode.apply(String,e.concat([(4278190080&n)>>24,(16711680&n)>>16,(65280&n)>>8,255&n]))),n+=1;return i}function RSAKey(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}
/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
function ECFieldElementFp(e,t){this.x=t,this.q=e}function ECPointFp(e,t,r,i){this.curve=e,this.x=t,this.y=r,this.z=null==i?BigInteger.ONE:i,this.zinv=null}function ECCurveFp(e,t,r){this.q=e,this.a=this.fromBigInteger(t),this.b=this.fromBigInteger(r),this.infinity=new ECPointFp(this,null,null)}SecureRandom.prototype.nextBytes=function rng_get_bytes(e){var t;for(t=0;t<e.length;++t)e[t]=rng_get_byte()},RSAKey.prototype.doPublic=function RSADoPublic(e){return e.modPowInt(this.e,this.n)},RSAKey.prototype.setPublic=function RSASetPublic(e,t){if(this.isPublic=!0,this.isPrivate=!1,"string"!=typeof e)this.n=e,this.e=t;else{if(!(null!=e&&null!=t&&e.length>0&&t.length>0))throw"Invalid RSA public key";this.n=parseBigInt(e,16),this.e=parseInt(t,16)}},RSAKey.prototype.encrypt=function RSAEncrypt(e){var t=function pkcs1pad2(e,t){if(t<e.length+11)throw"Message too long for RSA";for(var r=new Array,i=e.length-1;i>=0&&t>0;){var n=e.charCodeAt(i--);n<128?r[--t]=n:n>127&&n<2048?(r[--t]=63&n|128,r[--t]=n>>6|192):(r[--t]=63&n|128,r[--t]=n>>6&63|128,r[--t]=n>>12|224)}r[--t]=0;for(var o=new SecureRandom,s=new Array;t>2;){for(s[0]=0;0==s[0];)o.nextBytes(s);r[--t]=s[0]}return r[--t]=2,r[--t]=0,new BigInteger(r)}(e,this.n.bitLength()+7>>3);if(null==t)return null;var r=this.doPublic(t);if(null==r)return null;var i=r.toString(16);return 0==(1&i.length)?i:"0"+i},RSAKey.prototype.encryptOAEP=function RSAEncryptOAEP(e,t,r){var i=function oaep_pad(e,t,r,i){var n=V.crypto.MessageDigest,o=V.crypto.Util,s=null;if(r||(r="sha1"),"string"==typeof r&&(s=n.getCanonicalAlgName(r),i=n.getHashLength(s),r=function f(e){return hextorstr(o.hashHex(rstrtohex(e),s))}),e.length+2*i+2>t)throw"Message too long for RSA";var a,u="";for(a=0;a<t-e.length-2*i-2;a+=1)u+="\0";var c=r("")+u+""+e,h=new Array(i);(new SecureRandom).nextBytes(h);var l=oaep_mgf1_arr(h,c.length,r),g=[];for(a=0;a<c.length;a+=1)g[a]=c.charCodeAt(a)^l.charCodeAt(a);var p=oaep_mgf1_arr(g,h.length,r),d=[0];for(a=0;a<h.length;a+=1)d[a+1]=h[a]^p.charCodeAt(a);return new BigInteger(d.concat(g))}(e,this.n.bitLength()+7>>3,t,r);if(null==i)return null;var n=this.doPublic(i);if(null==n)return null;var o=n.toString(16);return 0==(1&o.length)?o:"0"+o},RSAKey.prototype.type="RSA",ECFieldElementFp.prototype.equals=function feFpEquals(e){return e==this||this.q.equals(e.q)&&this.x.equals(e.x)},ECFieldElementFp.prototype.toBigInteger=function feFpToBigInteger(){return this.x},ECFieldElementFp.prototype.negate=function feFpNegate(){return new ECFieldElementFp(this.q,this.x.negate().mod(this.q))},ECFieldElementFp.prototype.add=function feFpAdd(e){return new ECFieldElementFp(this.q,this.x.add(e.toBigInteger()).mod(this.q))},ECFieldElementFp.prototype.subtract=function feFpSubtract(e){return new ECFieldElementFp(this.q,this.x.subtract(e.toBigInteger()).mod(this.q))},ECFieldElementFp.prototype.multiply=function feFpMultiply(e){return new ECFieldElementFp(this.q,this.x.multiply(e.toBigInteger()).mod(this.q))},ECFieldElementFp.prototype.square=function feFpSquare(){return new ECFieldElementFp(this.q,this.x.square().mod(this.q))},ECFieldElementFp.prototype.divide=function feFpDivide(e){return new ECFieldElementFp(this.q,this.x.multiply(e.toBigInteger().modInverse(this.q)).mod(this.q))},ECPointFp.prototype.getX=function pointFpGetX(){return null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)),this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))},ECPointFp.prototype.getY=function pointFpGetY(){return null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)),this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))},ECPointFp.prototype.equals=function pointFpEquals(e){return e==this||(this.isInfinity()?e.isInfinity():e.isInfinity()?this.isInfinity():!!e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q).equals(BigInteger.ZERO)&&e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q).equals(BigInteger.ZERO))},ECPointFp.prototype.isInfinity=function pointFpIsInfinity(){return null==this.x&&null==this.y||this.z.equals(BigInteger.ZERO)&&!this.y.toBigInteger().equals(BigInteger.ZERO)},ECPointFp.prototype.negate=function pointFpNegate(){return new ECPointFp(this.curve,this.x,this.y.negate(),this.z)},ECPointFp.prototype.add=function pointFpAdd(e){if(this.isInfinity())return e;if(e.isInfinity())return this;var t=e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q),r=e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q);if(BigInteger.ZERO.equals(r))return BigInteger.ZERO.equals(t)?this.twice():this.curve.getInfinity();var i=new BigInteger("3"),n=this.x.toBigInteger(),o=this.y.toBigInteger(),s=(e.x.toBigInteger(),e.y.toBigInteger(),r.square()),a=s.multiply(r),u=n.multiply(s),c=t.square().multiply(this.z),h=c.subtract(u.shiftLeft(1)).multiply(e.z).subtract(a).multiply(r).mod(this.curve.q),l=u.multiply(i).multiply(t).subtract(o.multiply(a)).subtract(c.multiply(t)).multiply(e.z).add(t.multiply(a)).mod(this.curve.q),f=a.multiply(this.z).multiply(e.z).mod(this.curve.q);return new ECPointFp(this.curve,this.curve.fromBigInteger(h),this.curve.fromBigInteger(l),f)},ECPointFp.prototype.twice=function pointFpTwice(){if(this.isInfinity())return this;if(0==this.y.toBigInteger().signum())return this.curve.getInfinity();var e=new BigInteger("3"),t=this.x.toBigInteger(),r=this.y.toBigInteger(),i=r.multiply(this.z),n=i.multiply(r).mod(this.curve.q),o=this.curve.a.toBigInteger(),s=t.square().multiply(e);BigInteger.ZERO.equals(o)||(s=s.add(this.z.square().multiply(o)));var a=(s=s.mod(this.curve.q)).square().subtract(t.shiftLeft(3).multiply(n)).shiftLeft(1).multiply(i).mod(this.curve.q),u=s.multiply(e).multiply(t).subtract(n.shiftLeft(1)).shiftLeft(2).multiply(n).subtract(s.square().multiply(s)).mod(this.curve.q),c=i.square().multiply(i).shiftLeft(3).mod(this.curve.q);return new ECPointFp(this.curve,this.curve.fromBigInteger(a),this.curve.fromBigInteger(u),c)},ECPointFp.prototype.multiply=function pointFpMultiply(e){if(this.isInfinity())return this;if(0==e.signum())return this.curve.getInfinity();var t,r=e,i=r.multiply(new BigInteger("3")),n=this.negate(),o=this;for(t=i.bitLength()-2;t>0;--t){o=o.twice();var s=i.testBit(t);s!=r.testBit(t)&&(o=o.add(s?this:n))}return o},ECPointFp.prototype.multiplyTwo=function pointFpMultiplyTwo(e,t,r){var i;i=e.bitLength()>r.bitLength()?e.bitLength()-1:r.bitLength()-1;for(var n=this.curve.getInfinity(),o=this.add(t);i>=0;)n=n.twice(),e.testBit(i)?n=r.testBit(i)?n.add(o):n.add(this):r.testBit(i)&&(n=n.add(t)),--i;return n},ECCurveFp.prototype.getQ=function curveFpGetQ(){return this.q},ECCurveFp.prototype.getA=function curveFpGetA(){return this.a},ECCurveFp.prototype.getB=function curveFpGetB(){return this.b},ECCurveFp.prototype.equals=function curveFpEquals(e){return e==this||this.q.equals(e.q)&&this.a.equals(e.a)&&this.b.equals(e.b)},ECCurveFp.prototype.getInfinity=function curveFpGetInfinity(){return this.infinity},ECCurveFp.prototype.fromBigInteger=function curveFpFromBigInteger(e){return new ECFieldElementFp(this.q,e)},ECCurveFp.prototype.decodePointHex=function curveFpDecodePointHex(e){switch(parseInt(e.substr(0,2),16)){case 0:return this.infinity;case 2:case 3:return null;case 4:case 6:case 7:var t=(e.length-2)/2,r=e.substr(2,t),i=e.substr(t+2,t);return new ECPointFp(this,this.fromBigInteger(new BigInteger(r,16)),this.fromBigInteger(new BigInteger(i,16)));default:return null}},
/*! (c) Stefan Thomas | https://github.com/bitcoinjs/bitcoinjs-lib
 */
ECFieldElementFp.prototype.getByteLength=function(){return Math.floor((this.toBigInteger().bitLength()+7)/8)},ECPointFp.prototype.getEncoded=function(e){var t=function d(e,t){var r=e.toByteArrayUnsigned();if(t<r.length)r=r.slice(r.length-t);else for(;t>r.length;)r.unshift(0);return r},r=this.getX().toBigInteger(),i=this.getY().toBigInteger(),n=t(r,32);return e?i.isEven()?n.unshift(2):n.unshift(3):(n.unshift(4),n=n.concat(t(i,32))),n},ECPointFp.decodeFrom=function(e,t){t[0];var r=t.length-1,i=t.slice(1,1+r/2),n=t.slice(1+r/2,1+r);i.unshift(0),n.unshift(0);var o=new BigInteger(i),s=new BigInteger(n);return new ECPointFp(e,e.fromBigInteger(o),e.fromBigInteger(s))},ECPointFp.decodeFromHex=function(e,t){t.substr(0,2);var r=t.length-2,i=t.substr(2,r/2),n=t.substr(2+r/2,r/2),o=new BigInteger(i,16),s=new BigInteger(n,16);return new ECPointFp(e,e.fromBigInteger(o),e.fromBigInteger(s))},ECPointFp.prototype.add2D=function(e){if(this.isInfinity())return e;if(e.isInfinity())return this;if(this.x.equals(e.x))return this.y.equals(e.y)?this.twice():this.curve.getInfinity();var t=e.x.subtract(this.x),r=e.y.subtract(this.y).divide(t),i=r.square().subtract(this.x).subtract(e.x),n=r.multiply(this.x.subtract(i)).subtract(this.y);return new ECPointFp(this.curve,i,n)},ECPointFp.prototype.twice2D=function(){if(this.isInfinity())return this;if(0==this.y.toBigInteger().signum())return this.curve.getInfinity();var e=this.curve.fromBigInteger(BigInteger.valueOf(2)),t=this.curve.fromBigInteger(BigInteger.valueOf(3)),r=this.x.square().multiply(t).add(this.curve.a).divide(this.y.multiply(e)),i=r.square().subtract(this.x.multiply(e)),n=r.multiply(this.x.subtract(i)).subtract(this.y);return new ECPointFp(this.curve,i,n)},ECPointFp.prototype.multiply2D=function(e){if(this.isInfinity())return this;if(0==e.signum())return this.curve.getInfinity();var t,r=e,i=r.multiply(new BigInteger("3")),n=this.negate(),o=this;for(t=i.bitLength()-2;t>0;--t){o=o.twice();var s=i.testBit(t);s!=r.testBit(t)&&(o=o.add2D(s?this:n))}return o},ECPointFp.prototype.isOnCurve=function(){var e=this.getX().toBigInteger(),t=this.getY().toBigInteger(),r=this.curve.getA().toBigInteger(),i=this.curve.getB().toBigInteger(),n=this.curve.getQ(),o=t.multiply(t).mod(n),s=e.multiply(e).multiply(e).add(r.multiply(e)).add(i).mod(n);return o.equals(s)},ECPointFp.prototype.toString=function(){return"("+this.getX().toBigInteger().toString()+","+this.getY().toBigInteger().toString()+")"},ECPointFp.prototype.validate=function(){var e=this.curve.getQ();if(this.isInfinity())throw new Error("Point is at infinity.");var t=this.getX().toBigInteger(),r=this.getY().toBigInteger();if(t.compareTo(BigInteger.ONE)<0||t.compareTo(e.subtract(BigInteger.ONE))>0)throw new Error("x coordinate out of bounds");if(r.compareTo(BigInteger.ONE)<0||r.compareTo(e.subtract(BigInteger.ONE))>0)throw new Error("y coordinate out of bounds");if(!this.isOnCurve())throw new Error("Point is not on the curve.");if(this.multiply(e).isInfinity())throw new Error("Point is not a scalar multiple of G.");return!0};
/*! Mike Samuel (c) 2009 | code.google.com/p/json-sans-eval
 */
var K=function(){var e=new RegExp('(?:false|true|null|[\\{\\}\\[\\]]|(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)|(?:"(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))*"))',"g"),t=new RegExp("\\\\(?:([^u])|u(.{4}))","g"),r={'"':'"',"/":"/","\\":"\\",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"};function h(e,t,i){return t?r[t]:String.fromCharCode(parseInt(i,16))}var i=new String(""),o=(Object,Array,Object.hasOwnProperty);return function(r,a){var u,c,l=r.match(e),f=l[0],g=!1;"{"===f?u={}:"["===f?u=[]:(u=[],g=!0);for(var p=[u],d=1-g,v=l.length;d<v;++d){var y;switch((f=l[d]).charCodeAt(0)){default:(y=p[0])[c||y.length]=+f,c=void 0;break;case 34:if(-1!==(f=f.substring(1,f.length-1)).indexOf("\\")&&(f=f.replace(t,h)),y=p[0],!c){if(!(y instanceof Array)){c=f||i;break}c=y.length}y[c]=f,c=void 0;break;case 91:y=p[0],p.unshift(y[c||y.length]=[]),c=void 0;break;case 93:p.shift();break;case 102:(y=p[0])[c||y.length]=!1,c=void 0;break;case 110:(y=p[0])[c||y.length]=null,c=void 0;break;case 116:(y=p[0])[c||y.length]=!0,c=void 0;break;case 123:y=p[0],p.unshift(y[c||y.length]={}),c=void 0;break;case 125:p.shift()}}if(g){if(1!==p.length)throw new Error;u=u[0]}else if(p.length)throw new Error;if(a){u=function s(e,t){var r=e[t];if(r&&"object"===(void 0===r?"undefined":n(r))){var i=null;for(var u in r)if(o.call(r,u)&&r!==e){var c=s(r,u);void 0!==c?r[u]=c:(i||(i=[]),i.push(u))}if(i)for(var h=i.length;--h>=0;)delete r[i[h]]}return a.call(e,t,r)}({"":u},"")}return u}}();void 0!==V&&V||(V={}),void 0!==V.asn1&&V.asn1||(V.asn1={}),V.asn1.ASN1Util=new function(){this.integerToByteHex=function(e){var t=e.toString(16);return t.length%2==1&&(t="0"+t),t},this.bigIntToMinTwosComplementsHex=function(e){var t=e.toString(16);if("-"!=t.substr(0,1))t.length%2==1?t="0"+t:t.match(/^[0-7]/)||(t="00"+t);else{var r=t.substr(1).length;r%2==1?r+=1:t.match(/^[0-7]/)||(r+=2);for(var i="",n=0;n<r;n++)i+="f";t=new BigInteger(i,16).xor(e).add(BigInteger.ONE).toString(16).replace(/^-/,"")}return t},this.getPEMStringFromHex=function(e,t){return hextopem(e,t)},this.newObject=function(e){var t=V.asn1,r=t.DERBoolean,i=t.DERInteger,n=t.DERBitString,o=t.DEROctetString,s=t.DERNull,a=t.DERObjectIdentifier,u=t.DEREnumerated,c=t.DERUTF8String,h=t.DERNumericString,l=t.DERPrintableString,f=t.DERTeletexString,g=t.DERIA5String,p=t.DERUTCTime,d=t.DERGeneralizedTime,v=t.DERSequence,y=t.DERSet,m=t.DERTaggedObject,S=t.ASN1Util.newObject,b=Object.keys(e);if(1!=b.length)throw"key of param shall be only one.";var F=b[0];if(-1==":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":"+F+":"))throw"undefined key: "+F;if("bool"==F)return new r(e[F]);if("int"==F)return new i(e[F]);if("bitstr"==F)return new n(e[F]);if("octstr"==F)return new o(e[F]);if("null"==F)return new s(e[F]);if("oid"==F)return new a(e[F]);if("enum"==F)return new u(e[F]);if("utf8str"==F)return new c(e[F]);if("numstr"==F)return new h(e[F]);if("prnstr"==F)return new l(e[F]);if("telstr"==F)return new f(e[F]);if("ia5str"==F)return new g(e[F]);if("utctime"==F)return new p(e[F]);if("gentime"==F)return new d(e[F]);if("seq"==F){for(var _=e[F],w=[],E=0;E<_.length;E++){var x=S(_[E]);w.push(x)}return new v({array:w})}if("set"==F){for(_=e[F],w=[],E=0;E<_.length;E++){x=S(_[E]);w.push(x)}return new y({array:w})}if("tag"==F){var A=e[F];if("[object Array]"===Object.prototype.toString.call(A)&&3==A.length){var C=S(A[2]);return new m({tag:A[0],explicit:A[1],obj:C})}var P={};if(void 0!==A.explicit&&(P.explicit=A.explicit),void 0!==A.tag&&(P.tag=A.tag),void 0===A.obj)throw"obj shall be specified for 'tag'.";return P.obj=S(A.obj),new m(P)}},this.jsonToASN1HEX=function(e){return this.newObject(e).getEncodedHex()}},V.asn1.ASN1Util.oidHexToInt=function(e){for(var t="",r=parseInt(e.substr(0,2),16),i=(t=Math.floor(r/40)+"."+r%40,""),n=2;n<e.length;n+=2){var o=("00000000"+parseInt(e.substr(n,2),16).toString(2)).slice(-8);if(i+=o.substr(1,7),"0"==o.substr(0,1))t=t+"."+new BigInteger(i,2).toString(10),i=""}return t},V.asn1.ASN1Util.oidIntToHex=function(e){var t=function e(t){var r=t.toString(16);return 1==r.length&&(r="0"+r),r},r=function d(e){var r="",i=new BigInteger(e,10).toString(2),n=7-i.length%7;7==n&&(n=0);for(var o="",s=0;s<n;s++)o+="0";i=o+i;for(s=0;s<i.length-1;s+=7){var a=i.substr(s,7);s!=i.length-7&&(a="1"+a),r+=t(parseInt(a,2))}return r};if(!e.match(/^[0-9.]+$/))throw"malformed oid string: "+e;var i="",n=e.split("."),o=40*parseInt(n[0])+parseInt(n[1]);i+=t(o),n.splice(0,2);for(var s=0;s<n.length;s++)i+=r(n[s]);return i},V.asn1.ASN1Object=function(){this.getLengthHexFromValue=function(){if(void 0===this.hV||null==this.hV)throw"this.hV is null or undefined.";if(this.hV.length%2==1)throw"value hex must be even length: n="+"".length+",v="+this.hV;var e=this.hV.length/2,t=e.toString(16);if(t.length%2==1&&(t="0"+t),e<128)return t;var r=t.length/2;if(r>15)throw"ASN.1 length too long to represent by 8x: n = "+e.toString(16);return(128+r).toString(16)+t},this.getEncodedHex=function(){return(null==this.hTLV||this.isModified)&&(this.hV=this.getFreshValueHex(),this.hL=this.getLengthHexFromValue(),this.hTLV=this.hT+this.hL+this.hV,this.isModified=!1),this.hTLV},this.getValueHex=function(){return this.getEncodedHex(),this.hV},this.getFreshValueHex=function(){return""}},V.asn1.DERAbstractString=function(e){V.asn1.DERAbstractString.superclass.constructor.call(this);this.getString=function(){return this.s},this.setString=function(e){this.hTLV=null,this.isModified=!0,this.s=e,this.hV=utf8tohex(this.s).toLowerCase()},this.setStringHex=function(e){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=e},this.getFreshValueHex=function(){return this.hV},void 0!==e&&("string"==typeof e?this.setString(e):void 0!==e.str?this.setString(e.str):void 0!==e.hex&&this.setStringHex(e.hex))},v.lang.extend(V.asn1.DERAbstractString,V.asn1.ASN1Object),V.asn1.DERAbstractTime=function(e){V.asn1.DERAbstractTime.superclass.constructor.call(this);this.localDateToUTC=function(e){return utc=e.getTime()+6e4*e.getTimezoneOffset(),new Date(utc)},this.formatDate=function(e,t,r){var i=this.zeroPadding,n=this.localDateToUTC(e),o=String(n.getFullYear());"utc"==t&&(o=o.substr(2,2));var s=o+i(String(n.getMonth()+1),2)+i(String(n.getDate()),2)+i(String(n.getHours()),2)+i(String(n.getMinutes()),2)+i(String(n.getSeconds()),2);if(!0===r){var a=n.getMilliseconds();if(0!=a){var u=i(String(a),3);s=s+"."+(u=u.replace(/[0]+$/,""))}}return s+"Z"},this.zeroPadding=function(e,t){return e.length>=t?e:new Array(t-e.length+1).join("0")+e},this.getString=function(){return this.s},this.setString=function(e){this.hTLV=null,this.isModified=!0,this.s=e,this.hV=stohex(e)},this.setByDateValue=function(e,t,r,i,n,o){var s=new Date(Date.UTC(e,t-1,r,i,n,o,0));this.setByDate(s)},this.getFreshValueHex=function(){return this.hV}},v.lang.extend(V.asn1.DERAbstractTime,V.asn1.ASN1Object),V.asn1.DERAbstractStructured=function(e){V.asn1.DERAbstractString.superclass.constructor.call(this);this.setByASN1ObjectArray=function(e){this.hTLV=null,this.isModified=!0,this.asn1Array=e},this.appendASN1Object=function(e){this.hTLV=null,this.isModified=!0,this.asn1Array.push(e)},this.asn1Array=new Array,void 0!==e&&void 0!==e.array&&(this.asn1Array=e.array)},v.lang.extend(V.asn1.DERAbstractStructured,V.asn1.ASN1Object),V.asn1.DERBoolean=function(){V.asn1.DERBoolean.superclass.constructor.call(this),this.hT="01",this.hTLV="0101ff"},v.lang.extend(V.asn1.DERBoolean,V.asn1.ASN1Object),V.asn1.DERInteger=function(e){V.asn1.DERInteger.superclass.constructor.call(this),this.hT="02",this.setByBigInteger=function(e){this.hTLV=null,this.isModified=!0,this.hV=V.asn1.ASN1Util.bigIntToMinTwosComplementsHex(e)},this.setByInteger=function(e){var t=new BigInteger(String(e),10);this.setByBigInteger(t)},this.setValueHex=function(e){this.hV=e},this.getFreshValueHex=function(){return this.hV},void 0!==e&&(void 0!==e.bigint?this.setByBigInteger(e.bigint):void 0!==e.int?this.setByInteger(e.int):"number"==typeof e?this.setByInteger(e):void 0!==e.hex&&this.setValueHex(e.hex))},v.lang.extend(V.asn1.DERInteger,V.asn1.ASN1Object),V.asn1.DERBitString=function(e){if(void 0!==e&&void 0!==e.obj){var t=V.asn1.ASN1Util.newObject(e.obj);e.hex="00"+t.getEncodedHex()}V.asn1.DERBitString.superclass.constructor.call(this),this.hT="03",this.setHexValueIncludingUnusedBits=function(e){this.hTLV=null,this.isModified=!0,this.hV=e},this.setUnusedBitsAndHexValue=function(e,t){if(e<0||7<e)throw"unused bits shall be from 0 to 7: u = "+e;var r="0"+e;this.hTLV=null,this.isModified=!0,this.hV=r+t},this.setByBinaryString=function(e){var t=8-(e=e.replace(/0+$/,"")).length%8;8==t&&(t=0);for(var r=0;r<=t;r++)e+="0";var i="";for(r=0;r<e.length-1;r+=8){var n=e.substr(r,8),o=parseInt(n,2).toString(16);1==o.length&&(o="0"+o),i+=o}this.hTLV=null,this.isModified=!0,this.hV="0"+t+i},this.setByBooleanArray=function(e){for(var t="",r=0;r<e.length;r++)1==e[r]?t+="1":t+="0";this.setByBinaryString(t)},this.newFalseArray=function(e){for(var t=new Array(e),r=0;r<e;r++)t[r]=!1;return t},this.getFreshValueHex=function(){return this.hV},void 0!==e&&("string"==typeof e&&e.toLowerCase().match(/^[0-9a-f]+$/)?this.setHexValueIncludingUnusedBits(e):void 0!==e.hex?this.setHexValueIncludingUnusedBits(e.hex):void 0!==e.bin?this.setByBinaryString(e.bin):void 0!==e.array&&this.setByBooleanArray(e.array))},v.lang.extend(V.asn1.DERBitString,V.asn1.ASN1Object),V.asn1.DEROctetString=function(e){if(void 0!==e&&void 0!==e.obj){var t=V.asn1.ASN1Util.newObject(e.obj);e.hex=t.getEncodedHex()}V.asn1.DEROctetString.superclass.constructor.call(this,e),this.hT="04"},v.lang.extend(V.asn1.DEROctetString,V.asn1.DERAbstractString),V.asn1.DERNull=function(){V.asn1.DERNull.superclass.constructor.call(this),this.hT="05",this.hTLV="0500"},v.lang.extend(V.asn1.DERNull,V.asn1.ASN1Object),V.asn1.DERObjectIdentifier=function(e){var t=function b(e){var t=e.toString(16);return 1==t.length&&(t="0"+t),t},r=function a(e){var r="",i=new BigInteger(e,10).toString(2),n=7-i.length%7;7==n&&(n=0);for(var o="",s=0;s<n;s++)o+="0";i=o+i;for(s=0;s<i.length-1;s+=7){var u=i.substr(s,7);s!=i.length-7&&(u="1"+u),r+=t(parseInt(u,2))}return r};V.asn1.DERObjectIdentifier.superclass.constructor.call(this),this.hT="06",this.setValueHex=function(e){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=e},this.setValueOidString=function(e){if(!e.match(/^[0-9.]+$/))throw"malformed oid string: "+e;var i="",n=e.split("."),o=40*parseInt(n[0])+parseInt(n[1]);i+=t(o),n.splice(0,2);for(var s=0;s<n.length;s++)i+=r(n[s]);this.hTLV=null,this.isModified=!0,this.s=null,this.hV=i},this.setValueName=function(e){var t=V.asn1.x509.OID.name2oid(e);if(""===t)throw"DERObjectIdentifier oidName undefined: "+e;this.setValueOidString(t)},this.getFreshValueHex=function(){return this.hV},void 0!==e&&("string"==typeof e?e.match(/^[0-2].[0-9.]+$/)?this.setValueOidString(e):this.setValueName(e):void 0!==e.oid?this.setValueOidString(e.oid):void 0!==e.hex?this.setValueHex(e.hex):void 0!==e.name&&this.setValueName(e.name))},v.lang.extend(V.asn1.DERObjectIdentifier,V.asn1.ASN1Object),V.asn1.DEREnumerated=function(e){V.asn1.DEREnumerated.superclass.constructor.call(this),this.hT="0a",this.setByBigInteger=function(e){this.hTLV=null,this.isModified=!0,this.hV=V.asn1.ASN1Util.bigIntToMinTwosComplementsHex(e)},this.setByInteger=function(e){var t=new BigInteger(String(e),10);this.setByBigInteger(t)},this.setValueHex=function(e){this.hV=e},this.getFreshValueHex=function(){return this.hV},void 0!==e&&(void 0!==e.int?this.setByInteger(e.int):"number"==typeof e?this.setByInteger(e):void 0!==e.hex&&this.setValueHex(e.hex))},v.lang.extend(V.asn1.DEREnumerated,V.asn1.ASN1Object),V.asn1.DERUTF8String=function(e){V.asn1.DERUTF8String.superclass.constructor.call(this,e),this.hT="0c"},v.lang.extend(V.asn1.DERUTF8String,V.asn1.DERAbstractString),V.asn1.DERNumericString=function(e){V.asn1.DERNumericString.superclass.constructor.call(this,e),this.hT="12"},v.lang.extend(V.asn1.DERNumericString,V.asn1.DERAbstractString),V.asn1.DERPrintableString=function(e){V.asn1.DERPrintableString.superclass.constructor.call(this,e),this.hT="13"},v.lang.extend(V.asn1.DERPrintableString,V.asn1.DERAbstractString),V.asn1.DERTeletexString=function(e){V.asn1.DERTeletexString.superclass.constructor.call(this,e),this.hT="14"},v.lang.extend(V.asn1.DERTeletexString,V.asn1.DERAbstractString),V.asn1.DERIA5String=function(e){V.asn1.DERIA5String.superclass.constructor.call(this,e),this.hT="16"},v.lang.extend(V.asn1.DERIA5String,V.asn1.DERAbstractString),V.asn1.DERUTCTime=function(e){V.asn1.DERUTCTime.superclass.constructor.call(this,e),this.hT="17",this.setByDate=function(e){this.hTLV=null,this.isModified=!0,this.date=e,this.s=this.formatDate(this.date,"utc"),this.hV=stohex(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"utc"),this.hV=stohex(this.s)),this.hV},void 0!==e&&(void 0!==e.str?this.setString(e.str):"string"==typeof e&&e.match(/^[0-9]{12}Z$/)?this.setString(e):void 0!==e.hex?this.setStringHex(e.hex):void 0!==e.date&&this.setByDate(e.date))},v.lang.extend(V.asn1.DERUTCTime,V.asn1.DERAbstractTime),V.asn1.DERGeneralizedTime=function(e){V.asn1.DERGeneralizedTime.superclass.constructor.call(this,e),this.hT="18",this.withMillis=!1,this.setByDate=function(e){this.hTLV=null,this.isModified=!0,this.date=e,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=stohex(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=stohex(this.s)),this.hV},void 0!==e&&(void 0!==e.str?this.setString(e.str):"string"==typeof e&&e.match(/^[0-9]{14}Z$/)?this.setString(e):void 0!==e.hex?this.setStringHex(e.hex):void 0!==e.date&&this.setByDate(e.date),!0===e.millis&&(this.withMillis=!0))},v.lang.extend(V.asn1.DERGeneralizedTime,V.asn1.DERAbstractTime),V.asn1.DERSequence=function(e){V.asn1.DERSequence.superclass.constructor.call(this,e),this.hT="30",this.getFreshValueHex=function(){for(var e="",t=0;t<this.asn1Array.length;t++){e+=this.asn1Array[t].getEncodedHex()}return this.hV=e,this.hV}},v.lang.extend(V.asn1.DERSequence,V.asn1.DERAbstractStructured),V.asn1.DERSet=function(e){V.asn1.DERSet.superclass.constructor.call(this,e),this.hT="31",this.sortFlag=!0,this.getFreshValueHex=function(){for(var e=new Array,t=0;t<this.asn1Array.length;t++){var r=this.asn1Array[t];e.push(r.getEncodedHex())}return 1==this.sortFlag&&e.sort(),this.hV=e.join(""),this.hV},void 0!==e&&void 0!==e.sortflag&&0==e.sortflag&&(this.sortFlag=!1)},v.lang.extend(V.asn1.DERSet,V.asn1.DERAbstractStructured),V.asn1.DERTaggedObject=function(e){V.asn1.DERTaggedObject.superclass.constructor.call(this),this.hT="a0",this.hV="",this.isExplicit=!0,this.asn1Object=null,this.setASN1Object=function(e,t,r){this.hT=t,this.isExplicit=e,this.asn1Object=r,this.isExplicit?(this.hV=this.asn1Object.getEncodedHex(),this.hTLV=null,this.isModified=!0):(this.hV=null,this.hTLV=r.getEncodedHex(),this.hTLV=this.hTLV.replace(/^../,t),this.isModified=!1)},this.getFreshValueHex=function(){return this.hV},void 0!==e&&(void 0!==e.tag&&(this.hT=e.tag),void 0!==e.explicit&&(this.isExplicit=e.explicit),void 0!==e.obj&&(this.asn1Object=e.obj,this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)))},v.lang.extend(V.asn1.DERTaggedObject,V.asn1.ASN1Object);var V,q,W,J=new function(){};function stoBA(e){for(var t=new Array,r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}function BAtos(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t}function BAtohex(e){for(var t="",r=0;r<e.length;r++){var i=e[r].toString(16);1==i.length&&(i="0"+i),t+=i}return t}function stohex(e){return BAtohex(stoBA(e))}function b64tob64u(e){return e=(e=(e=e.replace(/\=/g,"")).replace(/\+/g,"-")).replace(/\//g,"_")}function b64utob64(e){return e.length%4==2?e+="==":e.length%4==3&&(e+="="),e=(e=e.replace(/-/g,"+")).replace(/_/g,"/")}function hextob64u(e){return e.length%2==1&&(e="0"+e),b64tob64u(hex2b64(e))}function b64utohex(e){return b64tohex(b64utob64(e))}function utf8tohex(e){return uricmptohex(encodeURIComponentAll(e))}function hextoutf8(e){return decodeURIComponent(hextouricmp(e))}function hextorstr(e){for(var t="",r=0;r<e.length-1;r+=2)t+=String.fromCharCode(parseInt(e.substr(r,2),16));return t}function rstrtohex(e){for(var t="",r=0;r<e.length;r++)t+=("0"+e.charCodeAt(r).toString(16)).slice(-2);return t}function hextob64(e){return hex2b64(e)}function hextob64nl(e){var t=hextob64(e).replace(/(.{64})/g,"$1\r\n");return t=t.replace(/\r\n$/,"")}function b64nltohex(e){return b64tohex(e.replace(/[^0-9A-Za-z\/+=]*/g,""))}function hextopem(e,t){return"-----BEGIN "+t+"-----\r\n"+hextob64nl(e)+"\r\n-----END "+t+"-----\r\n"}function pemtohex(e,t){if(-1==e.indexOf("-----BEGIN "))throw"can't find PEM header: "+t;return b64nltohex(e=void 0!==t?(e=e.replace("-----BEGIN "+t+"-----","")).replace("-----END "+t+"-----",""):(e=e.replace(/-----BEGIN [^-]+-----/,"")).replace(/-----END [^-]+-----/,""))}function zulutomsec(e){var t,r,i,n,o,s,a,u,c,h,l;if(l=e.match(/^(\d{2}|\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(|\.\d+)Z$/))return u=l[1],t=parseInt(u),2===u.length&&(50<=t&&t<100?t=1900+t:0<=t&&t<50&&(t=2e3+t)),r=parseInt(l[2])-1,i=parseInt(l[3]),n=parseInt(l[4]),o=parseInt(l[5]),s=parseInt(l[6]),a=0,""!==(c=l[7])&&(h=(c.substr(1)+"00").substr(0,3),a=parseInt(h)),Date.UTC(t,r,i,n,o,s,a);throw"unsupported zulu format: "+e}function zulutosec(e){return~~(zulutomsec(e)/1e3)}function uricmptohex(e){return e.replace(/%/g,"")}function hextouricmp(e){return e.replace(/(..)/g,"%$1")}function ipv6tohex(e){var t="malformed IPv6 address";if(!e.match(/^[0-9A-Fa-f:]+$/))throw t;var r=(e=e.toLowerCase()).split(":").length-1;if(r<2)throw t;var i=":".repeat(7-r+2),n=(e=e.replace("::",i)).split(":");if(8!=n.length)throw t;for(var o=0;o<8;o++)n[o]=("0000"+n[o]).slice(-4);return n.join("")}function hextoipv6(e){if(!e.match(/^[0-9A-Fa-f]{32}$/))throw"malformed IPv6 address octet";for(var t=(e=e.toLowerCase()).match(/.{1,4}/g),r=0;r<8;r++)t[r]=t[r].replace(/^0+/,""),""==t[r]&&(t[r]="0");var i=(e=":"+t.join(":")+":").match(/:(0:){2,}/g);if(null===i)return e.slice(1,-1);var n="";for(r=0;r<i.length;r++)i[r].length>n.length&&(n=i[r]);return(e=e.replace(n,"::")).slice(1,-1)}function hextoip(e){var t="malformed hex value";if(!e.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/))throw t;if(8!=e.length)return 32==e.length?hextoipv6(e):e;try{return parseInt(e.substr(0,2),16)+"."+parseInt(e.substr(2,2),16)+"."+parseInt(e.substr(4,2),16)+"."+parseInt(e.substr(6,2),16)}catch(e){throw t}}function encodeURIComponentAll(e){for(var t=encodeURIComponent(e),r="",i=0;i<t.length;i++)"%"==t[i]?(r+=t.substr(i,3),i+=2):r=r+"%"+stohex(t[i]);return r}function hextoposhex(e){return e.length%2==1?"0"+e:e.substr(0,1)>"7"?"00"+e:e}J.getLblen=function(e,t){if("8"!=e.substr(t+2,1))return 1;var r=parseInt(e.substr(t+3,1));return 0==r?-1:0<r&&r<10?r+1:-2},J.getL=function(e,t){var r=J.getLblen(e,t);return r<1?"":e.substr(t+2,2*r)},J.getVblen=function(e,t){var r;return""==(r=J.getL(e,t))?-1:("8"===r.substr(0,1)?new BigInteger(r.substr(2),16):new BigInteger(r,16)).intValue()},J.getVidx=function(e,t){var r=J.getLblen(e,t);return r<0?r:t+2*(r+1)},J.getV=function(e,t){var r=J.getVidx(e,t),i=J.getVblen(e,t);return e.substr(r,2*i)},J.getTLV=function(e,t){return e.substr(t,2)+J.getL(e,t)+J.getV(e,t)},J.getNextSiblingIdx=function(e,t){return J.getVidx(e,t)+2*J.getVblen(e,t)},J.getChildIdx=function(e,t){var r=J,i=new Array,n=r.getVidx(e,t);"03"==e.substr(t,2)?i.push(n+2):i.push(n);for(var o=r.getVblen(e,t),s=n,a=0;;){var u=r.getNextSiblingIdx(e,s);if(null==u||u-n>=2*o)break;if(a>=200)break;i.push(u),s=u,a++}return i},J.getNthChildIdx=function(e,t,r){return J.getChildIdx(e,t)[r]},J.getIdxbyList=function(e,t,r,i){var n,o,s=J;if(0==r.length){if(void 0!==i&&e.substr(t,2)!==i)throw"checking tag doesn't match: "+e.substr(t,2)+"!="+i;return t}return n=r.shift(),o=s.getChildIdx(e,t),s.getIdxbyList(e,o[n],r,i)},J.getTLVbyList=function(e,t,r,i){var n=J,o=n.getIdxbyList(e,t,r);if(void 0===o)throw"can't find nthList object";if(void 0!==i&&e.substr(o,2)!=i)throw"checking tag doesn't match: "+e.substr(o,2)+"!="+i;return n.getTLV(e,o)},J.getVbyList=function(e,t,r,i,n){var o,s,a=J;if(void 0===(o=a.getIdxbyList(e,t,r,i)))throw"can't find nthList object";return s=a.getV(e,o),!0===n&&(s=s.substr(2)),s},J.hextooidstr=function(e){var t=function h(e,t){return e.length>=t?e:new Array(t-e.length+1).join("0")+e},r=[],i=e.substr(0,2),n=parseInt(i,16);r[0]=new String(Math.floor(n/40)),r[1]=new String(n%40);for(var o=e.substr(2),s=[],a=0;a<o.length/2;a++)s.push(parseInt(o.substr(2*a,2),16));var u=[],c="";for(a=0;a<s.length;a++)128&s[a]?c+=t((127&s[a]).toString(2),7):(c+=t((127&s[a]).toString(2),7),u.push(new String(parseInt(c,2))),c="");var h=r.join(".");return u.length>0&&(h=h+"."+u.join(".")),h},J.dump=function(e,t,r,i){var n=J,o=n.getV,s=n.dump,a=n.getChildIdx,u=e;e instanceof V.asn1.ASN1Object&&(u=e.getEncodedHex());var c=function q(e,t){return e.length<=2*t?e:e.substr(0,t)+"..(total "+e.length/2+"bytes).."+e.substr(e.length-t,t)};void 0===t&&(t={ommit_long_octet:32}),void 0===r&&(r=0),void 0===i&&(i="");var h=t.ommit_long_octet;if("01"==u.substr(r,2))return"00"==(l=o(u,r))?i+"BOOLEAN FALSE\n":i+"BOOLEAN TRUE\n";if("02"==u.substr(r,2))return i+"INTEGER "+c(l=o(u,r),h)+"\n";if("03"==u.substr(r,2))return i+"BITSTRING "+c(l=o(u,r),h)+"\n";if("04"==u.substr(r,2)){var l=o(u,r);if(n.isASN1HEX(l)){var f=i+"OCTETSTRING, encapsulates\n";return f+=s(l,t,0,i+"  ")}return i+"OCTETSTRING "+c(l,h)+"\n"}if("05"==u.substr(r,2))return i+"NULL\n";if("06"==u.substr(r,2)){var g=o(u,r),p=V.asn1.ASN1Util.oidHexToInt(g),d=V.asn1.x509.OID.oid2name(p),v=p.replace(/\./g," ");return""!=d?i+"ObjectIdentifier "+d+" ("+v+")\n":i+"ObjectIdentifier ("+v+")\n"}if("0c"==u.substr(r,2))return i+"UTF8String '"+hextoutf8(o(u,r))+"'\n";if("13"==u.substr(r,2))return i+"PrintableString '"+hextoutf8(o(u,r))+"'\n";if("14"==u.substr(r,2))return i+"TeletexString '"+hextoutf8(o(u,r))+"'\n";if("16"==u.substr(r,2))return i+"IA5String '"+hextoutf8(o(u,r))+"'\n";if("17"==u.substr(r,2))return i+"UTCTime "+hextoutf8(o(u,r))+"\n";if("18"==u.substr(r,2))return i+"GeneralizedTime "+hextoutf8(o(u,r))+"\n";if("30"==u.substr(r,2)){if("3000"==u.substr(r,4))return i+"SEQUENCE {}\n";f=i+"SEQUENCE\n";var y=t;if((2==(b=a(u,r)).length||3==b.length)&&"06"==u.substr(b[0],2)&&"04"==u.substr(b[b.length-1],2)){d=n.oidname(o(u,b[0]));var m=JSON.parse(JSON.stringify(t));m.x509ExtName=d,y=m}for(var S=0;S<b.length;S++)f+=s(u,y,b[S],i+"  ");return f}if("31"==u.substr(r,2)){f=i+"SET\n";var b=a(u,r);for(S=0;S<b.length;S++)f+=s(u,t,b[S],i+"  ");return f}var F=parseInt(u.substr(r,2),16);if(0!=(128&F)){var _=31&F;if(0!=(32&F)){var f=i+"["+_+"]\n";for(b=a(u,r),S=0;S<b.length;S++)f+=s(u,t,b[S],i+"  ");return f}return"68747470"==(l=o(u,r)).substr(0,8)&&(l=hextoutf8(l)),"subjectAltName"===t.x509ExtName&&2==_&&(l=hextoutf8(l)),f=i+"["+_+"] "+l+"\n"}return i+"UNKNOWN("+u.substr(r,2)+") "+o(u,r)+"\n"},J.isASN1HEX=function(e){var t=J;if(e.length%2==1)return!1;var r=t.getVblen(e,0),i=e.substr(0,2),n=t.getL(e,0);return e.length-i.length-n.length==2*r},J.oidname=function(e){var t=V.asn1;V.lang.String.isHex(e)&&(e=t.ASN1Util.oidHexToInt(e));var r=t.x509.OID.oid2name(e);return""===r&&(r=e),r},void 0!==V&&V||(V={}),void 0!==V.lang&&V.lang||(V.lang={}),V.lang.String=function(){},"function"==typeof i?(q=function utf8tob64u(e){return b64tob64u(new i(e,"utf8").toString("base64"))},W=function b64utoutf8(e){return new i(b64utob64(e),"base64").toString("utf8")}):(q=function utf8tob64u(e){return hextob64u(uricmptohex(encodeURIComponentAll(e)))},W=function b64utoutf8(e){return decodeURIComponent(hextouricmp(b64utohex(e)))}),V.lang.String.isInteger=function(e){return!!e.match(/^[0-9]+$/)||!!e.match(/^-[0-9]+$/)},V.lang.String.isHex=function(e){return!(e.length%2!=0||!e.match(/^[0-9a-f]+$/)&&!e.match(/^[0-9A-F]+$/))},V.lang.String.isBase64=function(e){return!(!(e=e.replace(/\s+/g,"")).match(/^[0-9A-Za-z+\/]+={0,3}$/)||e.length%4!=0)},V.lang.String.isBase64URL=function(e){return!e.match(/[+/=]/)&&(e=b64utob64(e),V.lang.String.isBase64(e))},V.lang.String.isIntegerArray=function(e){return!!(e=e.replace(/\s+/g,"")).match(/^\[[0-9,]+\]$/)};void 0!==V&&V||(V={}),void 0!==V.crypto&&V.crypto||(V.crypto={}),V.crypto.Util=new function(){this.DIGESTINFOHEAD={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414"},this.DEFAULTPROVIDER={md5:"cryptojs",sha1:"cryptojs",sha224:"cryptojs",sha256:"cryptojs",sha384:"cryptojs",sha512:"cryptojs",ripemd160:"cryptojs",hmacmd5:"cryptojs",hmacsha1:"cryptojs",hmacsha224:"cryptojs",hmacsha256:"cryptojs",hmacsha384:"cryptojs",hmacsha512:"cryptojs",hmacripemd160:"cryptojs",MD5withRSA:"cryptojs/jsrsa",SHA1withRSA:"cryptojs/jsrsa",SHA224withRSA:"cryptojs/jsrsa",SHA256withRSA:"cryptojs/jsrsa",SHA384withRSA:"cryptojs/jsrsa",SHA512withRSA:"cryptojs/jsrsa",RIPEMD160withRSA:"cryptojs/jsrsa",MD5withECDSA:"cryptojs/jsrsa",SHA1withECDSA:"cryptojs/jsrsa",SHA224withECDSA:"cryptojs/jsrsa",SHA256withECDSA:"cryptojs/jsrsa",SHA384withECDSA:"cryptojs/jsrsa",SHA512withECDSA:"cryptojs/jsrsa",RIPEMD160withECDSA:"cryptojs/jsrsa",SHA1withDSA:"cryptojs/jsrsa",SHA224withDSA:"cryptojs/jsrsa",SHA256withDSA:"cryptojs/jsrsa",MD5withRSAandMGF1:"cryptojs/jsrsa",SHA1withRSAandMGF1:"cryptojs/jsrsa",SHA224withRSAandMGF1:"cryptojs/jsrsa",SHA256withRSAandMGF1:"cryptojs/jsrsa",SHA384withRSAandMGF1:"cryptojs/jsrsa",SHA512withRSAandMGF1:"cryptojs/jsrsa",RIPEMD160withRSAandMGF1:"cryptojs/jsrsa"},this.CRYPTOJSMESSAGEDIGESTNAME={md5:y.algo.MD5,sha1:y.algo.SHA1,sha224:y.algo.SHA224,sha256:y.algo.SHA256,sha384:y.algo.SHA384,sha512:y.algo.SHA512,ripemd160:y.algo.RIPEMD160},this.getDigestInfoHex=function(e,t){if(void 0===this.DIGESTINFOHEAD[t])throw"alg not supported in Util.DIGESTINFOHEAD: "+t;return this.DIGESTINFOHEAD[t]+e},this.getPaddedDigestInfoHex=function(e,t,r){var i=this.getDigestInfoHex(e,t),n=r/4;if(i.length+22>n)throw"key is too short for SigAlg: keylen="+r+","+t;for(var o="0001",s="00"+i,a="",u=n-o.length-s.length,c=0;c<u;c+=2)a+="ff";return o+a+s},this.hashString=function(e,t){return new V.crypto.MessageDigest({alg:t}).digestString(e)},this.hashHex=function(e,t){return new V.crypto.MessageDigest({alg:t}).digestHex(e)},this.sha1=function(e){return new V.crypto.MessageDigest({alg:"sha1",prov:"cryptojs"}).digestString(e)},this.sha256=function(e){return new V.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"}).digestString(e)},this.sha256Hex=function(e){return new V.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"}).digestHex(e)},this.sha512=function(e){return new V.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"}).digestString(e)},this.sha512Hex=function(e){return new V.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"}).digestHex(e)}},V.crypto.Util.md5=function(e){return new V.crypto.MessageDigest({alg:"md5",prov:"cryptojs"}).digestString(e)},V.crypto.Util.ripemd160=function(e){return new V.crypto.MessageDigest({alg:"ripemd160",prov:"cryptojs"}).digestString(e)},V.crypto.Util.SECURERANDOMGEN=new SecureRandom,V.crypto.Util.getRandomHexOfNbytes=function(e){var t=new Array(e);return V.crypto.Util.SECURERANDOMGEN.nextBytes(t),BAtohex(t)},V.crypto.Util.getRandomBigIntegerOfNbytes=function(e){return new BigInteger(V.crypto.Util.getRandomHexOfNbytes(e),16)},V.crypto.Util.getRandomHexOfNbits=function(e){var t=e%8,r=new Array((e-t)/8+1);return V.crypto.Util.SECURERANDOMGEN.nextBytes(r),r[0]=(255<<t&255^255)&r[0],BAtohex(r)},V.crypto.Util.getRandomBigIntegerOfNbits=function(e){return new BigInteger(V.crypto.Util.getRandomHexOfNbits(e),16)},V.crypto.Util.getRandomBigIntegerZeroToMax=function(e){for(var t=e.bitLength();;){var r=V.crypto.Util.getRandomBigIntegerOfNbits(t);if(-1!=e.compareTo(r))return r}},V.crypto.Util.getRandomBigIntegerMinToMax=function(e,t){var r=e.compareTo(t);if(1==r)throw"biMin is greater than biMax";if(0==r)return e;var i=t.subtract(e);return V.crypto.Util.getRandomBigIntegerZeroToMax(i).add(e)},V.crypto.MessageDigest=function(e){this.setAlgAndProvider=function(e,t){if(null!==(e=V.crypto.MessageDigest.getCanonicalAlgName(e))&&void 0===t&&(t=V.crypto.Util.DEFAULTPROVIDER[e]),-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(e)&&"cryptojs"==t){try{this.md=V.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[e].create()}catch(t){throw"setAlgAndProvider hash alg set fail alg="+e+"/"+t}this.updateString=function(e){this.md.update(e)},this.updateHex=function(e){var t=y.enc.Hex.parse(e);this.md.update(t)},this.digest=function(){return this.md.finalize().toString(y.enc.Hex)},this.digestString=function(e){return this.updateString(e),this.digest()},this.digestHex=function(e){return this.updateHex(e),this.digest()}}if(-1!=":sha256:".indexOf(e)&&"sjcl"==t){try{this.md=new sjcl.hash.sha256}catch(t){throw"setAlgAndProvider hash alg set fail alg="+e+"/"+t}this.updateString=function(e){this.md.update(e)},this.updateHex=function(e){var t=sjcl.codec.hex.toBits(e);this.md.update(t)},this.digest=function(){var e=this.md.finalize();return sjcl.codec.hex.fromBits(e)},this.digestString=function(e){return this.updateString(e),this.digest()},this.digestHex=function(e){return this.updateHex(e),this.digest()}}},this.updateString=function(e){throw"updateString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.updateHex=function(e){throw"updateHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digest=function(){throw"digest() not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digestString=function(e){throw"digestString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digestHex=function(e){throw"digestHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName},void 0!==e&&void 0!==e.alg&&(this.algName=e.alg,void 0===e.prov&&(this.provName=V.crypto.Util.DEFAULTPROVIDER[this.algName]),this.setAlgAndProvider(this.algName,this.provName))},V.crypto.MessageDigest.getCanonicalAlgName=function(e){return"string"==typeof e&&(e=(e=e.toLowerCase()).replace(/-/,"")),e},V.crypto.MessageDigest.getHashLength=function(e){var t=V.crypto.MessageDigest,r=t.getCanonicalAlgName(e);if(void 0===t.HASHLENGTH[r])throw"not supported algorithm: "+e;return t.HASHLENGTH[r]},V.crypto.MessageDigest.HASHLENGTH={md5:16,sha1:20,sha224:28,sha256:32,sha384:48,sha512:64,ripemd160:20},V.crypto.Mac=function(e){this.setAlgAndProvider=function(e,t){if(null==(e=e.toLowerCase())&&(e="hmacsha1"),"hmac"!=(e=e.toLowerCase()).substr(0,4))throw"setAlgAndProvider unsupported HMAC alg: "+e;void 0===t&&(t=V.crypto.Util.DEFAULTPROVIDER[e]),this.algProv=e+"/"+t;var r=e.substr(4);if(-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(r)&&"cryptojs"==t){try{var i=V.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[r];this.mac=y.algo.HMAC.create(i,this.pass)}catch(e){throw"setAlgAndProvider hash alg set fail hashAlg="+r+"/"+e}this.updateString=function(e){this.mac.update(e)},this.updateHex=function(e){var t=y.enc.Hex.parse(e);this.mac.update(t)},this.doFinal=function(){return this.mac.finalize().toString(y.enc.Hex)},this.doFinalString=function(e){return this.updateString(e),this.doFinal()},this.doFinalHex=function(e){return this.updateHex(e),this.doFinal()}}},this.updateString=function(e){throw"updateString(str) not supported for this alg/prov: "+this.algProv},this.updateHex=function(e){throw"updateHex(hex) not supported for this alg/prov: "+this.algProv},this.doFinal=function(){throw"digest() not supported for this alg/prov: "+this.algProv},this.doFinalString=function(e){throw"digestString(str) not supported for this alg/prov: "+this.algProv},this.doFinalHex=function(e){throw"digestHex(hex) not supported for this alg/prov: "+this.algProv},this.setPassword=function(e){if("string"==typeof e){var t=e;return e.length%2!=1&&e.match(/^[0-9A-Fa-f]+$/)||(t=rstrtohex(e)),void(this.pass=y.enc.Hex.parse(t))}if("object"!=(void 0===e?"undefined":n(e)))throw"KJUR.crypto.Mac unsupported password type: "+e;t=null;if(void 0!==e.hex){if(e.hex.length%2!=0||!e.hex.match(/^[0-9A-Fa-f]+$/))throw"Mac: wrong hex password: "+e.hex;t=e.hex}if(void 0!==e.utf8&&(t=utf8tohex(e.utf8)),void 0!==e.rstr&&(t=rstrtohex(e.rstr)),void 0!==e.b64&&(t=b64tohex(e.b64)),void 0!==e.b64u&&(t=b64utohex(e.b64u)),null==t)throw"KJUR.crypto.Mac unsupported password type: "+e;this.pass=y.enc.Hex.parse(t)},void 0!==e&&(void 0!==e.pass&&this.setPassword(e.pass),void 0!==e.alg&&(this.algName=e.alg,void 0===e.prov&&(this.provName=V.crypto.Util.DEFAULTPROVIDER[this.algName]),this.setAlgAndProvider(this.algName,this.provName)))},V.crypto.Signature=function(e){var t=null;if(this._setAlgNames=function(){var e=this.algName.match(/^(.+)with(.+)$/);e&&(this.mdAlgName=e[1].toLowerCase(),this.pubkeyAlgName=e[2].toLowerCase())},this._zeroPaddingOfSignature=function(e,t){for(var r="",i=t/4-e.length,n=0;n<i;n++)r+="0";return r+e},this.setAlgAndProvider=function(e,t){if(this._setAlgNames(),"cryptojs/jsrsa"!=t)throw"provider not supported: "+t;if(-1!=":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)){try{this.md=new V.crypto.MessageDigest({alg:this.mdAlgName})}catch(e){throw"setAlgAndProvider hash alg set fail alg="+this.mdAlgName+"/"+e}this.init=function(e,t){var r=null;try{r=void 0===t?z.getKey(e):z.getKey(e,t)}catch(e){throw"init failed:"+e}if(!0===r.isPrivate)this.prvKey=r,this.state="SIGN";else{if(!0!==r.isPublic)throw"init failed.:"+r;this.pubKey=r,this.state="VERIFY"}},this.updateString=function(e){this.md.updateString(e)},this.updateHex=function(e){this.md.updateHex(e)},this.sign=function(){if(this.sHashHex=this.md.digest(),void 0!==this.ecprvhex&&void 0!==this.eccurvename){var e=new V.crypto.ECDSA({curve:this.eccurvename});this.hSign=e.signHex(this.sHashHex,this.ecprvhex)}else if(this.prvKey instanceof RSAKey&&"rsaandmgf1"===this.pubkeyAlgName)this.hSign=this.prvKey.signWithMessageHashPSS(this.sHashHex,this.mdAlgName,this.pssSaltLen);else if(this.prvKey instanceof RSAKey&&"rsa"===this.pubkeyAlgName)this.hSign=this.prvKey.signWithMessageHash(this.sHashHex,this.mdAlgName);else if(this.prvKey instanceof V.crypto.ECDSA)this.hSign=this.prvKey.signWithMessageHash(this.sHashHex);else{if(!(this.prvKey instanceof V.crypto.DSA))throw"Signature: unsupported private key alg: "+this.pubkeyAlgName;this.hSign=this.prvKey.signWithMessageHash(this.sHashHex)}return this.hSign},this.signString=function(e){return this.updateString(e),this.sign()},this.signHex=function(e){return this.updateHex(e),this.sign()},this.verify=function(e){if(this.sHashHex=this.md.digest(),void 0!==this.ecpubhex&&void 0!==this.eccurvename)return new V.crypto.ECDSA({curve:this.eccurvename}).verifyHex(this.sHashHex,e,this.ecpubhex);if(this.pubKey instanceof RSAKey&&"rsaandmgf1"===this.pubkeyAlgName)return this.pubKey.verifyWithMessageHashPSS(this.sHashHex,e,this.mdAlgName,this.pssSaltLen);if(this.pubKey instanceof RSAKey&&"rsa"===this.pubkeyAlgName)return this.pubKey.verifyWithMessageHash(this.sHashHex,e);if(void 0!==V.crypto.ECDSA&&this.pubKey instanceof V.crypto.ECDSA)return this.pubKey.verifyWithMessageHash(this.sHashHex,e);if(void 0!==V.crypto.DSA&&this.pubKey instanceof V.crypto.DSA)return this.pubKey.verifyWithMessageHash(this.sHashHex,e);throw"Signature: unsupported public key alg: "+this.pubkeyAlgName}}},this.init=function(e,t){throw"init(key, pass) not supported for this alg:prov="+this.algProvName},this.updateString=function(e){throw"updateString(str) not supported for this alg:prov="+this.algProvName},this.updateHex=function(e){throw"updateHex(hex) not supported for this alg:prov="+this.algProvName},this.sign=function(){throw"sign() not supported for this alg:prov="+this.algProvName},this.signString=function(e){throw"digestString(str) not supported for this alg:prov="+this.algProvName},this.signHex=function(e){throw"digestHex(hex) not supported for this alg:prov="+this.algProvName},this.verify=function(e){throw"verify(hSigVal) not supported for this alg:prov="+this.algProvName},this.initParams=e,void 0!==e&&(void 0!==e.alg&&(this.algName=e.alg,void 0===e.prov?this.provName=V.crypto.Util.DEFAULTPROVIDER[this.algName]:this.provName=e.prov,this.algProvName=this.algName+":"+this.provName,this.setAlgAndProvider(this.algName,this.provName),this._setAlgNames()),void 0!==e.psssaltlen&&(this.pssSaltLen=e.psssaltlen),void 0!==e.prvkeypem)){if(void 0!==e.prvkeypas)throw"both prvkeypem and prvkeypas parameters not supported";try{t=z.getKey(e.prvkeypem);this.init(t)}catch(e){throw"fatal error to load pem private key: "+e}}},V.crypto.Cipher=function(e){},V.crypto.Cipher.encrypt=function(e,t,r){if(t instanceof RSAKey&&t.isPublic){var i=V.crypto.Cipher.getAlgByKeyAndName(t,r);if("RSA"===i)return t.encrypt(e);if("RSAOAEP"===i)return t.encryptOAEP(e,"sha1");var n=i.match(/^RSAOAEP(\d+)$/);if(null!==n)return t.encryptOAEP(e,"sha"+n[1]);throw"Cipher.encrypt: unsupported algorithm for RSAKey: "+r}throw"Cipher.encrypt: unsupported key or algorithm"},V.crypto.Cipher.decrypt=function(e,t,r){if(t instanceof RSAKey&&t.isPrivate){var i=V.crypto.Cipher.getAlgByKeyAndName(t,r);if("RSA"===i)return t.decrypt(e);if("RSAOAEP"===i)return t.decryptOAEP(e,"sha1");var n=i.match(/^RSAOAEP(\d+)$/);if(null!==n)return t.decryptOAEP(e,"sha"+n[1]);throw"Cipher.decrypt: unsupported algorithm for RSAKey: "+r}throw"Cipher.decrypt: unsupported key or algorithm"},V.crypto.Cipher.getAlgByKeyAndName=function(e,t){if(e instanceof RSAKey){if(-1!=":RSA:RSAOAEP:RSAOAEP224:RSAOAEP256:RSAOAEP384:RSAOAEP512:".indexOf(t))return t;if(null===t||void 0===t)return"RSA";throw"getAlgByKeyAndName: not supported algorithm name for RSAKey: "+t}throw"getAlgByKeyAndName: not supported algorithm name: "+t},V.crypto.OID=new function(){this.oidhex2name={"2a864886f70d010101":"rsaEncryption","2a8648ce3d0201":"ecPublicKey","2a8648ce380401":"dsa","2a8648ce3d030107":"secp256r1","2b8104001f":"secp192k1","2b81040021":"secp224r1","2b8104000a":"secp256k1","2b81040023":"secp521r1","2b81040022":"secp384r1","2a8648ce380403":"SHA1withDSA","608648016503040301":"SHA224withDSA","608648016503040302":"SHA256withDSA"}},void 0!==V&&V||(V={}),void 0!==V.crypto&&V.crypto||(V.crypto={}),V.crypto.ECDSA=function(e){var t=new SecureRandom;this.type="EC",this.isPrivate=!1,this.isPublic=!1,this.getBigRandom=function(e){return new BigInteger(e.bitLength(),t).mod(e.subtract(BigInteger.ONE)).add(BigInteger.ONE)},this.setNamedCurve=function(e){this.ecparams=V.crypto.ECParameterDB.getByName(e),this.prvKeyHex=null,this.pubKeyHex=null,this.curveName=e},this.setPrivateKeyHex=function(e){this.isPrivate=!0,this.prvKeyHex=e},this.setPublicKeyHex=function(e){this.isPublic=!0,this.pubKeyHex=e},this.getPublicKeyXYHex=function(){var e=this.pubKeyHex;if("04"!==e.substr(0,2))throw"this method supports uncompressed format(04) only";var t=this.ecparams.keylen/4;if(e.length!==2+2*t)throw"malformed public key hex length";var r={};return r.x=e.substr(2,t),r.y=e.substr(2+t),r},this.getShortNISTPCurveName=function(){var e=this.curveName;return"secp256r1"===e||"NIST P-256"===e||"P-256"===e||"prime256v1"===e?"P-256":"secp384r1"===e||"NIST P-384"===e||"P-384"===e?"P-384":null},this.generateKeyPairHex=function(){var e=this.ecparams.n,t=this.getBigRandom(e),r=this.ecparams.G.multiply(t),i=r.getX().toBigInteger(),n=r.getY().toBigInteger(),o=this.ecparams.keylen/4,s=("0000000000"+t.toString(16)).slice(-o),a="04"+("0000000000"+i.toString(16)).slice(-o)+("0000000000"+n.toString(16)).slice(-o);return this.setPrivateKeyHex(s),this.setPublicKeyHex(a),{ecprvhex:s,ecpubhex:a}},this.signWithMessageHash=function(e){return this.signHex(e,this.prvKeyHex)},this.signHex=function(e,t){var r=new BigInteger(t,16),i=this.ecparams.n,n=new BigInteger(e,16);do{var o=this.getBigRandom(i),s=this.ecparams.G.multiply(o).getX().toBigInteger().mod(i)}while(s.compareTo(BigInteger.ZERO)<=0);var a=o.modInverse(i).multiply(n.add(r.multiply(s))).mod(i);return V.crypto.ECDSA.biRSSigToASN1Sig(s,a)},this.sign=function(e,t){var r=t,i=this.ecparams.n,n=BigInteger.fromByteArrayUnsigned(e);do{var o=this.getBigRandom(i),s=this.ecparams.G.multiply(o).getX().toBigInteger().mod(i)}while(s.compareTo(BigInteger.ZERO)<=0);var a=o.modInverse(i).multiply(n.add(r.multiply(s))).mod(i);return this.serializeSig(s,a)},this.verifyWithMessageHash=function(e,t){return this.verifyHex(e,t,this.pubKeyHex)},this.verifyHex=function(e,t,r){var i,n,o,s=V.crypto.ECDSA.parseSigHex(t);i=s.r,n=s.s,o=ECPointFp.decodeFromHex(this.ecparams.curve,r);var a=new BigInteger(e,16);return this.verifyRaw(a,i,n,o)},this.verify=function(e,t,r){var i,o,s;if(Bitcoin.Util.isArray(t)){var a=this.parseSig(t);i=a.r,o=a.s}else{if("object"!==(void 0===t?"undefined":n(t))||!t.r||!t.s)throw"Invalid value for signature";i=t.r,o=t.s}if(r instanceof ECPointFp)s=r;else{if(!Bitcoin.Util.isArray(r))throw"Invalid format for pubkey value, must be byte array or ECPointFp";s=ECPointFp.decodeFrom(this.ecparams.curve,r)}var u=BigInteger.fromByteArrayUnsigned(e);return this.verifyRaw(u,i,o,s)},this.verifyRaw=function(e,t,r,i){var n=this.ecparams.n,o=this.ecparams.G;if(t.compareTo(BigInteger.ONE)<0||t.compareTo(n)>=0)return!1;if(r.compareTo(BigInteger.ONE)<0||r.compareTo(n)>=0)return!1;var s=r.modInverse(n),a=e.multiply(s).mod(n),u=t.multiply(s).mod(n);return o.multiply(a).add(i.multiply(u)).getX().toBigInteger().mod(n).equals(t)},this.serializeSig=function(e,t){var r=e.toByteArraySigned(),i=t.toByteArraySigned(),n=[];return n.push(2),n.push(r.length),(n=n.concat(r)).push(2),n.push(i.length),(n=n.concat(i)).unshift(n.length),n.unshift(48),n},this.parseSig=function(e){var t;if(48!=e[0])throw new Error("Signature not a valid DERSequence");if(2!=e[t=2])throw new Error("First element in signature must be a DERInteger");var r=e.slice(t+2,t+2+e[t+1]);if(2!=e[t+=2+e[t+1]])throw new Error("Second element in signature must be a DERInteger");var i=e.slice(t+2,t+2+e[t+1]);return t+=2+e[t+1],{r:BigInteger.fromByteArrayUnsigned(r),s:BigInteger.fromByteArrayUnsigned(i)}},this.parseSigCompact=function(e){if(65!==e.length)throw"Signature has the wrong length";var t=e[0]-27;if(t<0||t>7)throw"Invalid signature type";var r=this.ecparams.n;return{r:BigInteger.fromByteArrayUnsigned(e.slice(1,33)).mod(r),s:BigInteger.fromByteArrayUnsigned(e.slice(33,65)).mod(r),i:t}},this.readPKCS5PrvKeyHex=function(e){var t,r,i,n=J,o=V.crypto.ECDSA.getName,s=n.getVbyList;if(!1===n.isASN1HEX(e))throw"not ASN.1 hex string";try{t=s(e,0,[2,0],"06"),r=s(e,0,[1],"04");try{i=s(e,0,[3,0],"03").substr(2)}catch(e){}}catch(e){throw"malformed PKCS#1/5 plain ECC private key"}if(this.curveName=o(t),void 0===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(i),this.setPrivateKeyHex(r),this.isPublic=!1},this.readPKCS8PrvKeyHex=function(e){var t,r,i,n=J,o=V.crypto.ECDSA.getName,s=n.getVbyList;if(!1===n.isASN1HEX(e))throw"not ASN.1 hex string";try{s(e,0,[1,0],"06"),t=s(e,0,[1,1],"06"),r=s(e,0,[2,0,1],"04");try{i=s(e,0,[2,0,2,0],"03").substr(2)}catch(e){}}catch(e){throw"malformed PKCS#8 plain ECC private key"}if(this.curveName=o(t),void 0===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(i),this.setPrivateKeyHex(r),this.isPublic=!1},this.readPKCS8PubKeyHex=function(e){var t,r,i=J,n=V.crypto.ECDSA.getName,o=i.getVbyList;if(!1===i.isASN1HEX(e))throw"not ASN.1 hex string";try{o(e,0,[0,0],"06"),t=o(e,0,[0,1],"06"),r=o(e,0,[1],"03").substr(2)}catch(e){throw"malformed PKCS#8 ECC public key"}if(this.curveName=n(t),null===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(r)},this.readCertPubKeyHex=function(e,t){5!==t&&(t=6);var r,i,n=J,o=V.crypto.ECDSA.getName,s=n.getVbyList;if(!1===n.isASN1HEX(e))throw"not ASN.1 hex string";try{r=s(e,0,[0,t,0,1],"06"),i=s(e,0,[0,t,1],"03").substr(2)}catch(e){throw"malformed X.509 certificate ECC public key"}if(this.curveName=o(r),null===this.curveName)throw"unsupported curve name";this.setNamedCurve(this.curveName),this.setPublicKeyHex(i)},void 0!==e&&void 0!==e.curve&&(this.curveName=e.curve),void 0===this.curveName&&(this.curveName="secp256r1"),this.setNamedCurve(this.curveName),void 0!==e&&(void 0!==e.prv&&this.setPrivateKeyHex(e.prv),void 0!==e.pub&&this.setPublicKeyHex(e.pub))},V.crypto.ECDSA.parseSigHex=function(e){var t=V.crypto.ECDSA.parseSigHexInHexRS(e);return{r:new BigInteger(t.r,16),s:new BigInteger(t.s,16)}},V.crypto.ECDSA.parseSigHexInHexRS=function(e){var t=J,r=t.getChildIdx,i=t.getV;if("30"!=e.substr(0,2))throw"signature is not a ASN.1 sequence";var n=r(e,0);if(2!=n.length)throw"number of signature ASN.1 sequence elements seem wrong";var o=n[0],s=n[1];if("02"!=e.substr(o,2))throw"1st item of sequene of signature is not ASN.1 integer";if("02"!=e.substr(s,2))throw"2nd item of sequene of signature is not ASN.1 integer";return{r:i(e,o),s:i(e,s)}},V.crypto.ECDSA.asn1SigToConcatSig=function(e){var t=V.crypto.ECDSA.parseSigHexInHexRS(e),r=t.r,i=t.s;if("00"==r.substr(0,2)&&r.length%32==2&&(r=r.substr(2)),"00"==i.substr(0,2)&&i.length%32==2&&(i=i.substr(2)),r.length%32==30&&(r="00"+r),i.length%32==30&&(i="00"+i),r.length%32!=0)throw"unknown ECDSA sig r length error";if(i.length%32!=0)throw"unknown ECDSA sig s length error";return r+i},V.crypto.ECDSA.concatSigToASN1Sig=function(e){if(e.length/2*8%128!=0)throw"unknown ECDSA concatinated r-s sig  length error";var t=e.substr(0,e.length/2),r=e.substr(e.length/2);return V.crypto.ECDSA.hexRSSigToASN1Sig(t,r)},V.crypto.ECDSA.hexRSSigToASN1Sig=function(e,t){var r=new BigInteger(e,16),i=new BigInteger(t,16);return V.crypto.ECDSA.biRSSigToASN1Sig(r,i)},V.crypto.ECDSA.biRSSigToASN1Sig=function(e,t){var r=V.asn1,i=new r.DERInteger({bigint:e}),n=new r.DERInteger({bigint:t});return new r.DERSequence({array:[i,n]}).getEncodedHex()},V.crypto.ECDSA.getName=function(e){return"2a8648ce3d030107"===e?"secp256r1":"2b8104000a"===e?"secp256k1":"2b81040022"===e?"secp384r1":-1!=="|secp256r1|NIST P-256|P-256|prime256v1|".indexOf(e)?"secp256r1":-1!=="|secp256k1|".indexOf(e)?"secp256k1":-1!=="|secp384r1|NIST P-384|P-384|".indexOf(e)?"secp384r1":null},void 0!==V&&V||(V={}),void 0!==V.crypto&&V.crypto||(V.crypto={}),V.crypto.ECParameterDB=new function(){var e={},t={};function a(e){return new BigInteger(e,16)}this.getByName=function(r){var i=r;if(void 0!==t[i]&&(i=t[r]),void 0!==e[i])return e[i];throw"unregistered EC curve name: "+i},this.regist=function(r,i,n,o,s,u,c,h,l,f,g,p){e[r]={};var d=a(n),v=a(o),y=a(s),m=a(u),S=a(c),b=new ECCurveFp(d,v,y),F=b.decodePointHex("04"+h+l);e[r].name=r,e[r].keylen=i,e[r].curve=b,e[r].G=F,e[r].n=m,e[r].h=S,e[r].oid=g,e[r].info=p;for(var _=0;_<f.length;_++)t[f[_]]=r}},V.crypto.ECParameterDB.regist("secp128r1",128,"FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC","E87579C11079F43DD824993C2CEE5ED3","FFFFFFFE0000000075A30D1B9038A115","1","161FF7528B899B2D0C28607CA52C5B86","CF5AC8395BAFEB13C02DA292DDED7A83",[],"","secp128r1 : SECG curve over a 128 bit prime field"),V.crypto.ECParameterDB.regist("secp160k1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73","0","7","0100000000000000000001B8FA16DFAB9ACA16B6B3","1","3B4C382CE37AA192A4019E763036F4F5DD4D7EBB","938CF935318FDCED6BC28286531733C3F03C4FEE",[],"","secp160k1 : SECG curve over a 160 bit prime field"),V.crypto.ECParameterDB.regist("secp160r1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC","1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45","0100000000000000000001F4C8F927AED3CA752257","1","4A96B5688EF573284664698968C38BB913CBFC82","23A628553168947D59DCC912042351377AC5FB32",[],"","secp160r1 : SECG curve over a 160 bit prime field"),V.crypto.ECParameterDB.regist("secp192k1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37","0","3","FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D","1","DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D","9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D",[]),V.crypto.ECParameterDB.regist("secp192r1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC","64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1","FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831","1","188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012","07192B95FFC8DA78631011ED6B24CDD573F977A11E794811",[]),V.crypto.ECParameterDB.regist("secp224r1",224,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE","B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4","FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D","1","B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21","BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34",[]),V.crypto.ECParameterDB.regist("secp256k1",256,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F","0","7","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141","1","79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798","483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",[]),V.crypto.ECParameterDB.regist("secp256r1",256,"FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC","5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B","FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551","1","6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296","4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5",["NIST P-256","P-256","prime256v1"]),V.crypto.ECParameterDB.regist("secp384r1",384,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC","B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973","1","AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7","3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f",["NIST P-384","P-384"]),V.crypto.ECParameterDB.regist("secp521r1",521,"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC","051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409","1","C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66","011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650",["NIST P-521","P-521"]);var z=function(){var t=function d(e,t,i){return r(y.AES,e,t,i)},r=function k(e,t,r,i){var n=y.enc.Hex.parse(t),o=y.enc.Hex.parse(r),s=y.enc.Hex.parse(i),a={};a.key=o,a.iv=s,a.ciphertext=n;var u=e.decrypt(a,o,{iv:s});return y.enc.Hex.stringify(u)},i=function l(e,t,r){return n(y.AES,e,t,r)},n=function g(e,t,r,i){var n=y.enc.Hex.parse(t),o=y.enc.Hex.parse(r),s=y.enc.Hex.parse(i),a=e.encrypt(n,o,{iv:s}),u=y.enc.Hex.parse(a.toString());return y.enc.Base64.stringify(u)},s={"AES-256-CBC":{proc:t,eproc:i,keylen:32,ivlen:16},"AES-192-CBC":{proc:t,eproc:i,keylen:24,ivlen:16},"AES-128-CBC":{proc:t,eproc:i,keylen:16,ivlen:16},"DES-EDE3-CBC":{proc:function e(t,i,n){return r(y.TripleDES,t,i,n)},eproc:function o(e,t,r){return n(y.TripleDES,e,t,r)},keylen:24,ivlen:8},"DES-CBC":{proc:function a(e,t,i){return r(y.DES,e,t,i)},eproc:function f(e,t,r){return n(y.DES,e,t,r)},keylen:8,ivlen:8}},u=function n(e){var t={},r=e.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)","m"));r&&(t.cipher=r[1],t.ivsalt=r[2]);var i=e.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"));i&&(t.type=i[1]);var o=-1,s=0;-1!=e.indexOf("\r\n\r\n")&&(o=e.indexOf("\r\n\r\n"),s=2),-1!=e.indexOf("\n\n")&&(o=e.indexOf("\n\n"),s=1);var a=e.indexOf("-----END");if(-1!=o&&-1!=a){var u=e.substring(o+2*s,a-s);u=u.replace(/\s+/g,""),t.data=u}return t},c=function j(e,t,r){for(var i=r.substring(0,16),n=y.enc.Hex.parse(i),o=y.enc.Utf8.parse(t),a=s[e].keylen+s[e].ivlen,u="",c=null;;){var h=y.algo.MD5.create();if(null!=c&&h.update(c),h.update(o),h.update(n),c=h.finalize(),(u+=y.enc.Hex.stringify(c)).length>=2*a)break}var l={};return l.keyhex=u.substr(0,2*s[e].keylen),l.ivhex=u.substr(2*s[e].keylen,2*s[e].ivlen),l},g=function b(e,t,r,i){var n=y.enc.Base64.parse(e),o=y.enc.Hex.stringify(n);return(0,s[t].proc)(o,r,i)};return{version:"1.0.0",parsePKCS5PEM:function parsePKCS5PEM(e){return u(e)},getKeyAndUnusedIvByPasscodeAndIvsalt:function getKeyAndUnusedIvByPasscodeAndIvsalt(e,t,r){return c(e,t,r)},decryptKeyB64:function decryptKeyB64(e,t,r,i){return g(e,t,r,i)},getDecryptedKeyHex:function getDecryptedKeyHex(e,t){var r=u(e),i=(r.type,r.cipher),n=r.ivsalt,o=r.data,s=c(i,t,n).keyhex;return g(o,i,s,n)},getEncryptedPKCS5PEMFromPrvKeyHex:function getEncryptedPKCS5PEMFromPrvKeyHex(e,t,r,i,n){var o="";if(void 0!==i&&null!=i||(i="AES-256-CBC"),void 0===s[i])throw"KEYUTIL unsupported algorithm: "+i;void 0!==n&&null!=n||(n=function m(e){var t=y.lib.WordArray.random(e);return y.enc.Hex.stringify(t)}(s[i].ivlen).toUpperCase());var a=function h(e,t,r,i){return(0,s[t].eproc)(e,r,i)}(t,i,c(i,r,n).keyhex,n);o="-----BEGIN "+e+" PRIVATE KEY-----\r\n";return o+="Proc-Type: 4,ENCRYPTED\r\n",o+="DEK-Info: "+i+","+n+"\r\n",o+="\r\n",o+=a.replace(/(.{64})/g,"$1\r\n"),o+="\r\n-----END "+e+" PRIVATE KEY-----\r\n"},parseHexOfEncryptedPKCS8:function parseHexOfEncryptedPKCS8(e){var t=J,r=t.getChildIdx,i=t.getV,n={},o=r(e,0);if(2!=o.length)throw"malformed format: SEQUENCE(0).items != 2: "+o.length;n.ciphertext=i(e,o[1]);var s=r(e,o[0]);if(2!=s.length)throw"malformed format: SEQUENCE(0.0).items != 2: "+s.length;if("2a864886f70d01050d"!=i(e,s[0]))throw"this only supports pkcs5PBES2";var a=r(e,s[1]);if(2!=s.length)throw"malformed format: SEQUENCE(0.0.1).items != 2: "+a.length;var u=r(e,a[1]);if(2!=u.length)throw"malformed format: SEQUENCE(0.0.1.1).items != 2: "+u.length;if("2a864886f70d0307"!=i(e,u[0]))throw"this only supports TripleDES";n.encryptionSchemeAlg="TripleDES",n.encryptionSchemeIV=i(e,u[1]);var c=r(e,a[0]);if(2!=c.length)throw"malformed format: SEQUENCE(0.0.1.0).items != 2: "+c.length;if("2a864886f70d01050c"!=i(e,c[0]))throw"this only supports pkcs5PBKDF2";var h=r(e,c[1]);if(h.length<2)throw"malformed format: SEQUENCE(0.0.1.0.1).items < 2: "+h.length;n.pbkdf2Salt=i(e,h[0]);var l=i(e,h[1]);try{n.pbkdf2Iter=parseInt(l,16)}catch(e){throw"malformed format pbkdf2Iter: "+l}return n},getPBKDF2KeyHexFromParam:function getPBKDF2KeyHexFromParam(e,t){var r=y.enc.Hex.parse(e.pbkdf2Salt),i=e.pbkdf2Iter,n=y.PBKDF2(t,r,{keySize:6,iterations:i});return y.enc.Hex.stringify(n)},_getPlainPKCS8HexFromEncryptedPKCS8PEM:function _getPlainPKCS8HexFromEncryptedPKCS8PEM(e,t){var r=pemtohex(e,"ENCRYPTED PRIVATE KEY"),i=this.parseHexOfEncryptedPKCS8(r),n=z.getPBKDF2KeyHexFromParam(i,t),o={};o.ciphertext=y.enc.Hex.parse(i.ciphertext);var s=y.enc.Hex.parse(n),a=y.enc.Hex.parse(i.encryptionSchemeIV),u=y.TripleDES.decrypt(o,s,{iv:a});return y.enc.Hex.stringify(u)},getKeyFromEncryptedPKCS8PEM:function getKeyFromEncryptedPKCS8PEM(e,t){var r=this._getPlainPKCS8HexFromEncryptedPKCS8PEM(e,t);return this.getKeyFromPlainPrivatePKCS8Hex(r)},parsePlainPrivatePKCS8Hex:function parsePlainPrivatePKCS8Hex(e){var t=J,r=t.getChildIdx,i=t.getV,n={algparam:null};if("30"!=e.substr(0,2))throw"malformed plain PKCS8 private key(code:001)";var o=r(e,0);if(3!=o.length)throw"malformed plain PKCS8 private key(code:002)";if("30"!=e.substr(o[1],2))throw"malformed PKCS8 private key(code:003)";var s=r(e,o[1]);if(2!=s.length)throw"malformed PKCS8 private key(code:004)";if("06"!=e.substr(s[0],2))throw"malformed PKCS8 private key(code:005)";if(n.algoid=i(e,s[0]),"06"==e.substr(s[1],2)&&(n.algparam=i(e,s[1])),"04"!=e.substr(o[2],2))throw"malformed PKCS8 private key(code:006)";return n.keyidx=t.getVidx(e,o[2]),n},getKeyFromPlainPrivatePKCS8PEM:function getKeyFromPlainPrivatePKCS8PEM(e){var t=pemtohex(e,"PRIVATE KEY");return this.getKeyFromPlainPrivatePKCS8Hex(t)},getKeyFromPlainPrivatePKCS8Hex:function getKeyFromPlainPrivatePKCS8Hex(e){var t,r=this.parsePlainPrivatePKCS8Hex(e);if("2a864886f70d010101"==r.algoid)t=new RSAKey;else if("2a8648ce380401"==r.algoid)t=new V.crypto.DSA;else{if("2a8648ce3d0201"!=r.algoid)throw"unsupported private key algorithm";t=new V.crypto.ECDSA}return t.readPKCS8PrvKeyHex(e),t},_getKeyFromPublicPKCS8Hex:function _getKeyFromPublicPKCS8Hex(e){var t,r=J.getVbyList(e,0,[0,0],"06");if("2a864886f70d010101"===r)t=new RSAKey;else if("2a8648ce380401"===r)t=new V.crypto.DSA;else{if("2a8648ce3d0201"!==r)throw"unsupported PKCS#8 public key hex";t=new V.crypto.ECDSA}return t.readPKCS8PubKeyHex(e),t},parsePublicRawRSAKeyHex:function parsePublicRawRSAKeyHex(e){var t=J,r=t.getChildIdx,i=t.getV,n={};if("30"!=e.substr(0,2))throw"malformed RSA key(code:001)";var o=r(e,0);if(2!=o.length)throw"malformed RSA key(code:002)";if("02"!=e.substr(o[0],2))throw"malformed RSA key(code:003)";if(n.n=i(e,o[0]),"02"!=e.substr(o[1],2))throw"malformed RSA key(code:004)";return n.e=i(e,o[1]),n},parsePublicPKCS8Hex:function parsePublicPKCS8Hex(e){var t=J,r=t.getChildIdx,i=t.getV,n={algparam:null},o=r(e,0);if(2!=o.length)throw"outer DERSequence shall have 2 elements: "+o.length;var s=o[0];if("30"!=e.substr(s,2))throw"malformed PKCS8 public key(code:001)";var a=r(e,s);if(2!=a.length)throw"malformed PKCS8 public key(code:002)";if("06"!=e.substr(a[0],2))throw"malformed PKCS8 public key(code:003)";if(n.algoid=i(e,a[0]),"06"==e.substr(a[1],2)?n.algparam=i(e,a[1]):"30"==e.substr(a[1],2)&&(n.algparam={},n.algparam.p=t.getVbyList(e,a[1],[0],"02"),n.algparam.q=t.getVbyList(e,a[1],[1],"02"),n.algparam.g=t.getVbyList(e,a[1],[2],"02")),"03"!=e.substr(o[1],2))throw"malformed PKCS8 public key(code:004)";return n.key=i(e,o[1]).substr(2),n}}}();z.getKey=function(e,t,r){var i=(v=J).getChildIdx,n=(v.getV,v.getVbyList),o=V.crypto,s=o.ECDSA,a=o.DSA,u=RSAKey,c=pemtohex,h=z;if(void 0!==u&&e instanceof u)return e;if(void 0!==s&&e instanceof s)return e;if(void 0!==a&&e instanceof a)return e;if(void 0!==e.curve&&void 0!==e.xy&&void 0===e.d)return new s({pub:e.xy,curve:e.curve});if(void 0!==e.curve&&void 0!==e.d)return new s({prv:e.d,curve:e.curve});if(void 0===e.kty&&void 0!==e.n&&void 0!==e.e&&void 0===e.d)return(C=new u).setPublic(e.n,e.e),C;if(void 0===e.kty&&void 0!==e.n&&void 0!==e.e&&void 0!==e.d&&void 0!==e.p&&void 0!==e.q&&void 0!==e.dp&&void 0!==e.dq&&void 0!==e.co&&void 0===e.qi)return(C=new u).setPrivateEx(e.n,e.e,e.d,e.p,e.q,e.dp,e.dq,e.co),C;if(void 0===e.kty&&void 0!==e.n&&void 0!==e.e&&void 0!==e.d&&void 0===e.p)return(C=new u).setPrivate(e.n,e.e,e.d),C;if(void 0!==e.p&&void 0!==e.q&&void 0!==e.g&&void 0!==e.y&&void 0===e.x)return(C=new a).setPublic(e.p,e.q,e.g,e.y),C;if(void 0!==e.p&&void 0!==e.q&&void 0!==e.g&&void 0!==e.y&&void 0!==e.x)return(C=new a).setPrivate(e.p,e.q,e.g,e.y,e.x),C;if("RSA"===e.kty&&void 0!==e.n&&void 0!==e.e&&void 0===e.d)return(C=new u).setPublic(b64utohex(e.n),b64utohex(e.e)),C;if("RSA"===e.kty&&void 0!==e.n&&void 0!==e.e&&void 0!==e.d&&void 0!==e.p&&void 0!==e.q&&void 0!==e.dp&&void 0!==e.dq&&void 0!==e.qi)return(C=new u).setPrivateEx(b64utohex(e.n),b64utohex(e.e),b64utohex(e.d),b64utohex(e.p),b64utohex(e.q),b64utohex(e.dp),b64utohex(e.dq),b64utohex(e.qi)),C;if("RSA"===e.kty&&void 0!==e.n&&void 0!==e.e&&void 0!==e.d)return(C=new u).setPrivate(b64utohex(e.n),b64utohex(e.e),b64utohex(e.d)),C;if("EC"===e.kty&&void 0!==e.crv&&void 0!==e.x&&void 0!==e.y&&void 0===e.d){var l=(A=new s({curve:e.crv})).ecparams.keylen/4,f="04"+("0000000000"+b64utohex(e.x)).slice(-l)+("0000000000"+b64utohex(e.y)).slice(-l);return A.setPublicKeyHex(f),A}if("EC"===e.kty&&void 0!==e.crv&&void 0!==e.x&&void 0!==e.y&&void 0!==e.d){l=(A=new s({curve:e.crv})).ecparams.keylen/4,f="04"+("0000000000"+b64utohex(e.x)).slice(-l)+("0000000000"+b64utohex(e.y)).slice(-l);var g=("0000000000"+b64utohex(e.d)).slice(-l);return A.setPublicKeyHex(f),A.setPrivateKeyHex(g),A}if("pkcs5prv"===r){var p,d=e,v=J;if(9===(p=i(d,0)).length)(C=new u).readPKCS5PrvKeyHex(d);else if(6===p.length)(C=new a).readPKCS5PrvKeyHex(d);else{if(!(p.length>2&&"04"===d.substr(p[1],2)))throw"unsupported PKCS#1/5 hexadecimal key";(C=new s).readPKCS5PrvKeyHex(d)}return C}if("pkcs8prv"===r)return C=h.getKeyFromPlainPrivatePKCS8Hex(e);if("pkcs8pub"===r)return h._getKeyFromPublicPKCS8Hex(e);if("x509pub"===r)return X509.getPublicKeyFromCertHex(e);if(-1!=e.indexOf("-END CERTIFICATE-",0)||-1!=e.indexOf("-END X509 CERTIFICATE-",0)||-1!=e.indexOf("-END TRUSTED CERTIFICATE-",0))return X509.getPublicKeyFromCertPEM(e);if(-1!=e.indexOf("-END PUBLIC KEY-")){var y=pemtohex(e,"PUBLIC KEY");return h._getKeyFromPublicPKCS8Hex(y)}if(-1!=e.indexOf("-END RSA PRIVATE KEY-")&&-1==e.indexOf("4,ENCRYPTED")){var m=c(e,"RSA PRIVATE KEY");return h.getKey(m,null,"pkcs5prv")}if(-1!=e.indexOf("-END DSA PRIVATE KEY-")&&-1==e.indexOf("4,ENCRYPTED")){var S=n(B=c(e,"DSA PRIVATE KEY"),0,[1],"02"),b=n(B,0,[2],"02"),F=n(B,0,[3],"02"),_=n(B,0,[4],"02"),w=n(B,0,[5],"02");return(C=new a).setPrivate(new BigInteger(S,16),new BigInteger(b,16),new BigInteger(F,16),new BigInteger(_,16),new BigInteger(w,16)),C}if(-1!=e.indexOf("-END PRIVATE KEY-"))return h.getKeyFromPlainPrivatePKCS8PEM(e);if(-1!=e.indexOf("-END RSA PRIVATE KEY-")&&-1!=e.indexOf("4,ENCRYPTED")){var E=h.getDecryptedKeyHex(e,t),x=new RSAKey;return x.readPKCS5PrvKeyHex(E),x}if(-1!=e.indexOf("-END EC PRIVATE KEY-")&&-1!=e.indexOf("4,ENCRYPTED")){var A,C=n(B=h.getDecryptedKeyHex(e,t),0,[1],"04"),P=n(B,0,[2,0],"06"),I=n(B,0,[3,0],"03").substr(2);if(void 0===V.crypto.OID.oidhex2name[P])throw"undefined OID(hex) in KJUR.crypto.OID: "+P;return(A=new s({curve:V.crypto.OID.oidhex2name[P]})).setPublicKeyHex(I),A.setPrivateKeyHex(C),A.isPublic=!1,A}if(-1!=e.indexOf("-END DSA PRIVATE KEY-")&&-1!=e.indexOf("4,ENCRYPTED")){var B;S=n(B=h.getDecryptedKeyHex(e,t),0,[1],"02"),b=n(B,0,[2],"02"),F=n(B,0,[3],"02"),_=n(B,0,[4],"02"),w=n(B,0,[5],"02");return(C=new a).setPrivate(new BigInteger(S,16),new BigInteger(b,16),new BigInteger(F,16),new BigInteger(_,16),new BigInteger(w,16)),C}if(-1!=e.indexOf("-END ENCRYPTED PRIVATE KEY-"))return h.getKeyFromEncryptedPKCS8PEM(e,t);throw"not supported argument"},z.generateKeypair=function(e,t){if("RSA"==e){var r=t;(s=new RSAKey).generate(r,"10001"),s.isPrivate=!0,s.isPublic=!0;var i=new RSAKey,n=s.n.toString(16),o=s.e.toString(16);return i.setPublic(n,o),i.isPrivate=!1,i.isPublic=!0,(a={}).prvKeyObj=s,a.pubKeyObj=i,a}if("EC"==e){var s,a,u=t,c=new V.crypto.ECDSA({curve:u}).generateKeyPairHex();return(s=new V.crypto.ECDSA({curve:u})).setPublicKeyHex(c.ecpubhex),s.setPrivateKeyHex(c.ecprvhex),s.isPrivate=!0,s.isPublic=!1,(i=new V.crypto.ECDSA({curve:u})).setPublicKeyHex(c.ecpubhex),i.isPrivate=!1,i.isPublic=!0,(a={}).prvKeyObj=s,a.pubKeyObj=i,a}throw"unknown algorithm: "+e},z.getPEM=function(e,t,r,i,n,s){var a=V,u=a.asn1,c=u.DERObjectIdentifier,h=u.DERInteger,l=u.ASN1Util.newObject,f=u.x509.SubjectPublicKeyInfo,g=a.crypto,p=g.DSA,d=g.ECDSA,v=RSAKey;function A(e){return l({seq:[{int:0},{int:{bigint:e.n}},{int:e.e},{int:{bigint:e.d}},{int:{bigint:e.p}},{int:{bigint:e.q}},{int:{bigint:e.dmp1}},{int:{bigint:e.dmq1}},{int:{bigint:e.coeff}}]})}function B(e){return l({seq:[{int:1},{octstr:{hex:e.prvKeyHex}},{tag:["a0",!0,{oid:{name:e.curveName}}]},{tag:["a1",!0,{bitstr:{hex:"00"+e.pubKeyHex}}]}]})}function x(e){return l({seq:[{int:0},{int:{bigint:e.p}},{int:{bigint:e.q}},{int:{bigint:e.g}},{int:{bigint:e.y}},{int:{bigint:e.x}}]})}if((void 0!==v&&e instanceof v||void 0!==p&&e instanceof p||void 0!==d&&e instanceof d)&&1==e.isPublic&&(void 0===t||"PKCS8PUB"==t))return hextopem(F=new f(e).getEncodedHex(),"PUBLIC KEY");if("PKCS1PRV"==t&&void 0!==v&&e instanceof v&&(void 0===r||null==r)&&1==e.isPrivate)return hextopem(F=A(e).getEncodedHex(),"RSA PRIVATE KEY");if("PKCS1PRV"==t&&void 0!==d&&e instanceof d&&(void 0===r||null==r)&&1==e.isPrivate){var m=new c({name:e.curveName}).getEncodedHex(),S=B(e).getEncodedHex(),b="";return b+=hextopem(m,"EC PARAMETERS"),b+=hextopem(S,"EC PRIVATE KEY")}if("PKCS1PRV"==t&&void 0!==p&&e instanceof p&&(void 0===r||null==r)&&1==e.isPrivate)return hextopem(F=x(e).getEncodedHex(),"DSA PRIVATE KEY");if("PKCS5PRV"==t&&void 0!==v&&e instanceof v&&void 0!==r&&null!=r&&1==e.isPrivate){var F=A(e).getEncodedHex();return void 0===i&&(i="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA",F,r,i,s)}if("PKCS5PRV"==t&&void 0!==d&&e instanceof d&&void 0!==r&&null!=r&&1==e.isPrivate){F=B(e).getEncodedHex();return void 0===i&&(i="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("EC",F,r,i,s)}if("PKCS5PRV"==t&&void 0!==p&&e instanceof p&&void 0!==r&&null!=r&&1==e.isPrivate){F=x(e).getEncodedHex();return void 0===i&&(i="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("DSA",F,r,i,s)}var _=function o(e,t){var r=w(e,t);return new l({seq:[{seq:[{oid:{name:"pkcs5PBES2"}},{seq:[{seq:[{oid:{name:"pkcs5PBKDF2"}},{seq:[{octstr:{hex:r.pbkdf2Salt}},{int:r.pbkdf2Iter}]}]},{seq:[{oid:{name:"des-EDE3-CBC"}},{octstr:{hex:r.encryptionSchemeIV}}]}]}]},{octstr:{hex:r.ciphertext}}]}).getEncodedHex()},w=function c(e,t){var r=y.lib.WordArray.random(8),i=y.lib.WordArray.random(8),n=y.PBKDF2(t,r,{keySize:6,iterations:100}),o=y.enc.Hex.parse(e),s=y.TripleDES.encrypt(o,n,{iv:i})+"",a={};return a.ciphertext=s,a.pbkdf2Salt=y.enc.Hex.stringify(r),a.pbkdf2Iter=100,a.encryptionSchemeAlg="DES-EDE3-CBC",a.encryptionSchemeIV=y.enc.Hex.stringify(i),a};if("PKCS8PRV"==t&&void 0!=v&&e instanceof v&&1==e.isPrivate){var E=A(e).getEncodedHex();F=l({seq:[{int:0},{seq:[{oid:{name:"rsaEncryption"}},{null:!0}]},{octstr:{hex:E}}]}).getEncodedHex();return void 0===r||null==r?hextopem(F,"PRIVATE KEY"):hextopem(S=_(F,r),"ENCRYPTED PRIVATE KEY")}if("PKCS8PRV"==t&&void 0!==d&&e instanceof d&&1==e.isPrivate){E=new l({seq:[{int:1},{octstr:{hex:e.prvKeyHex}},{tag:["a1",!0,{bitstr:{hex:"00"+e.pubKeyHex}}]}]}).getEncodedHex(),F=l({seq:[{int:0},{seq:[{oid:{name:"ecPublicKey"}},{oid:{name:e.curveName}}]},{octstr:{hex:E}}]}).getEncodedHex();return void 0===r||null==r?hextopem(F,"PRIVATE KEY"):hextopem(S=_(F,r),"ENCRYPTED PRIVATE KEY")}if("PKCS8PRV"==t&&void 0!==p&&e instanceof p&&1==e.isPrivate){E=new h({bigint:e.x}).getEncodedHex(),F=l({seq:[{int:0},{seq:[{oid:{name:"dsa"}},{seq:[{int:{bigint:e.p}},{int:{bigint:e.q}},{int:{bigint:e.g}}]}]},{octstr:{hex:E}}]}).getEncodedHex();return void 0===r||null==r?hextopem(F,"PRIVATE KEY"):hextopem(S=_(F,r),"ENCRYPTED PRIVATE KEY")}throw"unsupported object nor format"},z.getKeyFromCSRPEM=function(e){var t=pemtohex(e,"CERTIFICATE REQUEST");return z.getKeyFromCSRHex(t)},z.getKeyFromCSRHex=function(e){var t=z.parseCSRHex(e);return z.getKey(t.p8pubkeyhex,null,"pkcs8pub")},z.parseCSRHex=function(e){var t=J,r=t.getChildIdx,i=t.getTLV,n={},o=e;if("30"!=o.substr(0,2))throw"malformed CSR(code:001)";var s=r(o,0);if(s.length<1)throw"malformed CSR(code:002)";if("30"!=o.substr(s[0],2))throw"malformed CSR(code:003)";var a=r(o,s[0]);if(a.length<3)throw"malformed CSR(code:004)";return n.p8pubkeyhex=i(o,a[2]),n},z.getJWKFromKey=function(e){var t={};if(e instanceof RSAKey&&e.isPrivate)return t.kty="RSA",t.n=hextob64u(e.n.toString(16)),t.e=hextob64u(e.e.toString(16)),t.d=hextob64u(e.d.toString(16)),t.p=hextob64u(e.p.toString(16)),t.q=hextob64u(e.q.toString(16)),t.dp=hextob64u(e.dmp1.toString(16)),t.dq=hextob64u(e.dmq1.toString(16)),t.qi=hextob64u(e.coeff.toString(16)),t;if(e instanceof RSAKey&&e.isPublic)return t.kty="RSA",t.n=hextob64u(e.n.toString(16)),t.e=hextob64u(e.e.toString(16)),t;if(e instanceof V.crypto.ECDSA&&e.isPrivate){if("P-256"!==(i=e.getShortNISTPCurveName())&&"P-384"!==i)throw"unsupported curve name for JWT: "+i;var r=e.getPublicKeyXYHex();return t.kty="EC",t.crv=i,t.x=hextob64u(r.x),t.y=hextob64u(r.y),t.d=hextob64u(e.prvKeyHex),t}if(e instanceof V.crypto.ECDSA&&e.isPublic){var i;if("P-256"!==(i=e.getShortNISTPCurveName())&&"P-384"!==i)throw"unsupported curve name for JWT: "+i;r=e.getPublicKeyXYHex();return t.kty="EC",t.crv=i,t.x=hextob64u(r.x),t.y=hextob64u(r.y),t}throw"not supported key object"},RSAKey.getPosArrayOfChildrenFromHex=function(e){return J.getChildIdx(e,0)},RSAKey.getHexValueArrayOfChildrenFromHex=function(e){var t,r=J.getV,i=r(e,(t=RSAKey.getPosArrayOfChildrenFromHex(e))[0]),n=r(e,t[1]),o=r(e,t[2]),s=r(e,t[3]),a=r(e,t[4]),u=r(e,t[5]),c=r(e,t[6]),h=r(e,t[7]),l=r(e,t[8]);return(t=new Array).push(i,n,o,s,a,u,c,h,l),t},RSAKey.prototype.readPrivateKeyFromPEMString=function(e){var t=pemtohex(e),r=RSAKey.getHexValueArrayOfChildrenFromHex(t);this.setPrivateEx(r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8])},RSAKey.prototype.readPKCS5PrvKeyHex=function(e){var t=RSAKey.getHexValueArrayOfChildrenFromHex(e);this.setPrivateEx(t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8])},RSAKey.prototype.readPKCS8PrvKeyHex=function(e){var t,r,i,n,o,s,a,u,c=J,h=c.getVbyList;if(!1===c.isASN1HEX(e))throw"not ASN.1 hex string";try{t=h(e,0,[2,0,1],"02"),r=h(e,0,[2,0,2],"02"),i=h(e,0,[2,0,3],"02"),n=h(e,0,[2,0,4],"02"),o=h(e,0,[2,0,5],"02"),s=h(e,0,[2,0,6],"02"),a=h(e,0,[2,0,7],"02"),u=h(e,0,[2,0,8],"02")}catch(e){throw"malformed PKCS#8 plain RSA private key"}this.setPrivateEx(t,r,i,n,o,s,a,u)},RSAKey.prototype.readPKCS5PubKeyHex=function(e){var t=J,r=t.getV;if(!1===t.isASN1HEX(e))throw"keyHex is not ASN.1 hex string";var i=t.getChildIdx(e,0);if(2!==i.length||"02"!==e.substr(i[0],2)||"02"!==e.substr(i[1],2))throw"wrong hex for PKCS#5 public key";var n=r(e,i[0]),o=r(e,i[1]);this.setPublic(n,o)},RSAKey.prototype.readPKCS8PubKeyHex=function(e){var t=J;if(!1===t.isASN1HEX(e))throw"not ASN.1 hex string";if("06092a864886f70d010101"!==t.getTLVbyList(e,0,[0,0]))throw"not PKCS8 RSA public key";var r=t.getTLVbyList(e,0,[1,0]);this.readPKCS5PubKeyHex(r)},RSAKey.prototype.readCertPubKeyHex=function(e,t){var r,i;(r=new X509).readCertHex(e),i=r.getPublicKeyHex(),this.readPKCS8PubKeyHex(i)};var Y=new RegExp("");function _zeroPaddingOfSignature(e,t){for(var r="",i=t/4-e.length,n=0;n<i;n++)r+="0";return r+e}function pss_mgf1_str(e,t,r){for(var i="",n=0;i.length<t;)i+=hextorstr(r(rstrtohex(e+String.fromCharCode.apply(String,[(4278190080&n)>>24,(16711680&n)>>16,(65280&n)>>8,255&n])))),n+=1;return i}function _rsasign_getAlgNameAndHashFromHexDisgestInfo(e){for(var t in V.crypto.Util.DIGESTINFOHEAD){var r=V.crypto.Util.DIGESTINFOHEAD[t],i=r.length;if(e.substring(0,i)==r)return[t,e.substring(i)]}return[]}function X509(){var e=J,t=e.getChildIdx,r=e.getV,i=e.getTLV,n=e.getVbyList,o=e.getTLVbyList,s=e.getIdxbyList,a=e.getVidx,u=e.oidname,c=X509,h=pemtohex;this.hex=null,this.version=0,this.foffset=0,this.aExtInfo=null,this.getVersion=function(){return null===this.hex||0!==this.version?this.version:"a003020102"!==o(this.hex,0,[0,0])?(this.version=1,this.foffset=-1,1):(this.version=3,3)},this.getSerialNumberHex=function(){return n(this.hex,0,[0,1+this.foffset],"02")},this.getSignatureAlgorithmField=function(){return u(n(this.hex,0,[0,2+this.foffset,0],"06"))},this.getIssuerHex=function(){return o(this.hex,0,[0,3+this.foffset],"30")},this.getIssuerString=function(){return c.hex2dn(this.getIssuerHex())},this.getSubjectHex=function(){return o(this.hex,0,[0,5+this.foffset],"30")},this.getSubjectString=function(){return c.hex2dn(this.getSubjectHex())},this.getNotBefore=function(){var e=n(this.hex,0,[0,4+this.foffset,0]);return e=e.replace(/(..)/g,"%$1"),e=decodeURIComponent(e)},this.getNotAfter=function(){var e=n(this.hex,0,[0,4+this.foffset,1]);return e=e.replace(/(..)/g,"%$1"),e=decodeURIComponent(e)},this.getPublicKeyHex=function(){return e.getTLVbyList(this.hex,0,[0,6+this.foffset],"30")},this.getPublicKeyIdx=function(){return s(this.hex,0,[0,6+this.foffset],"30")},this.getPublicKeyContentIdx=function(){var e=this.getPublicKeyIdx();return s(this.hex,e,[1,0],"30")},this.getPublicKey=function(){return z.getKey(this.getPublicKeyHex(),null,"pkcs8pub")},this.getSignatureAlgorithmName=function(){return u(n(this.hex,0,[1,0],"06"))},this.getSignatureValueHex=function(){return n(this.hex,0,[2],"03",!0)},this.verifySignature=function(e){var t=this.getSignatureAlgorithmName(),r=this.getSignatureValueHex(),i=o(this.hex,0,[0],"30"),n=new V.crypto.Signature({alg:t});return n.init(e),n.updateHex(i),n.verify(r)},this.parseExt=function(){if(3!==this.version)return-1;var r=s(this.hex,0,[0,7,0],"30"),i=t(this.hex,r);this.aExtInfo=new Array;for(var o=0;o<i.length;o++){var u={critical:!1},c=0;3===t(this.hex,i[o]).length&&(u.critical=!0,c=1),u.oid=e.hextooidstr(n(this.hex,i[o],[0],"06"));var h=s(this.hex,i[o],[1+c]);u.vidx=a(this.hex,h),this.aExtInfo.push(u)}},this.getExtInfo=function(e){var t=this.aExtInfo,r=e;if(e.match(/^[0-9.]+$/)||(r=V.asn1.x509.OID.name2oid(e)),""!==r)for(var i=0;i<t.length;i++)if(t[i].oid===r)return t[i]},this.getExtBasicConstraints=function(){var e=this.getExtInfo("basicConstraints");if(void 0===e)return e;var t=r(this.hex,e.vidx);if(""===t)return{};if("0101ff"===t)return{cA:!0};if("0101ff02"===t.substr(0,8)){var i=r(t,6);return{cA:!0,pathLen:parseInt(i,16)}}throw"basicConstraints parse error"},this.getExtKeyUsageBin=function(){var e=this.getExtInfo("keyUsage");if(void 0===e)return"";var t=r(this.hex,e.vidx);if(t.length%2!=0||t.length<=2)throw"malformed key usage value";var i=parseInt(t.substr(0,2)),n=parseInt(t.substr(2),16).toString(2);return n.substr(0,n.length-i)},this.getExtKeyUsageString=function(){for(var e=this.getExtKeyUsageBin(),t=new Array,r=0;r<e.length;r++)"1"==e.substr(r,1)&&t.push(X509.KEYUSAGE_NAME[r]);return t.join(",")},this.getExtSubjectKeyIdentifier=function(){var e=this.getExtInfo("subjectKeyIdentifier");return void 0===e?e:r(this.hex,e.vidx)},this.getExtAuthorityKeyIdentifier=function(){var e=this.getExtInfo("authorityKeyIdentifier");if(void 0===e)return e;for(var n={},o=i(this.hex,e.vidx),s=t(o,0),a=0;a<s.length;a++)"80"===o.substr(s[a],2)&&(n.kid=r(o,s[a]));return n},this.getExtExtKeyUsageName=function(){var e=this.getExtInfo("extKeyUsage");if(void 0===e)return e;var n=new Array,o=i(this.hex,e.vidx);if(""===o)return n;for(var s=t(o,0),a=0;a<s.length;a++)n.push(u(r(o,s[a])));return n},this.getExtSubjectAltName=function(){for(var e=this.getExtSubjectAltName2(),t=new Array,r=0;r<e.length;r++)"DNS"===e[r][0]&&t.push(e[r][1]);return t},this.getExtSubjectAltName2=function(){var e,n,o,s=this.getExtInfo("subjectAltName");if(void 0===s)return s;for(var a=new Array,u=i(this.hex,s.vidx),c=t(u,0),h=0;h<c.length;h++)o=u.substr(c[h],2),e=r(u,c[h]),"81"===o&&(n=hextoutf8(e),a.push(["MAIL",n])),"82"===o&&(n=hextoutf8(e),a.push(["DNS",n])),"84"===o&&(n=X509.hex2dn(e,0),a.push(["DN",n])),"86"===o&&(n=hextoutf8(e),a.push(["URI",n])),"87"===o&&(n=hextoip(e),a.push(["IP",n]));return a},this.getExtCRLDistributionPointsURI=function(){var e=this.getExtInfo("cRLDistributionPoints");if(void 0===e)return e;for(var r=new Array,i=t(this.hex,e.vidx),o=0;o<i.length;o++)try{var s=hextoutf8(n(this.hex,i[o],[0,0,0],"86"));r.push(s)}catch(e){}return r},this.getExtAIAInfo=function(){var e=this.getExtInfo("authorityInfoAccess");if(void 0===e)return e;for(var r={ocsp:[],caissuer:[]},i=t(this.hex,e.vidx),o=0;o<i.length;o++){var s=n(this.hex,i[o],[0],"06"),a=n(this.hex,i[o],[1],"86");"2b06010505073001"===s&&r.ocsp.push(hextoutf8(a)),"2b06010505073002"===s&&r.caissuer.push(hextoutf8(a))}return r},this.getExtCertificatePolicies=function(){var e=this.getExtInfo("certificatePolicies");if(void 0===e)return e;for(var o=i(this.hex,e.vidx),s=[],a=t(o,0),c=0;c<a.length;c++){var h={},l=t(o,a[c]);if(h.id=u(r(o,l[0])),2===l.length)for(var f=t(o,l[1]),g=0;g<f.length;g++){var p=n(o,f[g],[0],"06");"2b06010505070201"===p?h.cps=hextoutf8(n(o,f[g],[1])):"2b06010505070202"===p&&(h.unotice=hextoutf8(n(o,f[g],[1,0])))}s.push(h)}return s},this.readCertPEM=function(e){this.readCertHex(h(e))},this.readCertHex=function(e){this.hex=e,this.getVersion();try{s(this.hex,0,[0,7],"a3"),this.parseExt()}catch(e){}},this.getInfo=function(){var e,t,r;if(e="Basic Fields\n",e+="  serial number: "+this.getSerialNumberHex()+"\n",e+="  signature algorithm: "+this.getSignatureAlgorithmField()+"\n",e+="  issuer: "+this.getIssuerString()+"\n",e+="  notBefore: "+this.getNotBefore()+"\n",e+="  notAfter: "+this.getNotAfter()+"\n",e+="  subject: "+this.getSubjectString()+"\n",e+="  subject public key info: \n",e+="    key algorithm: "+(t=this.getPublicKey()).type+"\n","RSA"===t.type&&(e+="    n="+hextoposhex(t.n.toString(16)).substr(0,16)+"...\n",e+="    e="+hextoposhex(t.e.toString(16))+"\n"),void 0!==(r=this.aExtInfo)&&null!==r){e+="X509v3 Extensions:\n";for(var i=0;i<r.length;i++){var n=r[i],o=V.asn1.x509.OID.oid2name(n.oid);""===o&&(o=n.oid);var s="";if(!0===n.critical&&(s="CRITICAL"),e+="  "+o+" "+s+":\n","basicConstraints"===o){var a=this.getExtBasicConstraints();void 0===a.cA?e+="    {}\n":(e+="    cA=true",void 0!==a.pathLen&&(e+=", pathLen="+a.pathLen),e+="\n")}else if("keyUsage"===o)e+="    "+this.getExtKeyUsageString()+"\n";else if("subjectKeyIdentifier"===o)e+="    "+this.getExtSubjectKeyIdentifier()+"\n";else if("authorityKeyIdentifier"===o){var u=this.getExtAuthorityKeyIdentifier();void 0!==u.kid&&(e+="    kid="+u.kid+"\n")}else{if("extKeyUsage"===o)e+="    "+this.getExtExtKeyUsageName().join(", ")+"\n";else if("subjectAltName"===o)e+="    "+this.getExtSubjectAltName2()+"\n";else if("cRLDistributionPoints"===o)e+="    "+this.getExtCRLDistributionPointsURI()+"\n";else if("authorityInfoAccess"===o){var c=this.getExtAIAInfo();void 0!==c.ocsp&&(e+="    ocsp: "+c.ocsp.join(",")+"\n"),void 0!==c.caissuer&&(e+="    caissuer: "+c.caissuer.join(",")+"\n")}else if("certificatePolicies"===o)for(var h=this.getExtCertificatePolicies(),l=0;l<h.length;l++)void 0!==h[l].id&&(e+="    policy oid: "+h[l].id+"\n"),void 0!==h[l].cps&&(e+="    cps: "+h[l].cps+"\n")}}}return e+="signature algorithm: "+this.getSignatureAlgorithmName()+"\n",e+="signature: "+this.getSignatureValueHex().substr(0,16)+"...\n"}}Y.compile("[^0-9a-f]","gi"),RSAKey.prototype.sign=function(e,t){var r=function b(e){return V.crypto.Util.hashString(e,t)}(e);return this.signWithMessageHash(r,t)},RSAKey.prototype.signWithMessageHash=function(e,t){var r=parseBigInt(V.crypto.Util.getPaddedDigestInfoHex(e,t,this.n.bitLength()),16);return _zeroPaddingOfSignature(this.doPrivate(r).toString(16),this.n.bitLength())},RSAKey.prototype.signPSS=function(e,t,r){var i=function c(e){return V.crypto.Util.hashHex(e,t)}(rstrtohex(e));return void 0===r&&(r=-1),this.signWithMessageHashPSS(i,t,r)},RSAKey.prototype.signWithMessageHashPSS=function(e,t,r){var i,n=hextorstr(e),s=n.length,a=this.n.bitLength()-1,u=Math.ceil(a/8),c=function o(e){return V.crypto.Util.hashHex(e,t)};if(-1===r||void 0===r)r=s;else if(-2===r)r=u-s-2;else if(r<-2)throw"invalid salt length";if(u<s+r+2)throw"data too long";var h="";r>0&&(h=new Array(r),(new SecureRandom).nextBytes(h),h=String.fromCharCode.apply(String,h));var l=hextorstr(c(rstrtohex("\0\0\0\0\0\0\0\0"+n+h))),f=[];for(i=0;i<u-r-s-2;i+=1)f[i]=0;var g=String.fromCharCode.apply(String,f)+""+h,p=pss_mgf1_str(l,g.length,c),d=[];for(i=0;i<g.length;i+=1)d[i]=g.charCodeAt(i)^p.charCodeAt(i);var v=65280>>8*u-a&255;for(d[0]&=~v,i=0;i<s;i++)d.push(l.charCodeAt(i));return d.push(188),_zeroPaddingOfSignature(this.doPrivate(new BigInteger(d)).toString(16),this.n.bitLength())},RSAKey.prototype.verify=function(e,t){var r=parseBigInt(t=(t=t.replace(Y,"")).replace(/[ \n]+/g,""),16);if(r.bitLength()>this.n.bitLength())return 0;var i=_rsasign_getAlgNameAndHashFromHexDisgestInfo(this.doPublic(r).toString(16).replace(/^1f+00/,""));if(0==i.length)return!1;var n=i[0];return i[1]==function a(e){return V.crypto.Util.hashString(e,n)}(e)},RSAKey.prototype.verifyWithMessageHash=function(e,t){var r=parseBigInt(t=(t=t.replace(Y,"")).replace(/[ \n]+/g,""),16);if(r.bitLength()>this.n.bitLength())return 0;var i=_rsasign_getAlgNameAndHashFromHexDisgestInfo(this.doPublic(r).toString(16).replace(/^1f+00/,""));if(0==i.length)return!1;i[0];return i[1]==e},RSAKey.prototype.verifyPSS=function(t,r,i,n){var o=function e(t){return V.crypto.Util.hashHex(t,i)}(rstrtohex(t));return void 0===n&&(n=-1),this.verifyWithMessageHashPSS(o,r,i,n)},RSAKey.prototype.verifyWithMessageHashPSS=function(e,t,i,n){var o=new BigInteger(t,16);if(o.bitLength()>this.n.bitLength())return!1;var s,a=function r(e){return V.crypto.Util.hashHex(e,i)},u=hextorstr(e),c=u.length,h=this.n.bitLength()-1,l=Math.ceil(h/8);if(-1===n||void 0===n)n=c;else if(-2===n)n=l-c-2;else if(n<-2)throw"invalid salt length";if(l<c+n+2)throw"data too long";var f=this.doPublic(o).toByteArray();for(s=0;s<f.length;s+=1)f[s]&=255;for(;f.length<l;)f.unshift(0);if(188!==f[l-1])throw"encoded message does not end in 0xbc";var g=(f=String.fromCharCode.apply(String,f)).substr(0,l-c-1),p=f.substr(g.length,c),d=65280>>8*l-h&255;if(0!=(g.charCodeAt(0)&d))throw"bits beyond keysize not zero";var v=pss_mgf1_str(p,g.length,a),y=[];for(s=0;s<g.length;s+=1)y[s]=g.charCodeAt(s)^v.charCodeAt(s);y[0]&=~d;var m=l-c-n-2;for(s=0;s<m;s+=1)if(0!==y[s])throw"leftmost octets not zero";if(1!==y[m])throw"0x01 marker not found";return p===hextorstr(a(rstrtohex("\0\0\0\0\0\0\0\0"+u+String.fromCharCode.apply(String,y.slice(-n)))))},RSAKey.SALT_LEN_HLEN=-1,RSAKey.SALT_LEN_MAX=-2,RSAKey.SALT_LEN_RECOVER=-2,X509.hex2dn=function(e,t){if(void 0===t&&(t=0),"30"!==e.substr(t,2))throw"malformed DN";for(var r=new Array,i=J.getChildIdx(e,t),n=0;n<i.length;n++)r.push(X509.hex2rdn(e,i[n]));return"/"+(r=r.map(function(e){return e.replace("/","\\/")})).join("/")},X509.hex2rdn=function(e,t){if(void 0===t&&(t=0),"31"!==e.substr(t,2))throw"malformed RDN";for(var r=new Array,i=J.getChildIdx(e,t),n=0;n<i.length;n++)r.push(X509.hex2attrTypeValue(e,i[n]));return(r=r.map(function(e){return e.replace("+","\\+")})).join("+")},X509.hex2attrTypeValue=function(e,t){var r=J,i=r.getV;if(void 0===t&&(t=0),"30"!==e.substr(t,2))throw"malformed attribute type and value";var n=r.getChildIdx(e,t);2!==n.length||e.substr(n[0],2);var o=i(e,n[0]),s=V.asn1.ASN1Util.oidHexToInt(o);return V.asn1.x509.OID.oid2atype(s)+"="+hextorstr(i(e,n[1]))},X509.getPublicKeyFromCertHex=function(e){var t=new X509;return t.readCertHex(e),t.getPublicKey()},X509.getPublicKeyFromCertPEM=function(e){var t=new X509;return t.readCertPEM(e),t.getPublicKey()},X509.getPublicKeyInfoPropOfCertPEM=function(e){var t,r,i=J.getVbyList,n={};return n.algparam=null,(t=new X509).readCertPEM(e),r=t.getPublicKeyHex(),n.keyhex=i(r,0,[1],"03").substr(2),n.algoid=i(r,0,[0,0],"06"),"2a8648ce3d0201"===n.algoid&&(n.algparam=i(r,0,[0,1],"06")),n},X509.KEYUSAGE_NAME=["digitalSignature","nonRepudiation","keyEncipherment","dataEncipherment","keyAgreement","keyCertSign","cRLSign","encipherOnly","decipherOnly"],void 0!==V&&V||(V={}),void 0!==V.jws&&V.jws||(V.jws={}),V.jws.JWS=function(){var e=V.jws.JWS.isSafeJSONString;this.parseJWS=function(t,r){if(void 0===this.parsedJWS||!r&&void 0===this.parsedJWS.sigvalH){var i=t.match(/^([^.]+)\.([^.]+)\.([^.]+)$/);if(null==i)throw"JWS signature is not a form of 'Head.Payload.SigValue'.";var n=i[1],o=i[2],s=i[3],a=n+"."+o;if(this.parsedJWS={},this.parsedJWS.headB64U=n,this.parsedJWS.payloadB64U=o,this.parsedJWS.sigvalB64U=s,this.parsedJWS.si=a,!r){var u=b64utohex(s),c=parseBigInt(u,16);this.parsedJWS.sigvalH=u,this.parsedJWS.sigvalBI=c}var h=W(n),l=W(o);if(this.parsedJWS.headS=h,this.parsedJWS.payloadS=l,!e(h,this.parsedJWS,"headP"))throw"malformed JSON string for JWS Head: "+h}}},V.jws.JWS.sign=function(e,t,r,i,o){var s,a,u,c=V,h=c.jws.JWS,l=h.readSafeJSONString,f=h.isSafeJSONString,g=c.crypto,p=(g.ECDSA,g.Mac),d=g.Signature,v=JSON;if("string"!=typeof t&&"object"!=(void 0===t?"undefined":n(t)))throw"spHeader must be JSON string or object: "+t;if("object"==(void 0===t?"undefined":n(t))&&(a=t,s=v.stringify(a)),"string"==typeof t){if(!f(s=t))throw"JWS Head is not safe JSON string: "+s;a=l(s)}if(u=r,"object"==(void 0===r?"undefined":n(r))&&(u=v.stringify(r)),""!=e&&null!=e||void 0===a.alg||(e=a.alg),""!=e&&null!=e&&void 0===a.alg&&(a.alg=e,s=v.stringify(a)),e!==a.alg)throw"alg and sHeader.alg doesn't match: "+e+"!="+a.alg;var y=null;if(void 0===h.jwsalg2sigalg[e])throw"unsupported alg name: "+e;y=h.jwsalg2sigalg[e];var m=q(s)+"."+q(u),S="";if("Hmac"==y.substr(0,4)){if(void 0===i)throw"mac key shall be specified for HS* alg";var b=new p({alg:y,prov:"cryptojs",pass:i});b.updateString(m),S=b.doFinal()}else{var F;if(-1!=y.indexOf("withECDSA"))(F=new d({alg:y})).init(i,o),F.updateString(m),hASN1Sig=F.sign(),S=V.crypto.ECDSA.asn1SigToConcatSig(hASN1Sig);else if("none"!=y)(F=new d({alg:y})).init(i,o),F.updateString(m),S=F.sign()}return m+"."+hextob64u(S)},V.jws.JWS.verify=function(e,t,r){var i,o=V,s=o.jws.JWS,a=s.readSafeJSONString,u=o.crypto,c=u.ECDSA,h=u.Mac,l=u.Signature;void 0!==n(RSAKey)&&(i=RSAKey);var f=e.split(".");if(3!==f.length)return!1;var g=f[0]+"."+f[1],p=b64utohex(f[2]),d=a(W(f[0])),v=null,y=null;if(void 0===d.alg)throw"algorithm not specified in header";if((y=(v=d.alg).substr(0,2),null!=r&&"[object Array]"===Object.prototype.toString.call(r)&&r.length>0)&&-1==(":"+r.join(":")+":").indexOf(":"+v+":"))throw"algorithm '"+v+"' not accepted in the list";if("none"!=v&&null===t)throw"key shall be specified to verify.";if("string"==typeof t&&-1!=t.indexOf("-----BEGIN ")&&(t=z.getKey(t)),!("RS"!=y&&"PS"!=y||t instanceof i))throw"key shall be a RSAKey obj for RS* and PS* algs";if("ES"==y&&!(t instanceof c))throw"key shall be a ECDSA obj for ES* algs";var m=null;if(void 0===s.jwsalg2sigalg[d.alg])throw"unsupported alg name: "+v;if("none"==(m=s.jwsalg2sigalg[v]))throw"not supported";if("Hmac"==m.substr(0,4)){if(void 0===t)throw"hexadecimal key shall be specified for HMAC";var S=new h({alg:m,pass:t});return S.updateString(g),p==S.doFinal()}if(-1!=m.indexOf("withECDSA")){var b,F=null;try{F=c.concatSigToASN1Sig(p)}catch(e){return!1}return(b=new l({alg:m})).init(t),b.updateString(g),b.verify(F)}return(b=new l({alg:m})).init(t),b.updateString(g),b.verify(p)},V.jws.JWS.parse=function(e){var t,r,i,n=e.split("."),o={};if(2!=n.length&&3!=n.length)throw"malformed sJWS: wrong number of '.' splitted elements";return t=n[0],r=n[1],3==n.length&&(i=n[2]),o.headerObj=V.jws.JWS.readSafeJSONString(W(t)),o.payloadObj=V.jws.JWS.readSafeJSONString(W(r)),o.headerPP=JSON.stringify(o.headerObj,null,"  "),null==o.payloadObj?o.payloadPP=W(r):o.payloadPP=JSON.stringify(o.payloadObj,null,"  "),void 0!==i&&(o.sigHex=b64utohex(i)),o},V.jws.JWS.verifyJWT=function(e,t,r){var i=V.jws,o=i.JWS,s=o.readSafeJSONString,a=o.inArray,u=o.includedArray,c=e.split("."),h=c[0],l=c[1],f=(b64utohex(c[2]),s(W(h))),g=s(W(l));if(void 0===f.alg)return!1;if(void 0===r.alg)throw"acceptField.alg shall be specified";if(!a(f.alg,r.alg))return!1;if(void 0!==g.iss&&"object"===n(r.iss)&&!a(g.iss,r.iss))return!1;if(void 0!==g.sub&&"object"===n(r.sub)&&!a(g.sub,r.sub))return!1;if(void 0!==g.aud&&"object"===n(r.aud))if("string"==typeof g.aud){if(!a(g.aud,r.aud))return!1}else if("object"==n(g.aud)&&!u(g.aud,r.aud))return!1;var p=i.IntDate.getNow();return void 0!==r.verifyAt&&"number"==typeof r.verifyAt&&(p=r.verifyAt),void 0!==r.gracePeriod&&"number"==typeof r.gracePeriod||(r.gracePeriod=0),!(void 0!==g.exp&&"number"==typeof g.exp&&g.exp+r.gracePeriod<p)&&(!(void 0!==g.nbf&&"number"==typeof g.nbf&&p<g.nbf-r.gracePeriod)&&(!(void 0!==g.iat&&"number"==typeof g.iat&&p<g.iat-r.gracePeriod)&&((void 0===g.jti||void 0===r.jti||g.jti===r.jti)&&!!o.verify(e,t,r.alg))))},V.jws.JWS.includedArray=function(e,t){var r=V.jws.JWS.inArray;if(null===e)return!1;if("object"!==(void 0===e?"undefined":n(e)))return!1;if("number"!=typeof e.length)return!1;for(var i=0;i<e.length;i++)if(!r(e[i],t))return!1;return!0},V.jws.JWS.inArray=function(e,t){if(null===t)return!1;if("object"!==(void 0===t?"undefined":n(t)))return!1;if("number"!=typeof t.length)return!1;for(var r=0;r<t.length;r++)if(t[r]==e)return!0;return!1},V.jws.JWS.jwsalg2sigalg={HS256:"HmacSHA256",HS384:"HmacSHA384",HS512:"HmacSHA512",RS256:"SHA256withRSA",RS384:"SHA384withRSA",RS512:"SHA512withRSA",ES256:"SHA256withECDSA",ES384:"SHA384withECDSA",PS256:"SHA256withRSAandMGF1",PS384:"SHA384withRSAandMGF1",PS512:"SHA512withRSAandMGF1",none:"none"},V.jws.JWS.isSafeJSONString=function(e,t,r){var i=null;try{return"object"!=(void 0===(i=K(e))?"undefined":n(i))?0:i.constructor===Array?0:(t&&(t[r]=i),1)}catch(e){return 0}},V.jws.JWS.readSafeJSONString=function(e){var t=null;try{return"object"!=(void 0===(t=K(e))?"undefined":n(t))?null:t.constructor===Array?null:t}catch(e){return null}},V.jws.JWS.getEncodedSignatureValueFromJWS=function(e){var t=e.match(/^[^.]+\.[^.]+\.([^.]+)$/);if(null==t)throw"JWS signature is not a form of 'Head.Payload.SigValue'.";return t[1]},V.jws.JWS.getJWKthumbprint=function(e){if("RSA"!==e.kty&&"EC"!==e.kty&&"oct"!==e.kty)throw"unsupported algorithm for JWK Thumprint";var t="{";if("RSA"===e.kty){if("string"!=typeof e.n||"string"!=typeof e.e)throw"wrong n and e value for RSA key";t+='"e":"'+e.e+'",',t+='"kty":"'+e.kty+'",',t+='"n":"'+e.n+'"}'}else if("EC"===e.kty){if("string"!=typeof e.crv||"string"!=typeof e.x||"string"!=typeof e.y)throw"wrong crv, x and y value for EC key";t+='"crv":"'+e.crv+'",',t+='"kty":"'+e.kty+'",',t+='"x":"'+e.x+'",',t+='"y":"'+e.y+'"}'}else if("oct"===e.kty){if("string"!=typeof e.k)throw"wrong k value for oct(symmetric) key";t+='"kty":"'+e.kty+'",',t+='"k":"'+e.k+'"}'}var r=rstrtohex(t);return hextob64u(V.crypto.Util.hashHex(r,"sha256"))},V.jws.IntDate={},V.jws.IntDate.get=function(e){var t=V.jws.IntDate,r=t.getNow,i=t.getZulu;if("now"==e)return r();if("now + 1hour"==e)return r()+3600;if("now + 1day"==e)return r()+86400;if("now + 1month"==e)return r()+2592e3;if("now + 1year"==e)return r()+31536e3;if(e.match(/Z$/))return i(e);if(e.match(/^[0-9]+$/))return parseInt(e);throw"unsupported format: "+e},V.jws.IntDate.getZulu=function(e){return zulutosec(e)},V.jws.IntDate.getNow=function(){return~~(new Date/1e3)},V.jws.IntDate.intDate2UTCString=function(e){return new Date(1e3*e).toUTCString()},V.jws.IntDate.intDate2Zulu=function(e){var t=new Date(1e3*e);return("0000"+t.getUTCFullYear()).slice(-4)+("00"+(t.getUTCMonth()+1)).slice(-2)+("00"+t.getUTCDate()).slice(-2)+("00"+t.getUTCHours()).slice(-2)+("00"+t.getUTCMinutes()).slice(-2)+("00"+t.getUTCSeconds()).slice(-2)+"Z"},t.SecureRandom=SecureRandom,t.rng_seed_time=rng_seed_time,t.BigInteger=BigInteger,t.RSAKey=RSAKey,t.ECDSA=V.crypto.ECDSA,t.DSA=V.crypto.DSA,t.Signature=V.crypto.Signature,t.MessageDigest=V.crypto.MessageDigest,t.Mac=V.crypto.Mac,t.Cipher=V.crypto.Cipher,t.KEYUTIL=z,t.ASN1HEX=J,t.X509=X509,t.CryptoJS=y,t.b64tohex=b64tohex,t.b64toBA=b64toBA,t.stoBA=stoBA,t.BAtos=BAtos,t.BAtohex=BAtohex,t.stohex=stohex,t.stob64=function stob64(e){return hex2b64(stohex(e))},t.stob64u=function stob64u(e){return b64tob64u(hex2b64(stohex(e)))},t.b64utos=function b64utos(e){return BAtos(b64toBA(b64utob64(e)))},t.b64tob64u=b64tob64u,t.b64utob64=b64utob64,t.hex2b64=hex2b64,t.hextob64u=hextob64u,t.b64utohex=b64utohex,t.utf8tob64u=q,t.b64utoutf8=W,t.utf8tob64=function utf8tob64(e){return hex2b64(uricmptohex(encodeURIComponentAll(e)))},t.b64toutf8=function b64toutf8(e){return decodeURIComponent(hextouricmp(b64tohex(e)))},t.utf8tohex=utf8tohex,t.hextoutf8=hextoutf8,t.hextorstr=hextorstr,t.rstrtohex=rstrtohex,t.hextob64=hextob64,t.hextob64nl=hextob64nl,t.b64nltohex=b64nltohex,t.hextopem=hextopem,t.pemtohex=pemtohex,t.hextoArrayBuffer=function hextoArrayBuffer(e){if(e.length%2!=0)throw"input is not even length";if(null==e.match(/^[0-9A-Fa-f]+$/))throw"input is not hexadecimal";for(var t=new ArrayBuffer(e.length/2),r=new DataView(t),i=0;i<e.length/2;i++)r.setUint8(i,parseInt(e.substr(2*i,2),16));return t},t.ArrayBuffertohex=function ArrayBuffertohex(e){for(var t="",r=new DataView(e),i=0;i<e.byteLength;i++)t+=("00"+r.getUint8(i).toString(16)).slice(-2);return t},t.zulutomsec=zulutomsec,t.zulutosec=zulutosec,t.zulutodate=function zulutodate(e){return new Date(zulutomsec(e))},t.datetozulu=function datetozulu(e,t,r){var i,n=e.getUTCFullYear();if(t){if(n<1950||2049<n)throw"not proper year for UTCTime: "+n;i=(""+n).slice(-2)}else i=("000"+n).slice(-4);if(i+=("0"+(e.getUTCMonth()+1)).slice(-2),i+=("0"+e.getUTCDate()).slice(-2),i+=("0"+e.getUTCHours()).slice(-2),i+=("0"+e.getUTCMinutes()).slice(-2),i+=("0"+e.getUTCSeconds()).slice(-2),r){var o=e.getUTCMilliseconds();0!==o&&(i+="."+(o=(o=("00"+o).slice(-3)).replace(/0+$/g,"")))}return i+="Z"},t.uricmptohex=uricmptohex,t.hextouricmp=hextouricmp,t.ipv6tohex=ipv6tohex,t.hextoipv6=hextoipv6,t.hextoip=hextoip,t.iptohex=function iptohex(e){var t="malformed IP address";if(!(e=e.toLowerCase(e)).match(/^[0-9.]+$/)){if(e.match(/^[0-9a-f:]+$/)&&-1!==e.indexOf(":"))return ipv6tohex(e);throw t}var r=e.split(".");if(4!==r.length)throw t;var i="";try{for(var n=0;n<4;n++)i+=("0"+parseInt(r[n]).toString(16)).slice(-2);return i}catch(e){throw t}},t.encodeURIComponentAll=encodeURIComponentAll,t.newline_toUnix=function newline_toUnix(e){return e=e.replace(/\r\n/gm,"\n")},t.newline_toDos=function newline_toDos(e){return e=(e=e.replace(/\r\n/gm,"\n")).replace(/\n/gm,"\r\n")},t.hextoposhex=hextoposhex,t.intarystrtohex=function intarystrtohex(e){e=(e=(e=e.replace(/^\s*\[\s*/,"")).replace(/\s*\]\s*$/,"")).replace(/\s*/g,"");try{return e.split(/,/).map(function(e,t,r){var i=parseInt(e);if(i<0||255<i)throw"integer not in range 0-255";return("00"+i.toString(16)).slice(-2)}).join("")}catch(e){throw"malformed integer array string: "+e}},t.strdiffidx=function strdiffidx(e,t){var r=e.length;e.length>t.length&&(r=t.length);for(var i=0;i<r;i++)if(e.charCodeAt(i)!=t.charCodeAt(i))return i;return e.length!=t.length?r:-1},t.KJUR=V,t.crypto=V.crypto,t.asn1=V.asn1,t.jws=V.jws,t.lang=V.lang}).call(this,r(40).Buffer)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.JoseUtil=void 0;var i=r(41),n=r(0);var o=["RS256","RS384","RS512","PS256","PS384","PS512","ES256","ES384","ES512"];t.JoseUtil=function(){function JoseUtil(){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,JoseUtil)}return JoseUtil.parseJwt=function parseJwt(e){n.Log.debug("JoseUtil.parseJwt");try{var t=i.jws.JWS.parse(e);return{header:t.headerObj,payload:t.payloadObj}}catch(e){n.Log.error(e)}},JoseUtil.validateJwt=function validateJwt(e,t,r,o,s,a){n.Log.debug("JoseUtil.validateJwt");try{if("RSA"===t.kty)if(t.e&&t.n)t=i.KEYUTIL.getKey(t);else{if(!t.x5c||!t.x5c.length)return n.Log.error("JoseUtil.validateJwt: RSA key missing key material",t),Promise.reject(new Error("RSA key missing key material"));var u=(0,i.b64tohex)(t.x5c[0]);t=i.X509.getPublicKeyFromCertHex(u)}else{if("EC"!==t.kty)return n.Log.error("JoseUtil.validateJwt: Unsupported key type",t&&t.kty),Promise.reject(new Error("Unsupported key type: "+t&&t.kty));if(!(t.crv&&t.x&&t.y))return n.Log.error("JoseUtil.validateJwt: EC key missing key material",t),Promise.reject(new Error("EC key missing key material"));t=i.KEYUTIL.getKey(t)}return JoseUtil._validateJwt(e,t,r,o,s,a)}catch(e){return n.Log.error(e&&e.message||e),Promise.reject("JWT validation failed")}},JoseUtil._validateJwt=function _validateJwt(e,t,r,s,a,u){a||(a=0),u||(u=parseInt(Date.now()/1e3));var c=JoseUtil.parseJwt(e).payload;if(!c.iss)return n.Log.error("JoseUtil._validateJwt: issuer was not provided"),Promise.reject(new Error("issuer was not provided"));if(c.iss!==r)return n.Log.error("JoseUtil._validateJwt: Invalid issuer in token",c.iss),Promise.reject(new Error("Invalid issuer in token: "+c.iss));if(!c.aud)return n.Log.error("JoseUtil._validateJwt: aud was not provided"),Promise.reject(new Error("aud was not provided"));if(!(c.aud===s||Array.isArray(c.aud)&&c.aud.indexOf(s)>=0))return n.Log.error("JoseUtil._validateJwt: Invalid audience in token",c.aud),Promise.reject(new Error("Invalid audience in token: "+c.aud));var h=u+a,l=u-a;if(!c.iat)return n.Log.error("JoseUtil._validateJwt: iat was not provided"),Promise.reject(new Error("iat was not provided"));if(h<c.iat)return n.Log.error("JoseUtil._validateJwt: iat is in the future",c.iat),Promise.reject(new Error("iat is in the future: "+c.iat));if(c.nbf&&h<c.nbf)return n.Log.error("JoseUtil._validateJwt: nbf is in the future",c.nbf),Promise.reject(new Error("nbf is in the future: "+c.nbf));if(!c.exp)return n.Log.error("JoseUtil._validateJwt: exp was not provided"),Promise.reject(new Error("exp was not provided"));if(c.exp<l)return n.Log.error("JoseUtil._validateJwt: exp is in the past",c.exp),Promise.reject(new Error("exp is in the past:"+c.exp));try{if(!i.jws.JWS.verify(e,t,o))return n.Log.error("JoseUtil._validateJwt: signature validation failed"),Promise.reject(new Error("signature validation failed"))}catch(e){return n.Log.error(e&&e.message||e),Promise.reject(new Error("signature validation failed"))}return Promise.resolve()},JoseUtil.hashString=function hashString(e,t){try{return i.crypto.Util.hashString(e,t)}catch(e){n.Log.error(e)}},JoseUtil.hexToBase64Url=function hexToBase64Url(e){try{return(0,i.hextob64u)(e)}catch(e){n.Log.error(e)}},JoseUtil}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UserInfoService=void 0;var i=r(17),n=r(3),o=r(0);t.UserInfoService=function(){function UserInfoService(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.JsonService,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:n.MetadataService;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,UserInfoService),!e)throw o.Log.error("UserInfoService.ctor: No settings passed"),new Error("settings");this._settings=e,this._jsonService=new t,this._metadataService=new r(this._settings)}return UserInfoService.prototype.getClaims=function getClaims(e){var t=this;return e?this._metadataService.getUserInfoEndpoint().then(function(r){return o.Log.debug("UserInfoService.getClaims: received userinfo url",r),t._jsonService.getJson(r,e).then(function(e){return o.Log.debug("UserInfoService.getClaims: claims received",e),e})}):(o.Log.error("UserInfoService.getClaims: No token passed"),Promise.reject(new Error("A token is required")))},UserInfoService}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ResponseValidator=void 0;var i=r(0),n=r(3),o=r(43),s=r(16),a=r(42);var u=["nonce","at_hash","iat","nbf","exp","aud","iss","c_hash"];t.ResponseValidator=function(){function ResponseValidator(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n.MetadataService,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:o.UserInfoService,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:a.JoseUtil;if(function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,ResponseValidator),!e)throw i.Log.error("ResponseValidator.ctor: No settings passed to ResponseValidator"),new Error("settings");this._settings=e,this._metadataService=new t(this._settings),this._userInfoService=new r(this._settings),this._joseUtil=s}return ResponseValidator.prototype.validateSigninResponse=function validateSigninResponse(e,t){var r=this;return i.Log.debug("ResponseValidator.validateSigninResponse"),this._processSigninParams(e,t).then(function(t){return i.Log.debug("ResponseValidator.validateSigninResponse: state processed"),r._validateTokens(e,t).then(function(e){return i.Log.debug("ResponseValidator.validateSigninResponse: tokens validated"),r._processClaims(e).then(function(e){return i.Log.debug("ResponseValidator.validateSigninResponse: claims processed"),e})})})},ResponseValidator.prototype.validateSignoutResponse=function validateSignoutResponse(e,t){return e.id!==t.state?(i.Log.error("ResponseValidator.validateSignoutResponse: State does not match"),Promise.reject(new Error("State does not match"))):(i.Log.debug("ResponseValidator.validateSignoutResponse: state validated"),t.state=e.data,t.error?(i.Log.warn("ResponseValidator.validateSignoutResponse: Response was error",t.error),Promise.reject(new s.ErrorResponse(t))):Promise.resolve(t))},ResponseValidator.prototype._processSigninParams=function _processSigninParams(e,t){if(e.id!==t.state)return i.Log.error("ResponseValidator._processSigninParams: State does not match"),Promise.reject(new Error("State does not match"));if(!e.client_id)return i.Log.error("ResponseValidator._processSigninParams: No client_id on state"),Promise.reject(new Error("No client_id on state"));if(!e.authority)return i.Log.error("ResponseValidator._processSigninParams: No authority on state"),Promise.reject(new Error("No authority on state"));if(this._settings.authority){if(this._settings.authority&&this._settings.authority!==e.authority)return i.Log.error("ResponseValidator._processSigninParams: authority mismatch on settings vs. signin state"),Promise.reject(new Error("authority mismatch on settings vs. signin state"))}else this._settings.authority=e.authority;if(this._settings.client_id){if(this._settings.client_id&&this._settings.client_id!==e.client_id)return i.Log.error("ResponseValidator._processSigninParams: client_id mismatch on settings vs. signin state"),Promise.reject(new Error("client_id mismatch on settings vs. signin state"))}else this._settings.client_id=e.client_id;return i.Log.debug("ResponseValidator._processSigninParams: state validated"),t.state=e.data,t.error?(i.Log.warn("ResponseValidator._processSigninParams: Response was error",t.error),Promise.reject(new s.ErrorResponse(t))):e.nonce&&!t.id_token?(i.Log.error("ResponseValidator._processSigninParams: Expecting id_token in response"),Promise.reject(new Error("No id_token in response"))):!e.nonce&&t.id_token?(i.Log.error("ResponseValidator._processSigninParams: Not expecting id_token in response"),Promise.reject(new Error("Unexpected id_token in response"))):Promise.resolve(t)},ResponseValidator.prototype._processClaims=function _processClaims(e){var t=this;if(e.isOpenIdConnect){if(i.Log.debug("ResponseValidator._processClaims: response is OIDC, processing claims"),e.profile=this._filterProtocolClaims(e.profile),this._settings.loadUserInfo&&e.access_token)return i.Log.debug("ResponseValidator._processClaims: loading user info"),this._userInfoService.getClaims(e.access_token).then(function(r){return i.Log.debug("ResponseValidator._processClaims: user info claims received from user info endpoint"),r.sub!==e.profile.sub?(i.Log.error("ResponseValidator._processClaims: sub from user info endpoint does not match sub in access_token"),Promise.reject(new Error("sub from user info endpoint does not match sub in access_token"))):(e.profile=t._mergeClaims(e.profile,r),i.Log.debug("ResponseValidator._processClaims: user info claims received, updated profile:",e.profile),e)});i.Log.debug("ResponseValidator._processClaims: not loading user info")}else i.Log.debug("ResponseValidator._processClaims: response is not OIDC, not processing claims");return Promise.resolve(e)},ResponseValidator.prototype._mergeClaims=function _mergeClaims(e,t){var r=Object.assign({},e);for(var i in t){var n=t[i];Array.isArray(n)||(n=[n]);for(var o=0;o<n.length;o++){var s=n[o];r[i]?Array.isArray(r[i])?r[i].indexOf(s)<0&&r[i].push(s):r[i]!==s&&(r[i]=[r[i],s]):r[i]=s}}return r},ResponseValidator.prototype._filterProtocolClaims=function _filterProtocolClaims(e){i.Log.debug("ResponseValidator._filterProtocolClaims, incoming claims:",e);var t=Object.assign({},e);return this._settings._filterProtocolClaims?(u.forEach(function(e){delete t[e]}),i.Log.debug("ResponseValidator._filterProtocolClaims: protocol claims filtered",t)):i.Log.debug("ResponseValidator._filterProtocolClaims: protocol claims not filtered"),t},ResponseValidator.prototype._validateTokens=function _validateTokens(e,t){return t.id_token?t.access_token?(i.Log.debug("ResponseValidator._validateTokens: Validating id_token and access_token"),this._validateIdTokenAndAccessToken(e,t)):(i.Log.debug("ResponseValidator._validateTokens: Validating id_token"),this._validateIdToken(e,t)):(i.Log.debug("ResponseValidator._validateTokens: No id_token to validate"),Promise.resolve(t))},ResponseValidator.prototype._validateIdTokenAndAccessToken=function _validateIdTokenAndAccessToken(e,t){var r=this;return this._validateIdToken(e,t).then(function(e){return r._validateAccessToken(e)})},ResponseValidator.prototype._validateIdToken=function _validateIdToken(e,t){var r=this;if(!e.nonce)return i.Log.error("ResponseValidator._validateIdToken: No nonce on state"),Promise.reject(new Error("No nonce on state"));var n=this._joseUtil.parseJwt(t.id_token);if(!n||!n.header||!n.payload)return i.Log.error("ResponseValidator._validateIdToken: Failed to parse id_token",n),Promise.reject(new Error("Failed to parse id_token"));if(e.nonce!==n.payload.nonce)return i.Log.error("ResponseValidator._validateIdToken: Invalid nonce in id_token"),Promise.reject(new Error("Invalid nonce in id_token"));var o=n.header.kid;return this._metadataService.getIssuer().then(function(s){return i.Log.debug("ResponseValidator._validateIdToken: Received issuer"),r._metadataService.getSigningKeys().then(function(a){if(!a)return i.Log.error("ResponseValidator._validateIdToken: No signing keys from metadata"),Promise.reject(new Error("No signing keys from metadata"));i.Log.debug("ResponseValidator._validateIdToken: Received signing keys");var u=void 0;if(o)u=a.filter(function(e){return e.kid===o})[0];else{if((a=r._filterByAlg(a,n.header.alg)).length>1)return i.Log.error("ResponseValidator._validateIdToken: No kid found in id_token and more than one key found in metadata"),Promise.reject(new Error("No kid found in id_token and more than one key found in metadata"));u=a[0]}if(!u)return i.Log.error("ResponseValidator._validateIdToken: No key matching kid or alg found in signing keys"),Promise.reject(new Error("No key matching kid or alg found in signing keys"));var c=e.client_id,h=r._settings.clockSkew;return i.Log.debug("ResponseValidator._validateIdToken: Validaing JWT; using clock skew (in seconds) of: ",h),r._joseUtil.validateJwt(t.id_token,u,s,c,h).then(function(){return i.Log.debug("ResponseValidator._validateIdToken: JWT validation successful"),n.payload.sub?(t.profile=n.payload,t):(i.Log.error("ResponseValidator._validateIdToken: No sub present in id_token"),Promise.reject(new Error("No sub present in id_token")))})})})},ResponseValidator.prototype._filterByAlg=function _filterByAlg(e,t){var r=null;if(t.startsWith("RS"))r="RSA";else if(t.startsWith("PS"))r="PS";else{if(!t.startsWith("ES"))return i.Log.debug("ResponseValidator._filterByAlg: alg not supported: ",t),[];r="EC"}return i.Log.debug("ResponseValidator._filterByAlg: Looking for keys that match kty: ",r),e=e.filter(function(e){return e.kty===r}),i.Log.debug("ResponseValidator._filterByAlg: Number of keys that match kty: ",r,e.length),e},ResponseValidator.prototype._validateAccessToken=function _validateAccessToken(e){if(!e.profile)return i.Log.error("ResponseValidator._validateAccessToken: No profile loaded from id_token"),Promise.reject(new Error("No profile loaded from id_token"));if(!e.profile.at_hash)return i.Log.error("ResponseValidator._validateAccessToken: No at_hash in id_token"),Promise.reject(new Error("No at_hash in id_token"));if(!e.id_token)return i.Log.error("ResponseValidator._validateAccessToken: No id_token"),Promise.reject(new Error("No id_token"));var t=this._joseUtil.parseJwt(e.id_token);if(!t||!t.header)return i.Log.error("ResponseValidator._validateAccessToken: Failed to parse id_token",t),Promise.reject(new Error("Failed to parse id_token"));var r=t.header.alg;if(!r||5!==r.length)return i.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:",r),Promise.reject(new Error("Unsupported alg: "+r));var n=r.substr(2,3);if(!n)return i.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:",r,n),Promise.reject(new Error("Unsupported alg: "+r));if(256!==(n=parseInt(n))&&384!==n&&512!==n)return i.Log.error("ResponseValidator._validateAccessToken: Unsupported alg:",r,n),Promise.reject(new Error("Unsupported alg: "+r));var o="sha"+n,s=this._joseUtil.hashString(e.access_token,o);if(!s)return i.Log.error("ResponseValidator._validateAccessToken: access_token hash failed:",o),Promise.reject(new Error("Failed to validate at_hash"));var a=s.substr(0,s.length/2),u=this._joseUtil.hexToBase64Url(a);return u!==e.profile.at_hash?(i.Log.error("ResponseValidator._validateAccessToken: Failed to validate at_hash",u,e.profile.at_hash),Promise.reject(new Error("Failed to validate at_hash"))):(i.Log.debug("ResponseValidator._validateAccessToken: success"),Promise.resolve(e))},ResponseValidator}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=r(0),n=r(18),o=r(6),s=r(5),a=r(31),u=r(30),c=r(12),h=r(3),l=r(20),f=r(19),g=r(9),p=r(8),d=r(10),v=r(1),y=r(13);t.default={Log:i.Log,OidcClient:n.OidcClient,OidcClientSettings:o.OidcClientSettings,WebStorageStateStore:s.WebStorageStateStore,InMemoryWebStorage:a.InMemoryWebStorage,UserManager:u.UserManager,AccessTokenEvents:c.AccessTokenEvents,MetadataService:h.MetadataService,CordovaPopupNavigator:l.CordovaPopupNavigator,CordovaIFrameNavigator:f.CordovaIFrameNavigator,CheckSessionIFrame:g.CheckSessionIFrame,TokenRevocationClient:p.TokenRevocationClient,SessionMonitor:d.SessionMonitor,Global:v.Global,User:y.User},e.exports=t.default}])});

/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/objectSpread.js

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}
// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// EXTERNAL MODULE: ./node_modules/oidc-client/lib/oidc-client.min.js
var oidc_client_min = __webpack_require__("dd17");

// CONCATENATED MODULE: ./src/VueOidcAuth.js





oidc_client_min["Log"].level = oidc_client_min["Log"].DEBUG;
/**
 * Indicates the sign in behavior.
 */

var SignInType = {
  /**
   * Uses the main browser window to do sign-in.
   */
  Window: 0,

  /**
   * Uses a popup window to do sign-in.
   */
  Popup: 1,

  /**
   * Uses a hidden iframe to do sign-in.
   */
  Silent: 2
};

function createOidcAuth(_authName, defaultSignInType, _appUrl, oidcConfig) {
  var logger = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : console;

  if (!_authName) {
    throw new Error('Auth name is required.');
  }

  if (defaultSignInType !== SignInType.Window && defaultSignInType !== SignInType.Popup) {
    throw new Error('Only window or popup are valid default signin types.');
  }

  if (!_appUrl) {
    throw new Error('App base url is required.');
  }

  if (!oidcConfig) {
    throw new Error('No config provided to oidc auth.');
  }

  oidc_client_min["Log"].logger = logger; // merge config with defaults

  var config = _objectSpread({
    response_type: 'id_token',
    scope: 'openid profile',
    automaticSilentRenew: true,
    userStore: new oidc_client_min["WebStorageStateStore"]({
      store: localStorage
    }),
    post_logout_redirect_uri: _appUrl
  }, oidcConfig, {
    // all properties after this are not user configurable
    redirect_uri: "".concat(_appUrl, "auth/signinwin/").concat(_authName),
    popup_post_logout_redirect_uri: "".concat(_appUrl, "auth/signoutpop/").concat(_authName),
    popup_redirect_uri: "".concat(_appUrl, "auth/signinpop/").concat(_authName),
    silent_redirect_uri: "".concat(_appUrl, "auth/signinsilent/").concat(_authName)
  });

  oidc_client_min["Log"].debug("Creating new oidc auth as ".concat(_authName));
  var mgr = new oidc_client_min["UserManager"](config); ///////////////////////////////
  // events
  ///////////////////////////////

  mgr.events.addAccessTokenExpiring(function () {
    oidc_client_min["Log"].debug("".concat(_authName, " auth token expiring"));
  });
  mgr.events.addAccessTokenExpired(function () {
    oidc_client_min["Log"].debug("".concat(_authName, " auth token expired"));

    if (auth.isAuthenticated) {
      mgr.signinSilent().then(function () {
        oidc_client_min["Log"].debug("".concat(_authName, " auth silent signin after token expiration"));
      }).catch(function () {
        oidc_client_min["Log"].debug("".concat(_authName, " auth silent signin error after token expiration"));
        signInIfNecessary();
      });
    }
  });
  mgr.events.addSilentRenewError(function (e) {
    oidc_client_min["Log"].debug("".concat(_authName, " auth silent renew error ").concat(e)); // TODO: need to restart renew manually?

    if (auth.isAuthenticated) {// setTimeout(() => {
      //   mgr.signinSilent();
      // }, 5000);
    } else {
      signInIfNecessary();
    }
  });
  mgr.events.addUserLoaded(function (user) {
    auth.user = user;
  });
  mgr.events.addUserUnloaded(function () {
    auth.user = undefined; // redirect if on protected route (best method here?)

    oidc_client_min["Log"].debug("".concat(_authName, " auth user unloaded"));
    signInIfNecessary();
  });
  mgr.events.addUserSignedOut(function () {
    oidc_client_min["Log"].debug("".concat(_authName, " auth user signed out"));
    auth.user = null;
    signInIfNecessary();
  });

  function signInIfNecessary() {
    if (auth.myRouter) {
      var current = auth.myRouter.currentRoute;

      if (current && current.meta.authName === _authName) {
        oidc_client_min["Log"].debug("".concat(_authName, " auth page re-signin"));
        signInReal(defaultSignInType, {
          state: {
            current: current
          }
        }).then(function () {}).catch(function () {}); // window.location.reload();
        // auth.myRouter.go(); //replace('/');
      }
    }
  }

  function signInReal(type, args) {
    switch (type) {
      case SignInType.Popup:
        return mgr.signinPopup(args);

      case SignInType.Silent:
        return mgr.signinSilent(args);
    }

    return mgr.signinRedirect(args);
  }

  function redirectAfterSignout(router) {
    if (router) {
      var current = router.currentRoute;

      if (current && current.meta.authName === _authName) {
        router.replace('/');
        return;
      }
    } //   window.location.reload(true);


    if (_appUrl) window.location = _appUrl;
  }

  var _inited = false;
  var auth = new external_commonjs_vue_commonjs2_vue_root_Vue_default.a({
    data: function data() {
      return {
        user: null
      };
    },
    computed: {
      appUrl: function appUrl() {
        return _appUrl;
      },
      authName: function authName() {
        return _authName;
      },
      isAuthenticated: function isAuthenticated() {
        return !!this.user && !this.user.expired;
      },
      accessToken: function accessToken() {
        return !!this.user && !this.user.expired ? this.user.access_token : '';
      },
      userProfile: function userProfile() {
        return !!this.user && !this.user.expired ? this.user.profile : {};
      }
    },
    methods: {
      startup: function startup() {
        var _this = this;

        var path = window.location.pathname;
        var isCB = false;

        if (path.indexOf('/signinpop/') > -1) {
          mgr.signinPopupCallback();
          isCB = true;
        } else if (path.indexOf('/signinsilent/') > -1) {
          mgr.signinSilentCallback();
          isCB = true;
        } else if (path.indexOf('/signoutpop/') > -1) {
          mgr.signoutPopupCallback();
          isCB = true;
        }

        if (isCB) return Promise.resolve(0);

        if (_inited) {
          return Promise.resolve(true);
        } else {
          // load user from storage
          return mgr.getUser().then(function (test) {
            _inited = true;

            if (test && !test.expired) {
              _this.user = test;
            }

            return true;
          }).catch(function (err) {
            oidc_client_min["Log"].warn("Auth startup err = ".concat(err));
            return false;
          });
        }
      },
      useRouter: function useRouter(router) {
        var _this2 = this;

        this.myRouter = router;

        var guard = function guard(to, from, next) {
          if (to.matched.some(function (record) {
            return record.meta.authName === _this2.authName;
          })) {
            if (_this2.isAuthenticated) {
              next();
            } else {
              signInReal(defaultSignInType, {
                state: {
                  to: to
                }
              }).then(function () {
                if (defaultSignInType === SignInType.Window) {
                  next(false);
                } else {
                  next();
                }
              }).catch(function () {
                return next(false);
              });
            }
          } else {
            next();
          }
        };

        router.beforeEach(guard);
        router.addRoutes([{
          path: "/auth/signinwin/".concat(_authName),
          name: 'signinwin',
          component: {
            render: function render(h) {
              return h('div');
            },
            created: function created() {
              mgr.signinRedirectCallback().then(function (data) {
                oidc_client_min["Log"].debug("".concat(_authName, " Window signin callback success"), data); // need to manually redirect for window type
                // goto original secure route or root

                var redirect = data.state ? data.state.to : null;
                if (router) router.replace(redirect || '/');else window.location = _appUrl;
              }).catch(function (err) {
                oidc_client_min["Log"].error("".concat(_authName, " Window signin callback error"), err);
                if (router) router.replace('/');else window.location = _appUrl;
              });
            }
          }
        }]);
      },
      signIn: function signIn(args) {
        return signInReal(defaultSignInType, args);
      },
      signOut: function signOut(args) {
        if (defaultSignInType === SignInType.Popup) {
          var router = this.myRouter;
          return mgr.signoutPopup(args).then(function () {
            redirectAfterSignout(router);
          }).catch(function () {
            // could be window closed
            redirectAfterSignout(router);
          });
        }

        return mgr.signoutRedirect(args);
      }
    }
  });
  return auth;
}


// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js
/* concated harmony reexport SignInType */__webpack_require__.d(__webpack_exports__, "SignInType", function() { return SignInType; });
/* concated harmony reexport createOidcAuth */__webpack_require__.d(__webpack_exports__, "createOidcAuth", function() { return createOidcAuth; });




/***/ })

/******/ });
//# sourceMappingURL=VueOidcAuth.common.js.map