import * as dotenv from 'dotenv-defaults'
import { readFile as rf, stat } from 'fs'
import { resolve as pr } from 'path'
import { promisify } from 'util'

export interface EnvOptions {
  root: string
  mode?: '"development"' | '"production"' | '"test"' | string
  envFileName?: string
  prefix?: string
}

export type EnvConfig = Record<string, string>

export const resolve = pr

export async function readFile(filePath: string): Promise<string | undefined> {
  const stats = await promisify(stat)(filePath)

  if (stats.isFile()) {
    const buffer = await promisify(rf)(filePath) as Buffer
    return buffer.toString('utf8')
  }
}

export async function envConfig(filePath: string, prefix?: string): Promise<EnvConfig | undefined> {
  const content = await readFile(filePath)

  if (content) {
    const result = dotenv.parse(content)
    let config: EnvConfig = {}

    if (prefix) {
      Object.keys(result).forEach(key => {
        if (key.startsWith(prefix)) {
          config[key] = result[key]
        }
      })
    } else {
      config = result
    }

    for (const key of Object.keys(result)) {
      const value = JSON.stringify(result[key])

      if (prefix && !key.startsWith(prefix)) {
        continue
      }

      config[key] = value
    }

    return config
  }
}

export async function env({
  root,
  mode,
  prefix,
  envFileName = '.env'
}: EnvOptions): Promise<EnvConfig> {
  let config: EnvConfig = {}

  const basicConfig = await envConfig(resolve(root, envFileName), prefix)
  if (basicConfig) {
    config = { ...config, ...basicConfig }
  }

  if (mode) {
    const modeConfig = await envConfig(
      resolve(root, [envFileName, mode].join('.')),
      prefix
    )

    if (modeConfig) {
      config = { ...config, ...modeConfig }
    }
  }

  return config
}
