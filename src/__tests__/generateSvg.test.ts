import './config_test_env'
import { expect, test } from '@jest/globals'
import generateSvg from '../generateSvg'
import collectStats from '../collectStats'
import { XMLParser } from 'fast-xml-parser'

if (process.env.GITHUB_TOKEN === undefined) {
  throw new Error('GITHUB_TOKEN is not defined')
}
const ghToken = process.env.GITHUB_TOKEN

test('generateSVG', async () => {
  const stats = await collectStats({ ghToken, username: 'bart6114' })
  const svg = generateSvg(
    {
      about: 'He/him, cheese, dad, data,\nrocks & trails.',
      stats,
      username: 'bart6114'
    }
  )

  const parser = new XMLParser()
  const svgDoc: object = parser.parse(svg)
  expect(svgDoc).toBeDefined()
  expect(svgDoc).toBeInstanceOf(Object)

  // eslint-disable-next-line
  console.log(svg) 
}, 10000)
