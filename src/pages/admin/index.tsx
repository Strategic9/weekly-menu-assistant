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
  Show,
  Link
} from '@chakra-ui/react'

import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { queryClient } from '../../services/queryClient'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import TooltipButton from '../../components/TooltipButton'

type User = {
  id: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  updatedAt: string
}
type UseUserData = {
  items: User[]
  count: number
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [user, setUser] = useState<User>()
  const [page, setPage] = useState(1)

  const alert = useAlert()

  useEffect(() => {
    HTTPHandler.get('/users')
      .then((res) => {
        setUsers(res.data.items)
      })
      .catch((error) => console.log(error))
  }, [])

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
            Administrera användare
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
              {users.map((users, i) => (
                <Tr key={i}>
                  <Td>
                    <Text fontSize={[16, 16, 20]} fontWeight="bold" textTransform="capitalize">
                      {users.firstName} {users.lastName}
                    </Text>
                    <Text>{users.email}</Text>
                    <Text>{users.role ? users.role : 'user'}</Text>
                  </Td>
                  <Td>
                    <Show breakpoint="(min-width: 400px)">
                      <HStack>
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
                        <Link aria-label="edit user" href={`/admin/user/${users.id}`}>
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
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </PageWrapper>
  )
}
