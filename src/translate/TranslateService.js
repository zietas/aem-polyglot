const translationLog = require('./TranslationLog');

class TranslateService {
  constructor () {
    this.log = translationLog;
  }

  async translate (key, text, from, to) {
    return new Promise(() => {
      throw new Error('Not implemented');
    });
  }
}

module.exports = TranslateService;
