import { Schema, Document, model } from 'mongoose'

import { assetContracts } from './assetContracts'
import { paymentToken, PaymentToken as PaymentTokenT } from './paymentToken'
import { traits, Traits as TraitsT } from './traits'

const CollectionSchema = new Schema<Collection>(
  {
    /* Collection Name */
    name: { type: String, required: true, unique: true },

    /* Link to Collection on OpenSea */
    externalLink: { type: String, required: false },

    /* Collection Description */
    description: { type: String, required: false },

    /* Collection Slug */
    slug: { type: String, required: true, unique: true },

    /* Collection Image */
    imageUrl: { type: String, required: true },

    /* Collection Banner Image */
    bannerImageUrl: { type: String, required: true },

    status: {
      type: String,
      required: true,
      enum: ['not_requested', 'requested', 'approved', 'verified'],
    },

    /* Contracts tied to collection */
    assetContracts: assetContracts,

    /* Collection Traits */
    traits,

    /* Acceptable Payment Tokens */
    paymentTokens: [paymentToken],
  },
  {
    collection: 'Collection',
    optimisticConcurrency: true,
  }
)

interface Collection extends Document {
  name: string
  externalLink: string
  description: string
  slug: string
  imageUrl: string
  bannerImageUrl: string
  status: string
  assetContracts: string[]
  traits: TraitsT
  paymentTokens: PaymentTokenT[]
}

type NewCollection = Omit<Collection, '_id'>

const CollectionModel = model<Collection>('Collection', CollectionSchema)

export { CollectionSchema, CollectionModel, Collection, NewCollection }
