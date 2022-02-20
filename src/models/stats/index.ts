import { Schema, Document, model } from 'mongoose'

const StatsSchema = new Schema<Stats>(
  {
    StatsId: { type: String, required: true },
    oneDayVolume: { type: Number, required: true },
    oneDayChange: { type: Number, required: true },
    oneDayAvgPrice: { type: Number, required: true },
    weekVolume: { type: Number, required: true },
    weekChange: { type: Number, required: true },
    weekSales: { type: Number, required: true },
    monthVol: { type: Number, required: true },
    monthSales: { type: Number, required: true },
    monthAvgPrice: { type: Number, required: true },
    totalVolume: { type: Number, required: true },
    totalSales: { type: Number, required: true },
    count: { type: Number, required: true },
    numOwners: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    numReports: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    floorPrice: { type: Number, required: true },
  },
  {
    collection: 'Stats',
    optimisticConcurrency: true,
  }
)

interface Stats extends Document {
  StatsId: string
  oneDayVolume: number
  oneDayChange: number
  oneDayAvgPrice: number
  weekVolume: number
  weekChange: number
  weekSales: number
  monthVol: number
  monthSales: number
  monthAvgPrice: number
  totalVolume: number
  totalSales: number
  count: number
  numOwners: number
  avgPrice: number
  numReports: number
  marketCap: number
  floorPrice: number
}

type StatsUpdate = Partial<Stats>

type NewStats = Omit<Stats, '_id'>

const StatsModel = model<Stats>('Stats', StatsSchema)

export { StatsModel, Stats, StatsUpdate, NewStats }
