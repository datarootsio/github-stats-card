import * as core from '@actions/core'
import createCommit, { type CommitOptions } from './createCommit'
import collectStats from './collectStats'
import generateSVG from './generateSvg'

try {
  console.log(0)
  const username: string = core.getInput('username')
  console.log(1)
  const ghToken: string = core.getInput('gh_token')
  console.log(2)
  const badgePath: string = core.getInput('badge_path')
  console.log(3)

  const stats = await collectStats({ username })
  console.log(4)
  const svgContent = generateSVG({
    about: 'He/him, cheese, dad, data,\nrocks & trails.',
    stats,
    username
  })

  console.log(svgContent)

  const c: CommitOptions = {
    ghToken,
    svgContent,
    badgePath
  }

  await createCommit(c)
  core.setOutput('badgePath', badgePath)
} catch (error) {
  if (error instanceof Error) core.setFailed(error.message)
}
