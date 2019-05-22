const fileUtils = require('../fileUtils');
const dictionaryService = require('../dictionaryService');

const ImportService = require('../migrate/CSVImportService');

// TODO add tests for this command
async function importCommand(source, target, options) {
  console.log(`Importing '${source}' to ${target}`);
  const importService = new ImportService(options.separator, options.updateExisting);

  const csv = await fileUtils.readFile(source).catch((reason => {
    console.log(`Failed to read file ${source}`, reason);
    process.exit(0);
  }));

  const dict = await dictionaryService.readDict(target).catch((reason) => {
    console.log(`Failed to read dictionary ${target}`, reason);
    process.exit(0);
  });

  let newDict = importService.import(csv.toString(), dict);
  if (!options.disableSorting) {
    newDict = dictionaryService.sort(newDict);
  }
  await dictionaryService.saveDict(newDict, target).catch((reason) => {
    console.log(`Failed to save dictionary ${target}`, reason);
  });
}

module.exports = importCommand;
