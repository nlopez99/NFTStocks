import { Controller, Post, Body, Response } from '@nestjs/common'
import { Response as ExpressResponse } from 'express'

import { NewAuth, SignedAccessToken } from './auth/models/auth.model'
import { AuthService } from './auth/services/auth.service'
import { LoginData, NewUser } from './user/user.model'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginData,
    @Response({ passthrough: true }) response: ExpressResponse
  ): Promise<SignedAccessToken> {
    const { email, password } = body

    const user = await this.authService.login(email, password)

    const { refreshToken, ...userData } = user

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 5184000000, // 60 days
    })

    return userData
  }

  @Post('register')
  async register(@Body() body: NewUser & NewAuth): Promise<SignedAccessToken> {
    return await this.authService.register(body)
  }
}
