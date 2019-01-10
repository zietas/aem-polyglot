const sortCommand = require('./sortCommand');
const dictionaryService = require('../dictionaryService');

async function sortBatchCommand (directory) {
  console.log(`Starting batch sort on '${directory}'`);

  const files = dictionaryService.listDict(directory);
  for (const file of files) {
    await sortCommand(`${directory}/${file}`);
  }
}

module.exports = sortBatchCommand;
