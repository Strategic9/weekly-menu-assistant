import { Box, Text, Flex, Heading, Spinner } from '@chakra-ui/react'

import { Pagination } from '../../components/Pagination'
import { useState } from 'react'
import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import { useDishes } from '../../services/hooks/useDishes'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import { Grocery } from '../../services/hooks/useGroceries'
import Dish from '../../components/Dish'

type Dish = {
  id: string
  name: string
  description: string
  image: string
  recipe: string
  created_at: string
  ingredients: Array<{ grocery: Grocery }>
}

type UseDishData = {
  dishes: Dish[]
  totalCount: number
}

export default function DishList() {
  const [page, setPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const registersPerPage = 4

  const {
    data: useDishesData,
    isLoading,
    isFetching,
    error
  } = useDishes(
    page,
    {},
    {
      'page[limit]': registersPerPage,
      'page[offset]': offset
    }
  )
  const alert = useAlert()

  const data = useDishesData as UseDishData

  async function handlePrefetchDish() {
    await queryClient.prefetchQuery(
      'dishes',
      async () => {
        const response = await HTTPHandler.get('dishes')

        return response.data
      },
      {
        staleTime: 1000 * 60 * 10 // 10 minutes
      }
    )
  }

  async function handleDelete(id: string) {
    await HTTPHandler.delete(`dishes/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['dishes', page])
        alert.success('Maträtt borttagen')
      })
      .catch(() => alert.error('Borttagning misslyckad'))
  }

  function getDishIngredients(dish: Dish) {
    return !!dish.ingredients && dish.ingredients.length > 0
      ? dish.ingredients.sort((a, b) => {
          return a.isMain - b.isMain
        })
      : []
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p={['4', '8']}>
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Maträtter
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fel vid hämtning av maträtter</Text>
          </Flex>
        ) : (
          <>
            {data.dishes.map((dish) => (
              <Box key={dish.id} mt="20px">
                <Dish
                  dish={dish}
                  onMouseEnter={() => handlePrefetchDish()}
                  dishIngredient={getDishIngredients(dish)}
                  handleDeleteDish={() => handleDelete(dish.id)}
                />
              </Box>
            ))}

            <Pagination
              totalCountOfRegisters={data.totalCount}
              registersPerPage={registersPerPage}
              setOffset={setOffset}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>
    </PageWrapper>
  )
}
