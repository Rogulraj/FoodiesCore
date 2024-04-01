import { config } from 'dotenv';
import { bool, cleanEnv, port, str } from 'envalid';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const envVars = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  SECRET_KEY: str(),
  LOG_FORMAT: str(),
  LOG_DIR: str(),
  ORIGIN: str(),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_DATABASE: str(),
  CREDENTIALS: bool({ default: true }),
  AWS_ACCESS_KEY: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  AWS_MAIN_BUCKET: str(),
});

export const {
  NODE_ENV,
  PORT,
  LOG_DIR,
  LOG_FORMAT,
  SECRET_KEY,
  CREDENTIALS,
  ORIGIN,
  DB_DATABASE,
  DB_PASSWORD,
  DB_USERNAME,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_MAIN_BUCKET,
} = envVars;
