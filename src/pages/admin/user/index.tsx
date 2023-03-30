import { Flex, Text, Spinner } from '@chakra-ui/react'

import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'

import { api, HTTPHandler } from '../../../services/api'
import { queryClient } from '../../../services/queryClient'
import { getGroceryById, Grocery, useGrocery } from '../../../services/hooks/useGroceries'
import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'
import GroceryForm, { CreateGroceryFormData } from '../../../components/Form/GroceryForm'
import PageWrapper from '../../page-wrapper'
import { useEffect, useState } from 'react'
import { getUserById, User } from '../../../services/hooks/useUsers'
import UserForm, { CreateUserFormData } from '../../../components/Form/UserForm'

export default function UserPage(props) {
  const router = useRouter()
  const { user: userId } = router.query
  const alert = useAlert()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const [error, setError] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true)
      try {
        const item = await getUserById(userId as string)

        setUser(item.data)
        setIsLoading(false)
        console.log(item.data)

        return user
      } catch (error) {
        setIsLoading(false)
        setError(true)
      }
    }

    if (!router.isReady) {
      setIsLoading(true)
    } else {
      getUser()
    }
  }, [router.isReady, userId])

  const editUser = useMutation(
    async (user: CreateUserFormData) => {
      try {
        await HTTPHandler.patch(`users/${userId}`, {
          role: user.role
        })
        alert.success('Användaren uppdaterad')
        router.push('..')
      } catch (response) {
        alert.error(response.data.message)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groceries')
        router.push('..')
      }
    }
  )

  const handleEditUser: SubmitHandler<CreateUserFormData> = async (values) => {
    console.log(values)
    await editUser.mutateAsync(values)
  }

  return (
    <PageWrapper>
      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Fel vid hämtning av ingredienser.</Text>
        </Flex>
      ) : (
        <UserForm handleSubmit={handleEditUser} />
      )}
    </PageWrapper>
  )
}
