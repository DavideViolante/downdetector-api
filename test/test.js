const assert = require('assert')
const { downdetector } = require('../index')

describe('Tests for Downdetector.com unofficial APIs', () => {
  it('should return undefined if input is wrong', async () => {
    const res1 = await downdetector()
    assert.strictEqual(res1, undefined)
    const res2 = await downdetector(123)
    assert.strictEqual(res2, undefined)
  })

  it('should return correct response', async () => {
    const { reports, baseline } = await downdetector('steam')
    assert.ok(reports)
    assert.ok(baseline)
    assert.ok(reports.length)
    assert.ok(baseline.length)
    assert.strictEqual(reports.length, 96)
    assert.strictEqual(baseline.length, 96)
  })
})
