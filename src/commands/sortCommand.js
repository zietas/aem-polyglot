const dictionaryService = require('../dictionaryService')

async function sortCommand(source) {
  console.log(`Sorting '${source}'`);
  const sourceDict = await dictionaryService.readDict(source);
  const sortedDict = dictionaryService.sort(sourceDict);
  await dictionaryService.saveDict(sortedDict, source);
}

module.exports = sortCommand;
