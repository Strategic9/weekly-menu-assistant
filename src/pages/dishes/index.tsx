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
        alert.success('Dish deleted')
      })
      .catch(() => alert.error('Fail to delete dish'))
  }

  function getDishIngredients(dish: Dish): string {
    return !!dish.ingredients && dish.ingredients.length > 0
      ? dish.ingredients.map((i) => i.grocery.name).join(', ')
      : ''
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p={['4', '8']}>
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Dishes
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fail to obtain dishes data.</Text>
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
