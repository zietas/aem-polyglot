const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const Locale = require('../../src/translate/Locale');
const CSVImportService = require('../../src/migrate/CSVImportService');

chai.use(sinonChai);
chai.use(chaiArrays);

describe('CSVImportService', () => {
  describe('#construct', () => {
    it('should set provided separator', () => {
      const separator = '\t';
      const updateExisting = true;

      const t = new CSVImportService(separator, updateExisting);

      expect(t.separator).to.be.equal(separator);
      expect(t.updateExisting).to.be.equal(updateExisting);
    });

    it('should fallback to default separator', () => {
      const t = new CSVImportService();

      expect(t.separator).to.be.equal(';');
      expect(t.updateExisting).to.be.false;
    });
  });

  describe('#import', () => {
    beforeEach(() => {
      this.consoleSpy = sinon.spy(console, 'log');
    });

    afterEach(() => {
      this.consoleSpy.restore();
    });

    function createDictionary (language, country, keyCount) {
      const locale = new Locale(language, country);
      const dict = dictionaryService.create(locale);
      for (let i = 0; i < keyCount; i++) {
        dictionaryService.putEntry(dict, `key.${i}`, `value ${i} ${locale.getLocaleISOCode()}`);
      }
      return dict;
    }

    function createCSV (languages, keyCount, prefix) {
      prefix = prefix || '';
      const matrix = [];
      const firstRow = ['key'];
      languages.forEach((lang) => firstRow.push(lang));
      matrix.push(firstRow);

      for (let i = 0; i < keyCount; i++) {
        const row = [`key.${i}`];
        languages.forEach((lang) => row.push(`${prefix}value ${i} ${lang}`));
        matrix.push(row);
      }

      let csv = '';
      matrix.forEach((row) => {
        csv += row.join(';') + '\r\n';
      });
      return csv;
    }

    function getDictionaryKeys (dictionary) {
      return Object.keys(dictionary['jcr:root'])
        .filter((item) => item !== '_attributes');
    }

    it('should throw error when csv does not contain target language', () => {
      const dictionary = createDictionary('en', 'gb', 5);
      const csv = createCSV(['de_de'], 5);
      const tested = new CSVImportService();

      expect(() => tested.import(csv, dictionary)).to.throw(`Provided CSV does not contain translations for 'en_gb'`);
    });

    it('should not alter anything when not changes found', () => {
      const dictionary = createDictionary('en', 'gb', 5);
      const csv = createCSV(['en_gb'], 5);
      const tested = new CSVImportService();

      tested.import(csv, dictionary);

      for (let i = 0; i < 5; i++) {
        expect(this.consoleSpy).to.have.been.calledWith(`- skipping key 'key.${i}'`);
      }
    });

    it('should only update existing entries', () => {
      const dictionary = createDictionary('en', 'gb', 5);
      const csv = createCSV(['en_gb'], 10, 'new');
      const tested = new CSVImportService(';', true);

      const result = tested.import(csv, dictionary);

      const keys = getDictionaryKeys(result);

      expect(keys).to.be.ofSize(5);
      expect(keys).to.be.equalTo(['key.0', 'key.1', 'key.2', 'key.3', 'key.4']);

      for (let i = 0; i < 5; i++) {
        expect(this.consoleSpy).to.have.been.calledWith(`- updating key 'key.${i} -> newvalue ${i} en_gb'`);
      }
    });

    it('should add new entries to dictionary when provided', () => {
      const dictionary = createDictionary('en', 'gb', 5);
      const csv = createCSV(['en_gb'], 10, 'new');
      const tested = new CSVImportService();

      const result = tested.import(csv, dictionary);
      const keys = getDictionaryKeys(result);

      expect(keys).to.be.ofSize(10);

      for (let i = 0; i < 5; i++) {
        expect(this.consoleSpy).to.have.been.calledWith(`- updating key 'key.${i} -> newvalue ${i} en_gb'`);
      }
      for (let i = 5; i < 10; i++) {
        expect(this.consoleSpy).to.have.been.calledWith(`- adding new key 'key.${i} -> newvalue ${i} en_gb'`);
      }
    });

    it('should handle empty values from CSV', () => {
      const tested = new CSVImportService();
      const dictionary = createDictionary('en', 'gb', 1);
      let csv = '';
      csv += 'key;en_gb\r\n';
      csv += 'key.0;\r\n';

      const result = tested.import(csv, dictionary);

      expect(this.consoleSpy).to.have.been.calledWith(`- updating key 'key.0 -> '`);
      expect(result['jcr:root']['key.0']['_attributes']['sling:message']).to.be.equal('');
    });
  });
});
