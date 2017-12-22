"use strict";

const standalone = require("./standalone");
const linters = require("./linters");

const api = {};

api.lint = standalone;
api.linters = linters;

module.exports = api;
