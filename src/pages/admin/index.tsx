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
  Stack,
  Show
} from '@chakra-ui/react'

import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import { getUserById, User } from '../../services/hooks/useUsers'

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [user, setUser] = useState<User>()
  const [page, setPage] = useState(1)

  const alert = useAlert()

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
        const currentUser = users.map((user) => {
          return <dialog>{currentUser}</dialog>
        })
        queryClient.invalidateQueries(['users', page])
        alert.success('Användare hämtad')
        getUserById(id)
        setUser(res.data)

        users.map((user) => {
          if (user.id === id) {
            return <p {...user.id} />
          }

          return user
        })
        router.push(`admin/user`)
        return (
          <Flex>
            <Stack ml="10px">
              <Box>
                <Heading py={['8px', '6px']} size={['sm', 'md']}>
                  {user}
                </Heading>
              </Box>
            </Stack>
          </Flex>
        )
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
          </Heading>
        </Flex>
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
                    <Text>{user.email}</Text>
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
                            onClick={() => getUserDetails(user.id)}
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
      </Box>
    </PageWrapper>
  )
}
