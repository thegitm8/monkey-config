import * as _ from 'lodash';
process.env.SOMETHING_ELSE = 'bla';

const ENVS = { ...process.env };

function setAtPath(obj, path, value) {
  const pathEls = path.split('.');

  if (pathEls.length === 1) {
    obj[pathEls[0]] = value;
    return;
  }

  if (!obj[pathEls[0]]) {
    obj[pathEls[0]] = {};
  }

  return setAtPath(
    obj[pathEls[0]],
    pathEls.slice(1, pathEls.length).join('.'),
    value,
  );

}


function requiredEnvVar(envVar) {

  const requiredEnvVarError = new Error(
    `12Monkeys Config: Required environment variable ${envVar} is missing.`,
  );

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(
      requiredEnvVarError,
      envVar,
    );
  }

  throw requiredEnvVarError;

}

class Config {

  config = {};

  toArray = subject => subject.toString().split(',');
  toNumber = subject => parseInt(subject, 100);
  toBoolean = subject => subject.toString().toLowerCase() === 'true' ? true : false;

  cast = (key, env, transform?) => {

    setAtPath(this.config, key, ENVS[env] || undefined);

    return this;

  }

  castRequired = (key, env, transform?) => {

    setAtPath(this.config, key, ENVS[env] || requiredEnvVar(env));

    return this;

  }

  set = (key, value) => {

    setAtPath(this.config, key, value);

    return this;

  }

  seal = () => _.cloneDeep(this.config);

}

const config = new Config();

const test = config
  .cast('something', 'SOMETHING', config.toArray)
  .castRequired('anotherThing', 'SOMETHING_ELSE')
  .set('aKey.with.subkey', 123)
  .seal();

console.log(test);

