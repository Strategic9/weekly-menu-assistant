import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'

export const ThemeWrapper = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)
