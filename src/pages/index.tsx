import { Flex, Button, Stack, Text, Link } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { api } from '../services/api'
import { localStorage } from '../services/localstorage'
import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'
import { GoogleLogin } from 'react-google-login'
import { useEffect } from 'react'
import { Logo } from '../components/Header/Logo'

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
  const alert = useAlert()
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_CLIENT_ID

  const useGapi = async () => {
    const gapi = await import('gapi-script').then((pack) => pack.gapi)
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    }
    gapi.load('client:auth2', initClient)
  }

  useEffect(() => {
    useGapi()
  })

  const onSuccess = async (res) => {
    console.log('success:', res)
    await api
      .post('users/login', {
        email: res.profileObj.email,
        password: res.googleId
      })
      .then((res) => {
        onLoginSucess(res)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          signUp(res)
        } else {
          alert.error('Please verify the information')
        }
      })
  }

  const onFailure = (err) => {
    console.log('failed:', err)
  }

  const signUp = async (gisRes) => {
    await api
      .post('users', {
        email: gisRes.profileObj.email,
        password: gisRes.googleId,
        firstName: gisRes.profileObj.givenName,
        lastName: gisRes.profileObj.familyName
      })
      .then(() => {
        handleSignIn({ email: gisRes.profileObj.email, password: gisRes.googleId })
      })
      .catch(() => {
        alert.error('Please verify the information')
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
        alert.error('Please verify the information')
      })
  }

  const onLoginSucess = (res) => {
    alert.success('Welcome')
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
        maxW={360}
        bg="white"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
        boxShadow="xl"
        rounded="md"
      >
        <Logo linkTo={'/'} />
        <Stack mt={10} spacing="4">
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
        <Flex mt="6" w="100%" justifyContent="center">
          <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          />
        </Flex>
        <Text mt={8} fontSize={14}>
          Don't have an account?
          <Link ml={1} textDecorationLine="underline" color="oxblood.400" href="/signup">
            Create one here
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
