import {
  Box,
  Text,
  Flex,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  HStack,
  Tbody,
  Td,
  Spinner
} from '@chakra-ui/react'
import {} from 'nookies'
import { Pagination } from '../../components/Pagination'
import { useState } from 'react'
import { GetMenuHistoryResponse, useMenuHistory } from '../../services/hooks/useMenu'
import PageWrapper from '../page-wrapper'

export default function MenuHistory({ menus, totalCount }) {
  const [page, setPage] = useState(1)
  const { data: useMenuHistoryData, isLoading, isFetching, error } = useMenuHistory(page, {})
  const data = useMenuHistoryData as GetMenuHistoryResponse

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p="8">
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Menu History
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fail to obtain menu history.</Text>
          </Flex>
        ) : (
          <>
            <Table colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="tan.400" color="black">
                <Tr>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>Menu</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.menuHistory
                  .sort((m1, m2) => m2.start_date.getTime() - m1.start_date.getTime())
                  .map((menu) => (
                    <Tr key={menu.id}>
                      <Td>{menu.start_date.toDateString()}</Td>
                      <Td>{menu.end_date.toDateString()}</Td>
                      <Td>
                        {menu.dishes.map((menuDish) => (
                          <HStack key={menuDish.dish?.id}>
                            <Text>{menuDish.dish?.name}</Text>
                          </HStack>
                        ))}
                      </Td>
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
