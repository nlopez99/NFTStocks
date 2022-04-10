import { Controller, Get, Post, Body, Param } from '@nestjs/common'

import { NewCollection, Collection } from '../model/collection.model'
import { CollectionService } from '../service/collection.service'

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  async create(
    @Body() createCollectionDto: NewCollection
  ): Promise<Collection> {
    return await this.collectionService.create(createCollectionDto)
  }

  @Get()
  async findAll(): Promise<Collection[]> {
    return await this.collectionService.find()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Collection> {
    return await this.collectionService.findOne(id)
  }
}
