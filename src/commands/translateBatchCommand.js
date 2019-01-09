const _ = require('lodash');
const dictionaryService = require('../dictionaryService');
const translateCommand = require('./translateCommand');

async function translateBatchCommand(directory, sourceDict, options) {
  const paths = _.filter(dictionaryService.listDict(directory), (item) => {
    return item !== `${sourceDict}.xml`
  });

  try {
    for (const path of paths) {
      await translateCommand(`${directory}/${sourceDict}.xml`, `${directory}/${path}`, options);
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = translateBatchCommand;
