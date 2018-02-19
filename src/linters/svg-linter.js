"use strict";

const sax = require("sax");

function svgLinter(file) {
  return Promise.resolve()
    .then(
      () =>
        new Promise((resolve, reject) => {
          const parser = sax.parser(true);

          // eslint-disable-next-line unicorn/prefer-add-event-listener
          parser.onerror = function(error) {
            reject(error);
          };

          parser.onend = function() {
            resolve();
          };

          parser.write(file.buffer).close();
        })
    )
    .catch(error => {
      error.fileName = file.path;
      error.message = `File name "${error.fileName}"\n${error.message}`;

      throw error;
    });
}

module.exports = svgLinter;
