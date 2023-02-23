import {
  Flex,
  Box,
  HStack,
  VStack,
  Text,
  Heading,
  Spinner,
  useBreakpointValue
} from '@chakra-ui/react'
import { useMenu } from '../../services/hooks/useMenu'
import { getDayName, getMonthName } from '../../services/utils'
import PageWrapper from '../page-wrapper'
import { Input } from '../../components/Form/Input'

export default function Menu() {
  const { data: useMenuData, isLoading, isFetching, error } = useMenu({})
  const data: any = useMenuData

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const formatDate = (menuDate) => {
    const date = new Date(menuDate)
    const newDate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
    return newDate
  }

  // sort menus on descending order
  const sortedMenusHistory =
    data &&
    data.items.sort(
      (menu1, menu2) => new Date(menu2.startDate).getTime() - new Date(menu1.endDate).getTime()
    )

  //show only current menu and past menus
  const menusHistory =
    sortedMenusHistory &&
    sortedMenusHistory.filter((date) => {
      return new Date(date.startDate) < new Date()
    })

  return (
    <PageWrapper>
      <Box as="form" flex="1" borderRadius={8} bg="grain" p={['4', '8']}>
        <Flex align="center">
          <Heading size="lg" fontWeight="normal">
            Menyhistorik
          </Heading>
        </Flex>

        {isLoading || isFetching || !data ? (
          <Box w="100%" m="auto">
            <Spinner mt="8" size="lg" color="gray.500" ml="4" />
          </Box>
        ) : error ? (
          <Flex justify="center">
            <Text>Fel vid hämtning av menyhistorik.</Text>
          </Flex>
        ) : (
          <div>
            {menusHistory &&
              menusHistory.map((menu) => (
                <>
                  <Box mt="10" mb="6">
                    <Flex maxW="100%">
                      <Box mr="16px">
                        <Text mb="5px" fontSize={['sm', 'md']}>
                          Från
                        </Text>
                        <Input
                          width={['133px', '100%']}
                          h="40px"
                          p={[0, 5]}
                          fontSize={['sm', 'md']}
                          isDisabled
                          textAlign="center"
                          name="startDate"
                          defaultValue={formatDate(menu.startDate)}
                        />
                      </Box>
                      <Box>
                        <Text mb="5px" fontSize={['sm', 'md']}>
                          Till
                        </Text>
                        <Input
                          width={['133px', '100%']}
                          h="40px"
                          p={[0, 5]}
                          fontSize={['sm', 'md']}
                          isDisabled
                          textAlign="center"
                          name="endDate"
                          defaultValue={formatDate(menu.endDate)}
                        />
                      </Box>
                    </Flex>
                  </Box>

                  {menu.dishes.map((menuDish) => (
                    <Flex key={menuDish.dish.id} mb="10px">
                      <VStack key={menuDish.dish.id} w={['90px', '170px']}>
                        <Flex
                          key={menuDish.id.toString()}
                          w="100%"
                          h={16}
                          p={['10px']}
                          pr={['9px', '20px']}
                          bg="oxblood.500"
                          color="white"
                          borderLeftRadius={8}
                          justifyContent="center"
                          align="flex-end"
                          flexDirection="column"
                        >
                          <Text fontSize={[14, 18]}>
                            {getDayName(menuDish.selectionDate, 'sv')}
                          </Text>
                          <Text fontSize={[10, 14]} color="oxblood.100">
                            {getMonthName(menuDish.selectionDate, 'sv')}
                          </Text>
                        </Flex>
                      </VStack>

                      <VStack flex={1}>
                        <HStack
                          key={menuDish.dish.id}
                          w="100%"
                          h={16}
                          px={4}
                          py={2}
                          bg="gray.100"
                          borderRightRadius={8}
                          justifyContent="space-between"
                        >
                          <Flex direction="column">
                            <Text fontSize={[14, 18]} fontWeight="bold">
                              {menuDish.dish.name}
                            </Text>
                            {isWideVersion && (
                              <Text overflowWrap="anywhere" fontSize={14}>
                                {menuDish.dish.ingredients.map((i) => i.grocery.name).join(', ')}
                              </Text>
                            )}
                          </Flex>
                        </HStack>
                      </VStack>
                    </Flex>
                  ))}
                </>
              ))}
          </div>
        )}
      </Box>
    </PageWrapper>
  )
}
