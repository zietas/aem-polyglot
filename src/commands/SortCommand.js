const ICommand = require('./ICommand');
const alphabetize = require('alphabetize-object-keys');

class SortCommand extends ICommand {
  constructor(sourceDictionary) {
    super();
    this.sourceDictionary = sourceDictionary;
  }

  async execute() {
    return new Promise((resolve) => {
      resolve(alphabetize(this.sourceDictionary));
    });
  }
}

module.exports = SortCommand;
