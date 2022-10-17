import { useQuery, UseQueryOptions, } from "react-query";
import { api } from "../api";

export type Category = {
    id: string;
    name: string;
    created_at: string;
}

export type GetCategoriesResponse = {
    categories: Category[];
    totalCount: number;
}

export async function getCategories(page?: number): Promise<GetCategoriesResponse> {
    const { data, headers } = await api.get<GetCategoriesResponse>('categories', {
        params: {
            page
        }
    });

    const totalCount = Number(headers['x-total-count']);

    const categories = data.categories.map(category => {
        return {
            id: category.id,
            name: category.name,
            created_at: new Date(category.created_at).toLocaleDateString('se', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        categories,
        totalCount
    };
}

let currentPage: number;

export function useCategories(page: number, options: UseQueryOptions) {
    currentPage = page;
    return useQuery(page ? ['categories', page] : ['categories'], () => getCategories(page), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    });
}

export function useCategory(category_id: string) {
    const { data: useCategoriesData } = useCategories(currentPage, {});
    const data = useCategoriesData as GetCategoriesResponse;

    return useQuery(['category', category_id], () => {
        const category = data.categories.find((c: Category) => c.id === category_id);
        return { category };
    }, {
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}