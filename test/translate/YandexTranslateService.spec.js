const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const expect = chai.expect;
chai.use(chaiAsPromised);

const yandexTranslateStub = sinon.stub();
const YandexTranslateService = proxyquire('../../src/translate/YandexTranslateService', {
  'yandex-translate': function () {
    return {
      translate: yandexTranslateStub
    }
  }
});

describe('YandexTranslateService', () => {
  describe('#constructor', () => {
    it('should initialize fields', async () => {
      let tested = new YandexTranslateService('fakeAPIkey');

      expect(tested.log).not.to.be.null;
      expect(tested.service).not.to.be.null;
    });
  });

  describe('#translate', () => {

    const tested = new YandexTranslateService('fakeAPIkey');

    beforeEach(() => {
      this.logAddEntrySpy = sinon.spy(tested.log, 'addEntry');
    });

    afterEach(() => {
      this.logAddEntrySpy.restore();
    });

    it('should fail when service is returns error', async () => {
      yandexTranslateStub.callsFake((text, options, callback) => {
        callback('there seems to be a problem');
      });

      const promise = tested.translate('key', 'text', 'en', 'fr');

      expect(this.logAddEntrySpy).to.have.been.calledOnce;
      return expect(promise).to.be.rejectedWith('there seems to be a problem');
    });

    it('should fail when service is returns response code above 400', async () => {
      yandexTranslateStub.callsFake((text, options, callback) => {
        callback(null, {code: 403, message: 'Unauthorized Access'});
      });

      const promise = tested.translate('key', 'text', 'en', 'fr');

      expect(this.logAddEntrySpy).to.have.been.calledOnce;
      return expect(promise).to.be.rejectedWith('Unauthorized Access');
    });

    it('should return translated dictionary entry', async () => {
      yandexTranslateStub.callsFake((text, options, callback) => {
        callback(null, {text: ['some translation']});
      });

      const entry = await tested.translate('key', 'text', 'en', 'fr');

      expect(entry['_attributes']['sling:key']).to.be.equal('key');
      expect(entry['_attributes']['sling:message']).to.be.equal('some translation');
      expect(this.logAddEntrySpy).to.have.been.calledTwice;
    });
  });
});
