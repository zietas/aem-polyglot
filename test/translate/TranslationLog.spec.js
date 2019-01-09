const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const TranslationLog = require('../../src/translate/TranslationLog');

chai.use(sinonChai);

describe('TranslationLog', () => {
  let tested;

  let consoleSpy;

  beforeEach(() => {
    tested = new TranslationLog();
    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  describe('#addEntry()', () => {
    it('should add new entry', () => {
      tested.addEntry('some.key', 'en', 'lorem ipsum');

      expect(tested.getLog()).to.have.own.property('some.key');
      expect(tested.getEntry('some.key')).to.deep.equal({ 'en': 'lorem ipsum' });
    });

    it('should add 3 new entries', () => {
      tested.addEntry('some.key1', 'en', 'lorem ipsum');
      tested.addEntry('some.key1', 'de', 'lorem ipsum de');
      tested.addEntry('some.key1', 'fr', 'lorem ipsum fr');
      tested.addEntry('some.key2', 'en', 'lorem ipsum');
      tested.addEntry('some.key3', 'en', 'lorem ipsum');

      expect(tested.getLog()).to.have.own.property('some.key1');
      expect(tested.getLog()).to.have.own.property('some.key2');
      expect(tested.getLog()).to.have.own.property('some.key3');
      expect(tested.getEntry('some.key1')).to.deep.equal({
        'en': 'lorem ipsum',
        'de': 'lorem ipsum de',
        'fr': 'lorem ipsum fr'
      });
    });

    it('should override existing entry if same key', () => {
      tested.addEntry('some.key1', 'en', 'lorem ipsum');
      expect(tested.getEntry('some.key1')['en']).to.be.equal('lorem ipsum');

      tested.addEntry('some.key1', 'en', 'other value');
      expect(tested.getEntry('some.key1')['en']).to.be.equal('other value');
    });
  });

  describe('#clear()', () => {
    it('should clear out the log', () => {
      tested.addEntry('some.key1', 'en', 'lorem ipsum');
      tested.addEntry('some.key3', 'en', 'lorem ipsum');
      expect(tested.getLog('some.key1')).not.to.be.a('null');

      tested.clear();
      expect(tested.getEntry('some.key1')).to.be.a('undefined');
      expect(tested.getLog()).to.deep.equal({});
    });
  });

  describe('#print()', () => {
    it('should not print anything if empty', () => {
      tested.print();

      expect(consoleSpy).to.have.callCount(0);
    });

    it('should print log', () => {
      tested.addEntry('some.key1', 'en', 'lorem ipsum');
      tested.addEntry('some.key1', 'de', 'lorem ipsum de');
      tested.addEntry('some.key1', 'fr', 'lorem ipsum fr');
      tested.addEntry('some.key2', 'en', 'lorem ipsum');
      tested.addEntry('some.key3', 'en', 'lorem ipsum');

      tested.print();

      expect(consoleSpy).to.have.been.calledWith('- some.key1');
      expect(consoleSpy).to.have.been.calledWith('- some.key2');
      expect(consoleSpy).to.have.been.calledWith('- some.key3');
    });
  });
});
