"use strict";

const supportedByFileType = require("file-type/supported.js");

module.exports = [
  ...supportedByFileType.extensions,
  // Additional types
  "svg",
  "yml",
  "yaml",
];
