import { Flex, Button, Stack, Text, Link, Spinner } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { api } from '../services/api'
import { localStorage } from '../services/localstorage'
import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'
import { Logo } from '../components/Header/Logo'
import { useSession, signIn } from 'next-auth/react'

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object({
  email: yup.string().required('Vänligen ange e-post').email('Ogiltig e-post'),
  password: yup.string().required('Lösenord är obligatoriskt')
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
  const alert = useAlert()
  const { data: session } = useSession()

  const onSuccess = async () => {
    await api
      .post('users/login', {
        email: session.user.email,
        password: session.user.id
      })
      .then((res) => {
        onLoginSucess(res)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          signUp(session.user)
        } else {
          alert.error('Vänligen kontrollera angiven information')
        }
      })
  }

  const signUp = async (user) => {
    const username = user.name.split(' ')
    await api
      .post('users', {
        email: user.email,
        password: user.id,
        firstName: username[0],
        lastName: username[1] || null
      })
      .then(() => {
        handleSignIn({ email: user.email, password: user.id })
      })
      .catch(() => {
        alert.error('Vänligen kontrollera angiven information')
      })
  }

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await api
      .post('users/login', {
        ...values
      })
      .then((res) => {
        onLoginSucess(res)
      })
      .catch(() => {
        alert.error('Vänligen kontrollera angiven information')
      })
  }

  const onLoginSucess = (res) => {
    alert.success('Välkommen in')
    localStorage.set('token', res.data?.token)
    localStorage.set('username', res.data?.username)
    localStorage.set('email', res.data?.email)
    localStorage.set('user-id', res.data?.userId)
    router.push('menu')
  }

  if (session) {
    onSuccess()
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="grain">
      <Flex
        w="100%"
        maxW={360}
        bg="white"
        p="8"
        borderRadius={8}
        flexDir="column"
        boxShadow="xl"
        rounded="md"
      >
        <Logo linkTo={'/'} />
        {session ? (
          <Flex mt="6" w="100%" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <>
            <Flex as="form" onSubmit={handleSubmit(handleSignIn)} flexDir="column">
              <Stack mt={10} spacing="4">
                <Input type="email" label="E-post" error={errors.email} {...register('email')} />
                <Input
                  type="password"
                  label="Lösenord"
                  error={errors.password}
                  {...register('password')}
                />
              </Stack>
              <Button type="submit" mt="6" colorScheme="oxblood">
                Logga in
              </Button>
            </Flex>

            <Flex mt="6" w="100%" justifyContent="center">
              <button onClick={() => signIn('google')}>Sign in</button>
            </Flex>
            <Text mt={8} fontSize={14}>
              Har du inget konto?
              <Link ml={1} textDecorationLine="underline" color="oxblood.400" href="/signup">
                Skapa ett här!
              </Link>
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  )
}
