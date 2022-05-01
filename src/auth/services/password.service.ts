import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { randomBytes, pbkdf2 } from 'crypto'

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  private async hash(password: string, salt: Buffer): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      const hashRounds = this.configService.get<number>('password.HASH_ROUNDS')
      const keyLength = this.configService.get<number>('password.KEY_LENGTH')
      const digest = this.configService.get<string>('password.ALGORITHM')

      pbkdf2(
        password,
        salt,
        hashRounds,
        keyLength,
        digest,
        (err, derivedKey) => {
          if (err) reject(err)
          resolve(derivedKey)
        }
      )
    })
  }

  hashPassword = async (
    password: string
  ): Promise<{ salt: Buffer; hash: Buffer }> => {
    const salt = randomBytes(
      this.configService.get<number>('password.SALT_LENGTH')
    )
    const hash = await this.hash(password, salt)
    return { salt, hash }
  }

  match = async (
    passwordToCheck: string,
    salt: Buffer,
    passwordHash: Buffer
  ): Promise<boolean> => {
    const hash = await this.hash(passwordToCheck, salt)
    return Buffer.compare(hash, passwordHash) === 0
  }
}
