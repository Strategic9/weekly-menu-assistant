import { useQuery, UseQueryOptions } from 'react-query'
import { HTTPHandler } from '../api'
import { Grocery } from './useGroceries'

export type Dish = {
  id: string
  name: string
  image: string
  description: string
  ingredients: {
    grocery: Grocery
    quantity: number
  }[]
  createdAt: string
  mainIngredient: Grocery
  recipe: string
}

export type GetDishesResponse = {
  dishes: Dish[]
  totalCount: number
}

export async function getDishes(page: number, pageLimit = {}): Promise<GetDishesResponse> {
  const { data } = await HTTPHandler.get('dishes', {
    params: {
      page,
      ...pageLimit
    }
  })

  const totalCount = data.count
  const dishes = data.items.map((dish) => {
    return {
      id: dish.id,
      name: dish.name,
      description: dish.description,
      ingredients: dish.ingredients,
      image: dish.image,
      recipe: dish.recipe,
      mainIngredient: dish.mainIngredient,
      temperature: dish.temperature,
      rate: dish.rate,
      portions: dish.portions,
      cookingTime: dish.cookingTime,
      createdAt: new Date(dish.createdAt).toLocaleDateString('sv', {
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

export function useDishes(page: number, options: UseQueryOptions, pageLimit) {
  currentPage = page
  return useQuery(['dishes', page], () => getDishes(page, pageLimit), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}

export const getDishByID = async (dishId: string) => {
  const { data } = await HTTPHandler.get(`dishes/${dishId}`, {})

  return { dish: data }
}

export function useDish(dish_id: string) {
  return useQuery(['dishes', dish_id], () => getDishByID(dish_id))
}
