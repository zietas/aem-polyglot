const chai = require('chai');
const expect = chai.expect;
const ExportService = require('../../src/migrate/ExportService');

describe('ExportService', () => {
  let tested;

  beforeEach(() => {
    tested = new ExportService();
  });

  describe('#export', () => {
    it('should throw not implemented error', () => {
      return expect(tested.export).to.throw('Not implemented');
    });
  });
});
