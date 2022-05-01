import { Schema, Document, model } from 'mongoose'

const UserSchema = new Schema<User>(
  {
    authId: { type: String, required: true },
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
  id: string
  authId: string
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

type SanitizedUser = Pick<
  User,
  | 'id'
  | 'authId'
  | 'username'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'avatarUrl'
>

type NewUser = Omit<SanitizedUser, 'id' | 'authId'>

type UserUpdate = Partial<User>

const UserModel = model<User>('User', UserSchema)

export { UserSchema, UserModel, User, NewUser, UserUpdate, SanitizedUser }
