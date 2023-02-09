import { setCookie, parseCookies } from 'nookies'
import { useQuery, UseQueryOptions } from 'react-query'
import ShopList from '../../pages/shop-list'
import { Dish } from './useDishes'
import { HTTPHandler } from '../api'
import { getDays } from '../utils'

export type Menu = {
  user: User
  id: string
  startDate: Date
  endDate: Date
  dishes: MenuDish[]
  createdAt: Date
}

type User = {
  id: string
}

export type MenuDish = {
  selectionDate: Date
  dish: Dish
  id: string
}

export type ShopList = {
  id: string
  categories: {
    [category: string]: {
      name: string
      amount: number
      bought: boolean
    }[]
  }
}

export type GetMenuResponse = {
  menu: Menu[]
  shopList: ShopList
}

export type GetMenuHistoryResponse = {
  menuHistory: Menu[]
  totalCount: number
}

const checkDishesAndDays = (menu) => {
  const days = getDays(menu.startDate, menu.endDate)

  const filteredArray = days.filter(
    (day) => !menu.dishes.some((dish) => day.toString() === new Date(dish.selectionDate).toString())
  )

  filteredArray.forEach((object, i) =>
    menu.dishes.push({
      id: i.toString(),
      selectionDate: object,
      dish: {
        id: '0'
      }
    })
  )

  return menu.dishes.sort((a, b) => a.selectionDate.getTime() - b.selectionDate.getTime())
}

export async function getMenu(): Promise<any> {
  const { 'menu.shopList': cookieShopList } = parseCookies()
  const { data } = await HTTPHandler.get('menus', {
    params: {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  })
  const items = JSON.parse(JSON.stringify(data?.items))
  if (items.length) {
    const menu = data.items.find(
      (menu) => new Date() >= new Date(menu.startDate) && new Date() <= new Date(menu.endDate)
    ) as Menu

    if (menu) {
      menu.startDate = new Date(menu.startDate)
      menu.endDate = new Date(menu.endDate)

      menu.dishes.forEach((dish) => (dish.selectionDate = new Date(dish.selectionDate)))

      const updatedDishes = checkDishesAndDays(menu)

      menu.dishes = updatedDishes
    }

    const shoppingList = generateShopList(menu)

    const shopListData = () => {
      if (!cookieShopList) {
        setShopListCookie(shoppingList)
        return shoppingList
      }

      if (menu && cookieShopList) {
        if (menu.id !== JSON.parse(cookieShopList).id) {
          setShopListCookie(shoppingList)
          return shoppingList
        }
      }

      if (cookieShopList) {
        return JSON.parse(cookieShopList)
      }
    }

    const shopList = shopListData()

    return {
      items,
      shopList
    }
  } else {
    return null
  }
}

export function setShopListCookie(shopList: ShopList) {
  setCookie(null, 'menu.shopList', JSON.stringify(shopList), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })
}

function generateShopList(menu: Menu) {
  const shopList = menu.dishes.reduce<ShopList>(
    (shopList, menuDish) => {
      menuDish.dish.ingredients.map((ingredient) => {
        const category = ingredient.grocery.category ? ingredient.grocery.category.name : 'övrigt'
        const hasEntry = !!shopList.categories[category]
        if (!hasEntry) {
          shopList.categories[category] = []
        }
        const grocery = shopList.categories[category].find(
          (grocery) => grocery.name === ingredient.grocery.name
        )
        if (!grocery) {
          shopList.categories[category].push({
            name: ingredient.grocery.name,
            amount: 1,
            bought: false
          })
        } else {
          grocery.amount++
        }
      })
      return shopList
    },
    { id: menu.id, categories: {} }
  )
  return shopList
}

export function useMenu(options: UseQueryOptions) {
  return useQuery(['menu'], () => getMenu(), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}
