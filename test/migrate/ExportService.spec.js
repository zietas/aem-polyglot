const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const ExportService = require('../../src/migrate/ExportService');

chai.use(chaiAsPromised);

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
