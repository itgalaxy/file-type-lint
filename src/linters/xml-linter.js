"use strict";

const xml2js = require("xml2js");

function xmlLinter(file) {
  return Promise.resolve()
    .then(
      () =>
        new Promise((resolve) => {
          const parser = new xml2js.Parser();

          parser.parseString(file.buffer, (error) => {
            if (error) {
              throw error;
            }

            resolve();
          });
        })
    )
    .catch((error) => {
      let [message, line, column, char] = error.message.split("\n");

      if (!message) {
        message = "Unknown error";
      }

      if (line) {
        line = line.replace("Line: ", "");
      }

      if (column) {
        column = column.replace("Column: ", "");
      }

      if (char) {
        char = char.replace("Char: ", "");
      }

      const formatedError = new Error(
        `File "${file.path}" contain error "${message}".${
          line ? ` Line ${line}.` : ""
        }${column ? ` Colomn ${column}.` : ""}${char ? ` Char ${char}.` : ""}`
      );

      formatedError.fileName = file.path;
      formatedError.lineNumber = line;
      formatedError.columnNumber = column;
      formatedError.columnNumber = char;
      formatedError.stack = error.stack;

      throw formatedError;
    });
}

module.exports = xmlLinter;
