class ICommand {
  async execute() {
    return new Promise(() => {
      throw 'Not implemented';
    });
  }
}
module.exports = ICommand;
