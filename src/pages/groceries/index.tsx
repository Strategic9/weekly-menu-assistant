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
import { useState, useContext } from 'react'
import { Grocery, useGroceries } from '../../services/hooks/useGroceries'
import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import TooltipButton from '../../components/TooltipButton'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import { MenuDishOptions } from '../../components/Options'
import { UserContext } from '../../contexts/UserContext'

type UseGroceryData = {
  items: Grocery[]
  count: number
}

export default function GroceryList() {
  const [page, setPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const registersPerPage = 10

  const { currentUser } = useContext(UserContext)
  const role = currentUser.role

  const {
    data: useGroceriesData,
    isLoading,
    isFetching,
    error
  } = useGroceries(
    page,
    {},
    {
      'page[limit]': registersPerPage,
      'page[offset]': offset
    }
  )
  const alert = useAlert()

  const data = useGroceriesData as UseGroceryData

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const handleDelete = async (id: string) => {
    await HTTPHandler.delete(`groceries/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['groceries', page])
        alert.success('Ingrediens borttagen')
      })
      .catch(() => alert.error('Misslyckad borttagning'))
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p={[4, 8]}>
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Ingredienser
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fel vid hämtning av Ingredienser.</Text>
          </Flex>
        ) : (
          <Flex direction="column" justify="center" align="center">
            <Table size={!isWideVersion ? 'sm' : 'lg'} colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="gray.200" color="black">
                <Tr>
                  <Th fontSize={[14, 15, 18]}>ingrediens</Th>
                  <Show breakpoint="(min-width: 400px)">
                    <Th fontSize={[14, 15, 18]}>kategori</Th>
                  </Show>
                  {role === 'admin' && (
                    <Th fontSize={[14, 16, 18]} width="8">
                      händelser
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data.items.map((grocery) => (
                  <Tr key={grocery.id}>
                    <Td>
                      <Box>
                        <Text fontSize={[14, 16, 20]} fontWeight="bold" textTransform="capitalize">
                          {grocery.name}
                        </Text>
                      </Box>
                    </Td>
                    <Show breakpoint="(min-width: 400px)">
                      <Td>
                        {grocery.category && (
                          <Text fontSize={[14, 16, 18]} textTransform="capitalize">
                            {grocery.category.name}
                          </Text>
                        )}
                      </Td>
                    </Show>
                    {role === 'admin' && (
                      <Td>
                        <Show breakpoint="(max-width: 400px)">
                          <MenuDishOptions
                            replace={
                              <Link href={`/groceries/edit/${grocery.id}`} passHref>
                                <MenuItem
                                  fontSize="16"
                                  color="gray.700"
                                  icon={<RiEditLine size={16} />}
                                >
                                  Redigera
                                </MenuItem>
                              </Link>
                            }
                            deleteDish={() => handleDelete(grocery.id)}
                          />
                        </Show>
                        <Show breakpoint="(min-width: 400px)">
                          <HStack>
                            <Tooltip
                              label="Remove"
                              bg="red.200"
                              color="white"
                              placement="top-start"
                            >
                              <Button
                                aria-label="delete"
                                size="sm"
                                bg="red.100"
                                color="white"
                                justifyContent="center"
                                leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                                iconSpacing="0"
                                _hover={{ bg: 'red.200' }}
                                onClick={() => handleDelete(grocery.id)}
                              />
                            </Tooltip>
                            <Link aria-label="edit" href={`/groceries/edit/${grocery.id}`} passHref>
                              <TooltipButton
                                tooltipLabel="Redigera"
                                size="sm"
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
