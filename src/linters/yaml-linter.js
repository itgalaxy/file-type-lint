"use strict";

const yaml = require("js-yaml");

function yamlLinter(file) {
  return Promise.resolve().then(() => {
    let output = "";

    try {
      output = JSON.parse(file.buffer);
    } catch (JSONError) {
      if (JSONError instanceof SyntaxError) {
        try {
          output = [];
          yaml.loadAll(
            file.buffer,
            (doc) => {
              output.push(doc);
            },
            {}
          );

          if (output.length === 0) {
            output = null;
          } else if (output.length === 1) {
            [output] = output;
          }
        } catch (YAMLError) {
          YAMLError.fileName = file.path;
          YAMLError.reason = `File "${YAMLError.path}" contain error "${YAMLError.reason}".`;

          throw YAMLError;
        }
      } else {
        JSONError.fileName = file.path;

        throw JSONError;
      }
    }

    return output;
  });
}

module.exports = yamlLinter;
