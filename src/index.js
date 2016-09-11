//
var R = require("ramda");

// error text
var PRIVATE_ERROR = "Attempt to call private method";
var SIDE_EFFECT_ERROR = "Attempt to call a side effect outside of instance";

/**
 * factory - creates predictable state container methods
 * options
 *  - chain: creates a "chainable" method by returning "this"
 *  - sideEffect: binds function to instance state
 *  - reducer: creates a state reducing method
 *
 * @param  {function} targetFn
 * @param  {object} options {chain, sideEffect, reducer}
 * @return {mixed}
 */
function factory(targetFn, options) {
  var prototype;

  options = options || {};

  return function () {
    prototype = prototype || R.clone(this.constructor.prototype);

    var scope = options.sideEffect !== true
      ? prototype //@TODO could be cached?
      : this;

    var newState = targetFn.apply(scope, arguments);

    // support for curried functions
    if (typeof newState === "function") {
      return factory(newState, options).bind(scope);
    }

    if (options && options.reducer === true) {
      this.state = newState;
    }

    if (options && options.chain === true) {
      return this;
    }
    else {
      return newState;
    }
  };
}

// bound curry support
function privateFactory(targetFn, options) {
  options = options || {};

  return function () {
    // if curried add placeholder for state
    var method = arguments.length < targetFn.length
      ? R.partial(targetFn, [R.__])
      : targetFn;

    var result = method.apply(this, arguments);

    // support for curried functions
    if (typeof result === "function") {
      return privateFactory(result, options).bind(this);
    }

    if (options && options.chain === true) {
      return this;
    }
    else {
      return result;
    }
  };
}

/**
 * method
 * @param  {function} targetFn
 * @return {mixed} returnValue
 */
function method(targetFn) {
  var curriedFn = R.curry(targetFn);
  var innerFn;

  var outterFn = function () {
    if (this && this instanceof this.constructor) {
      var method = R.partial(curriedFn, [this.state]);

      innerFn = factory(method);

      return innerFn.apply(this, arguments);
    }
    else {
      innerFn = privateFactory(curriedFn);

      return innerFn.apply(this, arguments);
    }
  };

  outterFn.test = targetFn;

  return outterFn;
}

/**
 * chainMethod
 * @param  {function} targetFn
 * @return {function} outterFn
 */
function chainMethod(targetFn) {
  var curriedFn = R.curry(targetFn);
  var innerFn;

  var outterFn = function () {
    if (this && this instanceof this.constructor) {
      var method = R.partial(curriedFn, [this.state]);

      innerFn = factory(method, { chain: true });

      return innerFn.apply(this, arguments);
    }
    else {
      innerFn = privateFactory(curriedFn, { chain: true });

      return innerFn.apply(this, arguments);
    }
  };

  outterFn.test = targetFn;

  return outterFn;
}

/**
 * privateMethod
 * @param  {function} targetFn
 * @return {function} outterFn
 */
function privateMethod(targetFn) {
  var curriedFn = R.curry(targetFn);
  var innerFn;

  var outterFn = function () {
    if (this && this instanceof this.constructor) {
      throw Error(PRIVATE_ERROR);
    }
    else {
      innerFn = privateFactory(curriedFn);

      return innerFn.apply(this, arguments);
    }
  };

  outterFn.test = targetFn;

  return outterFn;
}

/**
 * sideEffect
 * @param  {function} targetFn
 * @return {function} outterFn
 */
function sideEffect(targetFn) {
  var curriedFn = R.curry(targetFn);
  var innerFn;

  var outterFn = function () {
    if (this && this instanceof this.constructor) {
      var method = R.partial(curriedFn, [this.state]);

      innerFn = factory(method, { sideEffect: true });

      return innerFn.apply(this, arguments);
    }
    else {
      throw Error(SIDE_EFFECT_ERROR);
    }
  };

  outterFn.test = targetFn;

  return outterFn;
}

/**
 * reducer
 * @param  {function} targetFn
 * @return {function} outterFn
 */
function reducer(targetFn) {
  var curriedFn = R.curry(targetFn);
  var innerFn;

  var outterFn = function () {
    if (this && this instanceof this.constructor) {
      var reducer = R.partial(curriedFn, [this.state]);

      innerFn = factory(reducer, { reducer: true });

      return innerFn.apply(this, arguments);
    }
    else {
      innerFn = privateFactory(curriedFn);

      return innerFn.apply(this, arguments);
    }
  };

  outterFn.test = targetFn;

  return outterFn;
}

/**
 * chainReducer
 * @param  {function} targetFn
 * @return {function} outterFn
 */
function chainReducer(targetFn) {
  var curriedFn = R.curry(targetFn);
  var innerFn;

  var outterFn = function () {
    if (this && this instanceof this.constructor) {
      var reducer = R.partial(curriedFn, [this.state]);

      innerFn = factory(reducer, { reducer: true, chain: true });

      return innerFn.apply(this, arguments);
    }
    else {
      innerFn = privateFactory(curriedFn, { chain: true });

      return innerFn.apply(this, arguments);
    }
  };

  outterFn.test = targetFn;

  return outterFn;
}

/**
 * privateReducer - alias of privateMethod for the sake of expression
 */
var privateReducer = privateMethod;

//
module.exports = {
  //
  PRIVATE_ERROR: PRIVATE_ERROR,
  SIDE_EFFECT_ERROR: SIDE_EFFECT_ERROR,

  //
  factory: factory,
  privateFactory: privateFactory,

  //
  method: method,
  chainMethod: chainMethod,
  privateMethod: privateMethod,

  //
  sideEffect: sideEffect,

  //
  reducer: reducer,
  chainReducer: chainReducer,
  privateReducer: privateReducer
};
