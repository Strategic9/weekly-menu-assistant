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
  Spinner,
  Show
} from '@chakra-ui/react'

import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import { GetUserPermissions, useUserPermissions } from '../../services/hooks/usePermissions'
import UserPage from './user'

type UsePermissionData = {
  count: number
  items: Permissions[]
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const registersPerPage = 10

  const alert = useAlert()

  const {
    data: useUserPermissionData,
    isLoading,
    isFetching,
    error
  } = useUserPermissions(
    page,
    {},
    {
      'page[limit]': registersPerPage,
      'page[offset]': offset
    }
  )
  const data = useUserPermissionData as UsePermissionData

  useEffect(() => {
    HTTPHandler.get('/users')
      .then((res) => {
        console.log(res.data.items)
        setUsers(res.data.items)
      })
      .catch((error) => console.log(error))
  }, [])

  const getUserDetails = async (id: string) => {
    await HTTPHandler.get(`users/${id}`)
      .then((res) => {
        console.log(res.data)
        queryClient.invalidateQueries(['users', page])
        alert.success('Användare hämtad')
      })
      .catch(() => alert.error('Fel vid hämtning av användare'))
  }

  const handleDelete = async (id: string) => {
    await HTTPHandler.delete(`users/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['users', page])
        alert.success('Användare borttagen')
      })
      .then(() => {})
      .catch(() => alert.error('Fel vid borttagning av användare'))
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p={[4, 8]}>
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Admin
            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
          </Heading>
        </Flex>
        {isLoading ? (
          <Flex justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Fel vid hämtning av användare.</Text>
          </Flex>
        ) : (
          <Flex direction="column" justify="center" align="center">
            <Table colorScheme="whiteAlpha" color="gray.700">
              <Thead bg="gray.200" fontSize="14px" color="black">
                <Tr fontSize="14px">
                  <Th fontSize={[14, 15, 18]}>Användare</Th>
                  <Th fontSize={[14, 15, 18]} width="8">
                    händelser
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user, i) => (
                  <Tr key={i}>
                    <Td>
                      <Text fontSize={[16, 16, 20]} fontWeight="bold" textTransform="capitalize">
                        {user.firstName} {user.lastName}
                      </Text>
                    </Td>
                    <Td>
                      <Show breakpoint="(min-width: 400px)">
                        <HStack>
                          <Tooltip label="View" bg="red.100" color="white" placement="top-start">
                            <Button
                              size={['xs', 'sm']}
                              bg="white.100"
                              color="black"
                              justifyContent="center"
                              leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                              iconSpacing="0"
                              onClick={(id) => getUserDetails(user.id)}
                              _hover={{ bg: 'red.200' }}
                            />
                          </Tooltip>
                          <Tooltip label="Remove" bg="red.100" color="white" placement="top-start">
                            <Button
                              size={['xs', 'sm']}
                              bg="red.100"
                              color="white"
                              justifyContent="center"
                              leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                              iconSpacing="0"
                              onClick={() => handleDelete(user.id)}
                              _hover={{ bg: 'red.200' }}
                            />
                          </Tooltip>
                        </HStack>
                      </Show>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        )}
      </Box>
    </PageWrapper>
  )
}
