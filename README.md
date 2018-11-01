# file-type-lint

[![NPM version](https://img.shields.io/npm/v/file-type-lint.svg)](https://www.npmjs.org/package/file-type-lint)
[![Travis Build Status](https://img.shields.io/travis/itgalaxy/file-type-lint/master.svg?label=build)](https://travis-ci.org/itgalaxy/file-type-lint)
[![dependencies Status](https://david-dm.org/itgalaxy/file-type-lint/status.svg)](https://david-dm.org/itgalaxy/file-type-lint)
[![devDependencies Status](https://david-dm.org/itgalaxy/file-type-lint/dev-status.svg)](https://david-dm.org/itgalaxy/file-type-lint?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/itgalaxy/file-type-lint.svg)](https://greenkeeper.io)

Lint file types based on their content.

## Installation

```shell
npm i -D file-type-lint
```

## Usage

### CLI

```shell
file-type-lint .
```

### API

```js
const fileTypeLint = require("file-type-lint");

fileTypeLint({
  files: "**/*"
})
  .then(result => {
    console.log(result.errored); // If `true` when contain error
    console.log(result.errors); // Array of errors

    return result;
  })
  .catch(error => {
    throw error;
  });
```

## Roadmap

- Formatters.
- Improve error readability.
- Less sync operation.
- More tests (100% coverage).
- Documentation.

## Contribution

Feel free to push your code if you agree with publishing under the MIT license.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
