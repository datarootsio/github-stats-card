import * as core from '@actions/core'
import createCommit, { type CommitOptions } from './createCommit'
import collectStats from './collectStats'
import generateSVG from './generateSvg'

try {
  const username: string = core.getInput('username')
  const ghTokenStats: string = core.getInput('gh_token_stats')
  const ghTokenCommits: string = core.getInput('gh_token_commits')
  const badgePath: string = core.getInput('badge_path')
  const commitMessage: string = core.getInput('commit_message')

  const stats = await collectStats({ ghToken: ghTokenStats, username })

  const svgContent = generateSVG({
    about: 'He/him, cheese, dad, data,\nrocks & trails.',
    stats,
    username
  })

  const commitToken = ghTokenCommits === '' ? ghTokenStats : ghTokenCommits

  const c: CommitOptions = {
    ghToken: commitToken,
    svgContent,
    badgePath,
    commitMessage
  }

  await createCommit(c)
  core.setOutput('badgePath', badgePath)
} catch (error) {
  if (error instanceof Error) core.setFailed(error.message)
}
