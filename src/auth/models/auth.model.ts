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
  { collection: 'Auth' }
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

interface SignedAccessToken {
  accessToken: string
}

interface SignedRefreshToken {
  refreshToken: string
}

type SanitizedAuth = Pick<
  Auth,
  'id' | 'userId' | 'roles' | 'actions' | 'activeTokens'
>

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
