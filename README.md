# Nily env

[![Build Status](https://github.com/NilyCat/env/workflows/CI/badge.svg)](https://github.com/NilyCat/env/actions)

## Installation

Install the library with `npm install @nily/env` or `yarn add @nily/env`

## Usage

```js
const { getEnvironment } = require('@nily/env')
const webpack = require('webpack')

new webpack.DefinePlugin(getEnvironment({
  root: __dirname,
  prefix: 'VUE_APP_'
}))
```

## Tests

Tests are using jest, to run the tests use:

```bash
$ npm run test
```

## MIT license
