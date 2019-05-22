const ImportService = require('./ImportService');
const dictionaryUtils = require('../dictionaryUtils');

// TODO add tests for this class
class CSVImportService extends ImportService {

  constructor(separator, updateExisting) {
    super();
    this.separator = separator || ';';
    this.updateExisting = updateExisting || false;
  }

  import(csv, dictionary) {
    const json = this._toJS(csv);
    return this._fillDictionary(json, dictionary);
  }

  _fillDictionary(json, dictionary) {
    const lang = dictionary['jcr:root']['_attributes']['jcr:language'];

    Object.keys(json).forEach((key) => {
      const value = json[key][lang];

      if (dictionary['jcr:root'][key]) {
        if (dictionary['jcr:root'][key]['_attributes']['sling:message'] !== value) {
          console.log('- updating new key', key, value);
          dictionary['jcr:root'][key]['_attributes']['sling:message'] = value;
        } else {
          console.log('- skipping key', key);
        }
      } else if (!this.updateExisting) {
        console.log('- adding new key', key, value);
        dictionary['jcr:root'][key] = dictionaryUtils.createEntry(key, value);
      }
    });
    return dictionary;
  }

  _toJS(csv) {
    const entries = {};
    const langs = [];

    csv
      .replace(/\r/gm, '')
      .split('\n')
      .filter((row) => !!row)
      .forEach((row, index) => {
        const cells = row.split(this.separator);
        if (index === 0) {
          for (let i = 1; i < cells.length; i++) {
            langs.push(cells[i]);
          }
        } else {
          const key = cells[0];
          entries[key] = entries[key] || {};
          for (let i = 1; i < cells.length; i++) {
            const lang = langs[i - 1];
            entries[key][lang] = cells[i] || '';
          }
        }
      });
    return entries;
  }
}

module.exports = CSVImportService;
