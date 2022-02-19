import { config } from '../config/appConfig';

const {
  db: { host, databaseName, user, pass },
  app: { nodeEnv }
} = config;

export const getDBConnectionURI = () => {
  let connectionURI;

  if (isDevEnv() && host === 'localhost') {
    connectionURI = `mongodb://${host}/${databaseName}`;
  } else {
    connectionURI = `mongodb+srv://${user}:${pass}@${host}/${databaseName}?retryWrites=true&w=majority`;
  }

  return connectionURI;
};

export const isDevEnv = () => {
  return nodeEnv === 'development' ? true : false;
};
