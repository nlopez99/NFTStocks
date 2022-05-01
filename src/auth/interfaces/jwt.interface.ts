export interface JWTPayload {
  sub: string
  firstName: string
  lastName: string
  roles: string[]
  actions: string[]
}

export type ValidJWTPayload = Pick<
  JWTPayload,
  'actions' | 'roles' | 'firstName' | 'lastName'
> & { id: string }
