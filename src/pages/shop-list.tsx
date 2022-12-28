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
import { setCookie } from 'nookies'
import { ChangeEvent, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useMutation } from 'react-query'
import { SearchIngredientModal } from '../components/Form/SearchIngredient'
import { Grocery } from '../services/hooks/useGroceries'
import { GetMenuResponse, useMenu } from '../services/hooks/useMenu'
import { queryClient } from '../services/queryClient'
import AlertDialog from '../components/AlertDialog'
import PageWrapper from './page-wrapper'

export default function ShopList() {
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
  }

  function handleAddGrocery(grocery: Grocery) {
    const category = grocery.category ? grocery.category.name : 'övrigt'
    const item = menuData.shopList.categories[category].find((item) => item.name === grocery.name)
    if (item) {
      item.amount++
    } else {
      menuData.shopList.categories[category].push({
        name: grocery.name,
        amount: 1,
        bought: false
      })
    }
    queryClient.setQueryData(['menu'], { ...menuData })
    alert.success('Item added')
  }

  function handleRemoveGrocery(category: string, index: number) {
    menuData.shopList.categories[category].splice(index, 1)
    queryClient.setQueryData(['menu'], { ...menuData })
    alert.success('Item removed')
  }

  useEffect(() => {
    return () => {
      if (menuData) {
        setCookie(undefined, 'menu.shopList', JSON.stringify(menuData.shopList))
      }
    }
  }, [menuData])

  return (
    <PageWrapper>
      <Box flex="1" borderRadius={8} bg="grain" p="8">
        <Flex justifyContent="space-between">
          <Heading mb="8" size="lg" fontWeight="normal">
            Shop List
          </Heading>
          <SearchIngredientModal
            buttonProps={{
              colorScheme: 'oxblood'
            }}
            buttonLabel={isWideVersion ? 'Add new item' : '+'}
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
            {error ? (
              <Flex justify="center">
                <Text>Fail to obtain shop list.</Text>
              </Flex>
            ) : (
              <List as={Stack} spacing="2">
                {Object.entries(menuData.shopList.categories)?.map(([key, groceries]) => (
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
                          header="Confirm"
                          body="Remove item from shop list?"
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
