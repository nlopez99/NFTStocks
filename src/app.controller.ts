import { Controller, Post, Body } from '@nestjs/common'

import { AppService } from './app.service'
import { SignedAccessToken } from './auth/models/auth.model'
import { AuthService } from './auth/services/auth.service'
import { LoginData } from './user/user.model'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() body: LoginData): Promise<SignedAccessToken> {
    const { email, password } = body
    return await this.authService.login(email, password)
  }
}
