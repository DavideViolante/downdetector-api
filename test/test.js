const assert = require('assert');
const { downdetector } = require('../index');

describe('Tests for Downdetector.com unofficial APIs', () => {
  it('should return undefined if input is wrong', async () => {
    const res1 = await downdetector();
    assert.strictEqual(res1, undefined);
    const res2 = await downdetector(123);
    assert.strictEqual(res2, undefined);
  });

  it('should return correct response', async () => {
    const { reports, baseline } = await downdetector('facebook');
    assert.ok(reports);
    assert.ok(baseline);
    assert.ok(reports.length);
    assert.ok(baseline.length);
    assert.strictEqual(reports.length, 96);
    assert.strictEqual(baseline.length, 96);
  });

  it('should return correct response with domain', async () => {
    const { reports, baseline } = await downdetector('windtre', 'it');
    assert.ok(reports);
    assert.ok(baseline);
    assert.ok(reports.length);
    assert.ok(baseline.length);
    assert.strictEqual(reports.length, 96);
    assert.strictEqual(baseline.length, 96);
  });
});
