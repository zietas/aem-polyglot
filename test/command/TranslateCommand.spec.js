const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');
const translationLog = require('../../src/translate/TranslationLog');

const yandexTranslateStub = sinon.stub();
const dictionaryTranslateStub = sinon.stub();
const tested = proxyquire('../../src/commands/translateCommand', {
  '../../src/translate/YandexTranslateService': function () {
    return {
      translate: yandexTranslateStub
    };
  },
  '../../src/translate/TranslateDictionaryService': function () {
    return {
      translate: dictionaryTranslateStub
    };
  }
});

yandexTranslateStub.callsFake(() => {
  return new Promise((resolve) => {
    resolve({ newDict: true });
  });
});

describe('translateCommand', () => {
  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.translationLogPrintSpy = sinon.spy(translationLog, 'print');
    this.readDictStub = sinon.stub(dictionaryService, 'readDict');
    this.sortStub = sinon.stub(dictionaryService, 'sort');
    this.saveDictStub = sinon.stub(dictionaryService, 'saveDict');

    this.readDictStub.onCall(0).returns({});
    this.readDictStub.onCall(1).returns({});
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.translationLogPrintSpy.restore();
    this.readDictStub.restore();
    this.sortStub.restore();
    this.saveDictStub.restore();
    dictionaryTranslateStub.resetHistory();
  });

  it('should not process without Yandex API key', async () => {
    await tested('./source.xml', './target.xml', {});

    expect(dictionaryTranslateStub).to.not.have.been.called;
    expect(this.saveDictStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWithExactly('Yandex API key is not defined');
  });

  it('should not sort translated dict if sorting is diabled', async () => {
    await tested('./source.xml', './target.xml', { yandexApiKey: 'fakeKey', disableSorting: true });

    expect(dictionaryTranslateStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.not.have.been.called;
  });

  it('should process command normally', async () => {
    await tested('./source.xml', './target.xml', { yandexApiKey: 'fakeKey', disableLogOutput: false });

    expect(dictionaryTranslateStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.sortStub).to.have.been.calledOnce;
    expect(this.translationLogPrintSpy).to.have.been.calledOnce;
  });

  it('should not print log at the end when disabledLog options is set', async () => {
    await tested('./source.xml', './target.xml', { yandexApiKey: 'fakeKey', disableLogOutput: true });

    expect(dictionaryTranslateStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.have.been.calledOnce;
    expect(this.translationLogPrintSpy).to.not.have.been.called;
  });

  it('should handle exceptions in case something goes south', async () => {
    const err = new Error('what a terrible failure!');
    dictionaryTranslateStub.throws(err);

    await tested('./source.xml', './target.xml', { yandexApiKey: 'fakeKey' });

    expect(dictionaryTranslateStub).to.have.been.calledOnce;
    expect(this.saveDictStub).to.not.have.been.called;
    expect(this.consoleSpy).to.have.been.calledWithExactly(err);
  });
});
