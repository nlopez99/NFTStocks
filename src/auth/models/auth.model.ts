import { Schema, Document, model } from 'mongoose'

const activeTokenSchema = {
  id: { type: String, required: true },
  exp: { type: Number, required: true },
}

const AuthSchema = new Schema<Auth>(
  {
    userId: { type: String, required: false },
    hash: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    roles: [{ type: String, required: true }],
    actions: [{ type: String, required: true }],
    activeTokens: [activeTokenSchema],
  },
  { collection: 'Auth' }
)

interface Auth extends Document {
  userId: string
  hash: Buffer
  salt: Buffer
  roles: string[]
  actions: string[]
  activeTokens: ActiveToken[]
}

interface ActiveToken {
  id: string
  exp: number
}

interface SignedAccessToken {
  accessToken: string
}

interface SignedRefreshToken {
  refreshToken: string
}

type SanitizedAuth = Omit<Auth, 'hash' | 'salt'>

interface NewAuth {
  password: string
  confirmation: string
}

interface JWTAccessToken {
  id: string
  firstName: string
  lastName: string
  aud: string
  sub: string
  roles: string[]
  actions: string[]
}

interface JWTRefreshToken {
  id: string
  aud: string
  sub: string
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
  SignedAccessToken,
  SignedRefreshToken,
}
