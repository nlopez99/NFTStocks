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
} from '@/auth/models/auth.model'

import { SanitizedUser } from '@/user/user.model'

import { generateId } from '@/utils/common'

const filterExpiredTokens = (tokens: ActiveToken[]): ActiveToken[] => {
  return tokens.filter((token) => isTokenValid(token))
}

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
      audience: this.configService.get<string>('auth.JWT_ACCESS_AUDIENCE'),
      subject: user.id,
      roles: auth.roles,
      actions: auth.actions,
    }
  }

  async createRefreshToken(userId: string): Promise<JWTRefreshToken> {
    return {
      id: await generateId(),
      audience: this.configService.get<string>('auth.JWT_REFRESH_AUD'),
      subject: userId,
    }
  }

  async addValidTokens(tokens: string[]) {
    const decodedTokens = await Promise.all(
      tokens.map((token) => this.jwtService.decode(token))
    )

    const tokenData = decodedTokens.map((tokenData: ActiveToken) => ({
      id: tokenData.id,
      exp: tokenData.exp,
    }))

    const auth = await this.authModel
      .findOne({ userId: decodedTokens[0].sub })
      .exec()

    const newTokens = [...auth.activeTokens, ...tokenData]

    await auth.updateOne({
      $set: { activeTokens: filterExpiredTokens(newTokens) },
    })
  }

  async removeValidTokens(tokens: string[]) {
    const decodedTokens = await Promise.all(
      tokens.map((token) => this.jwtService.decode(token))
    )

    const tokenIds = decodedTokens
      .filter((token) => token !== null)
      .map((tokenData: ActiveToken) => tokenData.id)

    const auth = await this.authModel
      .findOne({ userId: decodedTokens[0].sub })
      .exec()

    const newTokens = auth.activeTokens.filter(
      (token: ActiveToken) => !tokenIds.includes(token.id)
    )

    await auth.updateOne({
      $set: { activeTokens: filterExpiredTokens(newTokens) },
    })
  }

  async signAccessToken(payload: JwtAccessToken) {
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('auth.JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('auth.JWT_ACCESS_EXP'),
      }),
    }
  }

  async signRefreshToken(payload: { id: string; sub: string }) {
    return {
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('auth.JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('auth.JWT_REFRESH_EXP'),
      }),
    }
  }
}
