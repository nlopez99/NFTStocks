import { Schema, Document, model } from 'mongoose'

const CollectionSchema = new Schema<Collection>(
  {
    name: { type: String, required: true },
    about: { type: String, required: false },
    avatar: { type: String, required: false },
    link: { type: String, required: true },
    currentPrice: { type: Number, required: true },
  },
  {
    collection: 'Collection',
    optimisticConcurrency: true,
  }
)

interface Collection extends Document {
  name: string
  about: string
  avatar: string
  link: string
  currentPrice: number
}

type CollectionUpdate = Partial<Collection>

type NewCollection = Omit<Collection, '_id'>

const CollectionModel = model<Collection>('Collection', CollectionSchema)

export { CollectionModel, Collection, CollectionUpdate, NewCollection }
