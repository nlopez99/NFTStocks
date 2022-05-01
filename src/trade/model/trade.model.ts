import { Schema, Document, model } from 'mongoose'

const TradeSchema = new Schema<Trade>(
  {
    /* The collection being traded */
    collectionId: { type: String, required: true },

    /* The user making the trade */
    userId: { type: String, required: true },

    /* the quantity of the item being traded */
    quantity: { type: Number, required: true },

    /* the item's value */
    unitPrice: { type: Number, required: true },

    /* buying or selling the item */
    action: { type: String, required: true, enum: ['buy', 'sell'] },

    /* the current status of the trade */
    status: {
      type: String,
      required: true,
      enum: ['pending', 'fulfilled', 'failed'],
    },
  },
  {
    collection: 'Trade',
    optimisticConcurrency: true,
  }
)

interface Trade extends Document {
  collectionId: string
  userId: string
  quantity: number
  unitPrice: number
  action: 'buy' | 'sell'
  status: 'pending' | 'fulfilled' | 'failed'
}

type NewTrade = Omit<Trade, '_id'>

type UpdateTrade = Partial<Trade>

const TradeModel = model<Trade>('Trade', TradeSchema)

export { Trade, TradeSchema, TradeModel, NewTrade, UpdateTrade }
