const isBrowser = () => typeof window !== 'undefined'

export const localStorage = {
  set: (key: string, value: string) => {
    isBrowser() && window.localStorage.setItem(key, value)
  },
  get: (key: string) => {
    return isBrowser() && window.localStorage.getItem(key)
  },
  delete: (key: string) => {
    return isBrowser() && window.localStorage.removeItem(key)
  }
}
