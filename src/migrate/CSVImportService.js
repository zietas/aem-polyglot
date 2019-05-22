const ImportService = require('./ImportService');
const fs = require('fs');

// TODO add tests for this class
class CSVImportService extends ImportService {

  constructor(separator) {
    super();
    this.separator = separator || ';';
  }

  import(data) {

  }
}

module.exports = ImportService;
