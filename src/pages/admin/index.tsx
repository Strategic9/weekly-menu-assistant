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

export default function AdminPage() {
  const router = useRouter()
  const alert = useAlert()
  const [users, setUsers] = useState([])

  const handleDelete = async (id: string) => {
    await HTTPHandler.delete(`users/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries(['users'])
        alert.success('Användare borttagen')
        router.reload()
      })
      .catch(() => alert.error('Fel vid borttagning av användare'))
  }
  useEffect(() => {
    HTTPHandler.get('/users')
      .then((res) => {
        setUsers(res.data.items)
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p={[4, 8]}>
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="xs" fontWeight="normal">
            Administrera
          </Heading>
        </Flex>
        <Flex direction="column" justify="center" align="center">
          <Table colorScheme="whiteAlpha" color="gray.700">
            <Thead bg="gray.200" fontSize="14px" color="black">
              <Th fontSize={[10, 12, 14]}>Användare</Th>
              <Th fontSize={[10, 12, 14]}>händelser</Th>
            </Thead>
            <Tbody>
              {users.map((users, i) => (
                <Tr key={i}>
                  <Td>
                    <Text fontSize={[12, 12, 14]} fontWeight="bold" textTransform="capitalize">
                      {users.firstName} {users.lastName}
                    </Text>
                    <Text fontSize="3xs">{users.email}</Text>
                    <Text>{users.role ? users.role : 'user'}</Text>
                  </Td>
                  <Td textAlign="center">
                    <HStack>
                      <Tooltip label="Remove" bg="red.100" color="white" placement="top-start">
                        <Button
                          size={['xs', 'sm']}
                          bg="red.100"
                          color="white"
                          justifyContent="center"
                          leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                          iconSpacing="0"
                          onClick={() => handleDelete(users.id)}
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
