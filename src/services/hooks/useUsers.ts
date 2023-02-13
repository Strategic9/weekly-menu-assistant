import { useQuery, UseQueryOptions } from 'react-query'
import { number } from 'yup'
import { HTTPHandler } from '../api'

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: number
  updatedAt: number
}

export type GetUserResponse = {
  items: User
  count: number
}

export async function getUserById(id): Promise<GetUserResponse> {
  const { data } = await HTTPHandler.get('users', {})
  const items = data.items.map((user) => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: number,
      updatedAt: number
    }
  })
  return items
}
let currentPage: number

export function useUser(user_id: string) {
  return useQuery(['users'], () => getUserById(user_id))
}
