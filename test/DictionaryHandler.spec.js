const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');

const DictionaryHandler = require('../src/DictionaryHandler');

chai.use(chaiAsPromised);

describe('DictionaryHandler', () => {

  describe('#readDict()', () => {
    it('should throw error when file does not exists', () => {
      const source = './test/resources/not-existing-file';

      const promise = DictionaryHandler.readDict(source);

      return expect(promise).to.be.rejectedWith('ENOENT: no such file or directory');
    });

    it('should throw error when not an XML file is provided', () => {
      const source = './test/resources/en_gb-not-an-xml-file.xml';

      const promise = DictionaryHandler.readDict(source);

      return expect(promise).to.be.rejectedWith('Text data outside of root node');
    });

    it('should throw error XML is invalid', () => {
      const source = './test/resources/en_gb-invalid.xml';

      const promise = DictionaryHandler.readDict(source);

      return expect(promise).to.be.rejectedWith('Unexpected close tag');
    });

    it('should return XML converted into JS object', () => {
      const source = './test/resources/en_gb.xml';

      const promise = DictionaryHandler.readDict(source);

      return promise.then((dict) => {
        expect(dict).not.to.be.a('null');
        expect(dict).to.have.own.property('jcr:root');
        expect(dict).to.have.own.property('_declaration');
      });
    });
  });

  describe('#saveDict()', () => {
    const fsWriteFile = sinon.stub(fs, 'writeFile');

    it('should throw error when dictionary JS is invalid', () => {
      const jsonDict = 'not a dictionary';

      const promise = DictionaryHandler.saveDict(jsonDict);

      return expect(promise).to.be.rejectedWith('Given dictionary is not an object');
    });

    it('should throw error when dictionary JS has no declaration node', () => {
      const jsonDict = {elements: []};

      const promise = DictionaryHandler.saveDict(jsonDict);

      return expect(promise).to.be.rejectedWith('Given dictionary is not an object');
    });

    it('should throw error when fails to save', () => {
      const jsonDict = {'jcr:root': [], '_declaration': []};
      fsWriteFile.callsFake(() => {
        throw 'Failed to open file';
      });

      const promise = DictionaryHandler.saveDict(jsonDict);

      return expect(promise).to.be.rejectedWith('Failed to open file');
    });
  });
});
