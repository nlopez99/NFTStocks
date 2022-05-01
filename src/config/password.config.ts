import { registerAs } from '@nestjs/config'

const passwordConfig = registerAs('password', () => ({
  HASH_ROUNDS: parseInt(process.env.PW_HASH_ROUNDS, 10),
  KEY_LENGTH: parseInt(process.env.PW_KEY_LENGTH, 10),
  SALT_LENGTH: parseInt(process.env.PW_SALT_LENGTH, 10),
  ALGORITHM: process.env.PW_ALGORITHM,
}))

export default passwordConfig
