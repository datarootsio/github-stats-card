import * as github from '@actions/github'
import * as path from 'path'
import * as fs from 'fs'

interface CommitOptions {
  ghToken: string
  svgContent: string
  badgePath: string
}

const createCommit = async ({
  ghToken,
  badgePath, svgContent
}: CommitOptions): Promise<void> => {
  const octokit = github.getOctokit(ghToken)

  console.log(100)
  // const badgeDir = path.dirname(badgePath)

  // if (!fs.existsSync(badgeDir)) {
  //   fs.mkdirSync(path.dirname(badgePath), { recursive: true })
  // }
  // fs.writeFileSync(badgePath, svgContent)

  // create blob
  const { data: blobData } = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    content: Buffer.from(svgContent).toString('base64'),
    encoding: 'base64'
  })

  console.log(101)

  // create tree
  const { data: treeData } = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    base_tree: github.context.sha,
    tree: [
      {
        path: badgePath, // path to your file
        mode: '100644', // file mode
        type: 'blob',
        sha: blobData.sha
      }
    ]
  })

  console.log(102)
  // create commit
  const { data: commitData } = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    message: 'The treadmill bunnies generated a new badge',
    tree: treeData.sha,
    parents: [github.context.sha]
  })

  console.log(103, github.context.ref, commitData.sha)

  // update reference
  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: github.context.ref.replace('refs/', ''),
    sha: commitData.sha
  })

  console.log(104)
}

export type { CommitOptions }
export default createCommit
