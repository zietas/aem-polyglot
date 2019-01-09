const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const expect = chai.expect;
const TranslateCommand = require('../../src/commands/TranslateCommand');

chai.use(chaiAsPromised);

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

describe('TranslateCommand', () => {
  describe('#constructor', () => {
    it('should fail if locale cannot be extracted from source dict', () => {
      const sourceDict = createDict();
      const targetDict = createDict();

      expect(() => {
        new TranslateCommand(sourceDict, targetDict, null);
      }).to.throw('Could not extract locale from input dictionary');
    });

    it('should initialize correctly if locale is provided', () => {
      const sourceDict = createDict('en_us');
      const targetDict = createDict('de_de');

      const tested = new TranslateCommand(sourceDict, targetDict, null);

      expect(tested.sourceLocale.getLocaleISOCode()).to.be.equal('en_us');
      expect(tested.targetLocale.getLocaleISOCode()).to.be.equal('de_de');
    });
  });

  describe('#execute', () => {
    const sourceDict = createDict('en_us');
    addEntry(sourceDict, createEntry('key1', 'value1'));
    addEntry(sourceDict, createEntry('key2', 'value2'));
    addEntry(sourceDict, createEntry('key3', 'value3'));

    const mockedTranslationService = sinon.mock({
      translate: async function (key, value, sourceLang, targetLang) {
        return new Promise((resolve) => {
          resolve({ text: [`${value} ${targetLang}`] });
        });
      }
    });

    // TODO cover
    // it('should translate whole dictionary as target is empty', (done) => {
    //   const targetDict = createDict('de_de');
    //
    //   let tested = new TranslateCommand(sourceDict, targetDict, mockedTranslationService);
    //
    //   return tested.execute()
    //     .then((dict) => {
    //
    //
    //       expect(dict['jcr:root']['_attributes']['jcr:language']).to.be.equal('de_de');
    //       done();
    //     });
    // });
    //
    // it('should translate part of the dictionary as target has some entries', () => {
    //
    // });

    it('should not translate anything as all keys in target are set', () => {
      const targetDict = createDict('de_de');
      addEntry(targetDict, createEntry('key1', 'value1 de'));
      addEntry(targetDict, createEntry('key2', 'value2 de'));
      addEntry(targetDict, createEntry('key3', 'value3 de'));

      let tested = new TranslateCommand(sourceDict, targetDict, mockedTranslationService);

      return expect(tested.execute()).to.be.rejectedWith('No new entries found between \'en_us\' and \'de_de\' dictionaries');
    });

    it('should fail when translation service fails', () => {
      const targetDict = createDict('de_de');

      const mockedTranslationServiceFailure = sinon.mock({
        translate: () => {
          return new Promise((resolv, reject) => {
            reject({ code: 500 });
          });
        }
      });

      let tested = new TranslateCommand(sourceDict, targetDict, mockedTranslationServiceFailure);

      return expect(tested.execute()).to.be.rejected;
    });
  });
});
