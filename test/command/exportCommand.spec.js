const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const fs = require('fs');
const fileUtils = require('../../src/fileUtils');
const dictionaryService = require('../../src/dictionaryService');

chai.use(sinonChai);
const expect = chai.expect;

const csvExportStub = sinon.stub();
const tested = proxyquire('../../src/commands/exportCommand', {
  '../../src/migrate/CSVExportService': function () {
    return {
      export: csvExportStub
    }
  }
});

describe('exportCommand', () => {
  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.readDictStub = sinon.stub(dictionaryService, 'readDict');
    this.writeFileStub = sinon.stub(fileUtils, 'writeFile');
    this.existsSyncStub = sinon.stub(fs, 'existsSync');
    this.lstatSyncStub = sinon.stub(fs, 'lstatSync');
    this.existsSyncStub.callsFake((path) => !path.startsWith('./fake'));
    this.lstatSyncStub.callsFake((path) => {
      return {
        isFile: () => true
      }
    });
    this.writeFileStub.callsFake(async () => true);
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.readDictStub.restore();
    this.writeFileStub.restore();
    this.existsSyncStub.restore();
    this.lstatSyncStub.restore();
    csvExportStub.resetHistory();
  });

  it('should output error when non existing path to file provided', async () => {
    const paths = './fake_en_gb.xml';

    await tested(paths, {targetFile: './export.csv'});

    expect(this.readDictStub).to.not.have.been.called;
    expect(this.writeFileStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWith(`Exporting '${paths}' to './export.csv'`);
    expect(this.consoleSpy).to.have.been.calledWith('invalid paths to dictionaries provided');
  });

  it('should output error when non existing paths to file provided', async () => {
    const paths = './fake_en_gb.xml,./fake_de_de.xml,./fake_fr_fr.xml';

    await tested(paths, {targetFile: './otherFile.csv'});

    expect(this.readDictStub).to.not.have.been.called;
    expect(this.writeFileStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWith(`Exporting '${paths}' to './otherFile.csv'`);
    expect(this.consoleSpy).to.have.been.calledWith('invalid paths to dictionaries provided');
  });

  it('should export single dict to csv', async () => {
    const paths = './en_gb.xml';

    await tested(paths, {targetFile: './export.csv'});

    expect(csvExportStub).to.have.been.calledOnce;
    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.writeFileStub).to.have.been.calledOnce;
  });

  it('should output error when fails to save csv', async () => {
    const paths = './en_gb.xml';
    const err = new Error('test exception');
    this.writeFileStub.callsFake(async () => {
      throw err;
    });

    await tested(paths, {targetFile: './export.csv'});

    expect(csvExportStub).to.have.been.calledOnce;
    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.writeFileStub).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWith(`Failed to open './export.csv'`);
  });
});
