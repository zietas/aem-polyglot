const chai = require('chai');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const Locale = require('../../src/translate/Locale');
const CSVExportService = require('../../src/migrate/CSVExportService');

describe('CSVExportService', () => {
  describe('#construct', () => {
    it('should set provided separator', () => {
      const separator = '\t';

      const t = new CSVExportService(separator);

      expect(t.separator).to.be.equal(separator);
    });

    it('should fallback to default separator', () => {
      const t = new CSVExportService();

      expect(t.separator).to.be.equal(';');
    });
  });

  describe('#export', () => {
    function createDictionary (language, country, keyCount) {
      const locale = new Locale(language, country);
      const dict = dictionaryService.create(locale);
      for (let i = 0; i < keyCount; i++) {
        dictionaryService.putEntry(dict, `key.${i}`, `value ${i} ${locale.getLocaleISOCode()}`);
      }
      return dict;
    }

    function getRows (csv) {
      return csv
        .replace(/\r/gm, '')
        .split('\n')
        .filter((row) => !!row);
    }

    beforeEach(() => {
      this.tested = new CSVExportService();
    });

    afterEach(() => {
      this.tested = null;
    });

    it('should export a single dictionary to csv', () => {
      const enDict = createDictionary('en', 'gb', 10);

      const csv = this.tested.export([enDict]);
      const rows = getRows(csv);

      expect(rows[0]).to.be.equal('key;en_gb');
      expect(rows[1]).to.be.equal('key.0;value 0 en_gb');
      expect(rows[10]).to.be.equal('key.9;value 9 en_gb');
      expect(rows[11]).to.be.undefined;
    });

    it('should export a multiple dictionaries to csv', () => {
      const enDict = createDictionary('en', 'gb', 5);
      const frDict = createDictionary('fr', 'fr', 10);
      const deDict = createDictionary('de', 'de', 15);

      const csv = this.tested.export([enDict, frDict, deDict]);
      const rows = getRows(csv);

      expect(rows[0]).to.be.equal('key;de_de;en_gb;fr_fr');
      expect(rows[1]).to.be.equal('key.0;value 0 de_de;value 0 en_gb;value 0 fr_fr');
      expect(rows[2]).to.be.equal('key.1;value 1 de_de;value 1 en_gb;value 1 fr_fr');
      expect(rows[3]).to.be.equal('key.10;value 10 de_de;;');
      expect(rows[4]).to.be.equal('key.11;value 11 de_de;;');
      expect(rows[5]).to.be.equal('key.12;value 12 de_de;;');
      expect(rows[6]).to.be.equal('key.13;value 13 de_de;;');
      expect(rows[7]).to.be.equal('key.14;value 14 de_de;;');
      expect(rows[8]).to.be.equal('key.2;value 2 de_de;value 2 en_gb;value 2 fr_fr');
      expect(rows[9]).to.be.equal('key.3;value 3 de_de;value 3 en_gb;value 3 fr_fr');
      expect(rows[10]).to.be.equal('key.4;value 4 de_de;value 4 en_gb;value 4 fr_fr');
      expect(rows[11]).to.be.equal('key.5;value 5 de_de;;value 5 fr_fr');
      expect(rows[12]).to.be.equal('key.6;value 6 de_de;;value 6 fr_fr');
      expect(rows[13]).to.be.equal('key.7;value 7 de_de;;value 7 fr_fr');
      expect(rows[14]).to.be.equal('key.8;value 8 de_de;;value 8 fr_fr');
      expect(rows[15]).to.be.equal('key.9;value 9 de_de;;value 9 fr_fr');
      expect(rows[16]).to.be.undefined;
    });

    it('should throw error when jcr:language is not defined', () => {
      const enDict = createDictionary('en', 'gb', 5);
      delete enDict['jcr:root']['_attributes']['jcr:language'];

      expect(() => this.tested.export([enDict])).to.throw('Failed to get language from dictionary');
    });

    it('should fallback to key name when sling:key not defined for entry', () => {
      const enDict = createDictionary('en', 'gb', 1);
      delete enDict['jcr:root']['key.0']['_attributes']['sling:key'];

      const csv = this.tested.export([enDict]);
      const rows = getRows(csv);

      expect(rows[0]).to.be.equal('key;en_gb');
      expect(rows[1]).to.be.equal('key.0;value 0 en_gb');
    });

    it('should fallback to empty string when no translation available for given lang', () => {
      const enDict = createDictionary('en', 'gb', 1);
      const frDict = createDictionary('fr', 'fr', 1);
      delete frDict['jcr:root']['key.0']['_attributes']['sling:message'];

      const csv = this.tested.export([enDict, frDict]);
      const rows = getRows(csv);

      expect(rows[0]).to.be.equal('key;en_gb;fr_fr');
      expect(rows[1]).to.be.equal('key.0;value 0 en_gb;');
    });
  });
});
