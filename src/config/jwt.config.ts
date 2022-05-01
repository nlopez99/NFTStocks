import { registerAs } from '@nestjs/config'

const jwtConfig = registerAs('jwt', () => ({
  AUDIENCE: process.env.JWT_AUDIENCE,
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  ACCESS_EXP: process.env.JWT_ACCESS_EXP,
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  REFRESH_EXP: process.env.JWT_REFRESH_EXP,
}))

export default jwtConfig
