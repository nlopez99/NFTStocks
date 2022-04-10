import { registerAs } from '@nestjs/config'

const databaseConfig = registerAs('database', () => ({
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: parseInt(process.env.MONGO_PORT, 10) || 27017,
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  MONGO_CONNECTION_STRING:
    process.env.NODE_ENV !== 'production'
      ? `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
      : `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
}))

export default databaseConfig
