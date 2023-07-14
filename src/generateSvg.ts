import { type UserStats } from './collectStats'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { parse } from 'yaml'

const svgSafeString = (str: string): string => str.replace('&', '&amp;').replace('>', '&gt;').replace('<', '&lt;')

interface ThemeComponent {
  [key: string]: string
  fontFamily: string
  fill: string
  fontSize: string
  class: string
}

interface Theme {
  header: ThemeComponent
  about: ThemeComponent
  username: ThemeComponent
  background: ThemeComponent
  stats: ThemeComponent
  svg: string
}

interface GenerateSVGOptions {
  theme?: string
  // headerStyle?: string
  // usernameStyle?: string
  // aboutStyle?: string
  about: string
  username: string
  header?: string
  stats: UserStats // replace 'Stats' with the actual type of your stats
}

// load theme from yaml to Theme object
const loadTheme = (name = 'dark'): Theme => {
  const themeFile = fs.readFileSync(path.join(__dirname, '../themes', `${name}.yaml`), 'utf8')
  const theme: Theme = parse(themeFile) as Theme
  return theme
}

const dashed = (camel: string): string => camel.replace(/[A-Z]/g, m => '-' + m.toLowerCase())

const objToStyleString = (obj: Record<string, string>): string => (
  Object.entries(obj).map(([k, v]) => `${dashed(k)}:${v}`).join(';\n')
)

const fillTemplate = (template: string, data: Record<string, string | number>): string => {
  let output = template
  Object.keys(data).forEach((key) => {
    output = output.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(data[key]))
  })
  return output
}

const generateSVG = async ({ theme = 'dark', username, about = '', header = "👋 Hi, I'm", stats: { commits, followers, stargazers, avatarUrl } }: GenerateSVGOptions): Promise<string> => {
  const t = loadTheme(theme)
  const aboutWrap = svgSafeString(about).split('\n').map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 20}">${line}</tspan>`).join('')

  // download avatar file from url and convert to base64
  const response = await axios.get(avatarUrl, {
    responseType: 'arraybuffer'
  })
  const avatar = Buffer.from(response.data).toString('base64')

  const badgeTemplate = fs.readFileSync(path.join(__dirname, 'badgeTemplate.svg'), 'utf8')

  return fillTemplate(badgeTemplate, {
    headerStyle: objToStyleString(t.header),
    usernameStyle: objToStyleString(t.username),
    aboutStyle: objToStyleString(t.about),
    statsStyle: objToStyleString(t.stats),
    backgroundStyle: objToStyleString(t.background),
    extraSvg: t.svg,
    username,
    header,
    aboutWrap,
    commits,
    followers,
    stargazers,
    avatar
  })
}

export default generateSVG
export { fillTemplate, objToStyleString }
