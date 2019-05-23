const fs = require('fs');
const fileUtils = require('../fileUtils');
const dictionaryService = require('../dictionaryService');

const ExportService = require('../migrate/CSVExportService');

// TODO add tests for this command
async function exportCommand (sourceDictionaries, options) {
  console.log(`Exporting '${sourceDictionaries}' to ${options.targetFile}`);

  const dicts = sourceDictionaries.split(',')
    .filter(fs.existsSync)
    .filter((path) => fs.lstatSync(path).isFile());

  const exportService = new ExportService(options.separator);
  const toExport = [];

  await Promise.all(dicts.map(async (file) => {
    toExport.push(await dictionaryService.readDict(file));
  }));

  const csv = exportService.export(toExport);

  await fileUtils.writeFile(options.targetFile, csv)
    .catch((reason) => {
      console.log(`Failed to open ${options.targetFile}`, reason);
    });
}

module.exports = exportCommand;
