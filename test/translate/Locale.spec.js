const chai = require('chai');
const expect = chai.expect;
const Locale = require('../../src/translate/Locale');

describe('Locale', () => {
  describe('#constructor', () => {
    it('should handle case when no country is set', () => {
      const tested = new Locale('en');

      expect(tested.getLanguageCode()).to.be.equal('en');
      expect(tested.getCountryCode()).to.be.an('undefined');
      expect(tested.getLocaleISOCode()).to.be.equal('en');
    });

    it('should handle case when country is set', () => {
      const tested = new Locale('en', 'gb');

      expect(tested.getLanguageCode()).to.be.equal('en');
      expect(tested.getCountryCode()).to.be.equal('gb');
      expect(tested.getLocaleISOCode()).to.be.equal('en_gb');
    });

    it('should handle case when no params are provided', () => {
      const tested = new Locale();

      expect(tested.getLanguageCode()).to.be.an('undefined');
      expect(tested.getCountryCode()).to.be.an('undefined');
      expect(tested.getLocaleISOCode()).to.be.an('undefined');
    });
  });
});
