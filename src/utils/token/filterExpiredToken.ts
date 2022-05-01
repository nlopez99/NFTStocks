import * as moment from 'moment'

import { ActiveToken } from '@/auth/models/auth.model'

const isTokenExpired = (token: ActiveToken): boolean => {
  return moment(token.exp).isBefore(moment())
}

const filterExpiredTokens = (tokens: ActiveToken[]): ActiveToken[] =>
  tokens.filter((token) => isTokenExpired(token))

export default filterExpiredTokens
