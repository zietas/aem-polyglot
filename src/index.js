#!/usr/bin/env node
require('dotenv').config();

const program = require('commander');
const YandexTranslate = require('yandex-translate');

const pkg = require('../package.json');
const DictionaryHandler = require('./DictionaryHandler');
const TranslationLog = require('./translate/TranslationLog');
const YandexTranslateService = require('./translate/YandexTranslateService');
const TranslateCommand = require('./commands/TranslateCommand');
const SortCommand = require('./commands/SortCommand');
const CreateDictionaryCommand = require('./commands/CreateDictionaryCommand');

program
  .version(pkg.version, '-v, --version')
  .description('This tool is designed mainly for developers who are tasked to translate automatically AEM dictionaries into other languages.');

program
  .command('create <targetDir> <language> [country]')
  .description('creates a brand new empty dictionary')
  //  TODO implement in future
  // .option('-f, --force', 'Force create new dictionary. Action will override any existing dictionaries.')
  .action(async (targetDir, language, country, options) => {
    const cmd = new CreateDictionaryCommand(language, country);
    const dict = await cmd.execute();
    const target = `${targetDir}/${cmd.getCountryISOCode()}.xml`;
    await DictionaryHandler.saveDict(dict, target);
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
