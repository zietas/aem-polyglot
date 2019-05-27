const chai = require('chai');
const expect = chai.expect;
const CSVImportService = require('../../src/migrate/CSVImportService');

describe('CSVImportService', () => {
  describe('#construct', () => {
    it('should set provided separator', () => {
      const separator = '\t';
      const updateExisting = true;

      const t = new CSVImportService(separator, updateExisting);

      expect(t.separator).to.be.equal(separator);
      expect(t.updateExisting).to.be.equal(updateExisting);
    });

    it('should fallback to default separator', () => {
      const t = new CSVImportService();

      expect(t.separator).to.be.equal(';');
      expect(t.updateExisting).to.be.false;
    });
  });

  describe('#import', () => {
    beforeEach(() => {
      this.tested = new CSVImportService();
    });

    afterEach(() => {
      this.tested = null;
    });

    it('should', () => {

    });
  });
});
