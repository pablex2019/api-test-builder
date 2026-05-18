function generatePostmanTests(responseBody, status) {
  const lines = [];

  lines.push(`pm.test('Status code is ${status}', function () {`);
  lines.push(`  pm.response.to.have.status(${status});`);
  lines.push(`});`);
  lines.push('');

  if (
    responseBody &&
    typeof responseBody === 'object' &&
    !Array.isArray(responseBody)
  ) {
    lines.push(`pm.test('Response structure validation', function () {`);
    lines.push(`  const json = pm.response.json();`);

    Object.keys(responseBody).forEach((key) => {
      lines.push(`  pm.expect(json).to.have.property('${key}');`);
    });

    lines.push(`});`);
  }

  return lines.join('\n');
}

module.exports = {
  generatePostmanTests,
};