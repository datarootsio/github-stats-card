// use dotenv file
require('dotenv').config();

// create a function that queries the github graphql api for the user's stats
const { GraphQLClient } = require('graphql-request');
const GITHUB_API_URL = "https://api.github.com/graphql"

const client = new GraphQLClient(GITHUB_API_URL, {
  headers: {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  },
});


const getStats = async (username) => {
  const query = `
    {
        user(login: "${username}") {
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
    `;

  const data = await client.request(query);
  return data;
}

const getStargazers = async (username, afterCursor) => {
  var repos = [];
  const query = `
    {
      user(login: "${username}") {
          repositories(
          ownerAffiliations: [COLLABORATOR,OWNER]
          first: 5
          privacy: PUBLIC
          ${afterCursor ? `after: "${afterCursor}"` : ""}
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
    `;


  const data = await client.request(query);
  const endCursor = data.user.repositories.pageInfo.endCursor;
  repos = data.user.repositories.nodes.filter(repo => repo.stargazerCount > 0)

  if (endCursor) {
    repos = [...repos, ...await getStargazers(username, endCursor)]
  }
  return repos;
}


const collectStats = async (username) => {
  const stargazerDetails = await getStargazers(username);
  const statsUser = await getStats(username);

  const stats = {
    commitContributions: statsUser.user.contributionsCollection.totalCommitContributions,
    issueContributions: statsUser.user.contributionsCollection.issueContributions.totalCount,
    followers: statsUser.user.followers.totalCount,
    stargazerDetails: stargazerDetails,
    stargazerSum: stargazerDetails.reduce((acc, repo) => acc + repo.stargazerCount, 0)
  }

  return stats


}

export default collectStats;