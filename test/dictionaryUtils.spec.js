const chai = require('chai');
const expect = chai.expect;

const tested = require('../src/dictionaryUtils');


describe('dictionaryUtils', () => {
  describe('#encodeHTML', () => {
    it('should handle undefined input', () => {
      const result = tested.encodeHTML();

      expect(result).to.be.equal('')
    });

    it('should handle null input', () => {
      const result = tested.encodeHTML(null);

      expect(result).to.be.equal('')
    });

    it('should handle empty string input', () => {
      const result = tested.encodeHTML('');

      expect(result).to.be.equal('');
    });

    it('should not change normal text', () => {
      const input = 'Lorem ipsum dolor sith ameth';

      const result = tested.encodeHTML(input);

      expect(result).to.be.equal(input);
    });

    it('should encode special XML chars', () => {
      const input = '"&<>"';

      const result = tested.encodeHTML(input);

      expect(result).to.be.equal('&quot;&amp;&lt;&gt;&quot;');
    });

    it('should encode handlebars syntax', () => {
      const input = '<%= rating %> out of 5 stars (<%= votes %>)';

      const result = tested.encodeHTML(input);

      expect(result).to.be.equal('&lt;%= rating %&gt; out of 5 stars (&lt;%= votes %&gt;)');
    });
  });

  describe('#createEntry', () => {
    it('should create new dictionary entry', () => {
      const key = "some.key";
      const value = "Lorem ipsum dolor sith ameth";
      const expected = {
        '_attributes': {
          'jcr:priaryType': 'sling:MessageEntry',
          'sling:key': key,
          'sling:message': value
        }
      };

      const result = tested.createEntry(key,value);

      expect(result).to.be.deep.equal(expected);
    });
  });
});
