import { QueryClientProvider } from 'react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import type { AppProps } from 'next/app'
import { queryClient } from '../services/queryClient'
import { Provider as AlertProvider, positions, transitions, AlertProviderProps } from 'react-alert'
import { Alert } from '../components/Alert'
import '../styles/DatePicker.css'

const options: AlertProviderProps = {
  position: positions.TOP_CENTER,
  timeout: 8000,
  offset: '30px',
  transition: transitions.SCALE,
  template: Alert
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AlertProvider {...options}>
          <Component {...pageProps} />
        </AlertProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp
