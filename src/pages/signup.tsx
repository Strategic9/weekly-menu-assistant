import { Flex, Button, Stack, Text, Link } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { HTTPHandler } from '../services/api'
import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'
import { localStorage } from '../services/localstorage'
import { Logo } from '../components/Header/Logo'

type SignUpFormData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

type SignInFormData = {
  email: string
  password: string
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
        alert.success('Sign up successful')
        handleSignIn(values)
      })
      .catch((er) => {
        alert.error('Please verify the information')
      })
  }

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    const res = await HTTPHandler.post('users/login', {
      email: values.email,
      password: values.password
    })
    localStorage.set('token', res.data?.token)
    localStorage.set('username', res.data?.username)
    localStorage.set('email', res.data?.email)
    router.push('dashboard')
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="grain">
      <Flex
        as="form"
        w="100%"
        maxW={400}
        bg="white"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignUp)}
        boxShadow="xl"
        rounded="md"
      >
        <Logo linkTo="/" />
        <Stack mt={8} spacing={2}>
          <Stack spacing={4} direction="row">
            <Input
              type="text"
              label="First Name"
              error={errors.firstName}
              {...register('firstName')}
            />
            <Input
              type="text"
              label="Last Name"
              error={errors.lastName}
              {...register('lastName')}
            />
          </Stack>
          <Input type="email" label="Email" error={errors.email} {...register('email')} />
          <Input
            type="password"
            label="Password"
            error={errors.password}
            {...register('password')}
          />
        </Stack>

        <Button type="submit" mt="6" colorScheme="oxblood">
          Sign Up
        </Button>

        <Text mt={8} fontSize={14}>
          Already have an account?
          <Link ml={1} textDecorationLine="underline" color="oxblood.400" href="/">
            Sign in here
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
