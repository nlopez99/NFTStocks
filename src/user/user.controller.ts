import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'

import { NewUser, UserUpdate, SanitizedUser } from './user.model'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() newUser: NewUser): Promise<SanitizedUser> {
    return await this.userService.create(newUser)
  }

  @Get()
  async findAll(): Promise<SanitizedUser[]> {
    return await this.userService.find()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SanitizedUser> {
    return await this.userService.findOne({ id })
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUser: UserUpdate
  ): Promise<SanitizedUser> {
    return await this.userService.update(id, updateUser)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return await this.userService.delete(id)
  }
}
