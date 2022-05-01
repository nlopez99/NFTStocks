import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '@/user/user.module'

import { AuthSchema } from './models/auth.model'
import { AuthService } from './services/auth.service'
import { PasswordService } from './services/password.service'
import { TokenService } from './services/token.service'
import { JWTStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.ACCESS_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JWTStrategy, PasswordService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
