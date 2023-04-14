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
  const [users, setUsers] = useState([])

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
          <Heading size="lg" fontWeight="normal">
            Administrera användare
          </Heading>
        </Flex>
        <Flex direction="column" justify="center" align="center">
          <Table colorScheme="whiteAlpha" color="gray.700">
            <Thead bg="gray.200" fontSize="14px" color="black">
              <Th fontSize={[14, 15, 18]}>Användare</Th>
              <Th fontSize={[14, 15, 18]}>händelse</Th>
            </Thead>
            <Tbody>
              {users.map((users, i) => (
                <Tr key={i}>
                  <Td>
                    <Text fontSize={[16, 16, 20]} fontWeight="bold" textTransform="capitalize">
                      {users.firstName} {users.lastName}
                    </Text>
                    <Text fontSize="xs">{users.email}</Text>
                    <Text>{users.role ? users.role : 'user'}</Text>
                  </Td>
                  <Td textAlign="center">
                    <Link aria-label="edit user" href={`/admin/user/${users.id}`}>
                      <TooltipButton
                        tooltipLabel="Redigera"
                        size={['xs', 'sm']}
                        bg="gray.200"
                        leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                        iconSpacing="0"
                      />
                    </Link>
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
