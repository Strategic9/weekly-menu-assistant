import { useQuery, UseQueryOptions } from 'react-query'
import { HTTPHandler } from '../api'
import { setDate } from '../utils'

export type UserPermissions = {
  id: string
  name: string
  createdAt: string
}

export type GetUserPermissionResponse = {
  items: UserPermissions[]
  count: number
}

export async function GetUserPermissions(): Promise<GetUserPermissionResponse> {
  const { data } = await HTTPHandler.get('permission', {})
  const items = data.items.map((user) => {
    return {
      id: user.id,
      name: user.name,
      createdAt: setDate(user)
    }
  })
  return items
}
let currentPage: number
export function useUserPermissions(page: number, options: UseQueryOptions, extraParams?: any) {
  currentPage = page
  return useQuery(page ? ['permission', page] : ['permission'], () => GetUserPermissions(), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}
