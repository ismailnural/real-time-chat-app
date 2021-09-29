export const process = (encrypt: boolean, text: string, cipher: string) => {
  return {
    type: 'PROCESS',
    payload: { encrypt, text, cipher },
  }
}
