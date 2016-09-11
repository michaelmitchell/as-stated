//
import { expect } from "chai";
import as from "../src/index";

//
import TestClass from "./lib/test-class";


//
describe("private method", () => {
  it("should return a function", () => {
    expect(as.privateMethod(() => {})).to.be.a("function");
  });

  it("should include the original function in the test property", () => {
    const testFn = (state, x) => x;

    expect(as.privateMethod(testFn).test).to.eq(testFn);
  });

  it("should return a curried function", () => {
    const testFn = (state, x) => x;
    const fn = as.privateMethod(testFn);

    expect(fn).to.be.a("function");

    const fn2 = fn(1);

    expect(fn2).to.be.a("function");
    expect(fn2({})).to.eq(1);
  });

  it("should throw an error if called from an instance", () => {
    const testInst = new TestClass();

    expect(() => testInst.privateMethodReturnsParam(1)).to.throw(as.PRIVATE_ERROR);
  });

  it("should use a curried placeholder for state when called from prototype with less than expected arguments", () => {
    const testFn = TestClass.prototype.privateMethodReturnsParam(1);
    expect(testFn(1)).to.eq(1);
  });

  it("should not use a curried placeholder for state when called from prototype with expected arguments", () => {
    expect(TestClass.prototype.privateMethodReturnsParam({}, 1)).to.eq(1);
  });

});
