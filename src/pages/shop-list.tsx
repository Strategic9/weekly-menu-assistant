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
  useBreakpointValue
} from '@chakra-ui/react'
import { RiCloseLine } from 'react-icons/ri'
import { ChangeEvent } from 'react'
import { useAlert } from 'react-alert'
import { useMutation } from 'react-query'
import { SearchIngredientModal } from '../components/Form/SearchIngredient'
import { Grocery } from '../services/hooks/useGroceries'
import { GetMenuResponse, useMenu, setShopListCookie } from '../services/hooks/useMenu'
import { queryClient } from '../services/queryClient'
import AlertDialog from '../components/AlertDialog'
import PageWrapper from './page-wrapper'

import { GetCategoriesResponse, useCategories } from '../services/hooks/useCategories'

export default function ShopList() {
  const { data: useCategoriesData } = useCategories(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )
  const categoryData = useCategoriesData as GetCategoriesResponse

  const { data: useMenuData, isLoading, error } = useMenu({})
  const menuData = useMenuData as GetMenuResponse
  const alert = useAlert()

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
    lg: true
  })

  const changeItem = useMutation(
    async (data: { name: string; amount: number; bought: boolean; category: string }) => {
      const listItem = menuData.shopList.categories[data.category].find(
        (grocery) => grocery.name === data.name
      )
      listItem.bought = data.bought
      return menuData.shopList
    }
  )

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
    listItem: { name: string; amount: number; bought: boolean },
    category: string
  ) {
    listItem.bought = event.target.checked
    changeItem.mutate({ ...listItem, category })
    setShopListCookie(menuData.shopList)
  }

  function handleAddGrocery(grocery: Grocery) {
    const newIngredient = {
      name: grocery.name,
      amount: 1,
      bought: false
    }

    const category = categoryData.items.find((category) => category.id === grocery.category.id).name

    const shopListCategories = menuData.shopList.categories
    const new_Category_Ingredient = {
      [category]: [newIngredient]
    }

    const updatedshopList = { ...shopListCategories, ...new_Category_Ingredient }

    const ingredientExistsInShopList = menuData.shopList?.categories[category]?.find(
      (ingr) => ingr.name === grocery.name
    )

    const categoryExistsInShopList = menuData.shopList?.categories[category]

    if (ingredientExistsInShopList) {
      ingredientExistsInShopList.amount++
    }
    if (!categoryExistsInShopList) {
      menuData.shopList.categories = updatedshopList
    } else if (categoryExistsInShopList && !ingredientExistsInShopList) {
      menuData.shopList.categories[category].push(newIngredient)
    }

    queryClient.setQueryData(['menu'], { ...menuData })
    setShopListCookie(menuData.shopList)
    alert.success('Ingrediens tillagd')
  }

  function handleRemoveGrocery(category: string, index: number) {
    menuData.shopList.categories[category].splice(index, 1)

    queryClient.setQueryData(['menu'], { ...menuData })

    setShopListCookie(menuData.shopList)
    alert.success('Ingrediens borttagen')
  }

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p="8">
        <Flex justifyContent="space-between">
          <Heading mb="8" size="lg" fontWeight="normal">
            Inköpslista
          </Heading>
          <SearchIngredientModal
            buttonProps={{
              colorScheme: 'oxblood'
            }}
            buttonLabel={isWideVersion ? 'Lägg till' : '+'}
            onSelectItem={handleAddGrocery}
          />
        </Flex>
        <Divider />
        {isLoading ? (
          <Flex justify="center" mt="8">
            <Spinner />
          </Flex>
        ) : (
          <Box mt="8">
            {error || !menuData ? (
              <Flex justify="center">
                <Text>Fel vid hämtning av Inköpslistor.</Text>
              </Flex>
            ) : (
              <List as={Stack} spacing="2">
                {Object.entries(menuData?.shopList?.categories)?.map(([key, groceries]) => (
                  <Box key={key}>
                    <Text fontSize={['l', 'xl']} color="gray.500" textTransform="capitalize">
                      {key}
                    </Text>
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
    </PageWrapper>
  )
}
