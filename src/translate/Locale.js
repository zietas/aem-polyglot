class Locale {
  constructor(language, country) {
    this.language = language;
    this.country = country;
  }

  getLanguageCode() {
    return this.language;
  }

  getCountryCode() {
    return this.country;
  }

  getLocaleISOCode() {
    let result = this.language;
    if (this.country) {
      result += '_' + this.country;
    }
    return result;
  }
}

module.exports = Locale;
