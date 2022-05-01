import moment from 'moment'

import { ActiveToken } from '@/auth/models/auth.model'

const isTokenExpired = (token: ActiveToken): boolean => {
  if (token) return moment(token.expires).isAfter(moment())
  return false
}

const filterExpiredTokens = (tokens: ActiveToken[]): ActiveToken[] =>
  tokens.filter((token) => isTokenExpired(token))

export default filterExpiredTokens
