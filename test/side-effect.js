//
import { expect } from "chai";
import as from "../src/index";

//
import TestClass from "./lib/test-class";


//
describe("side effect", () => {
  it("should return a function", () => {
    expect(as.sideEffect(() => {})).to.be.a("function");
  });

  it("should include the original function in the test property", () => {
    const testFn = (state, x) => x;

    expect(as.sideEffect(testFn).test).to.eq(testFn);
  });

  it("should throw an error if called statically", () => {
    const testFn = (state, x) => x;
    const fn = as.sideEffect(testFn);

    expect(() => fn({}, 1)).to.throw(as.SIDE_EFFECT_ERROR);
  });

  it("should throw an error if called from prototype", () => {
    expect(() => TestClass.prototype.sideEffectReturnsParam({}, 1)).to.throw(as.SIDE_EFFECT_ERROR);
  });

  it("should return a curried function", () => {
    const testInst = new TestClass();

    expect(testInst.sideEffectReturnsTwoParams).to.be.a("function");

    const fn2 = testInst.sideEffectReturnsTwoParams(1);

    expect(fn2).to.be.a("function");
    expect(fn2(2)).to.deep.eq([1, 2]);
  });

  it("should partially apply state when called from an instance", () => {
    const testInst = new TestClass();

    expect(testInst.sideEffectReturnsParam).to.be.a("function");
    expect(testInst.sideEffectReturnsParam(1)).to.eq(1);
  });

  it("should be bound to a cloned prototype when called from an instance", () => {
    const MyClass = function () { };

    let testScope;

    MyClass.prototype.test = as.sideEffect(function () {
      testScope = this;
    });

    const inst = new MyClass();

    inst.test();

    expect(testScope).to.eq(inst);
    expect(testScope).to.not.eq(MyClass.prototype);
    expect(testScope).to.deep.eq(MyClass.prototype);
  });

  it("should be able to create side effects", () => {
    const testInst = new TestClass();

    testInst.sideEffectTrySideEffect(1);

    expect(testInst.changed).to.be.eq(1);
  });
});
