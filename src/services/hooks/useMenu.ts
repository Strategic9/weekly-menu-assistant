import { useQuery, UseQueryOptions } from 'react-query'
import { Dish } from './useDishes'
import { HTTPHandler } from '../api'
import { longDate, getDays } from '../utils'
import { addShoppingList } from './useShoppingList'
import { localStorage } from '../localstorage'

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
      measurementUnit: string
    }[]
  }
  name: string
}

export type GetMenuResponse = {
  menu: Menu[]
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
        id: `empty-${new Date()}`
      }
    })
  )

  return menu.dishes.sort((a, b) => a.selectionDate.getTime() - b.selectionDate.getTime())
}

export async function getMenu(): Promise<any> {
  //const { shopList: cookieShopList } = parseCookies()
  const cookieShopList = localStorage.get('shopList')
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

    setShoppingLists(cookieShopList, items)

    return {
      items
    }
  } else {
    return null
  }
}

// compare if there is a new week menu generated and returns an Array with the new shopping lists
export const setShoppingLists = (cookieShopList, items) => {
  const cookiesListParsed = cookieShopList ? JSON.parse(cookieShopList) : []
  const newShopList = items.map((item) => {
    if (!cookieShopList) {
      return generateShopList(item)
    } else {
      const menuExist = cookiesListParsed.find((cookie) => cookie.id === item.id)
      const shoppingListItem = !menuExist ? generateShopList(menuExist) : []
      return { ...generateShopList(item), ...shoppingListItem }
    }
  })
  addShoppingList(newShopList)
}

export function setShopListCookie(shopList: ShopList) {
  localStorage.set('menu.shopList', JSON.stringify([shopList]))
}

function generateShopList(menu: Menu) {
  const shopList = menu.dishes.reduce<ShopList>(
    (shopList, menuDish) => {
      menuDish.dish.ingredients.map((ingredient) => {
        const category = ingredient.grocery.category ? ingredient.grocery.category.name : 'övrigt'
        const hasEntry = !!shopList.categories[category]
        const productMeasurement = `${ingredient.quantity} ${ingredient.grocery?.measurementUnits[0]?.measurementUnit?.name}`
        const addMeasurement = productMeasurement.replace('undefined', 'st')
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
            bought: false,
            measurementUnit: addMeasurement
          })
        } else {
          grocery.amount++
        }
      })
      return shopList
    },
    {
      id: menu.id,
      categories: {},
      name: `From ${longDate(menu.startDate)} to ${longDate(menu.endDate)}`
    }
  )
  return shopList
}

export function useMenu(options: UseQueryOptions) {
  return useQuery(['menu'], () => getMenu(), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  })
}
