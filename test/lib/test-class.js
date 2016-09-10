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

TestClass.prototype.methodReturnsVoid = as.method << function (state) {
  // does nothing
}

TestClass.prototype.methodTryChangeState = as.method << function (state, x) {
  const newState = Object.assign({}, state, {
    changed: true
  });

  this.changed = true;

  return newState;
}

//
TestClass.prototype.chainMethodDoesNothing = as.chainMethod << function (state, x) {
  //
}

TestClass.prototype.chainMethodTryChangeState = as.chainMethod << function (state, x) {
  const newState = Object.assign({}, state, {
    changed: true
  });

  this.changed = true;

  return newState;
}

//
TestClass.prototype.privateMethodReturnsParam = as.privateMethod << function (state, x) {
  return x;
}

TestClass.prototype.privateMethodTryChangeState = as.privateMethod << function (state, x) {
  const newState = Object.assign({}, state, {
    changed: true
  });

  this.changed = true;

  return newState;
}

TestClass.prototype.sideEffectReturnsParam = as.sideEffect << function (state, x) {
  return x;
}


export default TestClass;
