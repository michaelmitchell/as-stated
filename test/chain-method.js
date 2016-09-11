//
import { expect } from "chai";
import as from "../src/index";

//
import TestClass from "./lib/test-class";


//
describe("chain method", () => {
  it("should return a function", () => {
    expect(as.chainMethod(() => {})).to.be.a("function");
  });

  it("should include the original function in the test property", () => {
    const testFn = (state, x) => x;

    expect(as.chainMethod(testFn).test).to.eq(testFn);
  });

  it("should return a curried function", () => {
    const testFn = (state, x) => x;
    const fn = as.chainMethod(testFn);

    expect(fn).to.be.a("function");

    const fn2 = fn(1);

    expect(fn2).to.be.a("function");
    expect(fn2({})).to.be.undefined;
  });

  it("should partially apply state when called from an instance", () => {
    const testInst = new TestClass();

    expect(testInst.chainMethodReturnsParam).to.be.a("function");
    expect(testInst.chainMethodReturnsParam(1)).to.a("object");
  });

  it("should use a curried placeholder for state when called from prototype with less than expected arguments", () => {
    const testFn = TestClass.prototype.chainMethodReturnsParam(1);
    expect(testFn(1)).to.be.a("object");
  });

  it("should not use a curried placeholder for state when called from prototype with expected arguments", () => {
    expect(TestClass.prototype.chainMethodReturnsParam({}, 1)).to.be.a("object");
  });

  it("should be bound to a cloned prototype when called from an instance", () => {
    const MyClass = function () { };

    let testScope;

    MyClass.prototype.test = as.chainMethod(function () {
      testScope = this;
    });

    const inst = new MyClass();

    inst.test();

    expect(testScope).to.not.eq(inst);
    expect(testScope).to.not.eq(MyClass.prototype);
    expect(testScope).to.deep.eq(MyClass.prototype);
  });

  it("should not reduce state", () => {
    const testInst = new TestClass();

    testInst.chainMethodTryReduceState(1);

    expect(testInst.state.result).to.be.undefined;
  });

  it("should be chainable", () => {
    const testInst = new TestClass();

    expect(testInst.chainMethodDoesNothing(1)).to.eq(testInst);
  });

  it("should not create side effects", () => {
    const testInst = new TestClass();

    testInst.chainMethodTrySideEffect();

    expect(testInst.changed).to.be.undefined;
    expect(TestClass.prototype.changed).to.be.undefined;
  });
});
