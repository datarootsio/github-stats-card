import * as fs from 'fs'
import * as path from 'path'

function ensureDirSync (dir: string): void {
  if (fs.existsSync(dir)) {
    return
  }
  fs.mkdirSync(dir, { recursive: true })
}

function checkDirAndWriteFile (filePath: string, content: string): void {
  const dirname = path.dirname(filePath)
  ensureDirSync(dirname)
  fs.writeFileSync(filePath, content)
}

export { checkDirAndWriteFile }
