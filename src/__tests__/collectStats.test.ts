// test collection for collectStats
import './config_test_env'
import { expect, test } from '@jest/globals'
import collectStats from '../collectStats'

if (process.env.GITHUB_TOKEN === undefined) {
  throw new Error('GITHUB_TOKEN is not defined')
}
const ghToken = process.env.GITHUB_TOKEN

test('collectStats', async () => {
  const stats = await collectStats({ ghToken, username: 'bart6114' })
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

  // had a bug where stats were based on pat and not specified user
  const statsMurillo = await collectStats({ ghToken, username: 'murilo-cunha' })
  expect(statsMurillo.followers).not.toBe(stats.followers)
  expect(statsMurillo.stargazers).not.toBe(stats.stargazers)
  expect(statsMurillo.commits).not.toBe(stats.commits)
}, 10000)

test('collectStatsWithFilter', async () => {
  const stats = await collectStats({ ghToken, username: 'bart6114', excludeRepos: ['datarootsio'], excludeReposOverride: ['datarootsio/databooks'] })
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
