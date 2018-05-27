import { Config } from '../models';

declare var process: {
  env: {
    NODE_ENV: string;
  };
};

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

export const config: Config = {
  name: 'api',
  port: isProd ? 5000 : 3001,
  env: isProd ? 'prod' : 'dev'
};
