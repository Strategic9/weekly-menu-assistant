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
import { GetServerSideProps } from 'next'
import { queryClient } from '../../services/queryClient'
import { api, HTTPHandler } from '../../services/api'
import { useDishes } from '../../services/hooks/useDishes'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'

type Dish = {
  id: string
  name: string
  description: string
  created_at: string
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
        const response = await HTTPHandler.get('dishes');

        return response.data
      },
      {
        staleTime: 1000 * 60 * 10 // 10 minutes
      }
    )
  }

  async function handleDelete(id: string) {
    await api
      .delete(`dishes/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['dishes', page])
        alert.success('Dish deleted')
      })
      .catch(() => alert.error('Fail to delete dish'))
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
              <Thead bg="tan.400" color="black">
                <Tr>
                  <Th>Dish</Th>
                  {isWideVersion && <Th>Creation date</Th>}
                  {isWideVersion && <Th width="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.dishes.map((dish) => (
                  <Tr key={dish.id}>
                    <Td>
                      <Box onMouseEnter={() => handlePrefetchDish()}>
                        <Text fontWeight="bold" textTransform="capitalize">
                          {dish.name}
                        </Text>
                      </Box>
                    </Td>
                    {isWideVersion && <Td>{dish.created_at}</Td>}
                    {isWideVersion && (
                      <Td>
                        <HStack>
                          <Tooltip label="Remove" bg="tan.400" color="white" placement="top-start">
                            <Button
                              size="sm"
                              colorScheme="tan"
                              justifyContent="center"
                              leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                              iconSpacing="0"
                              onClick={() => handleDelete(dish.id)}
                            />
                          </Tooltip>
                          <Link href={`/dishes/edit/${dish.id}`} passHref>
                            <TooltipButton
                              tooltipLabel="Edit"
                              size="sm"
                              colorScheme="tan"
                              leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                              iconSpacing="0"
                            />
                          </Link>
                        </HStack>
                      </Td>
                    )}
                  </Tr>
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

// export const getServerSideProps: GetServerSideProps = async () => {
//     const { users, totalCount } = await getUsers(1);

//     return {
//         props: {
//             users,
//             totalCount
//         }
//     }
// }
