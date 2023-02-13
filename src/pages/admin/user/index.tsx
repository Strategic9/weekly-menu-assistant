import { useRouter } from 'next/router'
import { useAlert } from 'react-alert'
import PageWrapper from '../../page-wrapper'
import { useEffect, useState } from 'react'
import { getUserById } from '../../../services/hooks/useUsers'
import GroceryForm from '../../../components/Form/GroceryForm'
import { Flex, Spinner } from '@chakra-ui/react'

export default function UserPage() {
  const router = useRouter()
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
