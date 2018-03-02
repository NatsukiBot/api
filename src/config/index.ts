import { Config } from '../models'

const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'

export const config: Config = {
  name: 'api',
  port: isProd ? 3001 : 5000,
  env: isProd ? 'prod' : 'dev'
}
