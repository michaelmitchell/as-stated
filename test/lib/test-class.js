import as from '../../src/index';

const initialState = {

};

//
function TestClass(state = initialState) {
  this.state = initialState;
}

TestClass.prototype.methodReturnsParam = as.method << function (state, x) {
  return x;
}

TestClass.prototype.methodReturnsDoesNothing = as.method << function (state) {
  // does nothing
}

TestClass.prototype.methodTryReduceState = as.method << function (state, x) {
  return Object.assign({}, state, {
    result: x
  });
}

TestClass.prototype.methodTrySideEfect = as.method << function (state, x) {
  this.changed = x;
}

TestClass.prototype.chainMethodReturnsParam = as.chainMethod << function (state, x) {
  return x;
}

//
TestClass.prototype.chainMethodDoesNothing = as.chainMethod << function (state, x) {
  //
}

TestClass.prototype.chainMethodTryReduceState = as.chainMethod << function (state, x) {
  return Object.assign({}, state, {
    result: x
  });
}

TestClass.prototype.chainMethodTrySideEffect = as.chainMethod << function (state, x) {
  this.changed = x;
}

//
TestClass.prototype.privateMethodReturnsParam = as.privateMethod << function (state, x) {
  return x;
}

TestClass.prototype.privateMethodTrySideEffect = as.privateMethod << function (state, x) {
  this.changed = x;
}

TestClass.prototype.sideEffectReturnsParam = as.sideEffect << function (state, x) {
  return x;
}

TestClass.prototype.sideEffectReturnsTwoParams = as.sideEffect << function (state, x, y) {
  return [x, y];
}

TestClass.prototype.sideEffectTrySideEffect  = as.sideEffect << function (state, x) {
  this.changed = x;
}

//
TestClass.prototype.reducerReturnsParam = as.reducer << function (state, x) {
  return x;
}

TestClass.prototype.reducerReturnsDoesNothing = as.reducer << function (state) {
  // does nothing
}

TestClass.prototype.reducerTryReduceState = as.reducer << function (state, x) {
  return Object.assign({}, state, {
    result: x
  });
}

//
TestClass.prototype.reducerTrySideEfect = as.chainReducer << function (state, x) {
  this.changed = x;
}

TestClass.prototype.chainReducerReturnsParam = as.chainReducer << function (state, x) {
  return x;
}

TestClass.prototype.chainReducerReturnsDoesNothing = as.chainReducer << function (state) {
  // does nothing
}

TestClass.prototype.chainReducerTryReduceState = as.chainReducer << function (state, x) {
  return Object.assign({}, state, {
    result: x
  });
}

TestClass.prototype.chainReducerTrySideEfect = as.reducer << function (state, x) {
  this.changed = x;
}

export default TestClass;
