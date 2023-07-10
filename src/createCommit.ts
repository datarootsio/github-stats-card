import * as github from '@actions/github'

interface CommitOptions {
  ghToken: string
  svgContent: string
  badgePath: string
  commitMessage: string
}

const createCommit = async ({
  ghToken,
  badgePath, svgContent, commitMessage
}: CommitOptions): Promise<void> => {
  const octokit = github.getOctokit(ghToken)

  // create blob
  const { data: blobData } = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    content: Buffer.from(svgContent).toString('base64'),
    encoding: 'base64'
  })

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

  // create commit
  const { data: commitData } = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    message: `${commitMessage} [skip ci]`,
    tree: treeData.sha,
    parents: [github.context.sha]
  })

  // update reference
  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: github.context.ref.replace('refs/', ''),
    sha: commitData.sha
  })
}

export type { CommitOptions }
export default createCommit
