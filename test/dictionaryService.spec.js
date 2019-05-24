const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiArrays = require('chai-arrays');
const expect = chai.expect;

const sinon = require('sinon');
const Locale = require('../src/translate/Locale');
const tested = require('../src/dictionaryService');

chai.use(chaiAsPromised);
chai.use(chaiArrays);

describe('dictionaryService', () => {
  describe('#create', () => {
    it('should create new en dict', () => {
      const dict = tested.create(new Locale('en'));

      expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('en');
    });

    it('should create new en_gb dict', () => {
      const dict = tested.create(new Locale('en_gb'));

      expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('en_gb');
    });

    it('should create new fr_fr dict', () => {
      const dict = tested.create(new Locale('fr_fr'));

      expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('fr_fr');
    });
  });

  describe('#createEntry', () => {
    it('should create new dictionary entry', () => {
      const key = 'some.key';
      const value = 'Lorem ipsum dolor sith ameth';
      const expected = {
        '_attributes': {
          'jcr:priaryType': 'sling:MessageEntry',
          'sling:key': key,
          'sling:message': value
        }
      };

      const result = tested.createEntry(key, value);

      expect(result).to.be.deep.equal(expected);
    });
  });

  describe('#sort', () => {
    it('should sort properties of a single level object', () => {
      const input = { z: 'some value', a: 'oother', c: 1 };
      const expectedOutcome = Object.keys(input).sort();

      const output = tested.sort(input);

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

      const output = await tested.sort(input);

      expect(Object.keys(output)).to.be.deep.equal(expectedOutcome);
      expect(Object.keys(output.c)).to.be.deep.equal(expectedOutcomeSub);
    });
  });

  describe('#readDict()', () => {
    it('should throw error when file does not exists', () => {
      const source = './test/resources/not-existing-file';

      const promise = tested.readDict(source);

      return expect(promise).to.be.rejectedWith('ENOENT: no such file or directory');
    });

    it('should throw error when not an XML file is provided', () => {
      const source = './test/resources/en_gb-not-an-xml-file.xml';

      const promise = tested.readDict(source);

      return expect(promise).to.be.rejectedWith('Text data outside of root node');
    });

    it('should throw error XML is invalid', () => {
      const source = './test/resources/en_gb-invalid.xml';

      const promise = tested.readDict(source);

      return expect(promise).to.be.rejectedWith('Unexpected close tag');
    });

    it('should return XML converted into JS object', () => {
      const source = './test/resources/en_gb.xml';

      const promise = tested.readDict(source);

      return promise.then((dict) => {
        expect(dict).not.to.be.a('null');
        expect(dict).to.have.own.property('jcr:root');
        expect(dict).to.have.own.property('_declaration');
      });
    });
  });

  describe('#saveDict()', () => {
    let fsWriteFile;

    before(() => {
      fsWriteFile = sinon.stub(fs, 'writeFile');
    });

    after(() => {
      fsWriteFile.restore();
    });

    it('should throw error when dictionary JS is invalid', () => {
      const jsonDict = 'not a dictionary';

      const promise = tested.saveDict(jsonDict);

      return expect(promise).to.be.rejectedWith('Given dictionary is not an object');
    });

    it('should throw error when dictionary JS has no declaration node', () => {
      const jsonDict = { elements: [] };

      const promise = tested.saveDict(jsonDict);

      return expect(promise).to.be.rejectedWith('Given dictionary is not an object');
    });

    it('should throw error when fails to save', () => {
      const jsonDict = { 'jcr:root': [], '_declaration': [] };
      const target = './tmpfile';
      fsWriteFile.callsFake((target, xml, encoding, callback) => {
        callback(new Error('Failed to open file'));
      });

      const promise = tested.saveDict(jsonDict, target);

      return expect(promise).to.be.rejectedWith('Failed to open file');
    });

    it('should throw error when exception during processing', () => {
      const jsonDict = { 'jcr:root': [], '_declaration': [] };
      const target = './tmpfile';
      fsWriteFile.callsFake(() => {
        throw new Error('Failed to open file');
      });

      const promise = tested.saveDict(jsonDict, target);

      return expect(promise).to.be.rejectedWith('Failed to open file');
    });

    it('should save dict', () => {
      const jsonDict = { 'jcr:root': [], '_declaration': [] };
      const target = './tmpfile';
      fsWriteFile.callsFake((target, xml, encoding, callback) => {
        callback();
      });

      const promise = tested.saveDict(jsonDict, target);

      return expect(promise).to.be.eventually.equal(true);
    });
  });

  describe('#list()', () => {
    it('should list only xml files that does not start from `.`', () => {
      sinon.stub(fs, 'readdirSync').callsFake(() => {
        return [
          '.content.xml',
          'some-other.json',
          'eb_gb.xml',
          'de_de.xml',
          'fr.xml',
          'ru.xml'
        ];
      });

      let paths = tested.listDict('./tmp');

      expect(paths).to.be.containingAllOf(['eb_gb.xml', 'de_de.xml', 'fr.xml', 'ru.xml']);
    });
  });

  describe('#exists()', () => {
    it('should return true if dict exists', () => {
      sinon.stub(fs, 'existsSync').callsFake(() => {
        return true;
      });

      expect(tested.exists('./some/path')).to.be.true;
    });
  });
});
