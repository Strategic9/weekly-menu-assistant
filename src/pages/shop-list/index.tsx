import { Box, Flex, Heading, Divider, Spinner, Text, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ShopList } from '../../services/hooks/useMenu'
import { getShoppingLists } from '../../services/hooks/useShoppingList'
import PageWrapper from '../page-wrapper'
import { MdArrowForwardIos } from 'react-icons/md'
import ShopListPage from './shopListDetails'
import { useRouter } from 'next/router'

const ShoppingLists = ({ urlId }: { urlId?: string | string[] }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [shoppingList, setshoppingList] = useState<ShopList[]>([])
  const [ShopListId, setId] = useState<string[] | string>(urlId || null)
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getShoppingLists().then((val) => {
      setshoppingList(val)
      setIsLoading(false)
    })
  }, [])

  const loadShoppingList = (id) => {
    setId(id)
    setIsSelected(!isSelected)
    router.push('/shop-list', `/shop-list/${id}`, { shallow: true })
  }

  const ListItem = ({ shoppingList }) => {
    return (
      <Button
        p="6"
        bgColor={['white', 'white', 'gray.100']}
        borderRadius={8}
        mb="2"
        cursor={'pointer'}
        _hover={{ bg: 'white' }}
        style={{
          transition: 'background-color ease 0.3s'
        }}
        justifyContent={'space-between'}
        alignItems="center"
        onClick={() => loadShoppingList(shoppingList.id)}
      >
        <Text noOfLines={[1, 2, 5]}>{shoppingList.name}</Text>
        <MdArrowForwardIos size="16" />
      </Button>
    )
  }

  const RenderList = () => {
    return (
      <Flex>
        <ShopListPage setId={setId} id={ShopListId} />
      </Flex>
    )
  }
  return (
    <PageWrapper>
      {isLoading ? (
        <Flex justify="center" mt="8">
          <Spinner />
        </Flex>
      ) : (
        <Box flex="1" borderRadius={8} bg="grain" p="8">
          {!ShopListId && !urlId ? (
            <Flex flexDir={'column'}>
              <Flex justifyContent="space-between">
                <Heading mb="8" size="lg" fontWeight="normal">
                  Inköpslista
                </Heading>
              </Flex>
              <Divider mb="8" />
              {!shoppingList ? (
                <Flex justify="center">
                  <Text>Fel vid hämtning av Inköpslistor.</Text>
                </Flex>
              ) : (
                <Flex flexDir={'column'}>
                  {shoppingList.map((list) => (
                    <ListItem shoppingList={list} key={list.id} />
                  ))}
                </Flex>
              )}
            </Flex>
          ) : (
            <RenderList />
          )}
        </Box>
      )}
    </PageWrapper>
  )
}

export default ShoppingLists
