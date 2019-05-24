const chai = require('chai');
const expect = chai.expect;
const dictionaryUtils = require('../../src/dictionaryHtmlEncoder');
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
