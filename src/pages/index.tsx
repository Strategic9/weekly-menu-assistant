import { Flex, Button, Stack, Text, Link, Spinner, Box } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { api } from '../services/api'
import { UserContext, UserProvider } from '../contexts/UserContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'
import { Logo } from '../components/Header/Logo'
import { useSession, signIn, signOut } from 'next-auth/react'

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object({
  email: yup.string().required('Vänligen ange e-post').email('Ogiltig e-post'),
  password: yup.string().required('Lösenord är obligatoriskt')
})

export default function SignIn() {
  const { user, setUser } = useContext(UserContext)
  console.log(user)

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
      .catch((err) => {
        if (session && err.response.data.details.includes('duplicate key')) {
          alert.error('Användaren finns redan, försök logga in med lösenord', {
            timeout: 5500
          })
          signOut({ redirect: false })
        } else {
          alert.error('Vänligen kontrollera angiven information')
        }
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
    setUser(res.data!)
    router.push('/menu')
  }

  if (session) {
    console.log(session)
    onSuccess()
  }

  return (
    <UserProvider>
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
                <Button aria-label="logga in" type="submit" mt="6" colorScheme="oxblood">
                  Logga in
                </Button>
              </Flex>

              <Flex mt="6" w="100%" justifyContent="center">
                <Button
                  aria-label="Logga in med Google"
                  borderRadius={8}
                  p={'22px 12px'}
                  width="100%"
                  onClick={() => signIn('google')}
                  alignItems="center"
                  justifyContent={'center'}
                  colorScheme="gray"
                  variant="outline"
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                  }
                >
                  Logga in med Google
                </Button>
              </Flex>
              <Text mt={8} fontSize={14}>
                Har du inget konto?
                <Link
                  aria-label="Har du inget konto? Skapa ett här!"
                  ml={1}
                  textDecorationLine="underline"
                  color="oxblood.400"
                  href="/signup"
                >
                  Skapa ett här!
                </Link>
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </UserProvider>
  )
}
