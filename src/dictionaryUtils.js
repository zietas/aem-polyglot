module.exports = {
  encodeHTML: function (attributeValue) {
    let result = '';

    if (attributeValue) {
      result = attributeValue.replace(/&quot;/g, '"')  // convert quote back before converting amp
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    return result;
  },
  createEntry: function (key, value) {
    return {
      '_attributes': {
        'jcr:priaryType': 'sling:MessageEntry',
        'sling:key': key,
        'sling:message': value
      }
    };
  }
};
