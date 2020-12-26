import config from '../config/config';
import os from 'os';
import { isPlainObject } from 'is-plain-object';

class Utils {
  public static isJSON(data: any): boolean {
    try {
      return JSON.parse(data);
    } catch (e) {
      return false;
    }
  }

  public static sanitizeLog(logData: any): any {
    logData = Utils.isJSON(logData) || logData;
    const excludedKeys = config.logging.excludedKeysToSanitize;
    const deepRegexReplace = (value, keys) => {
      if (typeof value === 'undefined' || typeof keys === 'undefined') {
        return {};
      }

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i = i + 1) {
          value[i] = deepRegexReplace(value[i], keys);
        }
        return value;
      }

      if (!isPlainObject(value)) {
        return value;
      }

      if (typeof keys === 'string') {
        keys = [keys];
      }

      if (!Array.isArray(keys)) {
        return value;
      }

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < keys.length; j++) {
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            if (new RegExp(keys[j], 'i').test(key)) {
              // keep 60 characters of socure document image base64 string instead of remove entire string
              if (key === 'Documents' && Array.isArray(value[key]) && value[key][0]?.Type) {
                value[key] = value[key].map(doc => {
                  const newdoc = { ...doc };
                  if (newdoc.Documents) {
                    newdoc.Documents = doc.Documents?.substr(0, 60);
                  } else if (newdoc.Content) {
                    newdoc.Content = doc.Content?.substr(0, 60);
                  } else {
                    newdoc.Document = doc.Document?.substr(0, 60);
                  }
                  return newdoc;
                });
              } else {
                value[key] = '[REMOVED]';
              }
            }
          }
        }
      }

      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          value[key] = deepRegexReplace(value[key], keys);
        }
      }

      return value;
    };

    return deepRegexReplace(logData, excludedKeys);
  }

  public static getIpAddress() {
    const networkInterfaces = os.networkInterfaces();
    return Object.keys(networkInterfaces)
      .reduce((r, k) => r.concat(k, networkInterfaces[k]), [])
      .filter(item => item.family === 'IPv4' && item.internal === false)
      .map(val => val.address)[0];
  }

  public static dropNullOrUndefined(obj: object): object {
    return Object.entries(obj).reduce(
      (acc, [k, v]) => (v == null ? acc : { ...acc, [k]: isPlainObject(v) ? Utils.dropNullOrUndefined(v) : v }),
      {}
    );
  }

  public static decimalAdjust(type: any, value: any, exp: any) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (Number.isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
  }
}

export default Utils;
