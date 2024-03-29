import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext'
import { localStorage } from '../services/localstorage'

interface PageWrapperProps {
  children: ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.get('token')) {
      router.push('/')
    } else {
      setIsLoading(false)
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
