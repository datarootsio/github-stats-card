// test collection for collectStats
import '../config'
import { expect, test } from '@jest/globals'
import collectStats from '../collectStats'

test('collectStats', async () => {
  const stats = await collectStats({ username: 'bart6114' })
  expect(stats).toBeDefined()
  expect(stats.avatarUrl).toBeDefined()
  expect(stats.commits).toBeDefined()
  expect(stats.issues).toBeDefined()
  expect(stats.followers).toBeGreaterThan(0)
  expect(stats.stargazers).toBeGreaterThan(0)
  expect(stats.stargazerDetails).toBeDefined()
  expect(stats.stargazerDetails.length).toBeGreaterThan(0)

  // expect stargazers to be more than 1000
  expect(stats.stargazers).toBeGreaterThan(1000)
}, 10000)

test('collectStatsWithFilter', async () => {
  const stats = await collectStats({ username: 'bart6114', excludeRepos: ['datarootsio'], includeReposOverride: ['datarootsio/databooks'] })
  expect(stats).toBeDefined()
  expect(stats.avatarUrl).toBeDefined()
  expect(stats.commits).toBeDefined()
  expect(stats.issues).toBeDefined()
  expect(stats.followers).toBeGreaterThan(0)
  expect(stats.stargazers).toBeGreaterThan(0)
  expect(stats.stargazerDetails).toBeDefined()
  expect(stats.stargazerDetails.length).toBeGreaterThan(0)

  // expect stargazers to be more than 1000
  expect(stats.stargazers).toBeLessThan(1000)

  // check the override
  expect(stats.stargazerDetails.some(repo => repo.name === 'databooks')).toBeTruthy()
}, 10000)
