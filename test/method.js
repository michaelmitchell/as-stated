//
import { expect } from "chai";
import as from '../src/index';

//
import TestClass from './lib/test-class';


//
describe('method', () => {
  it('should return a function', () => {
    expect(as.method(() => {})).to.be.a('function');
  });

  it('should include the original function in the test property', () => {
    const testFn = (state, x) => x;

    expect(as.method(testFn).test).to.eq(testFn);
  });

  it('should return a curried function', () => {
    const testFn = (state, x) => x;

    expect(testFn.length).to.eq(2);

    const fn = as.method(testFn);

    expect(fn).to.be.a('function');

    const fn2 = fn({});

    expect(fn2).to.be.a('function');
  });

  it('should partially apply state when called from an instance', () => {
    const testInst = new TestClass();

    expect(testInst.methodReturnsParam).to.be.a('function');
    expect(testInst.methodReturnsParam(1)).to.eq(1);
  });

  it('should not partially apply state when called from prototype', () => {
    expect(TestClass.prototype.methodReturnsParam).to.be.a('function');
    expect(TestClass.prototype.methodReturnsParam({})).to.be.a('function');
    expect(TestClass.prototype.methodReturnsParam({}, 1)).to.eq(1);
  });

  it('should not reduce state', () => {
    const testInst = new TestClass();

    testInst.methodTryChangeState(1);

    expect(testInst.state.changed).to.be.undefined;
  });

  it('should not be chainable', () => {
    const testInst = new TestClass();

    expect(testInst.methodReturnsVoid(1)).to.not.eq(testInst);
  });

  it('should not create side effects', () => {
    const testInst = new TestClass();

    testInst.methodTryChangeState()

    expect(testInst.changed).to.be.undefined;
    expect(TestClass.prototype.changed).to.be.undefined;
  });
});
