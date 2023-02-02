import { useQuery, UseQueryOptions } from 'react-query'
import { HTTPHandler } from '../api'
import { setDate } from '../utils'
import { Category } from './useCategories'
import { MeasurementUnit } from './useMeasurementUnit'

export type Grocery = {
  id: string
  name: string
  category: Category
  createdAt: string
  measurementUnits: MeasurementUnit
}

export type GetGroceriesResponse = {
  items: Grocery[]
  count: number
}

export async function getGroceries(page: number, extraParams?: any): Promise<GetGroceriesResponse> {
  const { data } = await HTTPHandler.get('groceries', {
    params: {
      include: 'category',
      ...extraParams
    }
  })

  // await api.get<GetGroceriesResponse>('groceries', {
  //   params: {
  //     include: 'category'
  //   }
  // })

  const count = data.count

  const items = data.items.map((grocery) => {
    return {
      id: grocery.id,
      name: grocery.name,
      category: grocery.category,
      measurementUnits: grocery.measurementUnits,
      createdAt: setDate(grocery)
    }
  })

  return {
    items,
    count
  }
}

let currentPage: number

export function useGroceries(page: number, options: UseQueryOptions, extraParams?: any) {
  currentPage = page
  return useQuery(
    page ? ['groceries', page] : ['groceries'],
    () => getGroceries(page, extraParams),
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options
    }
  )
}

// get one grocery
export async function getGroceryById(groceryId: string, include: string) {
  const { data } = await HTTPHandler.get(`groceries/${groceryId}`, {
    params: {
      include: 'category'
    }
  })

  const grocery = {
    id: data.id,
    name: data.name,
    category: data.category,
    measurementUnits: data.measurementUnits,
    createdAt: setDate(data)
  }
  return {
    grocery
  }
}

export function useGrocery(grocery_id: string) {
  return useQuery(['groceries'], () => getGroceryById(grocery_id, 'category'))
}
