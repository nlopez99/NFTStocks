import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common'

import { NewTrade, Trade, UpdateTrade } from '../model/trade.model'
import { TradeService } from '../service/trade.service'

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  async create(@Body() newTrade: NewTrade): Promise<Trade> {
    return await this.tradeService.create(newTrade)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Trade> {
    return await this.tradeService.findOne(id)
  }

  @Get(':id')
  async findByUser(@Param('userId') userId: string): Promise<Trade[]> {
    return await this.tradeService.findByUser(userId)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrade: UpdateTrade
  ): Promise<Trade> {
    return await this.tradeService.update(id, updateTrade)
  }
}
