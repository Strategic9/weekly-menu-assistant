import { parseCookies, setCookie } from 'nookies'
import { ShopList } from './useMenu'

const returnParsedData = (cookieShopList: string) => {
  if (cookieShopList) {
    return JSON.parse(cookieShopList)
  } else {
    return null
  }
}

export const getShoppingLists = async () => {
  const { shopList: cookieShopList } = parseCookies()
  const shoppinglists = await returnParsedData(cookieShopList)
  return shoppinglists
}

export const getShoppingListByID = (id: string) => {
  const { shopList: cookieShopList } = parseCookies()
  return JSON.parse(cookieShopList).find((listId) => listId.id === id)
}

export const addShoppingList = (newShoppingList: ShopList[]) => {
  setCookie(null, 'shopList', JSON.stringify(newShoppingList))
}

export const updateShoppingList = (updatedList) => {
  const { shopList: cookieShopList } = parseCookies()
  const arrayList = JSON.parse(cookieShopList)
  const index = arrayList.findIndex((list) => list.id === updatedList.id)
  arrayList[index] = updatedList

  setCookie(null, 'shopList', JSON.stringify(arrayList))
}
