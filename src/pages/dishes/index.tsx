import {
  Box,
  Text,
  Flex,
  Heading,
  Button,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Tooltip,
  Tbody,
  Td,
  useBreakpointValue,
  HStack,
  Spinner
} from '@chakra-ui/react'
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import Link from 'next/link'
import { Pagination } from '../../components/Pagination'
import { useState } from 'react'
import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import { useDishes } from '../../services/hooks/useDishes'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import { Grocery } from '../../services/hooks/useGroceries'
import Dish from '../../components/Dish/dish'

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

export default function DishList({ users, totalCount }) {
  const [page, setPage] = useState(1)
  const {
    data: useDishesData,
    isLoading,
    isFetching,
    error
  } = useDishes(page, {
    /*
        initialData: {
            users,
            totalCount
        },
    */
  })
  const alert = useAlert()

  const data = useDishesData as UseDishData

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

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

  console.log(data && data)

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
      <Box flex="1" borderRadius={8} bg="grain" p="8">
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
            <Table colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="gray.200" color="black">
                <Tr>
                  <Th>Dish</Th>
                  {isWideVersion && <Th>Ingredients</Th>}
                  {isWideVersion && <Th width="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.dishes.map((dish) => (
                  <Dish
                    key={dish.id}
                    dish={dish}
                    isWideVersion={isWideVersion}
                    onMouseEnter={() => handlePrefetchDish()}
                    dishIngredient={getDishIngredients(dish)}
                    handleDeleteDish={() => handleDelete(dish.id)}
                  />
                ))}
              </Tbody>
            </Table>

            <Pagination
              totalCountOfRegisters={data.totalCount}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>
    </PageWrapper>
  )
}
