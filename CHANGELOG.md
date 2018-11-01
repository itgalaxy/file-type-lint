# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org).

## 2.0.0 - 2018-11-01

- Added: `--ignore-case` option for CLI and `ignoreCase` for node API.
- Added: `wma`, `asf`, `ape`, `wv`, `ktx` and `dcm` extensions support.
- Changed: validate extensions in any case (`lowercase`, `uppercase`, `mIxEdCaSe` and etc) and throw error if it is not in lowercase, except extension what should be in uppercase (example `Z`).
- Chore: update `ignore` to `^5.0.3` version.
- Chore: update `file-type` to `^10.3.0` version.
- Chore: update `js-yaml` to `^3.12.0` version.
- Chore: update `js-yaml` to `^4.0.1` version.

## 1.1.0 - 2018-05-12

- Added: `mp2`, `qcp`, `heic`, `ogx`, `spx`, `ogm`, `ogv` extensions support.

## 1.0.2 - 2018-05-05

- Chore: minimum required `meow` version is now `5.0.0`.

## 1.0.1 - 2018-03-12

- Revert: minimum required `globby` version is now `^7.1.1`.

## 1.0.0 - 2018-02-19

- Chore: minimum required `globby` version is now `^8.0.1`. BREAKING CHANGE!

## 0.1.0 - 2017-12-22

- Chore: public initial release.
