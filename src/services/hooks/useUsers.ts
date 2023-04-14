import { useQuery } from 'react-query'
import { number } from 'yup'
import { HTTPHandler } from '../api'

export type User = {
  id: string
  firstName: string
  lastName: string
  role: string
  createdAt: number
  updatedAt: number
}

export type GetUserResponse = {
  userId: string
  role: string
}

export async function getUsersById(id): Promise<GetUserResponse> {
  const { data } = await HTTPHandler.get('users', {})

  const users = data.items.map((user) => {
    return {
      id: id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: number,
      updatedAt: number
    }
  })

  return users
}
let currentPage: number

export function useUser(user_id: string) {
  return useQuery(['users'], () => getUsersById(user_id))
}
