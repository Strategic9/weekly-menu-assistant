import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Icon
} from '@chakra-ui/react'
import { FiFile } from 'react-icons/fi'
import { useController } from 'react-hook-form'
import { useRef } from 'react'

const FileUpload = ({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false
}) => {
  const inputRef = useRef()
  const {
    field: { ref, value, ...inputProps },
    fieldState: { invalid }
  } = useController({
    name,
    control,
    rules: { required: isRequired }
  })

  return (
    <FormControl isInvalid={invalid} isRequired>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={<Icon as={FiFile} />}
        />
        <input
          type="file"
          accept={acceptedFileTypes}
          name={name}
          ref={inputRef}
          {...inputProps}
          // eslint-disable-next-line react/no-unknown-property
          inputRef={ref}
          style={{ display: 'none' }}
        ></input>
        <Input
          placeholder={placeholder || 'Your file ...'}
          onClick={() => inputRef.current.click()}
          value={value}
        />
      </InputGroup>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  )
}

export default FileUpload
