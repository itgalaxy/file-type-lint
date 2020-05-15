#!/usr/bin/env node

"use strict";

const meow = require("meow");
const getStdin = require("get-stdin");
// eslint-disable-next-line node/no-unpublished-require
const standalone = require("../src/standalone");

const cli = meow(
  `
    Usage file-type-lint [input]

    Input: Files(s), glob(s), or nothing to use stdin.

      If an input argument is wrapped in quotation marks, it will be passed to
      node-glob for cross-platform glob support. node_modules and
      bower_components are always ignored. You can also pass no input and use
      stdin, instead.

    Options:

      --disable-default-ignores, --di

        Allow linting of node_modules, bower_components and vendor.

      --ignore-case, -ic

        Ignore case of extensions (no errors for 'image.svg', 'image.SVG', 'image.sVg').

      --ignore-path, -i

        Path to a file containing patterns that describe files to ignore. The
        path can be absolute or relative to process.cwd(). By default, file-type-lint
        looks for .file-type-lintignore in process.cwd().

      --ignore-pattern, -ip

        Pattern of files to ignore (in addition to those in .file-type-lintignore).

      --version, -v

        Show the currently installed version of stylelint.

    Examples:

      $ file-type-lint .
`,
  {
    flags: {
      "disable-default-ignores": {
        alias: "di",
        type: "boolean",
      },
      "ignore-case": {
        alias: "ic",
      },
      "ignore-path": {
        alias: "i",
        type: "string",
      },
      "ignore-pattern": {
        alias: "ip",
      },
      version: {
        alias: "v",
        type: "boolean",
      },
    },
  }
);

if (cli.flags.help || cli.flags.h) {
  cli.showHelp();
}

if (cli.flags.version || cli.flags.v) {
  cli.showVersion();
}

const optionsBase = {};

if (cli.flags.ignoreCase) {
  optionsBase.ignoreCase = cli.flags.ignoreCase;
}

if (cli.flags.ignorePath) {
  optionsBase.ignorePath = cli.flags.ignorePath;
}

if (cli.flags.ignorePattern) {
  optionsBase.ignorePattern = cli.flags.ignorePattern;
}

if (cli.flags.disableDefaultIgnores) {
  optionsBase.disableDefaultIgnores = cli.flags.disableDefaultIgnores;
}

Promise.resolve()
  .then(() => {
    if (cli.input.length !== 0) {
      return Object.assign({}, optionsBase, {
        files: cli.input,
      });
    }

    return getStdin().then((stdin) =>
      Object.assign({}, optionsBase, {
        code: stdin,
      })
    );
  })
  .then((options) => {
    if (!options.files && !options.code) {
      cli.showHelp(0);
    }

    return standalone(options);
  })
  .then((linted) => {
    if (!linted.errored) {
      return linted;
    }

    linted.errors.forEach((error) => {
      process.stdout.write(`${error.toString()}\n`);
    });

    process.exitCode = 2;

    return linted;
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error.stack || error);

    const exitCode = typeof error.code === "number" ? error.code : 1;

    process.exit(exitCode);
  });
