#!/usr/bin/env node
require('dotenv').config();

const program = require('commander');
const pkg = require('../package.json');

const createDictionaryCommand = require('./commands/createDictionaryCommand');
const sortCommand = require('./commands/sortCommand');
const sortBatchCommand = require('./commands/sortBatchCommand');
const translateCommand = require('./commands/translateCommand');
const translateBatchCommand = require('./commands/translateBatchCommand');
program
  .version(pkg.version, '-v, --version')
  .description('This tool is designed mainly for developers who are tasked to translate automatically AEM dictionaries into other languages.');

program
  .command('create <targetDir> [locales...]')
  .description('creates a brand new empty dictionary')
  .option('-f, --force', 'Force create new dictionary. Action will override any existing dictionaries.')
  .action(createDictionaryCommand);

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
  .action(translateCommand);

program
  .command('translate-batch <directory> <sourceDict>')
  .description('batch translates all dictionaries in a <directory> based on defined <sourceDict>')
  .option('--disableSorting', 'Disable dictionary sorting')
  .option('--yandexApiKey <key>', 'Yandex API Key')
  .action(translateBatchCommand);

program.parse(process.argv);
