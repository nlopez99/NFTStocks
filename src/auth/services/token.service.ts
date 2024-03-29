import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import {
  ActiveToken,
  Auth,
  JWTAccessToken,
  JWTRefreshToken,
  SanitizedAuth,
  SignedAccessToken,
  SignedRefreshToken,
} from '@/auth/models/auth.model'

import { SanitizedUser } from '@/user/user.model'

import { generateId } from '@/utils/common'
import { filterExpiredTokens } from '@/utils/token'

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async createAccessToken(
    user: SanitizedUser,
    auth: SanitizedAuth
  ): Promise<JWTAccessToken> {
    return {
      id: await generateId(),
      firstName: user.firstName,
      lastName: user.lastName,
      aud: this.configService.get<string>('jwt.AUDIENCE'),
      sub: user.id,
      roles: auth.roles,
      actions: auth.actions,
    }
  }

  async createRefreshToken(userId: string): Promise<JWTRefreshToken> {
    return {
      id: await generateId(),
      aud: this.configService.get<string>('jwt.AUDIENCE'),
      sub: userId,
    }
  }

  async addValidTokens(tokens: string[]): Promise<void> {
    const decodedTokens = await Promise.all(
      tokens.map((token) => this.jwtService.decode(token))
    )

    const tokenData = decodedTokens.map((token: ActiveToken) => ({
      id: token.id,
      exp: token.exp,
    }))

    const [accessToken] = decodedTokens

    const auth = await this.authModel
      .findOne({ userId: accessToken.sub })
      .exec()

    const newTokens = [...auth.activeTokens, ...tokenData]

    await auth
      .updateOne({
        $set: { activeTokens: filterExpiredTokens(newTokens) },
      })
      .exec()
  }

  async removeValidTokens(tokens: string[]): Promise<void> {
    const decodedTokens = await Promise.all(
      tokens.map((token) => this.jwtService.decode(token))
    )

    const tokenIds = decodedTokens
      .filter((token) => !!token)
      .map((tokenData: ActiveToken) => tokenData.id)

    const [accessToken] = decodedTokens

    const auth = await this.authModel
      .findOne({ userId: accessToken.sub })
      .exec()

    const newTokens = auth.activeTokens.filter(
      (token: ActiveToken) => !tokenIds.includes(token.id)
    )

    await auth
      .updateOne({
        activeTokens: filterExpiredTokens(newTokens),
      })
      .exec()
  }

  async signAccessToken(payload: JWTAccessToken): Promise<SignedAccessToken> {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.SECRET'),
        expiresIn: this.configService.get<string>('jwt.ACCESS_EXP'),
      }),
    }
  }

  async signRefreshToken(payload: {
    id: string
    sub: string
  }): Promise<SignedRefreshToken> {
    return {
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.SECRET'),
        expiresIn: this.configService.get<string>('jwt.REFRESH_EXP'),
      }),
    }
  }
}
