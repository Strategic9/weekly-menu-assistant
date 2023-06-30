import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { UserContext } from '../contexts/UserContext'
import { getUser } from '../services/hooks/useUser'
import { localStorage } from '../services/localstorage'

interface PageWrapperProps {
  children: ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { setCurrentUser } = useContext(UserContext)

  useEffect(() => {
    const userToken = localStorage.get('token')
    if (!userToken) {
      router.push('/')
    } else {
      const userId = localStorage.get('user-id')
      const getCurrentUser = async () => {
        try {
          const { data } = await getUser(userId as string)
          setCurrentUser({
            email: data.email,
            role: data.role,
            userId: data.id,
            username: `${data.firstName} ${data.lastName}`
          })
          setIsLoading(false)
        } catch (error) {
          console.error(error)
        }
      }
      getCurrentUser()
    }
  }, [])

  return (
    <SidebarDrawerProvider>
      {isLoading ? null : (
        <Box>
          <Header />

          <Flex w="100%" my="6" justify="center" maxW={1400} mx="auto" px={[4, 6]}>
            <Sidebar />
            <Box width="100%" maxWidth="100%">
              {children}
            </Box>
          </Flex>
        </Box>
      )}
    </SidebarDrawerProvider>
  )
}
