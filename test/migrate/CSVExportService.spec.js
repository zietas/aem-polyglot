const chai = require('chai');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const CSVExportService = require('../../src/migrate/CSVExportService');

describe('CSVExportService', () => {
  describe('#construct', () => {
    it('should set provided separator', () => {
      const separator = '\t';

      const t = new CSVExportService(separator);

      expect(t.separator).to.be.equal(separator);
    });

    it('should fallback to default separator', () => {
      const t = new CSVExportService();

      expect(t.separator).to.be.equal(';');
    });
  });

  describe('#export', () => {
    function createDictionary () {
      let enDict = dictionaryService.create('en_gb');
      for (let i = 0; i < 10; i++) {
        dictionaryService.putEntry(enDict, `key.${i}`, `value ${i}`);
      }
    }

    beforeEach(() => {
      this.tested = new CSVExportService();
    });

    afterEach(() => {
      this.tested = null;
    });

    it('should', () => {

    });
  });
});
