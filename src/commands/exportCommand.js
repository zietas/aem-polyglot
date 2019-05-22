const fs = require('fs');
const dictionaryService = require('../dictionaryService');

const ExportService = require('../migrate/CSVExportService');

// TODO add tests for this command
async function exportCommand(sourceDictionaries, options) {
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

  fs.writeFile(options.targetFile, csv, (err) => {
    if(err) {
      return console.log(err);
    }
    console.log("Export complete!");
  });
}

module.exports = exportCommand;
