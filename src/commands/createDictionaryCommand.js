const Locale = require('../translate/Locale');
const dictionaryService = require('../dictionaryService');

async function createDictionaryCommand(targetDir, locales, options) {
  if(!dictionaryService.exists(targetDir)){
    console.log('Target directory does not exists');
    return;
  }

  for (const localeString of locales) {
    const target = `${targetDir}/${localeString}.xml`;
    if (!dictionaryService.exists(target) || options.force) {
      console.log(`Creating new dict '${target}'`);
      if (options.force) {
        console.log(`Overwriting dictionary under path '${target}'`);
      }
      const locale = Locale.fromLocaleIsoCode(localeString);
      await dictionaryService.saveDict(dictionaryService.create(locale), target);
    } else {
      console.log(`Dictionary under path '${target}' exists - skipping.`);
    }
  }
}

module.exports = createDictionaryCommand;
