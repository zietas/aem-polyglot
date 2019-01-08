const _ = require('lodash');
const ICommand = require('./ICommand');
const Locale = require('../translate/Locale');

const TEMPLATE = {
  _declaration: {_attributes: {encoding: 'UTF-8', version: '1.0'}},
  'jcr:root':
    {
      _attributes:
        {
          'jcr:language': 'en',
          'jcr:mixinTypes': '[mix:language]',
          'jcr:primaryType': 'sling:Folder',
          'xmlns:jcr': 'http://www.jcp.org/jcr/1.0',
          'xmlns:mix': 'http://www.jcp.org/jcr/mix/1.0',
          'xmlns:sling': 'http://sling.apache.org/jcr/sling/1.0'
        }
    }
};

class CreateDictionaryCommand extends ICommand {
  constructor(language, country) {
    super();
    this.locale = new Locale(language, country);
  }

  async execute() {
    return new Promise((resolve) => {
      const dict = _.cloneDeep(TEMPLATE);
      dict['jcr:root']['_attributes']['jcr:language'] = this.locale.getLocaleISOCode();
      resolve(dict);
    });
  }
}

module.exports = CreateDictionaryCommand;

