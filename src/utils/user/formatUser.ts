import { SanitizedUser } from '@/user/user.model'

const formatUser = (user: SanitizedUser): SanitizedUser => {
  const { id, authId, username, email, firstName, lastName, avatarUrl } = user
  return {
    id,
    authId,
    username,
    email,
    firstName,
    lastName,
    avatarUrl,
  }
}

export default formatUser
