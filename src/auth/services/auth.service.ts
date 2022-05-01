import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Auth, NewAuth, SanitizedAuth } from '@/auth/models/auth.model'
import { AuthenticatedUser, NewUser } from '@/user/user.model'
import { UserService } from '@/user/user.service'
import { formatUser } from '@/utils/user'

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

  async createUserAuth(password: string): Promise<SanitizedAuth> {
    const createdPassword = await this.passwordService.hashPassword(password)
    const newAuth = new this.authModel(createdPassword)
    return await newAuth.save()
  }

  async connectUserToAuth(userId: string, authId: string): Promise<void> {
    const auth = await this.authModel.findOne({ _id: authId }).exec()
    await auth.updateOne({ userId }).exec()
  }

  async login(email: string, password: string): Promise<AuthenticatedUser> {
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
      ...formatUser(user),
      accessToken,
      refreshToken,
    }
  }

  async register(newUser: NewUser & NewAuth): Promise<AuthenticatedUser> {
    const { password, ...user } = newUser

    const existingUser = await this.userService.findOne({ email: user.email })

    if (existingUser)
      throw new HttpException(
        `User ${user.email} already exists`,
        HttpStatus.CONFLICT
      )

    const sanitizedAuth = await this.createUserAuth(password)

    const createdUser = await this.userService.create({
      ...user,
      authId: sanitizedAuth.id,
    })

    await this.connectUserToAuth(createdUser.id, sanitizedAuth.id)

    const { accessToken } = await this.tokenService.signAccessToken(
      await this.tokenService.createAccessToken(createdUser, sanitizedAuth)
    )

    const { refreshToken } = await this.tokenService.signRefreshToken(
      await this.tokenService.createRefreshToken(createdUser.id)
    )

    await this.tokenService.addValidTokens([accessToken, refreshToken])

    return {
      ...formatUser(createdUser),
      accessToken,
      refreshToken,
    }
  }
}
