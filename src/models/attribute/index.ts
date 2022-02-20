import { Schema, Document, model } from 'mongoose'

const AttributesSchema = new Schema<Attributes>(
  {
    name: { type: String, required: true },
    nftId: { type: String, required: true },
    collectionId: { type: String, required: true },
    propertyType: { type: String, required: true },
    uniqueness: { type: Number, required: true },
  },
  {
    collection: 'Attribute',
    optimisticConcurrency: true,
  }
)

interface Attributes extends Document {
  name: string
  nftId: string
  collectionId: string
  uniqueness: number
  propertyType: string
}

type AttributesUpdate = Partial<Attributes>

type NewAttributes = Omit<Attributes, '_id'>

const AttributesModel = model<Attributes>('Attributes', AttributesSchema)

export { AttributesModel, Attributes, AttributesUpdate, NewAttributes }
