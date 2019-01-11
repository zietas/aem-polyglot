
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const tested = require('../../src/commands/addDictionaryEntryCommand');

describe('addDictionaryEntryCommand', () => {
  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.readDictStub = sinon.stub(dictionaryService, 'readDict');
    this.saveDictStub = sinon.stub(dictionaryService, 'saveDict');
    this.sortStub = sinon.stub(dictionaryService, 'sort');
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.saveDictStub.restore();
    this.readDictStub.restore();
    this.sortStub.restore();
  });

  it('should fail when fails to load dict', async () => {
    const msg = 'File not found exception';
    this.readDictStub.throws(new Error(msg));

    await tested('./tmp/some/en.xml', 'key', 'value', {});

    expect(this.consoleSpy).to.have.been.calledWithExactly(msg);
    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.not.have.been.called;
    expect(this.saveDictStub).to.not.have.been.called;
  });

  it('should skip entry creation when key already exists', async () => {
    this.readDictStub.returns({
      'jcr:root': {
        'existing.key': {}
      }
    });
    const key = 'existing.key';

    await tested('./tmp/some/en.xml', key, 'value', {});

    expect(this.consoleSpy).to.have.been.calledWithExactly(`Entry with key ${key} already exists. Skipping.`);
    expect(this.sortStub).to.not.have.been.called;
    expect(this.saveDictStub).to.not.have.been.called;
  });

  it('should overwrite existing entry if force flag is used', async () => {
    this.readDictStub.returns({
      'jcr:root': {
        'existing.key': {}
      }
    });
    const key = 'existing.key';

    await tested('./tmp/some/en.xml', key, 'value', { force: true });

    expect(this.consoleSpy).to.have.been.calledWithExactly(`Adding new entry to './tmp/some/en.xml'`);
    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.have.been.calledOnce;
  });

  it('should skip sorting if disableSorting flag', async () => {
    this.readDictStub.returns({
      'jcr:root': {
        'existing.key': {}
      }
    });
    const key = 'new.key';

    await tested('./tmp/some/en.xml', key, 'value', { disableSorting: true });

    expect(this.consoleSpy).to.have.been.calledWithExactly(`Adding new entry to './tmp/some/en.xml'`);
    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.not.have.been.called;
  });

  it('should create a new entry', async () => {
    this.readDictStub.returns({
      'jcr:root': {
        'existing.key': {}
      }
    });
    const key = 'new.key';

    await tested('./tmp/some/en.xml', key, 'value', {});

    expect(this.consoleSpy).to.have.been.calledWithExactly(`Adding new entry to './tmp/some/en.xml'`);
    expect(this.readDictStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.have.been.calledOnce;
  });
});
