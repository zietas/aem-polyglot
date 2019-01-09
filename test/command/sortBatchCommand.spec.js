const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = chai.expect;
const dictionaryService = require('../../src/dictionaryService');

const sortCommand = sinon.stub();
const tested = proxyquire('../../src/commands/sortBatchCommand', {
  '../../src/commands/sortCommand': sortCommand
});

describe('sortBatchCommand', () => {

  beforeEach(() => {
    this.consoleSpy = sinon.spy(console, 'log');
    this.listDictStub = sinon.stub(dictionaryService, 'listDict');
  });

  afterEach(() => {
    this.consoleSpy.restore();
    this.listDictStub.restore();
  });

  it('iterate over list of dict and sort each', async () => {
    this.listDictStub.returns(['en.xml', 'en_gb.xml', 'de.xml']);

    await tested('./tmp/some/path');

    expect(sortCommand).to.have.been.calledThrice;
    expect(sortCommand).to.have.been.calledWithExactly('./tmp/some/path/en.xml');
    expect(sortCommand).to.have.been.calledWithExactly('./tmp/some/path/en_gb.xml');
    expect(sortCommand).to.have.been.calledWithExactly('./tmp/some/path/de.xml');
    expect(this.listDictStub).to.have.been.calledOnce;
    expect(this.consoleSpy).to.have.been.calledWithExactly("Starting batch sort on './tmp/some/path'");
  });
});

