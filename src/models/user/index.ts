import { Schema, Document, model } from 'mongoose'

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    avatar: { type: String, required: false },
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
  phone: string | null
  avatar: string | null
}

type UserUpdate = Partial<User>

type NewUser = Omit<User, '_id'>

const UserModel = model<User>('User', UserSchema)

export { UserModel, User, UserUpdate, NewUser }
