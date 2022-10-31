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

const DatePickerBase: ForwardRefRenderFunction<HTMLInputElement, DatePickerProps> = ({
  isDisabled = false,
  isClearable,
  selected,
  showPopperArrow,
  ...rest
}) => {
  return (
    <Input
      as={ReactDatePicker}
      fontSize="md"
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
