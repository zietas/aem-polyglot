const chai = require('chai');
const expect = chai.expect;
const ImportService = require('../../src/migrate/ImportService');

describe('ImportService', () => {
  let tested;

  beforeEach(() => {
    tested = new ImportService();
  });

  describe('#import', () => {
    it('should throw not implemented error', () => {
      return expect(tested.import).to.throw('Not implemented');
    });
  });
});
