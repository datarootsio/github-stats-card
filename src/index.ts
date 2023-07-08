import core from '@actions/core'
import createCommit, { type CommitOptions } from './createCommit'
import collectStats from './collectStats'
import generateSVG from './generateSvg'

try {
  const username = core.getInput('username')
  const ghToken = core.getInput('gh_token')
  const badgePath = core.getInput('badgePath')

  const stats = await collectStats({ username })
  const svgContent = generateSVG({
    about: 'He/him, cheese, dad, data,\nrocks & trails.',
    stats,
    username
  })

  const c: CommitOptions = {
    ghToken,
    svgContent,
    badgePath
  }

  await createCommit(c)
  core.setOutput('badgePath', badgePath)
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message)
  }
}
