class TranslationLog {
  constructor() {
    this.log = {};
  }

  addEntry(key, lang, translation) {
    this.log[key] = this.log[key] || {};
    this.log[key][lang] = translation;
  }

  getEntry(key) {
    return this.log[key];
  }

  getLog() {
    return this.log;
  }

  print(){
    for (const key in this.log) {
      console.log(`- ${key}`);
      for (const lang in this.log[key]) {
        console.log(`-- ${lang} -> ${this.log[key][lang]}`);
      }
    }
  }
}

module.exports = TranslationLog;
