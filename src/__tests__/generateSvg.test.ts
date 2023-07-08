import '../config'
import { expect, test } from '@jest/globals'
import generateSvg from '../generateSvg'
import collectStats from '../collectStats'
import { XMLParser } from 'fast-xml-parser'

test('generateSVG', async () => {
  const stats = await collectStats('bart6114')
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
})
