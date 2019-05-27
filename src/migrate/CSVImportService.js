const ImportService = require('./ImportService');
const dictionaryService = require('../dictionaryService');

class CSVImportService extends ImportService {
  constructor(separator, updateExisting) {
    super();
    this.separator = separator || ';';
    this.updateExisting = updateExisting || false;
  }

  import(csv, dictionary) {
    const result = this._processCSV(csv);
    const dictLang = this._getDictionaryLang(dictionary);
    if (!result.languages.includes(dictLang)) {
      throw new Error(`Provided CSV does not contain translations for '${dictLang}'`);
    }
    return this._fillDictionary(result.entries, dictionary);
  }

  _getDictionaryLang(dictionary) {
    return dictionary['jcr:root']['_attributes']['jcr:language'];
  }

  _fillDictionary(json, dictionary) {
    const lang = this._getDictionaryLang(dictionary);

    Object.keys(json).forEach((key) => {
      const value = json[key][lang];

      if (dictionary['jcr:root'][key]) {
        if (dictionary['jcr:root'][key]['_attributes']['sling:message'] !== value) {
          console.log(`- updating key '${key} -> ${value}'` );
          dictionary['jcr:root'][key]['_attributes']['sling:message'] = value;
        } else {
          console.log(`- skipping key '${key}'`);
        }
      } else if (!this.updateExisting) {
        console.log(`- adding new key '${key} -> ${value}'` );
        dictionary['jcr:root'][key] = dictionaryService.createEntry(key, value);
      }
    });
    return dictionary;
  }

  _processCSV(csv) {
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
    return {entries: entries, languages: langs};
  }
}

module.exports = CSVImportService;
