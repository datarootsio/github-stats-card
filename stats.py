from pprint import pprint
import requests
from jinja2 import Environment

    

query_issues_followers = """
{
  user(login: "bart6114") {
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
"""

r = requests.post("https://api.github.com/graphql", 
json = {'query': query_issues_followers}, 
headers={"Authorization": "bearer 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"})
pprint(r.json())
exit()



def fetch_repos(repos_data: list = [], after_cursor: str = None):
    env = Environment()
    query = env.from_string("""
    {
    user(login: "murilo-cunha") {
        repositories(
        ownerAffiliations: [COLLABORATOR,OWNER]
        first: 5
        privacy: PUBLIC
        {% if after_cursor %}
        after: "{{ after_cursor }}"
        {% endif %}
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
    """).render({"after_cursor": after_cursor})

    r = requests.post("https://api.github.com/graphql", 
    json = {'query': query}, 
    headers={"Authorization": "bearer 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"})
    res = r.json()

    repos_data = res["data"]["user"]["repositories"]["nodes"]
    end_cursor  = res["data"]["user"]["repositories"]["pageInfo"]["endCursor"]

    if end_cursor is not None: 
        repos_data = repos_data + fetch_repos(repos_data, end_cursor)
    
    return repos_data
  

res = fetch_repos()

t = {}
for r in res:
  if r["stargazerCount"] > 0:
    if not r["owner"]["login"] in t:
      t[r["owner"]["login"]] = [r]
    else:
      t[r["owner"]["login"]].append(r)

pprint(t)

muris_stars = 4
total_stars = sum([x['stargazerCount'] for x in res])

print(f"In total this gives you {total_stars} stars")




