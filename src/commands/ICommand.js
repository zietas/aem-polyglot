class ICommand {
  async execute() {
    throw 'Not implemented';
  }
}

module.exports = ICommand;
