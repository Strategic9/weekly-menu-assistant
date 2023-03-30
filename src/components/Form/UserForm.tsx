import {
  Wrap,
  Flex,
  Box,
  Button,
  Icon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import error from 'next/error'
import { useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form/dist/types/form'
import { RiDeleteBinLine } from 'react-icons/ri'
import { ref } from 'yup'
import user from '../../pages/admin/user'
import { User } from '../../services/hooks/useUsers'
import Modal from '../Modal'
import { Input } from './Input'

export type CreateUserFormData = {
  firstName: string
  lastName: string
  role: string
}
interface UserFormParams {
  handleSubmit: SubmitHandler<CreateUserFormData>
  handleEditUser: SubmitHandler<CreateUserFormData>
  handleCancel?: () => void
  initialData?: User
}

export default function UserForm(user: UserFormParams) {
  return (
    <VStack spacing="8">
      <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
        <Heading size={['md', 'lg']} fontWeight="normal">
          {}
        </Heading>

        <Input placeholder="Namn" label="name" error={error} />
      </SimpleGrid>
    </VStack>
  )
}
