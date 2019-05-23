const fs = require('fs');
const _ = require('lodash');
const converter = require('xml-js');
const alphabetize = require('alphabetize-object-keys');
const dictionaryUtils = require('./dictionaryUtils');

const DICTIONARY_TEMPLATE = {
  _declaration: {
    _attributes: {
      encoding: 'UTF-8',
      version: '1.0'
    }
  },
  'jcr:root':
    {
      _attributes:
        {
          'jcr:language': 'en',
          'jcr:mixinTypes': '[mix:language]',
          'jcr:primaryType': 'sling:Folder',
          'xmlns:jcr': 'http://www.jcp.org/jcr/1.0',
          'xmlns:mix': 'http://www.jcp.org/jcr/mix/1.0',
          'xmlns:sling': 'http://sling.apache.org/jcr/sling/1.0'
        }
    }
};

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

const XML_TO_JSON_OPTIONS = {
  compact: true
};

const JSON_TO_XML_OPTIONS = {
  compact: true,
  spaces: 4,
  indentAttributes: true,
  ignoreDeclaration: true,
  attributeValueFn: dictionaryUtils.encodeHTML
};

function create (locale) {
  const dict = _.cloneDeep(DICTIONARY_TEMPLATE);
  dict['jcr:root']['_attributes']['jcr:language'] = locale.getLocaleISOCode();
  return dict;
}

function sort (dict) {
  return alphabetize(dict);
}

function listDict (path) {
  const paths = fs.readdirSync(path);
  return _.filter(paths, (item) => {
    return !item.startsWith('.') && item.endsWith('.xml');
  });
}

function exists (path) {
  return fs.existsSync(path);
}

async function readDict (source) {
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

async function saveDict (jsonDict, target) {
  function isValidDictionary (dict) {
    return _.isObject(dict) && dict['_declaration'] && dict['jcr:root'];
  }

  return new Promise((resolve, reject) => {
    try {
      if (!isValidDictionary(jsonDict)) {
        reject(new Error('Given dictionary is not an object'));
        return;
      }
      let xml = converter.js2xml(jsonDict, JSON_TO_XML_OPTIONS);
      xml = XML_DECLARATION + xml;
      xml = _.replace(xml, /\n[ ]*\/>/mg, '/>');
      xml = _.replace(xml, /\n[ ]*>/mg, '>');
      fs.writeFile(target, xml, 'utf-8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  create,
  sort,
  saveDict,
  readDict,
  exists,
  listDict
};
