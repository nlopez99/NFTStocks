import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

import { Response } from 'express'
import * as Joi from 'joi'

import { AuthService } from '@/auth/services/auth.service'
import { TokenService } from '@/auth/services/token.service'
import { NewUser, SanitizedUser } from '@/user/user.model'
import { UserService } from '@/user/user.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response
  ): Promise<any> {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })

    const { error } = schema.validate({
      email,
      password,
    })

    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST)

    const result = await this.authService.login(email, password)

    response.cookie('refresh_token', result.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
    })

    delete result.refresh_token

    return result
  }
}
