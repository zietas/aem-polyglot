const _ = require('lodash');
const dictionaryService = require('../dictionaryService');
const translateCommand = require('./translateCommand');
const translationLog = require('../../src/translate/TranslationLog');

async function translateBatchCommand (directory, sourceDict, options) {
  const paths = _.filter(dictionaryService.listDict(directory), (item) => {
    return item !== `${sourceDict}.xml`;
  });

  options = options || {};
  options.disableLogOutput = true;

  try {
    for (const path of paths) {
      await translateCommand(`${directory}/${sourceDict}.xml`, `${directory}/${path}`, options);
    }
    translationLog.print();
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = translateBatchCommand;
