import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV
  },
  db: {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    databaseName: process.env.DB_NAME
  }
};
