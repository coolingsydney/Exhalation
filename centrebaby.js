(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":6}],2:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":1,"./_getRawTag":4,"./_objectToString":5}],3:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":1}],5:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],6:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":3}],7:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":8,"./now":11,"./toNumber":13}],8:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],9:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],10:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":2,"./isObjectLike":9}],11:[function(require,module,exports){
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":6}],12:[function(require,module,exports){
var debounce = require('./debounce'),
    isObject = require('./isObject');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;

},{"./debounce":7,"./isObject":8}],13:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":8,"./isSymbol":10}],14:[function(require,module,exports){
'use strict';

var _kernPrep = require('./modules/kern-prep');

var _kernPrep2 = _interopRequireDefault(_kernPrep);

var _highlightCenter = require('./modules/highlight-center');

var _highlightCenter2 = _interopRequireDefault(_highlightCenter);

var _toggleAnimations = require('./modules/toggle-animations');

var _toggleAnimations2 = _interopRequireDefault(_toggleAnimations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SCROLL TO TOP ON LOAD

window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

if (/iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent)) {
    document.querySelector('main').style.marginTop = '-44px';
}

// IMPORT

// import infiniteScroll from './modules/infinite-scroll'
// import swapHeader from './modules/swap-header'


// INIT

// infiniteScroll.init()
// swapHeader.init(['.About--primary', '.About--secondary', '.About--contact'])
_kernPrep2.default.init();
_highlightCenter2.default.init(false);
_toggleAnimations2.default.init();

// CREDIT

console.log('%c \nWebsite made by Sydney Cooling-Sturges. Development of centre type effect by Bryant Wells \n \nwww.bryantwells.com \n \n \n', 'color: grey');

},{"./modules/highlight-center":15,"./modules/kern-prep":16,"./modules/toggle-animations":17}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GuideSet = function () {
    function GuideSet(activeAreaPercentage, activeAreaOffsetPercentage) {
        _classCallCheck(this, GuideSet);

        this.activeAreaPercentage = activeAreaPercentage;
        this.activeAreaOffsetPercentage = activeAreaOffsetPercentage;
        this.topPos = window.innerHeight / 2 - this.activeArea / 2 - this.activeAreaOffset;
        this.bottomPos = window.innerHeight / 2 + this.activeArea / 2 - this.activeAreaOffset;
    }

    _createClass(GuideSet, [{
        key: 'update',
        value: function update() {

            this.topPos = window.innerHeight / 2 - this.activeArea / 2 - this.activeAreaOffset;
            this.topMarker.style.top = this.topPos + 'px';

            this.bottomPos = window.innerHeight / 2 + this.activeArea / 2 - this.activeAreaOffset;
            this.bottomMarker.style.top = this.bottomPos + 'px';
        }
    }, {
        key: 'draw',
        value: function draw() {

            this.topMarker = document.createElement('div');
            this.topMarker.style.top = this.topPos + 'px';
            this.topMarker.classList.add('Marker');
            document.body.prepend(this.topMarker);

            this.bottomMarker = document.createElement('div');
            this.bottomMarker.style.top = this.bottomPos + 'px';
            this.bottomMarker.classList.add('Marker');
            document.body.prepend(this.bottomMarker);
        }
    }, {
        key: 'activeArea',
        get: function get() {
            return window.innerWidth * this.activeAreaPercentage;
        }
    }, {
        key: 'activeAreaOffset',
        get: function get() {
            return window.innerWidth * this.activeAreaOffsetPercentage;
        }
    }]);

    return GuideSet;
}();

var Line = function () {
    function Line(el, activeAreaPercentage, activeAreaOffsetPercentage) {
        _classCallCheck(this, Line);

        this.activeAreaPercentage = activeAreaPercentage;
        this.activeAreaOffsetPercentage = activeAreaOffsetPercentage;

        this.el = el;
        this.activeArea = {};
        this.activeArea.size = this.activeAreaSize;
        this.activeArea.top = window.innerHeight / 2 - this.activeArea.size / 2 - this.activeAreaOffset;
        this.activeArea.bottom = window.innerHeight / 2 + this.activeArea.size / 2 - this.activeAreaOffset;

        this.el.dataset.init = 'true';
        this.update();
    }

    _createClass(Line, [{
        key: 'activate',
        value: function activate() {

            this.el.classList.add('is-active');
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {

            this.el.classList.remove('is-active');
        }
    }, {
        key: 'update',
        value: function update() {

            this.activeArea.size = this.activeAreaSize;
            this.activeArea.top = window.innerHeight / 2 - this.activeArea.size / 2 - this.activeAreaOffset;
            this.activeArea.bottom = window.innerHeight / 2 + this.activeArea.size / 2 - this.activeAreaOffset;

            var pos = this.el.getBoundingClientRect();
            pos.middle = pos.top + pos.height / 2;

            if (pos.middle > this.activeArea.top && pos.middle < this.activeArea.bottom || this.el.matches('h1') && pos.middle > this.activeArea.bottom) {

                if (this.el.classList.contains('is-active') === false) {

                    this.activate();
                }
            } else if (this.el.classList.contains('is-active')) {

                this.deactivate();
            }
        }
    }, {
        key: 'activeAreaSize',
        get: function get() {
            return window.innerWidth * this.activeAreaPercentage;
        }
    }, {
        key: 'activeAreaOffset',
        get: function get() {
            return window.innerWidth * this.activeAreaOffsetPercentage;
        }
    }]);

    return Line;
}();

exports.default = {
    init: function init(devMode) {

        var style = getComputedStyle(document.body);

        var fontSize = parseInt(style.getPropertyValue('--base-font-size'), 10);
        var lineHeight = Number(style.getPropertyValue('--base-line-height'));
        var lineOffset = Number(style.getPropertyValue('--active-area-offset'));

        var activeArea = fontSize * lineHeight / 100;
        var activeAreaOffset = fontSize * lineOffset / 100;

        // register lines

        var lines = [];

        Array.from(document.querySelectorAll('.u-line')).forEach(function (el) {

            lines.push(new Line(el, activeArea, activeAreaOffset));
        });

        Array.from(document.querySelectorAll('.u-line-2')).forEach(function (el) {

          lines.push(new Line(el, activeArea, activeAreaOffset));
      });

        // update guides

        window.addEventListener('resize', (0, _throttle2.default)(function () {

            lines.forEach(function (line) {
                line.update();
            });
        }, 25));

        // update lines

        window.addEventListener('scroll', (0, _throttle2.default)(function () {

            lines.forEach(function (line) {
                line.update();
            });
        }, 25));

        if (devMode) {

            // draw guides

            var guideSet = new GuideSet(activeArea, activeAreaOffset);

            guideSet.draw();

            // update guides

            window.addEventListener('resize', (0, _throttle2.default)(function () {

                guideSet.update();
            }, 25));
        }
    }
};

},{"lodash/throttle":12}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
    init: function init() {

        var lines = [].concat(_toConsumableArray(document.querySelectorAll('.u-line')));
        var lines = [].concat(_toConsumableArray(document.querySelectorAll('.u-line-2')));

        lines.forEach(function (line) {

            var words = line.innerText.toLowerCase().trim().split(' ');

            line.innerText = '';

            words.forEach(function (word, i) {

                var wordElement = document.createElement('span');

                wordElement.dataset.word = word;
                line.appendChild(wordElement);

                var kernValues = window.getComputedStyle(wordElement).getPropertyValue('--kerning').toString().trim().split(' ');

                var letters = word.split('');

                letters.forEach(function (letter, i) {

                    var letterElement = document.createElement('span');
                    letterElement.style.marginRight = kernValues[i] + 'em';
                    letterElement.dataset.letter = letter;
                    letterElement.innerText = letter;

                    wordElement.appendChild(letterElement);
                });

                if (i < words.length - 1) {

                    line.innerHTML += '<span class="Space"> </span>';
                }
            });
        });
    }
};

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
    init: function init() {

        var quickFadeNodes = [].concat(_toConsumableArray(document.querySelectorAll('.u-fadeIn--quick')));

        var longFadeNodes = [].concat(_toConsumableArray(document.querySelectorAll('.u-fadeIn--long')));

        var style = getComputedStyle(document.body);

        var quickFadeDuration = parseInt(style.getPropertyValue('--long-duration'), 10) + parseInt(style.getPropertyValue('--quick-delay'), 10);

        var longFadeDuration = parseInt(style.getPropertyValue('--long-duration'), 10) + parseInt(style.getPropertyValue('--long-delay'), 10);

        window.setTimeout(function () {

            quickFadeNodes.forEach(function (node) {

                node.classList.remove('u-fadeIn--quick');
            });
        }, quickFadeDuration);

        window.setTimeout(function () {

            longFadeNodes.forEach(function (node) {

                node.classList.remove('u-fadeIn--long');
            });
        }, longFadeDuration);
    }
};

},{}]},{},[14]);
