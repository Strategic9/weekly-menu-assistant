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
import { queryClient } from '../../services/queryClient'
import { api } from '../../services/api'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import { useCategories } from '../../services/hooks/useCategories'
import PageWrapper from '../page-wrapper'

type Category = {
  id: string
  name: string
  category: string
  created_at: string
}

type UseCategoryData = {
  categories: Category[]
  totalCount: number
}

export default function CategoryList({ categories, totalCount }) {
  const [page, setPage] = useState(1)
  const { data: useCategoriesData, isLoading, isFetching, error } = useCategories(page, {})
  const alert = useAlert()

  const data = useCategoriesData as UseCategoryData

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const handleDelete = async (id: string) => {
    await api
      .delete(`categories/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['categories', page])
        alert.success('Category deleted')
      })
      .catch(() => alert.error('Fail to delete category'))
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p="8">
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Categories
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fail to obtain categories data.</Text>
          </Flex>
        ) : (
          <>
            <Table colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="tan.400" color="black">
                <Tr>
                  <Th>Category</Th>
                  {isWideVersion && <Th>Creation date</Th>}
                  {isWideVersion && <Th width="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.categories.map((category) => (
                  <Tr key={category.id}>
                    <Td>
                      <Box>
                        <Text fontWeight="bold" textTransform="capitalize">
                          {category.name}
                        </Text>
                      </Box>
                    </Td>
                    {isWideVersion && <Td>{category.created_at}</Td>}
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
                              onClick={() => handleDelete(category.id)}
                            />
                          </Tooltip>
                          <Link href={`/categories/edit/${category.id}`} passHref>
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
