const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiArrays = require('chai-arrays');
const sinon = require('sinon');
const expect = chai.expect;
const TranslateDictionaryService = require('../../src/translate/TranslateDictionaryService');

chai.use(chaiAsPromised);
chai.use(chaiArrays);

function createDict (locale) {
  const dict = {
    'jcr:root': {
      '_attributes': {}
    }
  };
  if (locale) {
    dict['jcr:root']['_attributes']['jcr:language'] = locale;
  }
  return dict;
}

function createEntry (key, value) {
  return {
    'jcr:primaryType': 'sling:MessageEntry',
    'sling:key': key,
    'sling:message': value
  };
}

function addEntry (dict, entry) {
  const key = entry['sling:key'];
  dict['jcr:root'][key] = {};
  dict['jcr:root'][key]['_attributes'] = entry;
}

const mockedTranslationService = {
  translate: async function (key, value, sourceLang, targetLang) {
    return new Promise((resolve) => {
      resolve({
        '_attributes': {
          'jcr:primaryType': 'sling:MessageEntry',
          'sling:key': key,
          'sling:message': `${value} ${targetLang}`
        }
      });
    });
  }
};

describe('TranslateDictionaryService', () => {
  describe('#constructor', () => {
    it('should initialize', () => {
      const tested = new TranslateDictionaryService(mockedTranslationService);

      expect(tested.translateService).not.to.be.null;
    });
  });

  describe('#translate', () => {
    const sourceDict = createDict('en_us');
    addEntry(sourceDict, createEntry('key1', 'value1'));
    addEntry(sourceDict, createEntry('key2', 'value2'));
    addEntry(sourceDict, createEntry('key3', 'value3'));

    it('should translate whole dictionary as target is empty', async () => {
      const targetDict = createDict('de_de');
      const expectedKeys = Object.keys(sourceDict['jcr:root']);

      const tested = new TranslateDictionaryService(mockedTranslationService);

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(4);
      expect(resultKeys).to.be.equalTo(expectedKeys);
    });

    it('should translate part of the dictionary as target has some entries', async () => {
      const targetDict = createDict('de_de');
      addEntry(targetDict, createEntry('key1', 'my own translated value'));
      const expectedKeys = Object.keys(sourceDict['jcr:root']);

      const tested = new TranslateDictionaryService(mockedTranslationService);

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(4);
      expect(resultKeys).to.be.equalTo(expectedKeys);
      expect(translatedDict['jcr:root']['key1']['_attributes']['sling:message']).to.be.equal('my own translated value');
      expect(translatedDict['jcr:root']['key2']['_attributes']['sling:message']).to.be.equal('value2 de');
    });

    it('should fail if locale cannot be extracted from source dict', () => {
      const sourceDict = createDict();
      const targetDict = createDict();

      const tested = new TranslateDictionaryService(mockedTranslationService);
      const promise = tested.translate(sourceDict, targetDict);

      expect(promise).to.be.rejectedWith('Could not extract locale from input dictionary');
    });

    it('should not translate anything as all keys in target are set', () => {
      const targetDict = createDict('de_de');
      addEntry(targetDict, createEntry('key1', 'value1 de'));
      addEntry(targetDict, createEntry('key2', 'value2 de'));
      addEntry(targetDict, createEntry('key3', 'value3 de'));

      let tested = new TranslateDictionaryService(mockedTranslationService);

      return expect(tested.translate(sourceDict, targetDict)).to.be.rejectedWith('No new entries found between \'en_us\' and \'de_de\' dictionaries');
    });

    it('should fail when translation service fails', () => {
      const targetDict = createDict('de_de');

      const mockedTranslationServiceFailure = sinon.mock({
        translate: () => {
          return new Promise((resolve, reject) => {
            resolve({ code: 500 });
          });
        }
      });

      let tested = new TranslateDictionaryService(mockedTranslationServiceFailure);

      return expect(tested.translate(sourceDict, targetDict)).to.be.rejected;
    });
  });
});
