const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const fileUtils = require('../../src/fileUtils');
const dictionaryService = require('../../src/dictionaryService');

chai.use(sinonChai);
const expect = chai.expect;

const csvImportStub = sinon.stub();
const tested = proxyquire('../../src/commands/importCommand', {
  '../../src/migrate/CSVImportService': function () {
    return {
      import: csvImportStub
    };
  }
});

function resolve (data, fail) {
  return async (source) => {
    return new Promise((resolve, reject) => {
      if (fail) {
        reject(data);
      } else {
        resolve(data);
      }
    });
  };
}

describe('importCommand', () => {
  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.saveDictStub = sinon.stub(dictionaryService, 'saveDict');
    this.readDictStub = sinon.stub(dictionaryService, 'readDict');
    this.sortStub = sinon.stub(dictionaryService, 'sort');
    this.readFileStub = sinon.stub(fileUtils, 'readFile');
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.saveDictStub.restore();
    this.readFileStub.restore();
    this.readDictStub.restore();
    this.sortStub.restore();
    csvImportStub.resetHistory();
  });

  it('should fail when fails to read csv file', async () => {
    const source = './source';
    const target = './target';
    const options = { disableSorting: false, separator: ';' };
    this.readFileStub.callsFake(resolve(new Error('failed to open file'), true));

    await tested(source, target, options);

    expect(this.saveDictStub).to.not.have.been.called;
    expect(this.sortStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWith(`Failed to read file '${source}'`);
  });

  it('should fail when fails to read dictionary file', async () => {
    const source = './source';
    const target = './target';
    const options = { disableSorting: false, separator: ';' };
    this.readFileStub.callsFake(resolve('data'));
    this.readDictStub.callsFake(resolve(new Error('failed to open file'), true));

    await tested(source, target, options);

    expect(this.saveDictStub).to.not.have.been.called;
    expect(this.sortStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWith(`Failed to read dictionary '${target}'`);
  });

  it('should fail when fails to save dictionary file', async () => {
    const source = './source';
    const target = './target';
    const options = { disableSorting: true, separator: ';' };
    this.readFileStub.callsFake(resolve('csv data'));
    this.readDictStub.callsFake(resolve('json data'));
    this.saveDictStub.callsFake(resolve(new Error('json data'), true));

    await tested(source, target, options);

    expect(this.sortStub).to.not.have.been.called;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWith(`Failed to save dictionary '${target}'`);
  });

  it('should not sort dictionary when disableSorting option is enabled', async () => {
    const source = './source';
    const target = './target';
    const options = { disableSorting: true, separator: ';' };
    this.readFileStub.callsFake(resolve('csv data'));
    this.readDictStub.callsFake(resolve('json data'));
    this.saveDictStub.callsFake(resolve('save data'));

    await tested(source, target, options);

    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.not.have.been.called;
  });

  it('should save the dictionary', async () => {
    const source = './source';
    const target = './target';
    const options = { disableSorting: false, separator: ';' };
    this.readFileStub.callsFake(resolve('csv data'));
    this.readDictStub.callsFake(resolve('json data'));
    this.saveDictStub.callsFake(resolve('save data'));

    await tested(source, target, options);

    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.have.been.calledOnce;
  });
});
