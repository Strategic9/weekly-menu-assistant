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
import { api, HTTPHandler } from '../../services/api'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import { useCategories } from '../../services/hooks/useCategories'
import PageWrapper from '../page-wrapper'

type Category = {
  id: string
  name: string
  category: string
  createdAt: string
}

type UseCategoryData = {
  items: Category[]
  count: number
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
    await HTTPHandler.delete(`categories/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['categories', page])
        alert.success('Kategori borttagen')
      })
      .catch(() => alert.error('Fail to delete category'))
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p={[4, 8]}>
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Kategorier
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
          <Flex direction="column" justify="center" align="center">
            <Table size={!isWideVersion ? 'sm' : 'lg'} colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="gray.200" fontSize="14px" color="black">
                <Tr fontSize="14px">
                  <Th fontSize={[14, 15, 18]}>Kategori</Th>
                  <Th fontSize={[14, 15, 18]} width="8">
                    händelser
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.items.map((category) => (
                  <Tr key={category.id}>
                    <Td>
                      <Box>
                        <Text fontSize={[14, 16, 20]} fontWeight="bold" textTransform="capitalize">
                          {category.name}
                        </Text>
                      </Box>
                    </Td>
                    <Td>
                      <HStack>
                        <Tooltip label="Remove" bg="red.100" color="white" placement="top-start">
                          <Button
                            size={['xs', 'sm']}
                            bg="red.100"
                            color="white"
                            justifyContent="center"
                            leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                            iconSpacing="0"
                            _hover={{ bg: 'red.200' }}
                            onClick={() => handleDelete(category.id)}
                          />
                        </Tooltip>
                        <Link href={`/categories/edit/${category.id}`} passHref>
                          <TooltipButton
                            tooltipLabel="Redigera"
                            size={['xs', 'sm']}
                            bg="gray.200"
                            leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                            iconSpacing="0"
                          />
                        </Link>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Pagination
              totalCountOfRegisters={data.count}
              currentPage={page}
              onPageChange={setPage}
            />
          </Flex>
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
