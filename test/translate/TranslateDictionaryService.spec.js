const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiArrays = require('chai-arrays');
const sinon = require('sinon');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const Locale = require('../../src/translate/Locale');
const TranslateDictionaryService = require('../../src/translate/TranslateDictionaryService');

chai.use(chaiAsPromised);
chai.use(chaiArrays);

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
    const sourceDict = dictionaryService.create(new Locale('en', 'us'));
    dictionaryService.putEntry(sourceDict, 'key1', 'value1');
    dictionaryService.putEntry(sourceDict, 'key2', 'value2');
    dictionaryService.putEntry(sourceDict, 'key3', 'value3');

    it('should translate whole dictionary as target is empty', async () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      const expectedKeys = Object.keys(sourceDict['jcr:root']);

      const tested = new TranslateDictionaryService(mockedTranslationService);

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(4);
      expect(resultKeys).to.be.equalTo(expectedKeys);
    });

    it('should translate only defined key', async () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      const expectedKeys = ['_attributes', 'key1'];

      const tested = new TranslateDictionaryService(mockedTranslationService, {keys: 'key1'});

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(2);
      expect(resultKeys).to.be.equalTo(expectedKeys);
    });

    it('should translate only defined keys', async () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      const expectedKeys = ['_attributes', 'key1', 'key2'];

      const tested = new TranslateDictionaryService(mockedTranslationService, {keys: 'key1,key2'});

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(3);
      expect(resultKeys).to.be.equalTo(expectedKeys);
    });

    it('should  not translate keys that are not defined in source dict', async () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      const expectedKeys = ['_attributes', 'key3'];

      const tested = new TranslateDictionaryService(mockedTranslationService, {keys: 'key3,key22,key45,nonExistingKey'});

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(2);
      expect(resultKeys).to.be.equalTo(expectedKeys);
    });

    it('should translate part of the dictionary as target has some entries', async () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      dictionaryService.putEntry(targetDict, 'key1', 'my own translated value');
      const expectedKeys = Object.keys(sourceDict['jcr:root']);

      const tested = new TranslateDictionaryService(mockedTranslationService);

      const translatedDict = await tested.translate(sourceDict, targetDict);

      const resultKeys = Object.keys(translatedDict['jcr:root']);
      expect(resultKeys).to.be.ofSize(4);
      expect(resultKeys).to.be.equalTo(expectedKeys);
      expect(translatedDict['jcr:root']['key1']['_attributes']['sling:message']).to.be.equal('my own translated value');
      expect(translatedDict['jcr:root']['key2']['_attributes']['sling:message']).to.be.equal('value2 de');
    });

    it('should fail if locale cannot be extracted from source dict', async () => {
      const sourceDict = dictionaryService.create(new Locale('de', 'de'));
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      delete sourceDict['jcr:root']['_attributes']['jcr:language'];

      const tested = new TranslateDictionaryService(mockedTranslationService);

      await expect(tested.translate(sourceDict, targetDict)).to.be.rejectedWith('Could not extract locale from input dictionary');
    });

    it('should not translate anything as all keys in target are set', async () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));
      dictionaryService.putEntry(targetDict, 'key1', 'value1 de');
      dictionaryService.putEntry(targetDict, 'key2', 'value2 de');
      dictionaryService.putEntry(targetDict, 'key3', 'value3 de');

      let tested = new TranslateDictionaryService(mockedTranslationService);

      await expect(tested.translate(sourceDict, targetDict)).to.be.rejectedWith('No new entries found between \'en_us\' and \'de_de\' dictionaries');
    });

    it('should fail when translation service fails', () => {
      const targetDict = dictionaryService.create(new Locale('de', 'de'));

      const mockedTranslationServiceFailure = sinon.mock({
        translate: () => {
          return new Promise((resolve, reject) => {
            resolve({code: 500});
          });
        }
      });

      let tested = new TranslateDictionaryService(mockedTranslationServiceFailure);

      return expect(tested.translate(sourceDict, targetDict)).to.be.rejected;
    });
  });
});
