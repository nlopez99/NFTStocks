import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CollectionController } from './controller/collection.controller'
import { CollectionSchema } from './model/collection.model'
import { CollectionService } from './service/collection.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
