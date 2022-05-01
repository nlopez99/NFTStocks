import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Auth } from '@/auth/models/auth.model'
import { SanitizedUser } from '@/user/user.model'
import { UserService } from '@/user/user.service'
import { sanitizeUser } from '@/utils/user'

import { PasswordService } from './password.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async login(
    email: string,
    password: string
  ): Promise<SanitizedUser & { accessToken: string; refreshToken: string }> {
    const user = await this.userService.findOne({ email })

    if (!user)
      throw new HttpException(`Cannot find user ${email}`, HttpStatus.NOT_FOUND)

    const { authId, id: userId } = user

    const auth = await this.authModel.findOne({ authId }).exec()

    if (!auth)
      throw new HttpException(
        `Cannot find auth ${authId} for user ${email}`,
        HttpStatus.NOT_FOUND
      )

    const { hash, salt } = auth

    const match = await this.passwordService.match(password, salt, hash)

    if (!match) throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED)

    const { accessToken } = await this.tokenService.signAccessToken(
      await this.tokenService.createAccessToken(user, auth)
    )

    const { refreshToken } = await this.tokenService.signRefreshToken(
      await this.tokenService.createRefreshToken(userId)
    )

    await this.tokenService.addValidTokens([accessToken, refreshToken])

    return {
      ...sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }
}
