"use strict";

module.exports = {
  "*.{js,mjs,jsx}": [
    "prettier --list-different",
    "eslint --report-unused-disable-directives",
  ],
  "*.{md,markdown,mdown,mkdn,mkd,mdwn,mkdown,ron}": [
    "prettier --list-different",
    "remark -f -q",
    "eslint --report-unused-disable-directives",
  ],
};
