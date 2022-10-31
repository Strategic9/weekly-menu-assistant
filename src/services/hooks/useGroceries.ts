import { useQuery, UseQueryOptions } from 'react-query'
import { api } from '../api'
import { Category } from './useCategories'

export type Grocery = {
  id: string
  name: string
  category: Category
  created_at: string
}

export type GetGroceriesResponse = {
  groceries: Grocery[]
  totalCount: number
}

export async function getGroceries(page: number): Promise<GetGroceriesResponse> {
  const { data, headers } = await api.get<GetGroceriesResponse>('groceries', {
    params: {
      page
    }
  })

  const totalCount = Number(headers['x-total-count'])

  const groceries = data.groceries.map((grocery) => {
    return {
      id: grocery.id,
      name: grocery.name,
      category: grocery.category,
      created_at: new Date(grocery.created_at).toLocaleDateString('se', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    groceries,
    totalCount
  }
}

let currentPage: number

export function useGroceries(page: number, options: UseQueryOptions) {
  currentPage = page
  return useQuery(page ? ['groceries', page] : ['groceries'], () => getGroceries(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}

export function useGrocery(grocery_id: string) {
  const { data: useGroceriesData } = useGroceries(currentPage, {})
  const data = useGroceriesData as GetGroceriesResponse

  return useQuery(
    ['grocery', grocery_id],
    () => {
      const grocery = data.groceries.find((g: Grocery) => g.id === grocery_id)
      return { grocery }
    },
    {
      staleTime: 1000 * 60 * 10 // 10 minutes
    }
  )
}
