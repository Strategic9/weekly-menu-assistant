import {
  Select as ChakraSelect,
  FormLabel,
  FormControl,
  SelectProps as ChakraSelectProps,
  FormErrorMessage
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'

interface SelectProps extends ChakraSelectProps {
  name: string
  label?: string
  error?: FieldError
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name, label, error = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraSelect
        name={name}
        id={name}
        placeholder="Select"
        focusBorderColor="oxblood.500"
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

export const Select = forwardRef(SelectBase)
