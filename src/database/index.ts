import { connect, set } from 'mongoose';
import { NODE_ENV, DB_USERNAME, DB_DATABASE, DB_PASSWORD } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.jx9a1cw.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(dbConfig.url);
};
