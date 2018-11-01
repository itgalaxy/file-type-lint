"use strict";

const xmlLinter = require("../xml-linter");
const path = require("path");
const fs = require("fs");

const fixturesDir = path.join(__dirname, "../../__tests__/fixtures");

// eslint-disable-next-line no-sync
const validXMLContent = fs.readFileSync(path.join(fixturesDir, "valid.xml"));
// eslint-disable-next-line no-sync
const invalidXMLContent = fs.readFileSync(
  path.join(fixturesDir, "invalid.xml")
);

describe("xml-linter", () => {
  const validFile = {
    buffer: Buffer.from(validXMLContent),
    path: path.join(__dirname, "valid.xml")
  };
  const unvalidFile = {
    buffer: Buffer.from(invalidXMLContent),
    path: path.join(__dirname, "invalid.xml")
  };

  it("should works with valid file", () =>
    expect(() => xmlLinter(validFile)).not.toThrow());

  it("should throw error with invalid file", () => {
    expect.assertions(1);

    return xmlLinter(unvalidFile).catch(error => {
      expect(error).not.toBeNull();
    });
  });
});
