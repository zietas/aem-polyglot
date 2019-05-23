const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const ImportService = require('../../src/migrate/ImportService');

chai.use(chaiAsPromised);

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
