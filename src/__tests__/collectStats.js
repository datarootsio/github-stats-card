// test collection for collectStats
require('../config');
const {expect, test} = require( '@jest/globals');
const collectStats = require('../collectStats');

test('collectStats', async () => {
    const stats = await collectStats('bart6114');
    expect(stats).toBeDefined();
    expect(stats.avatarUrl).toBeDefined();
    expect(stats.commits).toBeDefined();
    expect(stats.issues).toBeDefined();
    expect(stats.followers).toBeGreaterThan(0);
    expect(stats.stargazers).toBeGreaterThan(0);
    expect(stats.stargazerDetails).toBeDefined();
    expect(stats.stargazerDetails.length).toBeGreaterThan(0)
})