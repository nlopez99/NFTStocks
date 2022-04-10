import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, NewUser, SanitizedUser, UserUpdate } from './user.model'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>
  ) {}

  async create(newUser: NewUser): Promise<SanitizedUser> {
    const user = new this.userModel(newUser)
    const createdUser = await user.save()

    this.logger.debug(`Created User: ${createdUser.id as string}`)

    return createdUser
  }

  async find(
    filter: { [key: string]: unknown } = {}
  ): Promise<SanitizedUser[]> {
    return await this.userModel.find(filter).exec()
  }

  async findOne(id: string): Promise<SanitizedUser> {
    return await this.userModel.findOne({ _id: id }).exec()
  }

  async update(id: string, updateUser: UserUpdate): Promise<SanitizedUser> {
    return await this.userModel.findOneAndUpdate({ _id: id }, updateUser).exec()
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const deletedUser = await this.userModel
      .findOneAndDelete({ _id: id })
      .exec()
    if (deletedUser) {
      this.logger.debug(`Deleted User: ${deletedUser.id as string}`)
      return { success: true }
    }
    return { success: false }
  }
}
