import { type UserStats } from './collectStats'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const svgSafeString = (str: string): string => str.replace('&', '&amp;').replace('>', '&gt;').replace('<', '&lt;')

interface GenerateSVGOptions {
  about: string
  username: string
  header?: string
  stats: UserStats // replace 'Stats' with the actual type of your stats
}

const fillTemplate = (template: string, data: Record<string, string | number>): string => {
  let output = template
  Object.keys(data).forEach((key) => {
    output = output.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(data[key]))
  })
  return output
}

const generateSVG = async ({ about, username, header = "👋 Hi, I'm", stats: { commits, followers, stargazers, avatarUrl } }: GenerateSVGOptions): Promise<string> => {
  const aboutWrap = svgSafeString(about).split('\n').map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 20}">${line}</tspan>`).join('')

  // download avatar file from url and convert to base64
  const response = await axios.get(avatarUrl, {
    responseType: 'arraybuffer'
  })
  const avatar = Buffer.from(response.data).toString('base64')

  const badgeTemplate = fs.readFileSync(path.join(__dirname, 'badgeTemplate.svg'), 'utf8')

  return fillTemplate(badgeTemplate, {
    username, header, aboutWrap, commits, followers, stargazers, avatar
  })
}

export default generateSVG
export { fillTemplate }
