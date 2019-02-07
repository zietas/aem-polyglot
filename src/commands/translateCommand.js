const dictionaryService = require('../dictionaryService');
const YandexTranslateService = require('../translate/YandexTranslateService');
const TranslateDictionaryService = require('../translate/TranslateDictionaryService');

async function translateCommand (source, target, options) {
  const apiKey = process.env.YANDEX_API_KEY || options.yandexApiKey;
  if (!apiKey) {
    console.log('Yandex API key is not defined');
    return;
  }
  try {
    console.log(`Translating '${target}'`);
    const sourceDict = await dictionaryService.readDict(source);
    const targetDict = await dictionaryService.readDict(target);
    const translationService = new YandexTranslateService(apiKey);
    const translateDictionaryService = new TranslateDictionaryService(translationService, {
      keys: options.keys
    });

    let translatedDict = await translateDictionaryService.translate(sourceDict, targetDict);
    if (!options.disableSorting) {
      translatedDict = dictionaryService.sort(translatedDict);
    }
    await dictionaryService.saveDict(translatedDict, target);
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = translateCommand;
