import axios from 'axios'

const grabDiscordMemberCount = async (serverId: string): Promise<number> => {
  const response = await axios.get(
    `https://discord.com/api/v9/invites/${serverId}?with_counts=true&with_expiration=true`
  )
  return response?.data
    ? response.data.approximate_member_count
    : 0
}

export { grabDiscordMemberCount }

export default { grabDiscordMemberCount }
