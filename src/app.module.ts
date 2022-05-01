import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CollectionModule } from './collection/collection.module'
import databaseConfig from './config/database.config'
import openseaConfig from './config/opensea.config'
import { TradeModule } from './trade/trade.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [databaseConfig, openseaConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService
          .get<string>('database.MONGO_CONNECTION_STRING')
          .valueOf(),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CollectionModule,
    UserModule,
    TradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
