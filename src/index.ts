import * as dotenv from 'dotenv-defaults'
import { readFileSync } from 'fs'
import { resolve as pr } from 'path'

export interface EnvOptions {
  root: string
  mode?: '"development"' | '"production"' | '"test"' | string
  envFileName?: string
  prefix?: string
}

export type EnvConfig = Record<string, string>

export const resolve = pr

export function readFile(filePath: string): string | undefined {
  try {
    return readFileSync(filePath).toString()
  } catch (err) {}
}

export function envConfig(filePath: string, prefix?: string): EnvConfig | undefined {
  const content = readFile(filePath)

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

export function env({
  root,
  mode,
  prefix,
  envFileName = '.env'
}: EnvOptions): EnvConfig {
  let config: EnvConfig = {}

  const basicConfig = envConfig(resolve(root, envFileName), prefix)
  if (basicConfig) {
    config = { ...config, ...basicConfig }
  }

  if (mode) {
    const modeConfig = envConfig(
      resolve(root, [envFileName, mode].join('.')),
      prefix
    )

    if (modeConfig) {
      config = { ...config, ...modeConfig }
    }
  }

  return config
}
