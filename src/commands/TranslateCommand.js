const _ = require('lodash');
const ICommand = require('./ICommand');
const Locale = require('../translate/Locale');

class TranslateCommand extends ICommand {

  constructor(sourceDictionary, targetDictionary, translateService) {
    super();
    this.sourceDictionary = sourceDictionary;
    this.targetDictionary = targetDictionary;
    this.translateService = translateService;
    this.sourceLocale = this.getLocale(sourceDictionary);
    this.targetLocale = this.getLocale(targetDictionary);
  }

  async execute() {
    const sourceEntries = this.getEntries(this.sourceDictionary);
    const targetEntries = this.getEntries(this.targetDictionary);

    // TODO add support for finding difference by sling:key
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
          this.targetDictionary['jcr:root'][key] = await this.translateService.translate(key, value, sourceLang, targetLang);
        } catch (e) {
          reject(e);
        }
      }
      resolve(this.targetDictionary);
    });
  }

  getLocale(dict) {
    const jcrLanguage = dict['jcr:root']['_attributes']['jcr:language'];
    const langCountry = _.split(jcrLanguage, '_');
    return new Locale(langCountry[0], langCountry[1]);
  }

  getEntries(dict) {
    return _.pickBy(dict['jcr:root'], (value, key) => {
      return key !== '_attributes';
    });
  }
}

module.exports = TranslateCommand;
