class TranslationLog {
  constructor () {
    this.log = {};
  }

  addEntry (key, lang, translation) {
    this.log[key] = this.log[key] || {};
    this.log[key][lang] = translation;
  }

  getEntry (key) {
    return this.log[key];
  }

  getLog () {
    return this.log;
  }

  clear () {
    this.log = {};
  }

  // TODO maybe one day we should create translation reporter to have an easy ability to switch output format
  print () {
    for (const key in this.log) {
      console.log(`- ${key}`);
      for (const lang in this.log[key]) {
        console.log(`-- ${lang} -> ${this.log[key][lang]}`);
      }
    }
  }
}

module.exports = new TranslationLog();
