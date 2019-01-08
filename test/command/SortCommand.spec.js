const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const SortCommand = require('../../src/commands/SortCommand');

chai.use(chaiAsPromised);

describe('SortCommand', () => {

  describe('#execute', () => {
    it('should sort properties of a single level object', async () => {
      const input = {z: 'some value', a: 'oother', c: 1};
      const expectedOutcome = Object.keys(input).sort();
      const tested = new SortCommand(input);

      const output = await tested.execute();

      expect(Object.keys(output)).to.be.deep.equal(expectedOutcome);
    });

    it('should sort properties recursively', async () => {
      const input = {
        z: 'some value',
        a: [
          'z', 'e', 'a', 'd', 'b'
        ],
        c: {
          c: 1,
          b: 2,
          a: 3
        }
      };

      const expectedOutcome = Object.keys(input).sort();
      const expectedOutcomeSub = Object.keys(input.c).sort();
      const tested = new SortCommand(input);

      const output = await tested.execute();

      expect(Object.keys(output)).to.be.deep.equal(expectedOutcome);
      expect(Object.keys(output.c)).to.be.deep.equal(expectedOutcomeSub);
    });
  });
});
