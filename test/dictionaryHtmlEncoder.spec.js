const chai = require('chai');
const expect = chai.expect;

const tested = require('../src/dictionaryHtmlEncoder');

describe('dictionaryHtmlEncoder', () => {
    it('should handle undefined input', () => {
      const result = tested();

      expect(result).to.be.equal('');
    });

    it('should handle null input', () => {
      const result = tested(null);

      expect(result).to.be.equal('');
    });

    it('should handle empty string input', () => {
      const result = tested('');

      expect(result).to.be.equal('');
    });

    it('should not change normal text', () => {
      const input = 'Lorem ipsum dolor sith ameth';

      const result = tested(input);

      expect(result).to.be.equal(input);
    });

    it('should encode special XML chars', () => {
      const input = '"&<>"';

      const result = tested(input);

      expect(result).to.be.equal('&quot;&amp;&lt;&gt;&quot;');
    });

    it('should encode handlebars syntax', () => {
      const input = '<%= rating %> out of 5 stars (<%= votes %>)';

      const result = tested(input);

      expect(result).to.be.equal('&lt;%= rating %&gt; out of 5 stars (&lt;%= votes %&gt;)');
    });
});
