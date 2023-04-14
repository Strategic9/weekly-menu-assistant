import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Button,
  Spinner
} from '@chakra-ui/react'
import Link from 'next/link'

import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useMutation } from 'react-query'

import { Input } from '../../../components/Form/Input'
import { HTTPHandler } from '../../../services/api'
import { queryClient } from '../../../services/queryClient'
import { Category, getCategoryById } from '../../../services/hooks/useCategories'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import PageWrapper from '../../page-wrapper'
import { getUsersById, User } from '../../../services/hooks/useUsers'
import { getUser } from '../../../services/hooks/useUser'

type CreateUserFormData = {
  role: string
}

const createUserFormSchema = yup.object({
  role: yup.string().required('Role is required')
})

export default function UserPage() {
  const router = useRouter()
  const alert = useAlert()
  const { user: userId } = router.query
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const [error, setError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  useEffect(() => {
    const selectedUser = async () => {
      setIsLoading(true)
      console.log(user)

      try {
        const { data } = await getUser(userId as string)
        setUser(data)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setError(true)
      }
    }

    if (!router.isReady) {
      setIsLoading(true)
    } else {
      selectedUser()
    }
  }, [router.isReady, userId])

  const editUser = useMutation(
    async (user: CreateUserFormData) => {
      await HTTPHandler.patch(`users/${userId}`, { ...user })
        .then(() => {
          alert.success('Användare ändrad')
          router.push('..')
        })
        .catch(({ response }) => {
          alert.error(response.data.message)
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    }
  )

  const handleEditUser: SubmitHandler<CreateUserFormData> = async (values) => {
    await editUser.mutateAsync(values)
  }

  useEffect(() => {
    setValue('role', user?.role)
  }, [user, setValue])

  return (
    <PageWrapper>
      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Fel vid hämtning av användare.</Text>
        </Flex>
      ) : (
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="grain"
          p={['6', '8']}
          onSubmit={handleSubmit(handleEditUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Förändra {user.firstName} {user.lastName}
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input label="Roll" error={errors.role} {...register('role')} />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/admin" passHref>
                <Button aria-label="avbryt" colorScheme="gray">
                  Avbryt
                </Button>
              </Link>
              <Button aria-label="spara" type="submit" colorScheme="oxblood">
                Spara
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}
    </PageWrapper>
  )
}
