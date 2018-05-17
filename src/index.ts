import * as _ from 'lodash';

export const toArray = subject => subject ? subject.toString().split(',') : [];

export const toNumber = subject => parseInt(subject, 10);

export function toBoolean(subject) {
  const boolString = subject.toString().toLowerCase();

  switch (boolString) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new Error(`Expected "${subject}" to be either "true" or "false".`);
  }
}

export function setAtPath(obj, path, value) {
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

export function throwMissingEnvVarError(envVar) {

  const requiredEnvVarError = new Error(
    `Config: Required environment variable "${envVar}" is missing.`,
  );

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(
      requiredEnvVarError,
      envVar,
    );
  }

  throw requiredEnvVarError;

}

export interface options {
  transform?: (value: string) => any;
  default?: any;
}

export function cast(key: string, env: string, options: options = {}) {
  const value = typeof options.transform === 'function'
    ? options.transform(this.envs[env])
    : this.envs[env];

  setAtPath(this.config, key, value || options.default);

  return this;

}

export function castRequired(key, env, transform?) {

  if (!this.envs[env]) {
    throwMissingEnvVarError(env);
  }

  return this.cast(key, env, transform);

}

export function set(key, value) {

  setAtPath(this.config, key, value);

  return this;

}


export function seal() {

  return _.cloneDeep(
    Object.assign(
      {},
      this.config,
      { _envs: this.envs },
    ),
  );

}

export class Config {

  private config = {};
  private envs = { ...process.env };

  cast = cast;
  castRequired = castRequired;
  set = set;
  seal = seal;

}

export default new Config();
