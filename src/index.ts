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
  const header: string = core.getInput('header')
  const about: string = core.getInput('about')
  const excludeRepos: string[] = core.getInput('exclude_repos').split(',')
  const excludeReposOverride: string[] = core.getInput('exclude_repos_override').split(',')

  const stats = await collectStats({ ghToken: ghTokenStats, username, excludeRepos, excludeReposOverride })

  const svgContent = await generateSVG({
    header,
    about,
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
