"use strict";

const api = require("..");

describe("api", () => {
  it("is exported", () => {
    expect.assertions(2);

    expect(api.lint).not.toBeNull();
    expect(api.linters).not.toBeNull();
  });
});
