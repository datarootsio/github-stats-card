import { GraphQLClient } from 'graphql-request'
const GITHUB_API_URL = 'https://api.github.com/graphql'

// assert that process.env.GITHUB_TOKEN is set
if (process.env.GITHUB_TOKEN === undefined) {
  throw new Error('Please set the GITHUB_TOKEN environment variable')
}

const client = new GraphQLClient(GITHUB_API_URL, {
  headers: {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`
  }
})

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

const getUserStats = async (username: string): Promise<GHAPIUserStats> => {
  const query = `
    {
        user(login: "${username}") {
          avatarUrl
          contributionsCollection(from: "2023-01-01T00:00:00") {
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

const getReposWithStargazers = async (username: string, afterCursor = ''): Promise<GHReposWithStargazers[]> => {
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
  repos = data.user.repositories.nodes.filter(repo => repo.stargazerCount > 0)
  if (endCursor != null) {
    repos = [...repos, ...await getReposWithStargazers(username, endCursor)]
  }
  return repos
}

const collectStats = async (username: string): Promise<UserStats> => {
  const stargazerDetails = await getReposWithStargazers(username)
  const statsUser = await getUserStats(username)

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
