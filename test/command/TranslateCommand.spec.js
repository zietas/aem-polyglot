const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const TranslateCommand = require('../../src/commands/TranslateCommand');

chai.use(chaiAsPromised);

describe('TranslateCommand', () => {

  let tested;

  beforeEach(() => {
    // tested = new TranslateCommand();
  });

  describe('#execute', () => {
    // it('should throw not implemented error', () => {
    // TODO
    // });
  });
});
