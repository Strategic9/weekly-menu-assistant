import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'

type UserContext = {
  currentUser: User
  setCurrentUser: Dispatch<SetStateAction<User>>
}

type User = {
  email: string
  role: string
  token?: string
  userId: string
  username: string
}

export const defaultUser = {
  email: '',
  role: '',
  token: '',
  userId: '',
  username: ''
}

const UserContext = createContext<UserContext>({
  currentUser: defaultUser,
  setCurrentUser: (currentUser: User) => currentUser
})

type UserProviderProps = {
  children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User>({
    ...defaultUser
  })

  const contextValue = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser])

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
