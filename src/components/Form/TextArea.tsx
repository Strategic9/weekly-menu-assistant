import {
  FormLabel,
  FormControl,
  TextareaProps as ChakraTextareaProps,
  Textarea as ChakraTextarea,
  FormErrorMessage
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'

interface TextAreaProps extends ChakraTextareaProps {
  name: string
  label?: string
  error?: FieldError
}

const TextAreaBase: ForwardRefRenderFunction<HTMLSelectElement, TextAreaProps> = (
  { name, label, error = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraTextarea
        name={name}
        id={name}
        placeholder="Gör ett val"
        focusBorderColor="oxblood.500"
        bgColor="gray.100"
        _hover={{
          bgColor: 'gray.100'
        }}
        size="lg"
        fontSize={['14px', '16px']}
        ref={ref}
        {...rest}
      />
      {error && <FormErrorMessage color="red.600">{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const Textarea = forwardRef(TextAreaBase)
