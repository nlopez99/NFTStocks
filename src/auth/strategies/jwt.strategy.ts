import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JWTPayload, ValidJWTPayload } from '../interfaces/jwt.interface'

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ACCESS_SECRET',
    })
  }

  async validate(payload: JWTPayload): Promise<ValidJWTPayload> {
    const { firstName, lastName, sub, roles, actions } = payload

    return {
      id: sub,
      firstName,
      lastName,
      roles,
      actions,
    }
  }
}
