import { User, SanitizedUser } from '@/user/user.model'

const sanitizeUser = (user: User): SanitizedUser => {
  const { password, ...cleanedUser } = user
  return cleanedUser
}

export default sanitizeUser
