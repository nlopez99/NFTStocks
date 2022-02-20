import { Schema, Document, model } from 'mongoose'

const NFTSchema = new Schema<NFT>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    collectionId: { type: String, required: true },
    avgPrice: { type: Number, default: 0 },
    contractAddress: { type: String, required: true },
    floorPrice: { type: Number, default: 0 },
    link: { type: String, required: true },
  },
  {
    collection: 'NFT',
    optimisticConcurrency: true,
  }
)

interface NFT extends Document {
  name: string
  description: string
  collectionId: string
  avgPrice: number
  contractAddress: string
  floorPrice: number
  link: string
}

type NFTUpdate = Partial<NFT>

type NewNFT = Omit<NFT, '_id'>

const NFTModel = model<NFT>('NFT', NFTSchema)

export { NFTModel, NFT, NFTUpdate, NewNFT }
