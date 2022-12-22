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
import { useMenu } from '../../services/hooks/useMenu'
import { convertDateToString } from '../../services/utils'

import PageWrapper from '../page-wrapper'

export default function MenuHistory() {
  const [page, setPage] = useState(10)
  const { data: useMenuData, isLoading, isFetching, error } = useMenu({})
  const data: any = useMenuData

  // sort menus on descending order
  const sortedMenusHistory =
    data &&
    data.items.sort((m1, m2) => new Date(m2.startDate).getTime() - new Date(m1.endDate).getTime())

  //show only current and past menus
  const menusHistory =
    sortedMenusHistory &&
    sortedMenusHistory.filter((date) => {
      console.log(new Date(date.startDate) > new Date())
      return new Date(date.startDate) < new Date()
    })

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
              <Thead bg="gray.200" color="black">
                <Tr>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>Menu</Th>
                </Tr>
              </Thead>

              <Tbody>
                {menusHistory.map((menu) => {
                  return (
                    <Tr key={menu.id}>
                      {menu.id}
                      <Td>{convertDateToString(menu.startDate)}</Td>
                      <Td>{convertDateToString(menu.endDate)}</Td>
                      <Td>
                        {menu.dishes.map((menuDish) => (
                          <HStack key={menuDish.dish?.id}>
                            <Text>{menuDish.dish?.name}</Text>
                          </HStack>
                        ))}
                      </Td>
                    </Tr>
                  )
                })}
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
