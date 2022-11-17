import { Flex, Button, Stack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { HTTPHandler } from '../services/api'
import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'

type SignUpFormData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

const signUpFormSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(36, 'Password must be at most 36 characters'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required')
})

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpFormSchema)
  })
  const router = useRouter()
  const alert = useAlert()

  const handleSignUp: SubmitHandler<SignUpFormData> = async (values) => {
    await HTTPHandler.post('users', {
      ...values
    })
      .then(() => {
        alert.success('Sign up succesful')
        router.push('/')
      })
      .catch(() => {
        alert.error('Please verify the information')
      })
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="grain">
      <Flex
        as="form"
        w="100%"
        maxW={360}
        bg="white"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignUp)}
        boxShadow="xl"
        rounded="md"
      >
        <Stack spacing="4">
          <Input type="email" label="Email" error={errors.email} {...register('email')} />
          <Input
            type="password"
            label="Password"
            error={errors.password}
            {...register('password')}
          />
          <Input
            type="text"
            label="First Name"
            error={errors.firstName}
            {...register('firstName')}
          />
          <Input type="text" label="Last Name" error={errors.lastName} {...register('lastName')} />
        </Stack>

        <Button type="submit" mt="6" colorScheme="oxblood">
          Sign Up
        </Button>
      </Flex>
    </Flex>
  )
}
