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
  Spinner,
  MenuItem,
  Show
} from '@chakra-ui/react'
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import Link from 'next/link'
import { Pagination } from '../../components/Pagination'
import { useState } from 'react'
import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import { useCategories } from '../../services/hooks/useCategories'
import PageWrapper from '../page-wrapper'
import { MenuDishOptions } from '../../components/Options'
import Head from 'next/head'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'

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

export default function CategoryList() {
  const [page, setPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const { currentUser } = useContext(UserContext)
  const role = currentUser.role
  const registersPerPage = 10
  const {
    data: useCategoriesData,
    isLoading,
    isFetching,
    error
  } = useCategories(
    page,
    {},
    {
      'page[limit]': registersPerPage,
      'page[offset]': offset
    }
  )
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
      .catch(() => alert.error('Borttagning misslyckad'))
  }

  return (
    <PageWrapper>
      <Head>
        <title>Kategorier | Forkify</title>
      </Head>
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
                  {role === 'admin' && (
                    <Th fontSize={[14, 15, 18]} width="8">
                      händelser
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data.items.map((category) => (
                  <Tr key={category.id}>
                    <Td>
                      <Box>
                        <Text fontSize={[16, 16, 20]} fontWeight="bold" textTransform="capitalize">
                          {category.name}
                        </Text>
                      </Box>
                    </Td>
                    {role === 'admin' && (
                      <Td>
                        <Show breakpoint="(max-width: 400px)">
                          <MenuDishOptions
                            replace={
                              <Link href={`/categories/edit/${category.id}`} passHref>
                                <MenuItem
                                  fontSize="16"
                                  color="gray.700"
                                  icon={<RiEditLine size={16} />}
                                >
                                  Redigera
                                </MenuItem>
                              </Link>
                            }
                            deleteDish={() => handleDelete(category.id)}
                          />
                        </Show>
                        <Show breakpoint="(min-width: 400px)">
                          <HStack>
                            <Tooltip
                              label="Remove"
                              bg="red.100"
                              color="white"
                              placement="top-start"
                            >
                              <Button
                                aria-label="delete"
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
                            <Link
                              aria-label="edit category"
                              href={`/categories/edit/${category.id}`}
                              passHref
                            >
                              <TooltipButton
                                tooltipLabel="Redigera"
                                size={['xs', 'sm']}
                                bg="gray.200"
                                leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                                iconSpacing="0"
                              />
                            </Link>
                          </HStack>
                        </Show>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Pagination
              totalCountOfRegisters={data.count}
              registersPerPage={registersPerPage}
              setOffset={setOffset}
              currentPage={page}
              onPageChange={setPage}
            />
          </Flex>
        )}
      </Box>
    </PageWrapper>
  )
}
