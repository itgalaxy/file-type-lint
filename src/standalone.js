"use strict";

const path = require("path");
const util = require("util");
const fs = require("fs");
const ignore = require("ignore");
const globby = require("globby");
const FileType = require("file-type");
const supportedFileTypes = require("./reference/supported-file-extensions");
const linters = require("./linters");

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
      "!./vendor/**",
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
    // eslint-disable-next-line node/no-sync
    ignoreText = fs.readFileSync(absoluteIgnoreFilePath, "utf8");
  } catch (error) {
    if (error.code !== FILE_NOT_FOUND_ERROR_CODE) {
      throw error;
    }
  }

  const ignorePattern = options.ignorePattern || [];
  const ignorer = ignore().add(ignoreText).add(ignorePattern);

  const result = { errored: false, errors: [] };

  return Promise.resolve()
    .then(() =>
      globby(patterns, {
        absolute: true,
        dot: true,
        onlyFiles: true,
      })
    )
    .then((filePaths) => {
      if (filePaths.length === 0) {
        return [];
      }

      // The ignorer filter needs to check paths relative to cwd
      const filteredFilePaths = ignorer
        .filter(
          filePaths.map((filePath) => path.relative(process.cwd(), filePath))
        )
        .map((filePath) => path.join(process.cwd(), filePath));

      if (filteredFilePaths.length === 0) {
        return [];
      }

      return filteredFilePaths;
    })
    .then((filePaths) =>
      Promise.all(
        filePaths.map(async (filePath) => {
          const origExt = path.extname(filePath).slice(1);
          const ext = origExt.toLowerCase();

          if (!supportedFileTypes.includes(ext)) {
            return Promise.resolve();
          }

          const buffer = await util.promisify(fs.readFile)(filePath);
          const file = { buffer, path: path.resolve(filePath) };

          if (!ignoreCase && !["Z"].includes(ext) && ext !== origExt) {
            result.errors.push(
              new Error(
                `Extension of "${filePath}" file should be in lowercase format.`
              )
            );

            return file;
          }

          if (ext === "svg") {
            try {
              await linters.xmlLinter(file);
            } catch (error) {
              result.errors.push(error);
            }

            return file;
          }

          if (ext === "yml" || ext === "yaml") {
            try {
              await linters.yamlLinter(file);
            } catch (error) {
              result.errors.push(error);
            }

            return file;
          }

          const type = await FileType.fromBuffer(buffer);

          file.type = type;

          if (!file.type) {
            result.errors.push(
              new Error(
                `File "${path.resolve(filePath)}" has invalid extension.`
              )
            );

            return file;
          }

          if (ext !== file.type.ext) {
            result.errors.push(
              new Error(
                `File "${path.resolve(
                  filePath
                )}" has invalid extension. It should be "${type.ext}".`
              )
            );

            return file;
          }

          if (!type || !type.mime) {
            return file;
          }

          if (type.mime === "application/xml") {
            try {
              await linters.xmlLinter(file);
            } catch (error) {
              result.errors.push(error);
            }
          }

          return file;
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
