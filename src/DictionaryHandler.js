const fs = require('fs');
const converter = require('xml-js');

const JSON_TO_XML_OPTIONS = {
  compact: false,
  spaces: 4,
  indentAttributes: true
};

class DictionaryHandler {
  static async readDict(source) {
    return new Promise((resolve) => {
      fs.readFile(source, 'utf-8', (err, data) => {
        if (err) throw err;
        const json = converter.xml2js(data);
        resolve(json);
      });
    });
  }

  static async saveDict(jsonDict, target) {
    return new Promise((resolve) => {
      const xml = converter.js2xml(jsonDict, JSON_TO_XML_OPTIONS);
      fs.writeFile(target, xml, 'utf-8', (err) => {
        if (err) throw err;
        resolve(true);
      });
    });
  }
}

module.exports = DictionaryHandler;
