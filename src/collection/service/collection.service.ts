import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Collection, NewCollection } from '../model/collection.model'

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name)

  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<Collection>
  ) {}

  async create(newCollection: NewCollection): Promise<Collection> {
    const collection = new this.collectionModel(newCollection)
    const createdCollection = await collection.save()
    this.logger.debug(`Created collection: ${createdCollection.name}`)
    return createdCollection
  }

  async find(filter: { [key: string]: unknown } = {}): Promise<Collection[]> {
    return await this.collectionModel.find(filter).exec()
  }

  async findOne(id: string): Promise<Collection> {
    return await this.collectionModel.findOne({ _id: id }).exec()
  }
}
