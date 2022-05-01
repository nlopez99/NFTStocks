import { registerAs } from '@nestjs/config'

const openseaConfig = registerAs('opensea', () => ({
  API_KEY: process.env.OPENSEA_TOKEN,
}))

export default openseaConfig
