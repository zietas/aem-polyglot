const ExportService = require('./ExportService');

class CSVExportService extends ExportService {
  constructor (separator) {
    super();
    this.separator = separator || ';';
  }

  export (data) {
    const toExport = {};
    const langs = [];
    data.forEach((dict) => {
      const lang = this._getLang(dict);
      langs.push(lang);

      this._getEntryKeys(dict)
        .forEach((entryKey) => {
          const entry = dict['jcr:root'][entryKey]['_attributes'];
          const key = entry['sling:key'] || entryKey;
          toExport[key] = toExport[key] || {};
          toExport[key][lang] = entry['sling:message'] || '';
        });
    });

    langs.sort(this._compare);
    return this._toCsv(toExport, langs);
  }

  _compare (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  _getLang (dict) {
    const lang = dict['jcr:root']['_attributes']['jcr:language'];
    if (!lang) {
      throw new Error('Failed to get language from dictionary');
    }
    return lang;
  }

  _getEntryKeys (dict) {
    return Object.keys(dict['jcr:root'])
      .filter((item) => item !== '_attributes');
  }

  _toCsv (data, langs) {
    let csv = 'key' + this.separator + langs.join(this.separator) + '\r\n';
    const langCount = langs.length;
    const keys = Object.keys(data).sort(this._compare);

    keys.forEach((key) => {
      csv += key + this.separator;
      langs.forEach((lang, index) => {
        const value = data[key][lang] || '';
        csv += value;
        if (index + 1 < langCount) {
          csv += this.separator;
        }
      });
      csv += '\r\n';
    });
    return csv;
  }
}

module.exports = CSVExportService;
