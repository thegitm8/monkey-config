`monkey-config` provides a simple way to convert environment variables into a configuration object. The goal is to make your application [controllable via the environment](https://12factor.net/config) and at the same time make it easy to work with the values provided by the environment.

<!-- TOC -->

- [Install](#install)
- [Usage](#usage)
  - [General](#general)
  - [mapping environment variables](#mapping-environment-variables)
  - [options](#options)
    - [transform](#transform)
    - [defaults](#defaults)
  - [full example](#full-example)
- [test](#test)

<!-- /TOC -->

## Install

```Shell
npm i monkey-config
# or
yarn add monkey-config
```

## Usage

### General
`monkey-config` exposes a single object, capturing the current environment (`process.env`). This object helps you to construct a simple configuration object, mapping environment variables alongside constant configuration values.

`seal`ing the config creates a (deep) clone of the configuration to prevent further changes to either the environment or the configuration itself.

```JavaScript
import config from 'monkey-config'

const myConfig = config
  // configuration mapping goes here

export myConfig.seal()
```

or

```JavaScript
const config = require('monkey-config').default

const myConfig = config
  // configuration mapping goes here

module.exports = myConfig.seal()
```

### mapping environment variables

To map environment variables to the configuration, you have two methods: `cast` and `castRequired`. Both work the same except that `castRequired` throws if the specified environment variable doesn't exist.

Example:
```JavaScript
// process.env.SOME_ENV_VAR === 'aValue'

const myConfig = config
  .cast('aKey', 'SOME_ENV_VAR')
  .seal()

console.log(myConfig)
// { aKey: 'aValue' }
```

### options

#### transform

Since environment variable values are always present as strings, config provides methods to transform those (you can also provide methods yourself). Three methods are available: `toNumber`, `toArray` and `toBoolean`.

```JavaScript
import config, { toArray, toNumber } from 'monkey-config'

// process.env.MEANT_TO_BE_AN_ARRAY === 'a,b,c'
// process.env.MEANT_TO_BE_A_NUMBER === '42'
// process.env.MEANT_TO_BE_JSON === '{"a":"value"}'

const myConfig = config
  .cast('aNumber', 'MEANT_TO_BE_A_NUMBER', { transform: toNumber })
  .cast('anArray', 'MEANT_TO_BE_AN_ARRAY', { transform: toArary })
  // custom toJson
  .cast('json', 'MEANT_TO_BE_JSON', { transform: JSON.parse })
```

#### defaults
You can also provide default values when casting environment variables.

Example:
```JavaScript
const myConfig = config
  .cast('key', 'ENV_VAR', { default: 'aDefaultValue' })
```

### full example

```JavaScript
import config, { toNumber } from 'monkey-config'

// process.env.FIRST_ENV_VAR === 'firstValue'
// process.env.SECOND_ENV_VAR === '2'
// process.env.THIRD_ENV_VAR === undefined
// process.env.FOURTH_ENV_VAR === 'fourthValue'

const myConfig = config
  .cast('firstKey', 'FIRST_ENV_VAR')
  .cast('secondKey', 'SECOND_ENV_VAR', { transform: toNumber })
  .cast('thirdKey', 'THIRD_ENV_VAR', { default: 'thirdValue' })
  .cast('nested.fourthKey', 'FOURTH_ENV_VAR')
  .seal()

console.log(myConfig)
/*
  {
    firstKey: 'firstValue',
    secondKey: 2,
    thirdKey: 'thirdValue',
    nested: {
      fourthKey: 'fourthValue'
    },
    _envs: {
      // a copy of process.env at the point of creation
    }
  }
*/
```

## test

```Shell
git clone https://github.com/thegitm8/monkey-config.git

cd monkey-config

npm i

npm run build

npm test
```
