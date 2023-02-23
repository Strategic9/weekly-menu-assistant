import {
  Box,
  Flex,
  Heading,
  Spinner,
  Divider,
  List,
  ListItem,
  Text,
  Checkbox,
  Stack,
  Button,
  useBreakpointValue
} from '@chakra-ui/react'
import { RiCloseLine } from 'react-icons/ri'
import { ChangeEvent, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useMutation } from 'react-query'
import { SearchIngredientModal } from '../../components/Form/SearchIngredient'
import { Grocery } from '../../services/hooks/useGroceries'
import { ShopList } from '../../services/hooks/useMenu'
import AlertDialog from '../../components/AlertDialog'
import { MdArrowBackIos } from 'react-icons/md'

import { GetCategoriesResponse, useCategories } from '../../services/hooks/useCategories'
import { getShoppingListByID, updateShoppingList } from '../../services/hooks/useShoppingList'
import { useRouter } from 'next/router'

export default function ShopListPage({ id, setId }) {
  const router = useRouter()
  const { shopList: urlId } = router.query
  const shopListId = id || urlId
  const [shopList, setShopList] = useState<ShopList>()
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (shopListId) {
      setIsLoading(true)
      const list = getShoppingListByID(shopListId as string)
      setShopList(list)
      setIsLoading(false)
    }
  }, [shopListId, shopList])

  const { data: useCategoriesData } = useCategories(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )
  const categoryData = useCategoriesData as GetCategoriesResponse

  /*   const { data: useMenuData, isLoading, error } = useMenu({})
  const menuData = useMenuData as GetMenuResponse */

  const alert = useAlert()

  const goBack = () => {
    setId(null)
    router.push(`/shop-list`, undefined, { shallow: true })
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
    lg: true
  })

  const changeItem = useMutation(
    async (data: { name: string; amount: number; bought: boolean; category: string }) => {
      const listItem = shopList.categories[data.category].find(
        (grocery) => grocery.name === data.name
      )
      listItem.bought = data.bought
      return shopList
    }
  )

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
    listItem: { name: string; amount: number; bought: boolean },
    category: string
  ) {
    listItem.bought = event.target.checked
    changeItem.mutate({ ...listItem, category })
    updateShoppingList(shopList)
  }

  function handleAddGrocery(grocery: Grocery) {
    const newIngredient = {
      name: grocery.name,
      amount: 1,
      bought: false
    }

    const category = categoryData.items.find((category) => category.id === grocery.category.id).name

    const shopListCategories = shopList.categories
    const new_Category_Ingredient = {
      [category]: [newIngredient]
    }

    const updatedshopList = { ...shopListCategories, ...new_Category_Ingredient }

    const ingredientExistsInShopList = shopList?.categories[category]?.find(
      (ingr) => ingr.name === grocery.name
    )

    const categoryExistsInShopList = shopList?.categories[category]

    if (ingredientExistsInShopList) {
      ingredientExistsInShopList.amount++
    }
    if (!categoryExistsInShopList) {
      shopList.categories = updatedshopList
    } else if (categoryExistsInShopList && !ingredientExistsInShopList) {
      shopList.categories[category].push(newIngredient)
    }
    updateShoppingList(shopList)
    alert.success('Ingrediens tillagd')
  }

  function handleRemoveGrocery(category: string, index: number) {
    shopList.categories[category].splice(index, 1)

    updateShoppingList(shopList)
    alert.success('Ingrediens borttagen')
  }

  return (
    <Box flex="1" borderRadius={8} bg="grain">
      <Flex justifyContent="space-between" mb="8">
        <Button onClick={() => goBack()} variant="none">
          <Heading
            cursor="pointer"
            display="flex"
            alignItems="center"
            size="lg"
            fontWeight="normal"
          >
            <MdArrowBackIos size="20" />
            Inköpslista
          </Heading>
        </Button>
        {!error && shopList && (
          <SearchIngredientModal
            buttonProps={{
              colorScheme: 'oxblood'
            }}
            buttonLabel={isWideVersion ? 'Lägg till' : '+'}
            onSelectItem={handleAddGrocery}
          />
        )}
      </Flex>
      <Divider />
      {isLoading ? (
        <Flex justify="center" mt="8">
          <Spinner />
        </Flex>
      ) : (
        <Box mt="8">
          {error || !shopList ? (
            <Flex justify="center">
              <Text>Fel vid hämtning av Inköpslistor.</Text>
            </Flex>
          ) : (
            <List as={Stack} spacing="2">
              {Object.entries(shopList?.categories)?.map(([key, groceries]) => (
                <Box key={key}>
                  {groceries.length > 0 && (
                    <Text fontSize={['l', 'xl']} color="gray.500" textTransform="capitalize">
                      {key}
                    </Text>
                  )}
                  {groceries.map((listItem, index) => (
                    <ListItem
                      as={Flex}
                      key={listItem.name}
                      h="12"
                      my="3"
                      bg="gray.100"
                      borderRadius="4"
                      align="center"
                      justifyContent="space-between"
                    >
                      <Flex>
                        <Checkbox
                          pl="4"
                          colorScheme="oxblood"
                          isChecked={listItem.bought}
                          onChange={(event) => handleChange(event, listItem, key)}
                        />
                        <Text
                          fontSize={[15, 16]}
                          pl="4"
                          textDecoration={listItem.bought && 'line-through'}
                        >
                          {listItem.name} x{listItem.amount}
                        </Text>
                      </Flex>
                      <AlertDialog
                        buttonProps={{
                          as: RiCloseLine,
                          mx: '6',
                          size: 'xsm',
                          cursor: 'pointer'
                        }}
                        header="Bekräfta"
                        body="Ta bort ingrediens från inköpslistan?"
                        onConfirm={() => handleRemoveGrocery(key, index)}
                      />
                    </ListItem>
                  ))}
                </Box>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  )
}