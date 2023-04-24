import { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react'

type RoleContext = {
  role: string
  setRole: Dispatch<SetStateAction<string>>
}

const AppContext = createContext<RoleContext>({
  role: '',
  setRole: () => {
    /** Empty */
  }
})

const AppProvider = ({ children }) => {
  const [role, setRole] = useState('standard')

  const value = useMemo(() => ({ role, setRole }), [role])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppContext, AppProvider }
