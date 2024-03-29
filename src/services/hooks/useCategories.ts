import { useQuery, UseQueryOptions } from 'react-query'
import { HTTPHandler } from '../api'
import { setDate } from '../utils'

export type Category = {
  id: string
  name: string
  createdAt: string
}

export type GetCategoriesResponse = {
  items: Category[]
  count: number
}

export async function getCategories(page?: number, pageLimit = {}): Promise<GetCategoriesResponse> {
  const { data } = await HTTPHandler.get('categories', {
    params: {
      page,
      ...pageLimit
    }
  })

  const count = data.count

  const items = data.items.map((category) => {
    return {
      id: category.id,
      name: category.name,
      createdAt: setDate(category)
    }
  })

  return {
    items,
    count
  }
}

let currentPage: number

export function useCategories(page: number, options: UseQueryOptions, pageLimit) {
  currentPage = page
  return useQuery(
    page ? ['categories', page] : ['categories'],
    () => getCategories(page, pageLimit),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options
    }
  )
}

// get one category
export async function getCategoryById(categoryId: string) {
  const { data } = await HTTPHandler.get(`categories/${categoryId}`)

  return {
    id: data.id,
    name: data.name,
    createdAt: setDate(data)
  }
}

export function useCategory(category_id: string) {
  return useQuery(['category'], () => getCategoryById(category_id))
}
