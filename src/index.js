#!/usr/bin/env node
require('dotenv').config();

const program = require('commander');
const pkg = require('../package.json');
const DictionaryHandler = require('./DictionaryHandler');
const TranslateCommand = require('./commands/TranslateCommand');
const TranslationLog = require('./TranslationLog');

program
  .version(pkg.version, '-v, --version')
  .description('TODO add description');

program
  .command('translate <source> <target>')
  .alias('t')
  .action(async (source, target) => {
    const translationLog = new TranslationLog();
    const sourceDict = await DictionaryHandler.readDict(source);
    const targetDict = await DictionaryHandler.readDict(target);
    const cmd = new TranslateCommand(sourceDict, targetDict, translationLog, process.env.YANDEX_API_KEY);

    try {
      const translatedDict = await cmd.execute();
      await DictionaryHandler.saveDict(translatedDict, target);
      translationLog.print();
    } catch (e) {
      console.log(e.message);
    }
  });

program.parse(process.argv);
