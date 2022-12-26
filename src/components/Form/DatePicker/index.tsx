import { forwardRef, ForwardRefRenderFunction } from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { FieldError } from 'react-hook-form'
import { Input } from '../Input'

import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProps extends ReactDatePickerProps {
  label?: string
  error?: FieldError
  isDisabled?: boolean
}

const DatePickerBase: ForwardRefRenderFunction<HTMLInputElement, DatePickerProps> = (
  {
    name,
    label,
    error = null,
    isDisabled = false,
    isClearable,
    selected,
    showPopperArrow,
    ...rest
  },
  ref
) => {
  return (
    <Input
      as={ReactDatePicker}
      fontSize={['sm', 'md']}
      size={['sm', 'md']}
      w={['95%',]}
      textAlign="center"
      selected={selected}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      isDisabled={isDisabled}
      {...rest}
    />
  )
}

export const DatePicker = forwardRef(DatePickerBase)
