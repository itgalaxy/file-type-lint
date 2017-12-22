"use strict";

const yamlLinter = require("../yaml-linter");
const path = require("path");
const fs = require("fs");

const fixturesDir = path.join(__dirname, "../../__tests__/fixtures");

// eslint-disable-next-line no-sync
const validYAMLContent = fs.readFileSync(path.join(fixturesDir, "valid.yaml"));
// eslint-disable-next-line no-sync
const invalidYAMLContent = fs.readFileSync(
  path.join(fixturesDir, "invalid.yaml")
);

describe("yaml-linter", () => {
  const validFile = {
    buffer: Buffer.from(validYAMLContent),
    path: path.join(__dirname, "valid.yaml")
  };
  const unvalidFile = {
    buffer: Buffer.from(invalidYAMLContent),
    path: path.join(__dirname, "invalid.yaml")
  };

  it("should works with valid file", () => yamlLinter(validFile));

  it("should throw error with invalid file", () => {
    expect.assertions(1);

    return yamlLinter(unvalidFile).catch(error => {
      expect(error).not.toBeNull();
    });
  });
});
