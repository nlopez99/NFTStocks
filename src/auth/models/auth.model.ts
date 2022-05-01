import { Schema, Document, model } from 'mongoose'

const AuthSchema = new Schema<Auth>(
  {
    userId: { type: String, required: true },
    hash: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    roles: [{ type: String, required: true }],
    actions: [{ type: String, required: true }],
    activeTokens: [{ type: String, required: true }],
  },
  { collection: 'auth' }
)

interface Auth extends Document {
  id: string
  userId: string
  hash: Buffer
  salt: Buffer
  roles: string[]
  actions: string[]
  activeTokens: ActiveToken[]
}

interface ActiveToken {
  id: string
  expires: number
}

type SanitizedAuth = Omit<
  Auth,
  'hash' | 'salt' | 'userId' | 'id' | 'activeTokens'
>

interface NewAuth {
  password: string
  confirmation: string
}

interface JWTAccessToken {
  id: string
  firstName: string
  lastName: string
  audience: string
  subject: string
  roles: string[]
  actions: string[]
}

interface JWTRefreshToken {
  id: string
  audience: string
  subject: string
}

const AuthModel = model<Auth>('Auth', AuthSchema)

export {
  Auth,
  AuthSchema,
  AuthModel,
  NewAuth,
  JWTAccessToken,
  JWTRefreshToken,
  SanitizedAuth,
  ActiveToken,
}
