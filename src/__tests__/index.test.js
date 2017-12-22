"use strict";

const api = require("..");

describe("api", () => {
  test("are exported", () => {
    expect(api.lint).not.toBeNull();
    expect(api.linters).not.toBeNull();
  });
});
