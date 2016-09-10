//
import { expect } from "chai";
import as from '../src/index';

//
import TestClass from './lib/test-class';


//
describe('chain method', () => {
  it('should return a function', () => {
    expect(as.chainMethod(() => {})).to.be.a('function');
  });

  it('should include the original function in the test property', () => {
    const testFn = (state, x) => x;

    expect(as.chainMethod(testFn).test).to.eq(testFn);
  });

  it('should return a curried function', () => {
    const testFn = (state, x) => x;

    expect(testFn.length).to.eq(2);

    const fn = as.chainMethod(testFn);

    expect(fn).to.be.a('function');

    const fn2 = fn({});

    expect(fn2).to.be.a('function');
  });

  it('should partially apply state when called from an instance', () => {
    const testInst = new TestClass();

    expect(testInst.chainMethodDoesNothing).to.be.a('function');
    expect(testInst.chainMethodDoesNothing(1)).to.a('object');
  });

  it('should not partially apply state when called from prototype', () => {
    expect(TestClass.prototype.chainMethodDoesNothing).to.be.a('function');
    expect(TestClass.prototype.chainMethodDoesNothing({})).to.be.a('function');
    expect(TestClass.prototype.chainMethodDoesNothing({}, 1)).to.be.a('object');
  });

  it('should not reduce state', () => {
    const testInst = new TestClass();

    testInst.chainMethodTryChangeState(1);

    expect(testInst.state.changed).to.be.undefined;
  });

  it('should be chainable', () => {
    const testInst = new TestClass();
    const result = testInst.chainMethodDoesNothing(1);

    expect(result).to.deep.equal(TestClass.prototype);
  });

  it('should not create side effects', () => {
    const testInst = new TestClass();

    testInst.chainMethodTryChangeState();

    expect(testInst.changed).to.be.undefined;
    expect(TestClass.prototype.changed).to.be.undefined;
  });
});
