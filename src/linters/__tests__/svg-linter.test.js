"use strict";

const svgLinter = require("../svg-linter");
const path = require("path");
const fs = require("fs");

const fixturesDir = path.join(__dirname, "../../__tests__/fixtures");

// eslint-disable-next-line no-sync
const validSVGContent = fs.readFileSync(path.join(fixturesDir, "valid.svg"));
// eslint-disable-next-line no-sync
const invalidSVGContent = fs.readFileSync(
  path.join(fixturesDir, "invalid.svg")
);

describe("svg-linter", () => {
  const validFile = {
    buffer: Buffer.from(validSVGContent),
    path: path.join(__dirname, "valid.svg")
  };
  const unvalidFile = {
    buffer: Buffer.from(invalidSVGContent),
    path: path.join(__dirname, "invalid.svg")
  };

  it("should works with valid file", () =>
    expect(() => svgLinter(validFile)).not.toThrow());

  it("should throw error with invalid file", () => {
    expect.assertions(1);

    return svgLinter(unvalidFile).catch(error => {
      expect(error).not.toBeNull();
    });
  });
});
