'use strict';

const assert = require('assert-plus');
const moment = require('moment');

module.exports = {
  validator: function validator(require) {

    const getEnum = function getEnum(paramValue, name, defaultValue) {

      if (!require && paramValue === undefined) {
        return undefined;
      }

      if (paramValue) {
        return paramValue;
      }
      else if (defaultValue !== undefined) {
        return defaultValue;
      }
      assert.ok(null, `${name} (string) is invalid enum value`);
      return true;
    };

    const getNumber = function getNumber(paramValue, name, defaultValue) {
      if (!require && paramValue === undefined) {
        return undefined;
      }

      let value = defaultValue;

      if (defaultValue !== undefined) {
        if (paramValue) {
          assert.optionalNumber(paramValue, name);
        }
      }
      else {
        assert.number(paramValue, name);
      }

      if (paramValue) {
        value = paramValue;
      }

      return value;
    };

    const getString = function getString(paramValue, name, defaultValue) {
      if (!require && paramValue === undefined) {
        return undefined;
      }

      let value = defaultValue;

      if (defaultValue !== undefined) {
        if (paramValue) {
          assert.optionalString(paramValue, name);
        }
      }
      else {
        assert.string(paramValue, name);
      }

      if (paramValue) {
        value = paramValue;
      }

      return value;
    };

    const getDate = function getDate(paramValue, name, defaultValue) {
      if (!require && paramValue === undefined) {
        return undefined;
      }

      const value = getString(paramValue, name, defaultValue);

      if (value) {
        return moment(value);
      }

      return defaultValue;
    };

    const getArrayOfString = function getArrayOfString(paramValue, name, defaultValue) {
      if (!require && paramValue === undefined) {
        return undefined;
      }

      let value = defaultValue;

      if (defaultValue !== undefined) {
        if (paramValue) {
          assert.optionalArrayOfString(paramValue, name);
        }
      }
      else {
        assert.arrayOfString(paramValue, name);
      }

      if (paramValue) {
        value = paramValue;
      }

      return value;
    };

    return {
      getEnum: getEnum,
      getNumber: getNumber,
      getString: getString,
      getDate: getDate,
      getArrayOfString: getArrayOfString,
      require: require
    };
  }
};