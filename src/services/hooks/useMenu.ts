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

export async function getMenu(userId: string): Promise<any> {
  //const { shopList: cookieShopList } = parseCookies()
  const cookieShopList = localStorage.get('shopList')
  const { data } = await HTTPHandler.get('menus', {
    params: {
      'page[limit]': 1000,
      'page[offset]': 0,
      'fields[userId]': userId
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
  const shopList = menu?.dishes?.reduce<ShopList>(
    (shopList, menuDish) => {
      menuDish?.dish?.ingredients?.map((ingredient) => {
        const category = ingredient.grocery.category ? ingredient.grocery.category.name : 'övrigt'
        const hasEntry = !!shopList.categories[category]
        const productMeasurement = `${ingredient.quantity} ${ingredient.grocery?.measurementUnits[0]?.measurementUnit?.name}`

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
            measurementUnit: productMeasurement
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

export function useMenu(options: UseQueryOptions, userId: string) {
  return useQuery(['menu'], () => getMenu(userId), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
    enabled: !!userId
  })
}

export const generatWeekDaysDate = (week: Array<Date>) => {
  const days: Array<Date> = []
  for (let date = new Date(week[0]); date <= new Date(week[1]); date.setDate(date.getDate() + 1)) {
    days.push(new Date(date))
  }

  return days
}

export const getDaysWithoutDish = (days: Array<Date>, backendweekdays: Array<Date>) => {
  return days.filter((day) => {
    return !backendweekdays?.some((backendDay) => {
      return day.toDateString() === backendDay.toDateString()
    })
  })
}

export const generateEmptyDishes = (daysWhitoutDish: Array<Date>) => {
  return daysWhitoutDish.map((date) => {
    return {
      selectionDate: date,
      dish: {
        id: `empty-${Date.now()}`
      }
    }
  })
}

export const generateEmptyWeekMenu = (days: Array<Date>) => {
  const emptyDishes = generateEmptyDishes(days)
  return {
    menu: {
      id: `empty-${Date.now()}`,
      createdAt: new Date().toISOString(),
      startDate: days[0].toISOString(),
      endDate: days[days.length - 1].toISOString(),
      dishes: emptyDishes
    }
  }
}
