const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const TranslateService = require('../../src/translate/TranslateService');

chai.use(chaiAsPromised);

describe('TranslateService', () => {
  let tested;

  beforeEach(() => {
    tested = new TranslateService();
  });

  describe('#translate', () => {
    it('should throw not implemented error', () => {
      const promise = tested.translate();

      return expect(promise).to.be.rejectedWith('Not implemented');
    });
  });
});
