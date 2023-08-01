import './config_test_env'
import { expect, test } from '@jest/globals'
import generateSvg, { fillTemplate, objToStyleString } from '../generateSvg'
import collectStats from '../collectStats'
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'

if (process.env.GITHUB_TOKEN === undefined) {
  throw new Error('GITHUB_TOKEN is not defined')
}
const ghToken = process.env.GITHUB_TOKEN

test('generateSVG', async () => {
  const username = 'murilo-cunha'
  const stats = await collectStats({ ghToken, username })
  const svg = await generateSvg(
    {
      theme: 'hypnotoad',
      about: 'Rust evangelist by day, dog whisperer by night,\nliving life between compile and fetch.',
      stats,
      username
    }
  )
  // for debugging purposes
  fs.writeFile('test_badge.svg', svg, err => {
    if (err != null) {
      // eslint-disable-next-line
      console.error(err);
    }
    // file written successfully
  })

  const parser = new XMLParser()
  const svgDoc: object = parser.parse(svg)
  expect(svgDoc).toBeDefined()
  expect(svgDoc).toBeInstanceOf(Object)
}, 10000)

test('templater', () => {
  const r = fillTemplate('hello {{ name }}', { name: 'world' })
  expect(r).toBe('hello world')
})

test('objToStyleString test', () => {
  const r = objToStyleString({ color: 'red', fontSize: '12px' })
  expect(r).toBe('color:red;\nfont-size:12px')
})
