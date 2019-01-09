const chai = require('chai');
const expect = chai.expect;
const CreateDictionaryCommand = require('../../src/commands/CreateDictionaryCommand');

describe('CreateDictionaryCommand', () => {
  describe('#execute', () => {
    it('should create new en dict', () => {
      let tested = new CreateDictionaryCommand('en');

      return tested.execute()
        .then((dict) => {
          expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('en');
        });
    });

    it('should create new en_gb dict', () => {
      let tested = new CreateDictionaryCommand('en_gb');

      return tested.execute()
        .then((dict) => {
          expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('en_gb');
        });
    });

    it('should create new fr_fr dict', () => {
      let tested = new CreateDictionaryCommand('fr_fr');

      return tested.execute()
        .then((dict) => {
          expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('fr_fr');
        });
    });
  });
});
