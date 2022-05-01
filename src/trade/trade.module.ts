import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TradeController } from './controller/trade.controller'
import { TradeSchema } from './model/trade.model'
import { TradeService } from './service/trade.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trade', schema: TradeSchema }]),
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
