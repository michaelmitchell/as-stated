//
import { expect } from "chai";
import as from "../src/index";

//
import TestClass from "./lib/test-class";


//
describe("method", () => {
  it("should return a function", () => {
    expect(as.method(() => {})).to.be.a("function");
  });

  it("should include the original function in the test property", () => {
    const testFn = (state, x) => x;

    expect(as.method(testFn).test).to.eq(testFn);
  });

  it("should return a curried function", () => {
    const testFn = (state, x) => x;
    const fn = as.method(testFn);

    expect(fn).to.be.a("function");

    const fn2 = fn(1);

    expect(fn2).to.be.a("function");
    expect(fn2({})).to.eq(1);
  });

  it("should partially apply state when called from an instance", () => {
    const testInst = new TestClass();

    expect(testInst.methodReturnsParam).to.be.a("function");
    expect(testInst.methodReturnsParam(1)).to.eq(1);
  });

  it("should use a curried placeholder for state when called from prototype with less than expected arguments", () => {
    const testFn = TestClass.prototype.methodReturnsParam(1);
    expect(testFn(1)).to.eq(1);
  });

  it("should not use a curried placeholder for state when called from prototype with expected arguments", () => {
    expect(TestClass.prototype.methodReturnsParam({}, 1)).to.eq(1);
  });

  it("should be bound to a cloned prototype when called from an instance", () => {
    const MyClass = function () { };

    let testScope;

    MyClass.prototype.test = as.method(function () {
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

    testInst.methodTryReduceState(1);

    expect(testInst.state.result).to.be.undefined;
  });

  it("should not be chainable", () => {
    const testInst = new TestClass();

    expect(testInst.methodReturnsDoesNothing(1)).to.not.eq(testInst);
  });

  it("should not create side effects", () => {
    const testInst = new TestClass();

    testInst.methodTrySideEfect();

    expect(testInst.changed).to.be.undefined;
    expect(TestClass.prototype.changed).to.be.undefined;
  });
});
