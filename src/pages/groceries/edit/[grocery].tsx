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

export default function GroceryPage() {
  const router = useRouter()
  const { grocery: groceryId } = router.query
  const alert = useAlert()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setGrocery] = useState<Grocery>()
  const [error, setError] = useState(false)

  useEffect(() => {
    const getGrocery = async () => {
      setIsLoading(true)
      try {
        const item = await getGroceryById(groceryId as string, 'category')

        setGrocery(item.grocery)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setError(true)
      }
    }

    if (!router.isReady) {
      setIsLoading(true)
    } else {
      getGrocery()
    }
  }, [router.isReady, groceryId])

  const editGrocery = useMutation(
    async (grocery: CreateGroceryFormData) => {
      try {
        await HTTPHandler.patch(`groceries/${groceryId}`, {
          name: grocery.name,
          category: {
            id: grocery.categoryId
          },
          measurementUnits: [
            {
              id: grocery.measurementUnitId
            }
          ]
        })
        alert.success('Ingrediens uppdaterad')
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

  const handleEditGrocery: SubmitHandler<CreateGroceryFormData> = async (values) => {
    await editGrocery.mutateAsync(values)
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
        <GroceryForm handleSubmit={handleEditGrocery} initialData={data} />
      )}
    </PageWrapper>
  )
}
