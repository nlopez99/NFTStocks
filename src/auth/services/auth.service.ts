import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Auth, NewAuth, SanitizedAuth } from '@/auth/models/auth.model'
import { NewUser, SanitizedUser } from '@/user/user.model'
import { UserService } from '@/user/user.service'

import { sanitizeUser } from '@/utils/user'
import { AuthNotFoundError } from '@/utils/Errors/AuthNotFound.error'

import { PasswordService } from '../password/password.service'
import { TokenService } from '../token/token.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private userService: UsersService,
    private tokenService: TokenService,
    private passwordService: PasswordService
  ) {}

  async login(
    email: string,
    password: string
  ): Promise<SanitizedUser & { access_token: string; refresh_token: string }> {
    const user = await this.userService.findUnsanitizedUserByEmail(email)

    if (!user) {
      throw new UnauthorizedException()
    }

    const auth = await this.getAuthObjectById(user.authId)

    if (!user) {
      throw new AuthNotFoundError()
    }

    const passwordsMatch = await this.passwordService.passwordMatch(
      password,
      auth.salt,
      auth.hash
    )

    if (!passwordsMatch) {
      throw new UnauthorizedException()
    }

    const accessToken = await this.tokenService.signAccessToken(
      this.tokenService.createAccessTokenData(user, auth)
    )

    const refreshToken = await this.tokenService.signRefreshToken(
      this.tokenService.createRefreshToken(user.id)
    )

    await this.tokenService.addValidTokens([
      accessToken.access_token,
      refreshToken.refresh_token,
    ])

    return {
      ...sanitizeUser(user),
      ...accessToken,
      ...refreshToken,
    }
  }
}
