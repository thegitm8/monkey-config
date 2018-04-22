# monkey-config

## config
The config module provides a simple way to convert environment variables into a configuration object. It also allows you to convert values to have more flexibility when working with environment variables.

Config provides four methods to construct a configuration:
* `cast`: maps an envvironment variable to a key
* `castRequired`: same as `cast`, but throws if the environment variable isn't set
* `set` simply sets a key to a value
* `seal`: returns a plain object representation of the configuration

### Config general usage


```JavaScript
import config from 'twelve-monkeys/config'

// process.env.SOME_ENV_VAR === 'aValue'
// process.env.A_DIFFERENT_ENV_VAR === 'anotherValue'

const myConfig = config
  .cast('aKey', 'SOME_ENV_VAR')
  .castRequired('anotherKey', 'A_DIFFERENT_ENV_VAR') // would throw if not present
  .set('yetAnotherKey', 'someValue')
  .seal()

// Result
// {
//   aKey: 'aValue',
//   anotherKey: 'anotherValue',
//   yetAnotherKey: 'yetAnotherValue'
// }
```
### config casting values

Since envirment variable values are always present as strings, config provides a method of transforming thos. You can also provide methods yourself.
This works the same for `cast` and `castRequired`.

```JavaScript
import config, { toArray, toNumber } from 'twelve-monkeys/config'

// process.env.MEANT_TO_BE_AN_ARRAY === 'a,b,c'
// process.env.MEANT_TO_BE_A_NUMBER === '42'

const myConfig = config
  .cast('aNumber', 'MEANT_TO_BE_A_NUMBER', toNumber)
  .cast('anArray', 'MEANT_TO_BE_AN_ARRAY', toArary)

```
