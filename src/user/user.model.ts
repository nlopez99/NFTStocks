import { Schema, Document, model } from 'mongoose'

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatarUrl: { type: String, required: false },
  },
  {
    collection: 'User',
    optimisticConcurrency: true,
  }
)

interface User extends Document {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

interface SanitizedUser {
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

type NewUser = Omit<SanitizedUser, '_id'>

type UserUpdate = Partial<User>

const UserModel = model<User>('User', UserSchema)

export { UserSchema, UserModel, User, NewUser, UserUpdate, SanitizedUser }
