import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Auth, NewAuth, SanitizedAuth } from '@/auth/models/auth.model'
import { AuthenticatedUser, NewUser } from '@/user/user.model'
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

  async createUserAuth(password: string): Promise<SanitizedAuth> {
    const createdPassword = await this.passwordService.hashPassword(password)
    const newAuth = new this.authModel(createdPassword)
    const userAuth = await newAuth.save()
    const { salt, hash, ...sanitizedUserAuth } = userAuth
    // TODO: refactor this type assertion
    return sanitizedUserAuth as unknown as SanitizedAuth
  }

  async connectUserToAuth(userId: string, authId: string): Promise<void> {
    const auth = await this.authModel.findOne({ _id: authId }).exec()
    auth.userId = userId
    await auth.save()
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
      ...sanitizeUser(user),
      accessToken,
      refreshToken,
    }
  }

  async register(newUser: NewUser & NewAuth): Promise<AuthenticatedUser> {
    const { password, ...user } = newUser

    const sanitizedAuth = await this.createUserAuth(password)

    const sanitizedNewUser = await this.userService.create({
      ...user,
      authId: sanitizedAuth.id,
    })

    await this.connectUserToAuth(sanitizedNewUser.id, sanitizedAuth.id)

    const { accessToken } = await this.tokenService.signAccessToken(
      await this.tokenService.createAccessToken(sanitizedNewUser, sanitizedAuth)
    )

    const { refreshToken } = await this.tokenService.signRefreshToken(
      await this.tokenService.createRefreshToken(sanitizedNewUser.id)
    )

    await this.tokenService.addValidTokens([accessToken, refreshToken])

    return {
      ...sanitizedNewUser,
      accessToken,
      refreshToken,
    }
  }
}
