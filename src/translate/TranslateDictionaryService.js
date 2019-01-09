const Locale = require('./Locale');
const _ = require('lodash');

class TranslateDictionaryService {

  constructor(translateService) {
    this.translateService = translateService;
  }

  async translate(sourceDictionary, targetDictionary) {
    this.sourceLocale = this.getLocale(sourceDictionary);
    this.targetLocale = this.getLocale(targetDictionary);
    this.validateLocale(this.sourceLocale);
    this.validateLocale(this.targetLocale);

    const sourceEntries = this.getEntries(sourceDictionary);
    const targetEntries = this.getEntries(targetDictionary);
    const missingEntries = _.difference(Object.keys(sourceEntries), Object.keys(targetEntries));
    const size = _.size(missingEntries);

    return new Promise(async (resolve, reject) => {
      if (size === 0) {
        reject(`No new entries found between '${this.sourceLocale.getLocaleISOCode()}' and '${this.targetLocale.getLocaleISOCode()}' dictionaries`);
        return;
      }

      for (const key of missingEntries) {
        try {
          const value = sourceEntries[key]['_attributes']['sling:message'];
          const sourceLang = this.sourceLocale.getLanguageCode();
          const targetLang = this.targetLocale.getLanguageCode();
          targetDictionary['jcr:root'][key] = await this.translateService.translate(key, value, sourceLang, targetLang);
        } catch (e) {
          reject(e);
        }
      }
      resolve(targetDictionary);
    });
  }

  getLocale(dict) {
    return Locale.fromLocaleIsoCode(dict['jcr:root']['_attributes']['jcr:language']);
  }

  getEntries(dict) {
    return _.pickBy(dict['jcr:root'], (value, key) => {
      return key !== '_attributes';
    });
  }

  validateLocale(locale) {
    if (locale.getLocaleISOCode() === '') {
      throw new Error('Could not extract locale from input dictionary');
    }
  }
}

module.exports = TranslateDictionaryService;
