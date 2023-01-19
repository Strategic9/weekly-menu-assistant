import { Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { Draggable } from 'react-beautiful-dnd'
import { FaExchangeAlt, FaPlus } from 'react-icons/fa'
import { SearchDishModal } from '../Form/SearchDish'
import { MenuDishOptions } from '../Options'

export const MenuItem = ({
  menuDish,
  index,
  setValue,
  data,
  setHasUpdates,
  isWideVersion,
  setLocalData
}) => {
  const deleteDish = () => {
    const emptyDish = {
      id: '0'
    }

    const index = data.menu.dishes.findIndex((dish) => dish.dish.id === menuDish.dish.id)

    data.menu.dishes.splice(index, 1, {
      id: data.menu.dishes[index].id,
      selectionDate: data.menu.dishes[index].selectionDate,
      dish: emptyDish
    })

    setValue('dishes', data.menu.dishes)

    setLocalData({ ...data })
    setHasUpdates.on()
  }

  return (
    <Draggable draggableId={menuDish.id} index={index}>
      {(provided) => (
        <HStack
          w="100%"
          h={16}
          px={4}
          py={2}
          bg="gray.100"
          borderRightRadius={8}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          justifyContent="space-between"
        >
          <Flex direction="column">
            <Text fontWeight="bold" fontSize={[14, 18]}>
              {menuDish.dish.name}
            </Text>
            {isWideVersion && (
              <Text overflowWrap="anywhere" fontSize={14}>
                {menuDish.dish.ingredients.map((i) => i.grocery.name).join(', ')}
              </Text>
            )}
          </Flex>
          <MenuDishOptions
            dishId={menuDish.dish.id}
            replace={
              <SearchDishModal
                buttonProps={{
                  fontSize: '16',
                  leftIcon: <Icon mr={2.5} as={FaExchangeAlt} fontSize="16" />,
                  iconSpacing: '0',
                  borderRadius: '0',
                  fontWeight: 'normal',
                  w: '100%',
                  justifyContent: 'flex-start',
                  bgColor: 'white',
                  _hover: { background: 'gray.100' },
                  color: 'gray.700'
                }}
                buttonLabel="Ersätt"
                onSelectItem={(dish) => {
                  menuDish.dish = dish
                  data.menu.dishes.splice(index, 1, menuDish)
                  setValue('dishes', data.menu.dishes)
                  setLocalData({ ...data })
                  setHasUpdates.on()
                }}
              />
            }
            deleteDish={deleteDish}
          />
        </HStack>
      )}
    </Draggable>
  )
}

export const EmptyMenuItem = ({
  menuDish,
  index,
  setValue,
  setLocalData,
  data,
  setHasUpdates,
  isWideVersion
}) => {
  return (
    <Draggable draggableId={menuDish.id} index={index}>
      {(provided) => (
        <HStack
          w="100%"
          h={16}
          px={4}
          py={2}
          bg="tan.300"
          border={'2px'}
          borderStyle={'dotted'}
          borderColor="tan.500"
          borderRightRadius={8}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          justifyContent="space-between"
        >
          <Flex direction="column">
            <Text fontWeight="bold" fontSize={[14, 18]}>
              Ingen meny vald
            </Text>
            {isWideVersion && (
              <Text overflowWrap="anywhere" fontSize={14}>
                Du kan lägga till en meny
              </Text>
            )}
          </Flex>
          <SearchDishModal
            buttonProps={{
              size: isWideVersion ? 'sm' : 'xs',
              colorScheme: 'tan',
              leftIcon: <Icon as={FaPlus} fontSize={['14', '16']} />,
              iconSpacing: '0'
            }}
            onSelectItem={(dish) => {
              menuDish.dish = dish
              data.menu.dishes.splice(index, 1, menuDish)
              setValue('dishes', data.menu.dishes)
              setLocalData({ ...data })
              setHasUpdates.on()
            }}
          />
        </HStack>
      )}
    </Draggable>
  )
}
