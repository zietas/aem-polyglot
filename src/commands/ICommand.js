class ICommand {
  async execute () {
    return new Promise(() => {
      throw new Error('Not implemented');
    });
  }
}
module.exports = ICommand;
