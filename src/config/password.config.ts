import { registerAs } from '@nestjs/config'

const passwordConfig = registerAs('password', () => ({
  HASH_ROUNDS: process.env.PW_HASH_ROUNDS,
  KEY_LENGTH: process.env.PW_KEY_LENGTH,
  SALT_LENGTH: process.env.PW_SALT_LENGTH,
  ALGORITHM: process.env.PW_ALGORITHM,
}))

export default passwordConfig
