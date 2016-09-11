//
import { expect } from "chai";
import as from "../src/index";

//
describe("factory", () => {
  it("should return a function", () => {
    expect(as.factory(() => {})).to.be.a("function");
  });
});

//
describe("private factory", () => {
  it("should return a function", () => {
    expect(as.privateFactory(() => {})).to.be.a("function");
  });
});
