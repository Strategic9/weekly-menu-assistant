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
import { getUserById } from '../../../services/hooks/useUsers'
import UserForm from '../../../components/Form/UserForm'

export default function UserPage() {
  const router = useRouter()
  const { user: userId } = router.query
  const alert = useAlert()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState({})
  const [error, setError] = useState(false)

  useEffect(() => {
    const getUserDetails = async () => {
      setIsLoading(true)
      console.log('here')

      try {
        const { items } = await getUserById(user)
        setUser({ ...items })
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setError(true)
      }
    }

    if (!router.isReady) {
      setIsLoading(true)
    } else {
      getUserDetails()
    }
  }, [router.isReady, user])

  return <PageWrapper>{user}</PageWrapper>
}
