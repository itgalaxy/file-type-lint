"use strict";

const path = require("path");
const fs = require("fs");
const pify = require("pify");
const ignore = require("ignore");
const globby = require("globby");
const fileType = require("file-type");
const supportedFileTypes = require("./reference/supported-file-extensions");
const linters = require("./linters");

const fsP = pify(fs);

const DEFAULT_IGNORE_FILENAME = ".file-type-lintignore";
const FILE_NOT_FOUND_ERROR_CODE = "ENOENT";

function standalone(options) {
  let patterns = [].concat(
    Array.isArray(options.files) ? options.files : [options.files]
  );

  // Always ignore .git
  patterns = patterns.concat(["!**/.git/**", "!./.git/**"]);

  if (!options.disableDefaultIgnores) {
    patterns = patterns.concat([
      "!**/node_modules/**",
      "!./node_modules/**",
      "!**/bower_components/**",
      "!./bower_components/**",
      "!**/vendor/**",
      "!./vendor/**"
    ]);
  }

  const ignoreCase = options.ignoreCase || false;

  // The ignorer will be used to filter file paths after the glob is checked,
  // before any files are actually read
  const ignoreFilePath = options.ignorePath || DEFAULT_IGNORE_FILENAME;
  const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
    ? ignoreFilePath
    : path.resolve(process.cwd(), ignoreFilePath);
  let ignoreText = "";

  try {
    // eslint-disable-next-line no-sync
    ignoreText = fsP.readFileSync(absoluteIgnoreFilePath, "utf8");
  } catch (error) {
    if (error.code !== FILE_NOT_FOUND_ERROR_CODE) {
      throw error;
    }
  }

  const ignorePattern = options.ignorePattern || [];
  const ignorer = ignore()
    .add(ignoreText)
    .add(ignorePattern);

  const result = { errored: false, errors: [] };

  return Promise.resolve()
    .then(() =>
      globby(patterns, {
        absolute: true,
        dot: true,
        onlyFiles: true
      })
    )
    .then(filePaths => {
      if (filePaths.length === 0) {
        return [];
      }

      // The ignorer filter needs to check paths relative to cwd
      const filteredFilePaths = ignorer
        .filter(
          filePaths.map(filePath => path.relative(process.cwd(), filePath))
        )
        .map(filePath => path.join(process.cwd(), filePath));

      if (filteredFilePaths.length === 0) {
        return [];
      }

      return filteredFilePaths;
    })
    .then(filePaths =>
      Promise.all(
        filePaths.map(filePath => {
          const origExt = path.extname(filePath).slice(1);
          const ext = origExt.toLowerCase();

          if (!supportedFileTypes.includes(ext)) {
            return Promise.resolve();
          }

          return Promise.resolve()
            .then(() => fsP.readFile(filePath))
            .then(buffer => {
              if (!ignoreCase && !["Z"].includes(ext) && ext !== origExt) {
                throw new Error(
                  `Extension of "${filePath}" file should be in lowercase format.`
                );
              }

              const file = {
                buffer,
                path: path.resolve(filePath)
              };

              if (ext === "svg") {
                file.type = {
                  ext,
                  mime: "image/svg+xml"
                };

                return file;
              }

              if (ext === "yml" || ext === "yaml") {
                file.type = {
                  ext,
                  mime: "text/yaml"
                };

                return file;
              }

              const type = fileType(buffer);

              file.type = type;

              if (!file.type) {
                throw new Error(
                  `File "${path.resolve(filePath)}" has invalid extension.`
                );
              }

              if (ext !== file.type.ext) {
                throw new Error(
                  `File "${path.resolve(
                    filePath
                  )}" has invalid extension. It should be "${type.ext}".`
                );
              }

              return file;
            })
            .then(file => {
              const { type } = file;

              if (!type || !type.mime) {
                return file;
              }

              if (type.mime === "application/xml") {
                return linters.xmlLinter(file);
              }

              if (type.mime === "image/svg+xml") {
                return linters.svgLinter(file);
              }

              if (type.mime === "text/yaml") {
                return linters.yamlLinter(file);
              }

              return file;
            })
            .catch(error => result.errors.push(error));
        })
      )
    )
    .then(() => {
      if (result.errors.length > 0) {
        result.errored = true;
      }

      return result;
    });
}

module.exports = standalone;
