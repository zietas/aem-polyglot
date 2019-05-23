const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const dictionaryService = require('../../src/dictionaryService');

const tested = require('../../src/commands/sortCommand');

describe('sortCommand', () => {
  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.readDictStub = sinon.stub(dictionaryService, 'readDict');
    this.sortStub = sinon.stub(dictionaryService, 'sort');
    this.saveDictStub = sinon.stub(dictionaryService, 'saveDict');
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.readDictStub.restore();
    this.sortStub.restore();
    this.saveDictStub.restore();
  });

  function resolve (data) {
    return () => {
      return new Promise((resolve) => {
        resolve(data);
      });
    };
  }

  it('sort dict and save it', async () => {
    this.readDictStub.callsFake(resolve({}));
    this.sortStub.returns({});
    this.saveDictStub.callsFake(resolve(true));

    await tested('./tmp/some/path/en_us.xml');

    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly("Sorting './tmp/some/path/en_us.xml'");
  });
});
