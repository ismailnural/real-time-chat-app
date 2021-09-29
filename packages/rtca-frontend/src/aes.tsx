import aes256 from 'aes256'

// The secret key used for encrypting and decrypting messages
const secret_key = process.env.REACT_APP_SECRET_KEY || 'SECRET_KEY'

// Returns the encrypted text
export const toEncrypt = (text: string) => {
  const encrypted = aes256.encrypt(secret_key, text)
  return encrypted
}

// Welcome message is not decrypted
export const toDecrypt = (
  cipher: string,
  username: string,
  oldUsername?: string
) => {
  if (cipher.startsWith('Welcome')) {
    return cipher
  }

  if (cipher.startsWith(username)) {
    return cipher
  }

  if (oldUsername && cipher.startsWith(oldUsername)) {
    return cipher
  }

  // Decryped message is returned
  const decrypted = aes256.decrypt(secret_key, cipher)

  return decrypted
}
