#!/usr/bin/env node
require('dotenv').config();

const program = require('commander');
const pkg = require('../package.json');
const DictionaryHandler = require('./DictionaryHandler');
const YandexTranslateService = require('./translate/YandexTranslateService');
const TranslateCommand = require('./commands/TranslateCommand');
const SortCommand = require('./commands/SortCommand');
const CreateDictionaryCommand = require('./commands/CreateDictionaryCommand');

program
  .version(pkg.version, '-v, --version')
  .description('This tool is designed mainly for developers who are tasked to translate automatically AEM dictionaries into other languages.');

program
  .command('create <targetDir> [locales...]')
  .description('creates a brand new empty dictionary')
  .option('-f, --force', 'Force create new dictionary. Action will override any existing dictionaries.')
  .action(async (targetDir, locales, options) => {
    for (const locale of locales) {
      const target = `${targetDir}/${locale}.xml`;

      if (!DictionaryHandler.exists(target) || options.force) {
        if (options.force) {
          console.log(`Overwriting dictionary under path '${target}'`);
        }
        const cmd = new CreateDictionaryCommand(locale);
        const dict = await cmd.execute();
        await DictionaryHandler.saveDict(dict, target);
      } else {
        console.warn(`Dictionary under path '${target}' exists. Skipping creation`);
      }
    }
  });

program
  .command('sort <source>')
  .description('sorts entries in provided dictionary')
  .action(async (source) => {
    const sourceDict = await DictionaryHandler.readDict(source);
    const cmd = new SortCommand(sourceDict);
    const sortedDict = await cmd.execute();
    await DictionaryHandler.saveDict(sortedDict, source);
  });

program
  .command('translate <source> <target>')
  .description('based on master dictionary <source> it searches for missing keys in <target> dictionary and translates them')
  // TODO implement in future
  // .option('disableSorting', 'Disable dictionary sorting')
  .option('yandexApiKey', 'Yandex API Key')
  .action(async (source, target, options) => {
    const translateService = new YandexTranslateService(process.env.YANDEX_API_KEY || options.yandexApiKey);

    const sourceDict = await DictionaryHandler.readDict(source);
    const targetDict = await DictionaryHandler.readDict(target);
    const translateCmd = new TranslateCommand(sourceDict, targetDict, translateService);

    translateCmd.execute()
      .then((translatedDict) => {
        DictionaryHandler.saveDict(translatedDict, target);
        translateService.log.print();
      })
      .catch((err) => {
        console.log(err);
      });
  });

program.parse(process.argv);
