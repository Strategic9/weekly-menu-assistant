import { useQuery, UseQueryOptions, } from "react-query";
import { api } from "../api";
import { Category } from "./useCategories";

export type Grocery = {
    id: string;
    name: string;
    category: Category;
    createdAt: string;
}

export type GetGroceriesResponse = {
    items: Grocery[];
    count: number;
}

export async function getGroceries(page: number): Promise<GetGroceriesResponse> {
    const { data, headers } = await api.get<GetGroceriesResponse>('groceries', {
        params: {
            include: "category"
        }
    });

    const count = data.count;

    const items = data.items.map(grocery => {
        return {
            id: grocery.id,
            name: grocery.name,
            category: grocery.category,
            createdAt: new Date(grocery.createdAt).toLocaleDateString('se', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        items,
        count
    };
}

let currentPage: number;

export function useGroceries(page: number, options: UseQueryOptions) {
    currentPage = page;
    return useQuery(page ? ['groceries', page] : ['groceries'], () => getGroceries(page), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    });
}

// get one grocery
export async function getGroceryById(groceryId: string, include: string) {
    const { data } = await api.get<Grocery>(`groceries/${groceryId}`, {
        params: {
            include: "category"
        }
    })

    const grocery = {
        id: data.id,
        name: data.name,
        category: data.category,
        createdAt: new Date(data.createdAt).toLocaleDateString('se', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }
    return {
        grocery
    }
}

export function useGrocery(grocery_id: string) {
    return useQuery(['groceries'], () => getGroceryById(grocery_id, 'category'));
}