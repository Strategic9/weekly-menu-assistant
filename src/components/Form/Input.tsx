import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  InputProps as ChakraInputProps,
  FormErrorMessage
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  name: string
  label?: string
  error?: FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, justifyContent, display, ...rest },
  ref
) => {
  return (
    <FormControl justifyContent={justifyContent} display={display} isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="oxblood.500"
        _placeholder={{ color: 'gray.250' }}
        bgColor="gray.100"
        _hover={{
          bgColor: 'gray.100'
        }}
        size="lg"
        ref={ref}
        {...rest}
      />
      {error && <FormErrorMessage color="red.600">{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const Input = forwardRef(InputBase)
