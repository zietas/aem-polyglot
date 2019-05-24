module.exports = function (attributeValue) {
  let result = '';

  if (attributeValue) {
    result = attributeValue.replace(/&quot;/g, '"') // convert quote back before converting amp
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  return result;
};
