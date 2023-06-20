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
import { useEffect, useState, useRef, useContext } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { DatePicker } from '../../components/Form/DatePicker'
import { useMenu } from '../../services/hooks/useMenu'
import {
  addDays,
  arrayMove,
  getDayName,
  getMonthName,
  convertDateToString,
  organizeByDate
} from '../../services/utils'
import PageWrapper from '../page-wrapper'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'
import { EmptyMenuItem, MenuItem } from '../../components/MenuItems'
import WeekPicker from '../../components/Form/DatePicker/WeekPicker'
import { UserContext } from '../../contexts/UserContext'

type GenerateMenuInput = {
  user: {
    id: string
  }
  startDate: string
  endDate: string
}

const updateMenuFormSchema = yup.object({
  dishes: yup.array()
})

export default function Menu() {
  const { currentUser } = useContext(UserContext)
  const alert = useAlert()
  const [hasUpdates, setHasUpdates] = useBoolean()
  const { data: useMenuData, isLoading, isFetching } = useMenu({})
  const data: any = useMenuData
  let menuCurrentWeek

  const [week, setWeek] = useState(null)

  const startDateWeek = week && convertDateToString(week[0])
  const endDateWeek = week && convertDateToString(week[1])

  const [menuForChoosenWeekExists, setMenuForChoosenWeekExists] = useState(false)
  const [localData, setLocalData] = useState({ ...data })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(updateMenuFormSchema)
  })

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
    lg: true
  })

  const mobileOnly = useBreakpointValue({
    xs: true,
    base: true
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

  const getDishesIds = (dishes) => {
    const dishesIds = []

    if (dishes.length === 0) {
      return
    }
    dishes.map((dish) => {
      !dish.dish.id.includes('empty') &&
        dishesIds.push({
          id: dish.dish.id,
          selectionDate: dish.selectionDate
        })
    })
    return dishesIds
  }

  // const updateMenu = async (updatedMenu) => {
  //   await HTTPHandler.patch(`menus/${menuCurrentWeek.menu.id}`, {
  //     ...updatedMenu
  //   })
  //     .then(() => {
  //       queryClient.invalidateQueries('menu')
  //       alert.success('Meny sparad')
  //     })
  //     .catch(() => {
  //       alert.error('Fel vid uppdatering av meny')
  //     })
  // }

  const onFormSubmit = async (values) => {
    const dishesIds = getDishesIds(values.dishes)

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
          alert.success('Meny sparad')
        })
        .catch(() => {
          alert.error('Fel vid uppdatering av meny')
        })

      setHasUpdates.off()
    }
  }

  const menuWeek =
    data &&
    data?.items.find(
      (menu) =>
        menu.startDate.split('T')[0] === startDateWeek && menu.endDate.split('T')[0] === endDateWeek
    )

  if (menuWeek) {
    const backendweekdays = menuWeek?.dishes?.map((dish) => {
      return new Date(dish.selectionDate)
    })

    const days = []

    for (
      let date = new Date(week[0]);
      date <= new Date(week[1]);
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date))
    }

    const missingDates = days.filter((day) => {
      return !backendweekdays?.some((backendDay) => {
        return day.toDateString() === backendDay.toDateString()
      })
    })

    const emptyDishes = missingDates.map((date, i) => {
      return {
        // id: i.toString(),
        selectionDate: date,
        dish: {
          id: `empty-${Date.now()}`
        }
      }
    })

    const currentMenu = menuWeek?.dishes

    const concatenatedDishes = [...currentMenu, ...emptyDishes]

    menuWeek.dishes = concatenatedDishes

    menuCurrentWeek = { menu: menuWeek }
  }

  useEffect(() => {
    if (!!data && !!data.items && !!week) {
      if (menuWeek) {
        setMenuForChoosenWeekExists(true)
        setLocalData({ ...menuCurrentWeek })

        organizeByDate(menuCurrentWeek)
      } else {
        setMenuForChoosenWeekExists(false)
      }
      setValue('startDate', week[0])
      setValue('endDate', week[1])
    }
  }, [data, week])

  const generateNewMenu = async () => {
    const userId = currentUser.userId
    const params: GenerateMenuInput = {
      user: {
        id: userId
      },
      startDate: week[0],
      endDate: week[1]
    }

    await HTTPHandler.post('/menus/generate', params)
      .then((response) => {
        menuCurrentWeek = { menu: response.data }
        setLocalData({ ...menuCurrentWeek })
        setMenuForChoosenWeekExists(true)
        queryClient.invalidateQueries('menu')
      })
      .catch((error) => {
        const msg =
          error.response.data.details === 'generate.menu.error.not.enough.dishes'
            ? 'No dishes information found'
            : 'Fel vid menygenerering'
        alert.error(msg)
      })
  }

  const generateMenu = async () => {
    if (menuCurrentWeek) {
      const dishesIds = getDishesIds(menuCurrentWeek.menu.dishes)
      const values = getValues()
      const updatedMenu = {
        startDate: values.startDate,
        endDate: values.endDate,
        dishes: dishesIds
      }

      await HTTPHandler.patch(`/menus/generate/${menuCurrentWeek.menu.id}`, {
        ...updatedMenu
      })
        .then(() => {
          queryClient.invalidateQueries('menu')
          alert.success('Meny sparad')
        })
        .catch(() => {
          alert.error('Fel vid uppdatering av meny')
        })

      // setHasUpdates.off()
      // updateMenu(updatedMenu)
    } else {
      generateNewMenu()
    }
  }

  return (
    <PageWrapper>
      <Box
        as="form"
        flex="1"
        borderRadius={8}
        bg="grain"
        p={['4', '8']}
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Flex mb="8" align="center">
          <Heading size="lg" fontWeight="normal">
            Veckomeny
          </Heading>
        </Flex>
        {!menuForChoosenWeekExists ? (
          <>
            <WeekPicker definedWeek={week} setWeek={setWeek} />
            <Flex>
              <Button aria-label="Generera Veckomeny" mt="20px" onClick={() => generateNewMenu()}>
                Generera Veckomeny
              </Button>
            </Flex>
          </>
        ) : isLoading || isFetching || !localData ? (
          <Box w="100%" m="auto">
            <Spinner size="lg" color="gray.500" ml="4" />
          </Box>
        ) : (
          <>
            <Box mt="6" mb="6">
              <Flex maxW="100%">
                <Box>
                  <Text mb="5px" fontSize={['sm', 'md']}>
                    Från
                  </Text>
                  <Controller
                    name="startDate"
                    control={control}
                    render={() => <WeekPicker definedWeek={week} setWeek={setWeek} />}
                  />
                </Box>

                <Box ml="10px">
                  <Text mb="5px" fontSize={['sm', 'md']}>
                    Till
                  </Text>
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
                </Box>
              </Flex>

              {errors.endDate && (
                <FormErrorMessage color="red.600">{errors.endDate.message}</FormErrorMessage>
              )}
            </Box>
            <DragDropContext onDragEnd={handleChangeOrder}>
              <HStack spacing={0}>
                <VStack w={['90px', '170px']}>
                  {localData?.menu &&
                    localData.menu.dishes.map((menuDish, i) => (
                      <Flex
                        key={menuDish.id?.toString()}
                        w="100%"
                        h={16}
                        p={['10px']}
                        pr={mobileOnly ? '9px' : '20px'}
                        bg="oxblood.500"
                        color="white"
                        borderLeftRadius={8}
                        justifyContent="center"
                        align="flex-end"
                        flexDirection="column"
                      >
                        <Text fontSize={[14, 18]}>{getDayName(menuDish.selectionDate, 'sv')}</Text>
                        <Text fontSize={[10, 14]} color="oxblood.100">
                          {getMonthName(menuDish.selectionDate, 'sv')}
                        </Text>
                      </Flex>
                    ))}
                </VStack>
                <Droppable droppableId={`menu-${menuCurrentWeek?.menu.id}`}>
                  {(provided) => (
                    <VStack flex={1} ref={provided.innerRef} {...provided.droppableProps}>
                      {localData?.menu &&
                        localData.menu.dishes.map((menuDish, index) =>
                          menuDish.dish.id.includes('empty') ? (
                            <EmptyMenuItem
                              key={index.toString()}
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
            <Flex mt="8" justify="flex-end">
              {hasUpdates && (
                <HStack spacing="4" mr="2">
                  <Button aria-label="spara" type="submit" colorScheme="oxblood">
                    Spara
                  </Button>
                </HStack>
              )}
              <Button
                colorScheme="blue"
                aria-label="Generera Veckomeny"
                onClick={() => generateMenu()}
              >
                Generera Veckomeny
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </PageWrapper>
  )
}
