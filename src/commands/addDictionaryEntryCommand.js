const dictionaryService = require('../dictionaryService');

function createEntry (key, value) {
  return {
    '_attributes': {
      'jcr:priaryType': 'sling:MessageEntry',
      'sling:key': key,
      'sling:message': value
    }
  };
}

async function addDictionaryEntryCommand (target, key, value, options) {
  try {
    let dict = await dictionaryService.readDict(target);
    if (!dict['jcr:root'][key] || options.force) {
      console.log(`Adding new entry to '${target}'`);
      dict['jcr:root'][key] = createEntry(key, value);

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
