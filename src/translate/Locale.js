const _ = require('lodash');

class Locale {
  static fromLocaleIsoCode (localeIso) {
    const langCountry = _.split(localeIso, '_');
    return new Locale(langCountry[0], langCountry[1]);
  }

  constructor (language, country) {
    this.language = language;
    this.country = country;
  }

  getLanguageCode () {
    return this.language;
  }

  getCountryCode () {
    return this.country;
  }

  getLocaleISOCode () {
    let result = this.language;
    if (this.country) {
      result += '_' + this.country;
    }
    return result;
  }
}

module.exports = Locale;
