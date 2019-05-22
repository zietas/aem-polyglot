const ExportService = require('./ExportService');
const fs = require('fs');

function compare(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

function getLang(dict) {
  const lang = dict['jcr:root']['_attributes']['jcr:language'];
  if (!lang) {
    throw new Error("Failed to get language from dictionary");
  }
  return lang;
}

function getEntryKeys(dict) {
  return Object.keys(dict['jcr:root'])
    .filter((item) => item !== '_attributes');
}

function toCsv(data, langs, separator) {
  let csv = 'key' + separator + langs.join(separator) + '\r\n';
  const langCount = langs.length;
  const keys = Object.keys(data).sort(compare);

  keys.forEach((key) => {
    csv += key + separator;
    langs.forEach((lang, index) => {
      const value = data[key][lang] || '';
      csv += value;

      if (index + 1 < langCount) {
        csv += separator;
      }
    });
    csv += '\r\n';
  });

  return csv;
}

// TODO add tests for this class
class CSVExportService extends ExportService {

  constructor(separator) {
    super();
    this.separator = separator || ';';
  }

  export(data) {
    const toExport = {};
    const langs = [];
    data.forEach((dict) => {
      const lang = getLang(dict);
      langs.push(lang);

      getEntryKeys(dict)
        .forEach((entryKey) => {
          const entry = dict['jcr:root'][entryKey]['_attributes'];
          const key = entry['sling:key'] || entryKey;
          toExport[key] = toExport[key] || {};
          toExport[key][lang] = entry['sling:message'] || '';
        });
    });

    langs.sort(compare);

    return toCsv(toExport, langs, this.separator);
  }
}

module.exports = CSVExportService;
