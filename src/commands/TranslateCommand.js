const YandexTranslate = require('yandex-translate');
const _ = require('lodash');
const ICommand = require('./ICommand');

class TranslateCommand extends ICommand {

  constructor(sourceDictionary, targetDictionary, translationLog, yandexApiKey) {
    super();
    this.translationLog = translationLog;
    this.sourceDictionary = sourceDictionary;
    this.targetDictionary = targetDictionary;
    this.sourceLanguage = this.getLanguage(sourceDictionary);
    this.targetLanguage = this.getLanguage(targetDictionary);
    this.translator = YandexTranslate(yandexApiKey);
  }

  async execute() {
    const sourceEntries = this.getEntries(this.sourceDictionary);
    const targetEntries = this.getEntries(this.targetDictionary);
    const missingEntries = _.differenceBy(sourceEntries, targetEntries, 'name');
    const size = _.size(missingEntries);

    let processedCounter = 0;

    return new Promise((resolve) => {
      if (size > 0) {
        for (const entry of missingEntries) {
          const newEntry = _.cloneDeep(entry);
          const toTranslate = newEntry['attributes']['sling:message'];
          targetEntries.push(newEntry);
          this.translationLog.addEntry(newEntry['name'], this.sourceLanguage, toTranslate);
          this.translator.translate(toTranslate, {to: this.targetLanguage}, (err, res) => {
            if (err) throw err;
            newEntry['attributes']['sling:message'] = res.text[0];
            this.translationLog.addEntry(newEntry['name'], this.targetLanguage, res.text[0]);
            processedCounter++;
            if (processedCounter === size) {
              resolve(this.targetDictionary);
            }
          });
        }
      } else {
        throw new Error('No differences found');
      }
    });
  }

  getLanguage(dict) {
    const jcrRoot = this.getJcrRoot(dict);
    const langCountry = _.split(jcrRoot['attributes']['jcr:language'], '_');
    return langCountry[0];
  }

  getEntries(dict) {
    const jcrRoot = this.getJcrRoot(dict);
    if (!jcrRoot['elements']) {
      jcrRoot['elements'] = [];
    }
    return jcrRoot['elements'];
  }

  getJcrRoot(dict) {
    return _.find(dict['elements'], {name: 'jcr:root'});
  }
}

module.exports = TranslateCommand;
