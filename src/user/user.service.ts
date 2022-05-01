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
    return await user.save()
  }

  async find(
    filter: { [key: string]: unknown } = {}
  ): Promise<SanitizedUser[]> {
    return await this.userModel.find(filter).exec()
  }

  async findOne(filter: { [key: string]: unknown }): Promise<User> {
    return await this.userModel.findOne(filter).exec()
  }

  async findById(id: string): Promise<SanitizedUser> {
    return await this.userModel.findOne({ _id: id }).exec()
  }

  async findByAuthId(authId: string): Promise<SanitizedUser> {
    return await this.userModel.findOne({ authId }).exec()
  }

  async update(id: string, updateUser: UserUpdate): Promise<SanitizedUser> {
    return await this.userModel.findOneAndUpdate({ _id: id }, updateUser).exec()
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const deletedUser = await this.userModel
      .findOneAndDelete({ _id: id })
      .exec()
    if (deletedUser) {
      this.logger.debug(`Deleted User: ${deletedUser.id}`)
      return { success: true }
    }
    return { success: false }
  }
}
