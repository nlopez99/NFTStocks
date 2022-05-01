import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Trade, NewTrade, UpdateTrade } from '../model/trade.model'

@Injectable()
export class TradeService {
  private readonly logger = new Logger(TradeService.name)

  constructor(
    @InjectModel('Trade')
    private readonly tradeModel: Model<Trade>
  ) {}

  async create(newTrade: NewTrade): Promise<Trade> {
    const trade = new this.tradeModel(newTrade)

    const createdTrade = await trade.save()
    this.logger.debug(`Created trade: ${createdTrade._id as string}`)

    return createdTrade
  }

  async update(id: string, updateTrade: UpdateTrade): Promise<Trade> {
    const updatedTrade = await this.tradeModel
      .findOneAndUpdate({ _id: id }, updateTrade)
      .exec()
    this.logger.debug(`Updated trade: ${updatedTrade._id as string}`)

    return updatedTrade
  }

  async find(filter: { [key: string]: unknown } = {}): Promise<Trade[]> {
    return await this.tradeModel.find(filter).exec()
  }

  async findOne(id: string): Promise<Trade> {
    return await this.tradeModel.findOne({ _id: id }).exec()
  }

  async findByUser(userId: string): Promise<Trade[]> {
    return await this.tradeModel.find({ userId }).exec()
  }
}
