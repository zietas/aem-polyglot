const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const ICommand = require('../../src/commands/ICommand');

chai.use(chaiAsPromised);

describe('ICommand', () => {

  let tested;

  beforeEach(() => {
    tested = new ICommand();
  });

  describe('#execute', () => {
    it('should throw not implemented error', () => {
      const promise = tested.execute();

      return expect(promise).to.be.rejectedWith('Not implemented');
    });
  });
});
