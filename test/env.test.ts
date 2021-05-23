import { env } from '../src'

describe('env', () => {
  test('env config', async () => {
    const config = env({
      root: __dirname
    })
    expect(config).toStrictEqual({
      A: '"1"',
      APP_MODE: '"development"',
      B: '"x"',
      C: '"true"',
    })
  })

  test('development config', async () => {
    const config = env({
      root: __dirname,
      mode: 'development'
    })
    expect(config).toStrictEqual({
      A: '"1"',
      APP_MODE: '"development"',
      B: '"x"',
      C: '"true"',
    })
  })

  test('development config with prefix', async () => {
    const config = env({
      root: __dirname,
      mode: 'development',
      prefix: 'APP_'
    })
    expect(config).toStrictEqual({
      APP_MODE: '"development"'
    })
  })

  test('production config', async () => {
    const config = env({
      root: __dirname,
      mode: 'production'
    })
    expect(config).toStrictEqual({
      A: '"1"',
      APP_MODE: '"production"',
      B: '"x"',
      C: '"true"',
    })
  })

  test('production config with prefix', async () => {
    const config = env({
      root: __dirname,
      mode: 'production',
      prefix: 'APP_'
    })
    expect(config).toStrictEqual({
      APP_MODE: '"production"'
    })
  })

  test('test config', async () => {
    const config = env({
      root: __dirname,
      mode: 'test'
    })
    expect(config).toStrictEqual({
      A: '"1"',
      APP_MODE: '"test"',
      B: '"x"',
      C: '"true"',
    })
  })

  test('test config with prefix', async () => {
    const config = env({
      root: __dirname,
      mode: 'test',
      prefix: 'APP_'
    })
    expect(config).toStrictEqual({
      APP_MODE: '"test"'
    })
  })
})
