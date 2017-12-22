"use strict";

const linters = require("..");

describe("linters", () => {
  test("are exported", () => {
    expect(linters.svgLinter).not.toBeNull();
    expect(linters.xmlLinter).not.toBeNull();
    expect(linters.yamlLinter).not.toBeNull();
  });
});
