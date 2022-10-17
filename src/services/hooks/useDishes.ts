import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../api";
import { Grocery } from "./useGroceries";

export type Dish = {
    id: string;
    name: string;
    description: string;
    ingredients: Grocery[];
    created_at: string;
}

export type GetDishesResponse = {
    dishes: Dish[];
    totalCount: number;
}

export async function getDishes(page: number): Promise<GetDishesResponse> {
    const { data, headers } = await api.get<GetDishesResponse>('dishes', {
        params: {
            page
        }
    });

    const totalCount = Number(headers['x-total-count']);

    const dishes = data.dishes.map(dish => {
        return {
            id: dish.id,
            name: dish.name,
            description: dish.description,
            ingredients: dish.ingredients,
            created_at: new Date(dish.created_at).toLocaleDateString('se', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        dishes,
        totalCount
    };
}

let currentPage: number;

export function useDishes(page: number, options: UseQueryOptions) {
    currentPage = page;
    return useQuery(['dishes', page], () => getDishes(page), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    });
}

export function useDish(dish_id: string) {
    const { data: useDishesData } = useDishes(currentPage, {});
    const data = useDishesData as GetDishesResponse;

    return useQuery(['dish', dish_id], () => {
        const dish = data.dishes.find((d: Dish) => d.id === dish_id);
        return { dish };
    }, {
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}