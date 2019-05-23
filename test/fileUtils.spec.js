const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

const fs = require('fs');
const tested = require('../src/fileUtils');

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('fileUtils', () => {
  describe('#readFile', () => {
    beforeEach(() => {
      this.readFileStub = sinon.stub(fs, 'readFile');
    });

    afterEach(() => {
      this.readFileStub.restore();
    });

    it('should resolve', async () => {
      this.readFileStub.callsFake((path, data, cb) => {
        return cb(null, 'some data');
      });

      const result = await tested.readFile('./path', {});

      expect(result).to.be.equal('some data');
      expect(this.readFileStub).to.have.been.calledOnce;
    });

    it('should reject', async () => {
      this.readFileStub.callsFake((path, data, cb) => {
        return cb(new Error('fail'), null);
      });

      const promise = tested.readFile('./path', {});

      expect(promise).to.be.rejected;
      expect(this.readFileStub).to.have.been.calledOnce;
    });
  });

  describe('#writeFile', () => {
    beforeEach(() => {
      if (this.writeFileStub) {
        console.log(this.writeFileStub);
        this.writeFileStub.restore();
      }
      this.writeFileStub = sinon.stub(fs, 'writeFile');
    });

    afterEach(() => {
      this.writeFileStub.restore();
    });

    it('should resolve', async () => {
      this.writeFileStub.callsFake((path, content, options, cb) => {
        return cb(null);
      });

      await tested.writeFile('./path', 'content');

      expect(this.writeFileStub).to.have.been.calledOnce;
    });

    it('should reject', async () => {
      this.writeFileStub.callsFake((path, content, options, cb) => {
        return cb(new Error('fail'));
      });

      const promise = tested.writeFile('./path', 'content');

      expect(promise).to.be.rejected;
      expect(this.writeFileStub).to.have.been.calledOnce;
    });
  });
});
