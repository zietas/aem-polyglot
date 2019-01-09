const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const tested = require('../../src/commands/createDictionaryCommand');

describe('createDictionaryCommand', () => {

  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.existStub = sinon.stub(dictionaryService, "exists");
    this.createStub = sinon.stub(dictionaryService, "create");
    this.saveDictStub = sinon.stub(dictionaryService, "saveDict");
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.existStub.restore();
    this.saveDictStub.restore();
    this.createStub.restore();
  });

  it('should check if directory exists', async () => {
    this.existStub.returns(false);

    await tested('./tmp/some/path', ['de_de'], {});

    expect(this.consoleSpy).to.have.been.calledWithExactly("Target directory does not exists");
  });

  it('should create a single new dict', async () => {
    this.existStub.onCall(0).returns(true);
    this.existStub.onCall(1).returns(false);
    this.createStub.returns({});
    this.saveDictStub.callsFake(() => {
      return new Promise((resolve) => {
        resolve(true);
      })
    });

    await tested('./tmp/some/path', ['de_de'], {});

    expect(this.existStub).to.have.been.calledTwice;
    expect(this.createStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly("Creating new dict './tmp/some/path/de_de.xml'");
  });

  it('should create multiple new dict', async () => {
    this.existStub.onCall(0).returns(true);
    this.existStub.onCall(1).returns(false);
    this.createStub.returns({});
    this.saveDictStub.callsFake(() => {
      return new Promise((resolve) => {
        resolve(true);
      })
    });

    await tested('./tmp', ['fr_fr', 'es_es', 'ru'], {});

    expect(this.existStub).to.have.been.calledWith('./tmp/fr_fr.xml');
    expect(this.existStub).to.have.been.calledWith('./tmp/es_es.xml');
    expect(this.existStub).to.have.been.calledWith('./tmp/ru.xml');

    expect(this.createStub).to.have.been.calledThrice;
    expect(this.saveDictStub).to.have.been.calledThrice;

    expect(this.consoleSpy).to.have.been.calledWithExactly("Creating new dict './tmp/fr_fr.xml'");
    expect(this.consoleSpy).to.have.been.calledWithExactly("Creating new dict './tmp/es_es.xml'");
    expect(this.consoleSpy).to.have.been.calledWithExactly("Creating new dict './tmp/ru.xml'");
  });

  it('should not create new dict as one is already created', async () => {
    this.existStub.returns(true);

    await tested('./tmp', ['en_gb'], {});
    expect(this.createStub).to.not.have.been.called;
    expect(this.saveDictStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWithExactly("Dictionary under path './tmp/en_gb.xml' exists - skipping.");
  });

  it('should overwrite existing dict as we are using force option', async () => {
    this.existStub.returns(true);
    this.createStub.returns({});
    this.saveDictStub.callsFake(() => {
      return new Promise((resolve) => {
        resolve(true);
      })
    });

    await tested('.', ['en_gb'], {force: true});

    expect(this.createStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly("Creating new dict './en_gb.xml'");
    expect(this.consoleSpy).to.have.been.calledWithExactly("Overwriting dictionary under path './en_gb.xml'");
  });
});
