import { randomBytes } from 'crypto'

const ALPHA_NUMERIC_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const generateToken = async (
  bytes = 32,
  chars = ALPHA_NUMERIC_CHARS
): Promise<string> =>
  await new Promise((resolve, reject) => {
    randomBytes(bytes, (err, buffer) => {
      if (err)
        return reject(
          new Error(`Issue generating random token: ${err.message}`)
        )
      let token = ''
      for (let i = 0; i < buffer.length; ++i) {
        token += chars[buffer.readUInt8(i) % chars.length]
      }
      return resolve(token)
    })
  })

export default generateToken
