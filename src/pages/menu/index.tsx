import {
  Flex,
  Box,
  HStack,
  VStack,
  Text,
  Heading,
  Spinner,
  useBreakpointValue,
  Button,
  FormErrorMessage
} from '@chakra-ui/react'
import { useBoolean } from '@chakra-ui/hooks'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { DatePicker } from '../../components/Form/DatePicker'
import { GetMenuResponse, getMenu, useMenu } from '../../services/hooks/useMenu'
import { addDays, arrayMove, getDayName, getMonthName } from '../../services/utils'
import PageWrapper from '../page-wrapper'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'
import { EmptyMenuItem, MenuItem } from '../../components/MenuItems'
import WeekPicker from '../../components/Form/DatePicker/WeekPicker'

const updateMenuFormSchema = yup.object({
  startDate: yup.date(),
  endDate: yup
    .date()
    .required('End date is required')
    .when(
      'startDate',
      (started, yup) => started && yup.min(started, 'End date must be after start date.')
    ),
  dishes: yup.array()
})

export default function Menu() {
  const alert = useAlert()
  const [hasUpdates, setHasUpdates] = useBoolean()
  const { data: useMenuData, isLoading, isFetching } = useMenu({})
  const data: any = useMenuData
  const [localData, setLocalData] = useState({ ...data })
  let menuCurrentWeek

  //The week object to send to get a menu
  const [week, setWeek] = useState(null)
  const startDateWeek = week && week[0].toISOString().split('T')[0]
  const endDateWeek = week && week[1].toISOString().split('T')[0]
  let MenuForChoosenWeekExists = false;

  const setCurrentMenuWeek = (fetchData) => {
    fetchData.items.forEach(menu => {
      menu.startDate = new Date(menu.startDate)
      menu.endDate = new Date(menu.endDate)
    })
    const menuWeek = fetchData.items.find(menu => menu.startDate.toISOString().split('T')[0] === startDateWeek && menu.endDate.toISOString().split('T')[0] === endDateWeek)
    if (menuWeek) {
      menuCurrentWeek = { menu: menuWeek}
      MenuForChoosenWeekExists = true
    }
  }

  if (!!data) {
    setCurrentMenuWeek(data)
    console.log(MenuForChoosenWeekExists)
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(updateMenuFormSchema)
  })

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  })

  const handleChangeOrder = (result: DropResult) => {
    const { destination, source } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }
    const startDate = new Date(menuCurrentWeek.menu.startDate)

    arrayMove(menuCurrentWeek.menu.dishes, source.index, destination.index)

    for (let i = 0; i < menuCurrentWeek.menu.dishes.length; i++) {
      menuCurrentWeek.menu.dishes[i].selectionDate = addDays(startDate, i)
    }

    setValue('dishes', menuCurrentWeek.menu.dishes)
    setLocalData({ ...menuCurrentWeek })

    setHasUpdates.on()
  }

  const onFormSubmit = async (values) => {
    const dishesIds = []

    values.dishes.map((dish) => {
      dish.dish.id !== '0' &&
        dishesIds.push({
          id: dish.dish.id,
          selectionDate: dish.selectionDate
        })
    })

    if (hasUpdates) {
      const updatedMenu = {
        startDate: values.startDate,
        endDate: values.endDate,
        dishes: dishesIds
      }

      await HTTPHandler.patch(`menus/${menuCurrentWeek.menu.id}`, {
        ...updatedMenu
      })
        .then(() => {
          queryClient.invalidateQueries('menu')
          alert.success('Menu saved with success')
        })
        .catch(() => {
          alert.error('Fail to update menu')
        })

      setHasUpdates.off()
    }
  }

  useEffect(() => {
    if (menuCurrentWeek) {
      setValue('startDate', menuCurrentWeek.menu.startDate)
      setValue('endDate', menuCurrentWeek.menu.endDate)
      setValue('dishes', menuCurrentWeek.menu.dishes)
      setLocalData({ ...menuCurrentWeek })
    }
  })

  const generateMenu = async () => {
    const userId = localStorage.getItem('user-id')
    const params = {
      user: {
        id: userId
      },
      startDate: week[0],
      endDate: week[1]
    }
    try {
      HTTPHandler.post('/menus/generate', params).then( async(res) => {
        getMenu().then(updatedData => {
          setCurrentMenuWeek(updatedData)
          setLocalData({...menuCurrentWeek})
          debugger;
          MenuForChoosenWeekExists = true
          console.log('updated data', updatedData)
        })
      })

    } catch (err) {
      alert.error('Failed to generate menu')
    }
  }

  // console.log(week && week[0].toISOString().split('T')[0], menuData.startDate.split('T')[0])

  return (
    <PageWrapper>
      <Box
        as="form"
        flex="1"
        borderRadius={8}
        bg="grain"
        p="8"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Flex mb="8" align="center">
          <Heading size="lg" fontWeight="normal">
            Week Menu
          </Heading>
        </Flex>
        <WeekPicker setWeek={setWeek} />
        {!MenuForChoosenWeekExists ? (
          <Flex>
            <Button onClick={() => generateMenu()}>Generate Menu</Button>
          </Flex>
        ) : isLoading || isFetching || !localData ? (
          <Box w="100%" m="auto">
            <Spinner size="lg" color="gray.500" ml="4" />
          </Box>
        ) : (
          <>
            <Box mb="6">
              <Flex w="96" align="center" ml="auto">
                <Text mr="4">From</Text>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker isDisabled selected={value} onChange={(date) => onChange(date)} />
                  )}
                />
                <Text mx="4">to</Text>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      isDisabled
                      showPopperArrow={true}
                      selected={value}
                      onChange={(date) => {
                        onChange(date)
                        setHasUpdates.on()
                      }}
                    />
                  )}
                />
              </Flex>

              {errors.endDate && (
                <FormErrorMessage color="red.600">{errors.endDate.message}</FormErrorMessage>
              )}
            </Box>

            <DragDropContext onDragEnd={handleChangeOrder}>
              <HStack spacing={0}>
                <VStack w={40}>
                  {localData?.menu &&
                    localData.menu.dishes.map((menuDish) => (
                      <Flex
                        key={menuDish.id.toString()}
                        w="100%"
                        h={16}
                        bg="oxblood.500"
                        color="white"
                        borderLeftRadius={8}
                        justifyContent="center"
                        align="flex-end"
                        pr={3.5}
                        flexDirection="column"
                      >
                        <Text>{getDayName(menuDish.selectionDate, 'en')}</Text>
                        <Text fontSize={14} color="oxblood.100">
                          {getMonthName(menuDish.selectionDate, 'en')}
                        </Text>
                      </Flex>
                    ))}
                </VStack>
                <Droppable droppableId={`menu-${menuCurrentWeek.menu.id}`}>
                  {(provided) => (
                    <VStack flex={1} ref={provided.innerRef} {...provided.droppableProps}>
                      {localData?.menu &&
                        localData.menu.dishes.map((menuDish, index) =>
                          menuDish.dish.id === '0' ? (
                            <EmptyMenuItem
                              key={menuDish.id}
                              menuDish={menuDish}
                              setLocalData={setLocalData}
                              index={index}
                              setValue={setValue}
                              data={menuCurrentWeek}
                              setHasUpdates={setHasUpdates}
                              isWideVersion={isWideVersion}
                            />
                          ) : (
                            <MenuItem
                              key={menuDish.id}
                              menuDish={menuDish}
                              index={index}
                              setValue={setValue}
                              setLocalData={setLocalData}
                              data={menuCurrentWeek}
                              setHasUpdates={setHasUpdates}
                              isWideVersion={isWideVersion}
                            />
                          )
                        )}
                      {provided.placeholder}
                    </VStack>
                  )}
                </Droppable>
              </HStack>
            </DragDropContext>
            {hasUpdates && (
              <Flex mt="8" justify="flex-end">
                <HStack spacing="4">
                  <Button type="submit" colorScheme="oxblood">
                    Save
                  </Button>
                </HStack>
              </Flex>
            )}
          </>
        )}
      </Box>
    </PageWrapper>
  )
}
