"use strict";

const standalone = require("../standalone");
const path = require("path");

const fixturesDir = path.join(__dirname, "fixtures");

describe("standalone", () => {
  it("should works fine with valid files", () =>
    standalone({
      files: `${fixturesDir}/**/valid*`
    }).then(result => {
      expect(result.errored).toBe(false);
      expect(result.errors).toHaveLength(0);

      return result;
    }));

  it("should works fine with no files", () =>
    standalone({
      files: `${fixturesDir}/**/unknown*`
    }).then(result => {
      expect(result.errored).toBe(false);
      expect(result.errors).toHaveLength(0);

      return result;
    }));

  it("should be error with invalid files", () =>
    standalone({
      files: `${fixturesDir}/**/invalid*`
    }).then(result => {
      expect(result.errored).toBe(true);
      expect(result.errors).toHaveLength(8);

      return result;
    }));

  it("should be error with invalid files (`ignoreCase` option)", () =>
    standalone({
      files: `${fixturesDir}/**/invalid*`,
      ignoreCase: true
    }).then(result => {
      expect(result.errored).toBe(true);
      expect(result.errors).toHaveLength(6);

      return result;
    }));
});
