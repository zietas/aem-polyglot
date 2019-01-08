const fs = require('fs');
const converter = require('xml-js');
const _ = require('lodash');

const XML_TO_JSON_OPTIONS = {
  compact: true
};

const JSON_TO_XML_OPTIONS = {
  compact: true,
  spaces: 4,
  indentAttributes: true
};

class DictionaryHandler {
  static async readDict(source) {
    return new Promise((resolve, reject) => {
      fs.readFile(source, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const json = converter.xml2js(data, XML_TO_JSON_OPTIONS);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  static async saveDict(jsonDict, target) {
    function isValidDictionary(dict){
      return _.isObject(dict) && dict['_declaration'] && dict['jcr:root'];
    }

    return new Promise((resolve, reject) => {
      try {
        if(!isValidDictionary(jsonDict)){
          reject("Given dictionary is not an object");
          return;
        }
        const xml = converter.js2xml(jsonDict, JSON_TO_XML_OPTIONS);
        fs.writeFile(target, xml, 'utf-8', (err) => {
          if (err) {
            reject(reject);
          } else {
            resolve(true);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = DictionaryHandler;
