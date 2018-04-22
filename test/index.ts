import { assert } from 'chai';
import * as sinon from 'sinon';
import {
  toArray,
  toNumber,
  toBoolean,
  setAtPath,
  throwMissingEnvVarError,
  cast,
  castRequired,
  set,
  seal,
  Config,
} from '../src/index';

describe('src/index.ts', () => {

  describe('toArray', () => {

    it('converts a comma separated list into an array of strings.', () => {

      const stringifiedList = 'one,two,three';
      const arrayFromString = toArray(stringifiedList);

      assert.isArray(arrayFromString);
      arrayFromString.forEach(e => assert.isString(e));

    });

    it('returns an empty array if subject is undefined', () => {

      const emptyArray = toArray(undefined);

      assert.isArray(emptyArray);
      assert.deepEqual(emptyArray.length, 0);

    });

  });

  describe('toNumber', () => {

    it('converts a string to an integer.', () => {

      const stringifiedNumber = '1';

      assert.deepEqual(toNumber(stringifiedNumber), 1);

    });

  });

  describe('toBoolean', () => {

    it('returns `true` for any from of the string "true".', () => {

      const variantsOfTrueAsString = [
        'true',
        'True',
        'TRUE',
      ];

      variantsOfTrueAsString.forEach((s) => {
        const truethy = toBoolean(s);
        assert.isBoolean(truethy);
        assert.ok(truethy);

      });

    });

    it('returns `false` for any from of the string "false".', () => {

      const variantsOfTrueAsString = [
        'false',
        'False',
        'FALSE',
      ];

      variantsOfTrueAsString.forEach((s) => {
        const falsy = toBoolean(s);
        assert.isBoolean(falsy);
        assert.notOk(falsy);
      });

    });

    it('throws for any value not a variant of the strings "true" or "false".', () => {

      // TODO: generate random test input
      const listOfPseudoRandomStrings = [
        '123rtuklö',
        '0ßihugx',
        '45tzujkl',
        '...',
        'notFalse',
        'notTrue',
      ];

      listOfPseudoRandomStrings.forEach((s) => {
        const testFunc = ()  => toBoolean(s);
        assert.throws(testFunc, `Expected "${s}" to be either "true" or "false".`);
      });

    });

  });

  describe('setAtPath', () => {

    it('sets a value on a path on an object.', () => {

      const sampleObject = {};
      setAtPath(sampleObject, 'path', 'value');

      assert.ok(sampleObject.hasOwnProperty('path'));
      assert.deepEqual(sampleObject['path'], 'value');

    });

    it('creates intermediate paths if they don\'t exist', () => {

      const sampleObject = {};
      setAtPath(sampleObject, 'path.secondPath', 'value');

      assert.ok(sampleObject.hasOwnProperty('path'));
      assert.ok(sampleObject['path'].hasOwnProperty('secondPath'));
      assert.deepEqual(sampleObject['path'].secondPath, 'value');

    });

  });

  describe('throwMissingEnvVarError', () => {

    it('throws an error for a missing variable.', () => {

      const testFunc = () => throwMissingEnvVarError('TEST_VAR');

      assert.throws(
        testFunc,
        'Config: Required environment variable "TEST_VAR" is missing.',
      );

    });

  });

  describe('cast', () => {

    it('casts a value from the environment to a specified config key.', () => {

      const context = {
        config: {},
        envs: { TEST_ENV_VAR: 'testValue' },
      };

      cast.call(context, 'test', 'TEST_ENV_VAR');

      assert.deepEqual(context.config['test'], 'testValue');

    });

    it('casts an environment var to config and transforms it\'s value', () => {

      const context = {
        config: {},
        envs: { TEST_ENV_VAR: '42' },
      };

      cast.call(context, 'test', 'TEST_ENV_VAR', toNumber);

      assert.deepEqual(context.config['test'], 42);

    });

    it('casts to undefined if the environment variable doesn\'t exist', () => {

      const context = {
        config: {},
        envs: {},
      };

      cast.call(context, 'test', 'ENV_VAR_THAT_DOES_NOT_EXIST');

      assert.isUndefined(context.config['test']);
    });

  });

  describe('castRequired', () => {

    it('throws an error if the specified environment variable doesn\'t exist.', () => {

      const context = { envs: {} };
      const throwingFunc = () => castRequired.call(context, 'test', 'NON_EXISTING_ENV_VAR');

      assert.throws(
        throwingFunc,
        'Config: Required environment variable "NON_EXISTING_ENV_VAR" is missing.',
      );

    });

    it('hands calls down to cast, if environment variable is present.', () => {

      const castSpy = sinon.spy();
      const pseudoTransform = a => a;
      const context = {
        config: {},
        envs: { TEST_VAR: 'test' },
        cast: castSpy,
      };

      castRequired.call(context, 'test', 'TEST_VAR', pseudoTransform);

      assert.ok(castSpy.withArgs('test', 'TEST_VAR', pseudoTransform).calledOnce);

    });

  });

  describe('set', () => {

    it('sets a value to a specified config key.', () => {
      const context = {
        config: {},
      };

      set.call(context, 'test', 'aValue');

      assert.deepEqual(context.config['test'], 'aValue');
    });

  });

  describe('seal', () => {

    it('returns a clone of the configuration with all environment variables.', () => {
      const context = {
        config: {
          test: 'testValue',
        },
        envs: { ...process.env },
      };

      assert.deepEqual(
        seal.call(context),
        Object.assign(
          context.config,
          { _envs: context.envs },
        ),
      );

    });

  });

  describe('Config', () => {

    it('captures environment variables on construction.', () => {
      const config = new Config().seal();

      assert.deepEqual(config._envs, process.env);

    });

  });

});
