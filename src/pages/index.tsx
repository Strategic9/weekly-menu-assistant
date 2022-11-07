import { Flex, Button, Stack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { api } from '../services/api'
import { localStorage } from '../services/localstorage'
import { useRouter } from 'next/router'

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required')
})

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signInFormSchema)
  })
  const router = useRouter()

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await api
      .post('users/login', {
        ...values
      })
      .then((res) => {
        localStorage.set('token', res.data?.token)
        router.push('dashboard')
      })
      .catch(({ resError }) => {})
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
        onSubmit={handleSubmit(handleSignIn)}
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
        </Stack>

        <Button type="submit" mt="6" colorScheme="oxblood">
          Sign In
        </Button>
      </Flex>
    </Flex>
  )
}
