import { localStorage } from '../localstorage'
import { ShopList } from './useMenu'

const returnParsedData = (cookieShopList: string) => {
  if (cookieShopList) {
    return JSON.parse(cookieShopList)
  } else {
    return null
  }
}

export const getShoppingLists = async () => {
  const cookieShopList = localStorage.get('shopList')
  const shoppinglists = await returnParsedData(cookieShopList)
  return shoppinglists
}

export const getShoppingListByID = (id: string) => {
  const cookieShopList = localStorage.get('shopList')
  return JSON.parse(cookieShopList).find((listId) => listId.id === id)
}

export const addShoppingList = (newShoppingList: ShopList[]) => {
  localStorage.set('shopList', JSON.stringify(newShoppingList))
}

export const updateShoppingList = (updatedList) => {
  const cookieShopList = localStorage.get('shopList')
  const arrayList = JSON.parse(cookieShopList)
  const index = arrayList.findIndex((list) => list.id === updatedList.id)
  arrayList[index] = updatedList

  localStorage.set('shopList', JSON.stringify(arrayList))
}
