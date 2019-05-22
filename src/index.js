require('dotenv').config();

const program = require('commander');
const pkg = require('../package.json');

const createDictionaryCommand = require('./commands/createDictionaryCommand');
const addDictionaryEntryCommand = require('./commands/addDictionaryEntryCommand');
const sortCommand = require('./commands/sortCommand');
const sortBatchCommand = require('./commands/sortBatchCommand');
const translateCommand = require('./commands/translateCommand');
const translateBatchCommand = require('./commands/translateBatchCommand');
const exportCommand = require('./commands/exportCommand');
const importCommand = require('./commands/importCommand');

program
  .version(pkg.version, '-v, --version')
  .description('This tool is designed mainly for developers who are tasked to translate automatically AEM dictionaries into other languages.');

program
  .command('create <targetDir> [locales...]')
  .description('creates a brand new empty dictionary')
  .option('-f, --force', 'Force create new dictionary. Action will override any existing dictionaries.')
  .action(createDictionaryCommand);

program
  .command('add-entry <target> <key> <value>')
  .description('creates a brand new dictionary entry')
  .option('-f, --force', 'Force create new dictionary entry, overwriting an existing one.')
  .option('--disableSorting', 'Disable dictionary sorting')
  .action(addDictionaryEntryCommand);

program
  .command('sort <source>')
  .description('sorts entries in provided dictionary')
  .action(sortCommand);

program
  .command('sort-batch <directory>')
  .description('sorts all dictionaries found in given directory')
  .action(sortBatchCommand);

program
  .command('translate <source> <target>')
  .description('based on master dictionary <source> it searches for missing keys in <target> dictionary and translates them')
  .option('--disableSorting', 'Disable dictionary sorting')
  .option('--yandexApiKey <key>', 'Yandex API Key')
  .option('--keys <key>', 'A comma separated list of dictionaries keys. I.e. --keys=key1,key2,key3')
  .action(translateCommand);

program
  .command('translate-batch <directory> <sourceDict>')
  .description('batch translates all dictionaries in a <directory> based on defined <sourceDict>')
  .option('--disableSorting', 'Disable dictionary sorting')
  .option('--yandexApiKey <key>', 'Yandex API Key')
  .option('--keys <key>', 'A comma separated list of dictionaries keys. I.e. --keys=key1,key2,key3')
  .action(translateBatchCommand);

program
  .command('export <sourceDictionaries>')
  .description('Exports defined set of comma-separated dictionaries to CSV format. ')
  .option('-t, --targetFile [file]', 'Defines the name of the file where the data is exported', './export.csv')
  .option('-s, --separator [separator]', 'Defines separator used by exporter. Defaults to semicolon.', ';')
  .action(exportCommand);

program
  .command('import <source> <target>')
  .description('Imports entries from csv to a target dictionary')
  .option('-u, --updateExisting', 'Enforces script to only update existing keys in dictionary. No new entries will be added. ')
  .option('-s, --separator [separator]', 'Defines separator used by importer. Defaults to semicolon.', ';')
  .option('--disableSorting', 'Disable dictionary sorting')
  .action(importCommand);

program.parse(process.argv);
