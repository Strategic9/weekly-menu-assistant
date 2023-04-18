import { createContext, useState, useMemo } from 'react'

const AppContext = createContext({ role: '', setRole: () => {} })

const AppProvider = ({ children }) => {
  const [role, setRole] = useState('standard')

  const value = useMemo(() => ({ role, setRole }), [role])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppContext, AppProvider }
