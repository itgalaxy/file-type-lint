"use strict";

const standalone = require("../standalone");
const path = require("path");

const fixturesDir = path.join(__dirname, "fixtures");

describe("standalone", () => {
  it("should works fine with valid files", () =>
    standalone({
      files: `${fixturesDir}/**/valid.*`
    }));

  it("should be error with invalid files", () =>
    standalone({
      files: `${fixturesDir}/**/invalid*.*`
    }).then(result => {
      expect(result.errored).toBe(true);
      expect(result.errors).toHaveLength(5);

      return Promise.resolve();
    }));
});
