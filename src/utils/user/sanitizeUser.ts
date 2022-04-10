import { User, SanitizedUser } from '@/user/user.model'

const sanitizeUser = (user: User): SanitizedUser => ({
  username: user.username,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  avatarUrl: user.avatarUrl,
})

export default sanitizeUser
