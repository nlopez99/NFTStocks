import { Injectable } from '@nestjs/common'

@Injectable()
export class TradeService {
  create(createTradeDto: CreateTradeDto) {
    return 'This action adds a new trade'
  }

  findAll() {
    return `This action returns all trade`
  }

  findOne(id: number) {
    return `This action returns a #${id} trade`
  }

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`
  }

  remove(id: number) {
    return `This action removes a #${id} trade`
  }
}
