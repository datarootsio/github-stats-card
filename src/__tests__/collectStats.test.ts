// test collection for collectStats
import '../config'
import { expect, test } from '@jest/globals'
import collectStats from '../collectStats'

test('collectStats', async () => {
  const stats = await collectStats('bart6114')
  expect(stats).toBeDefined()
  expect(stats.avatarUrl).toBeDefined()
  expect(stats.commits).toBeDefined()
  expect(stats.issues).toBeDefined()
  expect(stats.followers).toBeGreaterThan(0)
  expect(stats.stargazers).toBeGreaterThan(0)
  expect(stats.stargazerDetails).toBeDefined()
  expect(stats.stargazerDetails.length).toBeGreaterThan(0)
}, 10000)
