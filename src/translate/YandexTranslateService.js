const YandexTranslate = require('yandex-translate');
const TranslateService = require('./TranslateService');
const dictionaryService = require('../dictionaryService');

class YandexTranslateService extends TranslateService {
  constructor (apiKey) {
    super();
    this.service = new YandexTranslate(apiKey);
  }

  async translate (key, text, from, to) {
    return new Promise((resolve, reject) => {
      this.log.addEntry(key, from, text);
      this.service.translate(text, { from, to }, (err, res) => {
        if (err) {
          reject(err);
        } else if (res.code >= 400) {
          reject(res.message);
        } else {
          this.log.addEntry(key, to, res.text[0]);
          resolve(dictionaryService.createEntry(key, res.text[0]));
        }
      });
    });
  }
}

module.exports = YandexTranslateService;
