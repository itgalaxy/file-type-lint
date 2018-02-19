"use strict";

const linters = require("..");

describe("linters", () => {
  it("are exported", () => {
    expect.assertions(3);

    expect(linters.svgLinter).not.toBeNull();
    expect(linters.xmlLinter).not.toBeNull();
    expect(linters.yamlLinter).not.toBeNull();
  });
});
