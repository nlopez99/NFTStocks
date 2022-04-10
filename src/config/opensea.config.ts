import { registerAs } from '@nestjs/config'

const openseaConfig = registerAs('database', () => ({
  API_KEY: process.env.OPENSEA_TOKEN,
}))

export default openseaConfig
