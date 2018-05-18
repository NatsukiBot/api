import { Config } from '../models'

const env = process.env.NODE_ENV || 'development'
const isProd = env === 'production'

export const config: Config = {
  name: 'api',
  port: isProd ? 5000 : 5001,
  env: isProd ? 'prod' : 'dev'
}
