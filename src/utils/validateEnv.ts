import { EnvError, cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  console.log('first');
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
};
