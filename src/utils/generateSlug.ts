import { randomBytes } from 'crypto'

export const generateSlug = (length: number = 6): string => {
  return randomBytes(length).toString('base64url').slice(0, length)
}