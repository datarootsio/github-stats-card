import { GraphQLClient } from 'graphql-request'
const GITHUB_API_URL = 'https://api.github.com/graphql'

const getGithubClient = (ghToken: string): GraphQLClient => (
  new GraphQLClient(GITHUB_API_URL, {
    headers: {
      Authorization: `bearer ${ghToken}`
    }
  })
)

interface CollectStatsOptions {
  ghToken: string
  username: string
  excludeRepos?: string[]
  excludeReposOverride?: string[]
}

interface GHAPIUserStats {
  user: {
    avatarUrl: string
    contributionsCollection: {
      totalCommitContributions: number
      issueContributions: {
        totalCount: number
      }
    }
    followers: {
      totalCount: number
    }
    following: {
      totalCount: number
    }
  }
}

interface GHReposWithStargazers {
  stargazerCount: number
  owner: {
    login: string
  }
  name: string
}

interface GHAPIStargazers {
  user: {
    repositories: {
      nodes: GHReposWithStargazers[]
      pageInfo: {
        endCursor: string
      }
    }
  }
}

export interface UserStats {
  avatarUrl: string
  commits: number
  issues: number
  followers: number
  stargazerDetails: GHReposWithStargazers[]
  stargazers: number
}

const getUserStats = async (client: GraphQLClient, username: string): Promise<GHAPIUserStats> => {
  const query = `
    {
        user(login: "${username}") {
          avatarUrl
          contributionsCollection {
            totalCommitContributions
            issueContributions {
              totalCount
            }
          }
          followers {
            totalCount
          }
          following {
            totalCount
          }
        }
      }
    `

  const data: GHAPIUserStats = await client.request(query)
  return data
}

const getReposWithStargazers = async (client: GraphQLClient, { ghToken, username, excludeRepos = [], excludeReposOverride: includeReposOverride = [] }: CollectStatsOptions, afterCursor = ''): Promise<GHReposWithStargazers[]> => {
  let repos: GHReposWithStargazers[] = []
  const query = `
    {
      user(login: "${username}") {
          repositories(
          ownerAffiliations: [COLLABORATOR,OWNER]
          first: 5
          privacy: PUBLIC
          ${afterCursor !== '' ? `after: "${afterCursor}"` : ''}
          ) {
          nodes {
              stargazerCount
              owner {
              login
              }
              name
          }
          pageInfo {
              endCursor
          }
          }
      }
      }
    `

  const data: GHAPIStargazers = await client.request(query)
  const endCursor = data.user.repositories.pageInfo.endCursor

  if (endCursor != null) {
    repos = [...data.user.repositories.nodes, ...await getReposWithStargazers(client, { ghToken, username, excludeReposOverride: includeReposOverride, excludeRepos }, endCursor)]
  }

  // create regexes from userinput
  const excludeRegexes = excludeRepos.map(ep => RegExp(ep))
  const includeRegexes = includeReposOverride.map(ip => RegExp(ip))

  // remove repos that are in excludeRepos
  const excludedRepos = repos.filter(repo => !excludeRegexes.some(r => r.test(`${repo.owner.login}/${repo.name}`)))
  const includedReposViaOverride = repos.filter(repo => includeRegexes.some(r => r.test(`${repo.owner.login}/${repo.name}`)))

  // remove 0 star repos
  let filteredRepos = repos.filter(repo => repo.stargazerCount > 0)
  // remove excluded repos
  filteredRepos = filteredRepos.filter(r => excludedRepos.some(er => er.name === r.name && er.owner.login === r.owner.login))
  // reintroduce overrides
  filteredRepos = [...filteredRepos, ...includedReposViaOverride]

  return filteredRepos
}

const collectStats = async (c: CollectStatsOptions): Promise<UserStats> => {
  const client = getGithubClient(c.ghToken)
  const stargazerDetails = await getReposWithStargazers(client, c)
  const statsUser = await getUserStats(client, c.username)

  const stats: UserStats = {
    avatarUrl: statsUser.user.avatarUrl,
    commits: statsUser.user.contributionsCollection.totalCommitContributions,
    issues: statsUser.user.contributionsCollection.issueContributions.totalCount,
    followers: statsUser.user.followers.totalCount,
    stargazerDetails,
    stargazers: stargazerDetails.reduce((acc, repo) => acc + repo.stargazerCount, 0)
  }

  return stats
}

export default collectStats
