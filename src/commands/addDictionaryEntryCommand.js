const dictionaryService = require('../dictionaryService');
const dictionaryUtils = require('../dictionaryUtils');

async function addDictionaryEntryCommand (target, key, value, options) {
  try {
    let dict = await dictionaryService.readDict(target);
    if (!dict['jcr:root'][key] || options.force) {
      console.log(`Adding new entry to '${target}'`);
      dict['jcr:root'][key] = dictionaryUtils.createEntry(key, value);

      if (!options.disableSorting) {
        dict = dictionaryService.sort(dict);
      }

      await dictionaryService.saveDict(dict, target);
    } else {
      console.log(`Entry with key ${key} already exists. Skipping.`);
    }
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = addDictionaryEntryCommand;
