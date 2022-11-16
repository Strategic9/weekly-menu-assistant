import { useQuery, UseQueryOptions } from 'react-query'
import { HTTPHandler } from '../api'
import { Grocery } from './useGroceries'

export type Dish = {
  id: string
  name: string
  description: string
  ingredients: Grocery[]
  createdAt: string
  mainIngredient: Grocery
}

export type GetDishesResponse = {
  dishes: Dish[]
  totalCount: number
}

export async function getDishes(page: number): Promise<GetDishesResponse> {
  const { data } = await HTTPHandler.get('dishes', {
    params: {
      page
    }
  })

  const totalCount = data.items.length
  const dishes = data.items.map((dish) => {
    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      ingredients: dish.ingredients,
      createdAt: new Date(dish.createdAt).toLocaleDateString('se', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    dishes,
    totalCount
  }
}

let currentPage: number

export function useDishes(page: number, options: UseQueryOptions) {
  currentPage = page
  return useQuery(['dishes', page], () => getDishes(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}

export function useDish(dish_id: string) {
  const { data: useDishesData } = useDishes(currentPage, {})
  const data = useDishesData as GetDishesResponse

  return useQuery(
    ['dish', dish_id],
    () => {
      const dish = data?.dishes.find((d: Dish) => d.id === dish_id)
      return { dish }
    },
    {
      staleTime: 1000 * 60 * 10 // 10 minutes
    }
  )
}
