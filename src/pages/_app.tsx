import { QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import type { AppProps } from 'next/app'
import { queryClient } from '../services/queryClient'
import { Provider as AlertProvider, positions, transitions, AlertProviderProps } from 'react-alert'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { Alert } from '../components/Alert'
import '../styles/DatePicker.css'
import { AppProvider } from '../contexts/AppContext'
import { UserProvider } from '../contexts/UserContext'

const options: AlertProviderProps = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: '30px',
  transition: transitions.SCALE,
  template: Alert
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Your AI menu assistant | Forkify</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <UserProvider>
              <ChakraProvider theme={theme}>
                <AlertProvider {...options}>
                  <Component {...pageProps} />
                </AlertProvider>
              </ChakraProvider>
            </UserProvider>
          </AppProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
