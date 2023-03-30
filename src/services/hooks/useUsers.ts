import { useQuery, UseQueryOptions } from 'react-query'
import { number } from 'yup'
import { HTTPHandler } from '../api'

export type User = {
  id: string
  role: string
}

export type GetUserResponse = {
  data: any
  items: User
  count: number
}

export async function getUserById(id): Promise<GetUserResponse> {
  const { data } = await HTTPHandler.get('users', {})

  const user = data.items.map((user) => {
    console.log(user.id)

    return {
      id: id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: number,
      updatedAt: number
    }
  })

  return user
}
let currentPage: number

export function useUser(user_id: string) {
  return useQuery(['users'], () => getUserById(user_id))
}
