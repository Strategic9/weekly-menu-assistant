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
  HStack,
  Tooltip,
  Tbody,
  Td,
  useBreakpointValue,
  Spinner
} from '@chakra-ui/react'
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import Link from 'next/link'
import { Pagination } from '../../components/Pagination'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { Grocery, useGroceries } from '../../services/hooks/useGroceries'
import { queryClient } from '../../services/queryClient'
import { api } from '../../services/api'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'

type UseGroceryData = {
  items: Grocery[]
  totalCount: number
}

export default function GroceryList({ groceries, totalCount }) {
  const [page, setPage] = useState(1)
  const { data: useGroceriesData, isLoading, isFetching, error } = useGroceries(page, {})
  const alert = useAlert()

  const data = useGroceriesData as UseGroceryData

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const handleDelete = async (id: string) => {
    await api
      .delete(`groceries/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['groceries', page])
        alert.success('Grocery deleted')
      })
      .catch(() => alert.error('Fail to delete grocery'))
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p="8">
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Groceries
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>

          {/* <Link href="/groceries/create" passHref>
                            <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="oxblood"
                                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
                            >
                                New Grocery
                            </Button>
                        </Link> */}
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fail to obtain groceries data.</Text>
          </Flex>
        ) : (
          <>
            <Table colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="tan.400" color="black">
                <Tr>
                  <Th>Grocery</Th>
                  <Th>Category</Th>
                  {isWideVersion && <Th>Creation date</Th>}
                  {isWideVersion && <Th width="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.items.map((grocery) => (
                  <Tr key={grocery.id}>
                    <Td>
                      <Box>
                        <Text fontWeight="bold" textTransform="capitalize">
                          {grocery.name}
                        </Text>
                      </Box>
                    </Td>
                    <Td>
                      {grocery.category && (
                        <Text fontSize="sm" textTransform="capitalize">
                          {grocery.category.name}
                        </Text>
                      )}
                    </Td>
                    {isWideVersion && <Td>{grocery.createdAt}</Td>}
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
                              onClick={() => handleDelete(grocery.id)}
                            />
                          </Tooltip>
                          <Link href={`/groceries/edit/${grocery.id}`} passHref>
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
