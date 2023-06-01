import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import User from '../pages/admin/user/[user]'

type UserContext = {
  user: object
  setUser: Dispatch<SetStateAction<User>>
}

type User = {
  email: string
  role: string
  token: string
  userId: string
  username: string
}
const defaultContext = {
  user: {
    email: '',
    role: 'standard',
    token: '',
    userId: '',
    username: ''
  },
  setUser: (user: User) => {
    email: ''
  }
} as UserContext
const UserContext = createContext(defaultContext)

type UserProviderProps = {
  children: ReactNode
}
const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>({
    email: '',
    role: 'standard',
    token: '',
    userId: '',
    username: ''
  })

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
