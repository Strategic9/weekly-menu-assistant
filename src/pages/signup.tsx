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
        alert.success('Konto skapat')
        handleSignIn(values)
      })
      .catch((er) => {
        if (er.response.data.details.includes('duplicate key')) {
          alert.error('Denna e-post är redan i bruk')
        } else {
          alert.error('Kontrollera angiven information')
        }
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
    router.push('menu')
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
              label="Tilltalsnamn"
              error={errors.firstName}
              {...register('firstName')}
            />
            <Input
              type="text"
              label="Efternamn"
              error={errors.lastName}
              {...register('lastName')}
            />
          </Stack>
          <Input type="email" label="E-post" error={errors.email} {...register('email')} />
          <Input
            type="password"
            label="Lösenord"
            error={errors.password}
            {...register('password')}
          />
        </Stack>

        <Button aria-label="registrera konto" type="submit" mt="6" colorScheme="oxblood">
          Registrera konto
        </Button>

        <Text mt={8} fontSize={14}>
          Har du redan ett konto?
          <Link ml={1} textDecorationLine="underline" color="oxblood.400" href="/">
            Logga in här
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
