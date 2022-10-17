import { setCookie, parseCookies } from "nookies";
import { useQuery, UseQueryOptions } from "react-query";
import ShopList from "../../pages/shop-list";
import { api } from "../api";
import { Dish } from "./useDishes";

export type Menu = {
    id: string;
    start_date: Date;
    end_date: Date;
    dishes: MenuDish[];
    created_at: Date;
}

export type MenuDish = {
    dish: Dish;
    date: Date;
}

export type ShopList = {
    id: string;
    categories: {
        [category: string]: {
            name: string;
            amount: number;
            bought: boolean;
        }[];
    };
}

export type GetMenuResponse = {
    menu: Menu;
    shopList: ShopList;
}

export type GetMenuHistoryResponse = {
    menuHistory: Menu[];
    totalCount: number;
}

export async function getMenu(): Promise<GetMenuResponse> {
    const { 'menu.shopList': cookieShopList } = parseCookies();
    const { data } = await api.get<GetMenuResponse>('menu');
    const menu = data.menu as Menu;
    let shopList: ShopList = cookieShopList ? JSON.parse(cookieShopList) : {};

    shopList = generateShopList(shopList, menu);

    menu.start_date = new Date(menu.start_date);
    menu.end_date = new Date(menu.end_date);
    menu.dishes.forEach(dish => dish.date = new Date(dish.date));

    return {
        menu,
        shopList
    };
}

export function setShopListCookie(shopList: ShopList) {
    setCookie(null, 'menu.shopList', JSON.stringify(shopList), {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
    });
}

function generateShopList(shopList: ShopList, menu: Menu) {
    shopList = menu.dishes.reduce<ShopList>((shopList, menuDish) => {
        menuDish.dish.ingredients.forEach(ingredient => {
            const category = ingredient.category ? ingredient.category.name : 'övrigt';
            const hasEntry = !!shopList.categories[category];
            if (!hasEntry) {
                shopList.categories[category] = [];
            }
            const grocery = shopList.categories[category].find(grocery => grocery.name === ingredient.name);
            if (!grocery) {
                shopList.categories[category].push({
                    name: ingredient.name,
                    amount: 1,
                    bought: false
                });
            } else {
                grocery.amount++;
            }
        });
        return shopList;
    }, { id: menu.id, categories: {} });
    return shopList;
}

export async function getMenuHistory(page: number): Promise<GetMenuHistoryResponse> {
    const { data, headers } = await api.get<GetMenuHistoryResponse>('menu/history', {
        params: {
            page
        }
    });
    const menuHistory = data.menuHistory;
    menuHistory.forEach(menu => {
        menu.start_date = new Date(menu.start_date)
        menu.end_date = new Date(menu.end_date)
    });

    const totalCount = Number(headers['x-total-count']);

    return {
        menuHistory,
        totalCount
    };
}

export function useMenu(options: UseQueryOptions) {
    return useQuery(['menu'], () => getMenu(), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    });
}

export function useMenuHistory(page: number, options: UseQueryOptions) {
    return useQuery(['menus', page], () => getMenuHistory(page), {
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    });
}
