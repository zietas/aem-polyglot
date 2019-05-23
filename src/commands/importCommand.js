const fileUtils = require('../fileUtils');
const dictionaryService = require('../dictionaryService');

const ImportService = require('../migrate/CSVImportService');

async function importCommand (source, target, options) {
  console.log(`Importing '${source}' to ${target}`);
  const importService = new ImportService(options.separator, options.updateExisting);

  let csv = null;
  let dict = null;

  try {
    csv = await fileUtils.readFile(source);
  } catch (e) {
    console.log(`Failed to read file '${source}'`, e.message);
    return;
  }

  try {
    dict = await dictionaryService.readDict(target);
  } catch (e) {
    console.log(`Failed to read dictionary '${target}'`, e.message);
    return;
  }

  let newDict = importService.import(csv.toString(), dict);
  if (!options.disableSorting) {
    newDict = dictionaryService.sort(newDict);
  }

  try {
    await dictionaryService.saveDict(newDict, target);
  } catch (e) {
    console.log(`Failed to save dictionary '${target}'`, e.message);
  }
}

module.exports = importCommand;
