import { Alert as ChakraAlert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import { AlertComponentPropsWithStyle } from 'react-alert'

export function Alert({ message, options, style }: AlertComponentPropsWithStyle) {
  return (
    <ChakraAlert status={options.type} style={style}>
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </ChakraAlert>
  )
}
