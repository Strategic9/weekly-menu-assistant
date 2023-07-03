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
import { useEffect, useState, useContext, useMemo } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { DatePicker } from '../../components/Form/DatePicker'
import {
  generatWeekDaysDate,
  generateEmptyDishes,
  generateEmptyWeekMenu,
  getDaysWithoutDish,
  useMenu
} from '../../services/hooks/useMenu'
import {
  addDays,
  arrayMove,
  getDayName,
  getMonthName,
  convertDateToString,
  organizeByDate,
  getDishesIds
} from '../../services/utils'
import PageWrapper from '../page-wrapper'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'
import { EmptyMenuItem, MenuItem } from '../../components/MenuItems'
import { getWeekRange, WeekPicker } from '../../components/Form/DatePicker/WeekPicker'
import { UserContext } from '../../contexts/UserContext'

type GenerateMenuInput = {
  user: {
    id: string
  }
  startDate: Date
  endDate: Date
}

type FormInputs = {
  startDate: Date
  endDate: Date
  dishes: DishesId
}

type DishesId = Array<{
  id: string
  selectionDate: string
}>

const updateMenuFormSchema = yup.object({
  dishes: yup.array()
})

export default function Menu() {
  const { currentUser } = useContext(UserContext)
  const alert = useAlert()
  const [hasUpdates, setHasUpdates] = useBoolean()
  const { data: useMenuData } = useMenu({}, currentUser.userId)
  const data: any = useMemo(() => useMenuData, [useMenuData])

  const [week, setWeek] = useState(getWeekRange(new Date()))

  const [localData, setLocalData] = useState(null)
  const [pageIsLoading, setPageIsLoading] = useState(true)
  const [enableGenerateBtn, setEnableGenerateBtn] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<FormInputs>({
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
    const currentWeekMenu = localData
    const { destination, source } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }
    const startDate = new Date(currentWeekMenu.menu.startDate)

    arrayMove(currentWeekMenu.menu.dishes, source.index, destination.index)

    for (let i = 0; i < currentWeekMenu.menu.dishes.length; i++) {
      currentWeekMenu.menu.dishes[i].selectionDate = addDays(startDate, i)
    }

    setValue('dishes', currentWeekMenu.menu.dishes)
    setLocalData({ ...currentWeekMenu })

    setHasUpdates.on()
  }

  const onFormSubmit = async (values) => {
    const dishesIds: DishesId = getDishesIds(values.dishes)

    if (hasUpdates) {
      setPageIsLoading(true)
      const updatedMenu: FormInputs = {
        startDate: values.startDate,
        endDate: values.endDate,
        dishes: dishesIds
      }

      await HTTPHandler.patch(`menus/${localData?.menu.id}`, {
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

  useEffect(() => {
    if (data) {
      const weekMenu = data?.items.find(
        (menu) =>
          menu.startDate.split('T')[0] === convertDateToString(week[0]) &&
          menu.endDate.split('T')[0] === convertDateToString(week[1])
      )

      const days: Array<Date> = generatWeekDaysDate(week)
      let currentWeekMenu

      if (weekMenu) {
        const backendweekdays: Array<Date> = weekMenu?.dishes?.map((dish) => {
          return new Date(dish.selectionDate)
        })

        const daysWithoutDish = getDaysWithoutDish(days, backendweekdays)

        const emptyDishes = generateEmptyDishes(daysWithoutDish)

        const currentMenu = weekMenu?.dishes
        weekMenu.dishes = [...currentMenu, ...emptyDishes]
        currentWeekMenu = { menu: weekMenu }
        organizeByDate(currentWeekMenu)
      } else {
        currentWeekMenu = generateEmptyWeekMenu(days)
      }
      setLocalData({ ...currentWeekMenu })
      setEnableGenerateBtn(
        currentWeekMenu?.menu?.dishes?.filter((d) => d.dish.id.includes('empty'))?.length > 0
      )
      setPageIsLoading(false)
    }
    setValue('startDate', week[0])
    setValue('endDate', week[1])
  }, [data, week])

  const generateMenu = async () => {
    if (localData && !localData.menu.id.includes('empty')) {
      setPageIsLoading(true)
      const dishesIds: DishesId = getDishesIds(localData.menu.dishes)
      const values = getValues()
      const updatedMenu = {
        startDate: values.startDate,
        endDate: values.endDate,
        dishes: dishesIds
      }

      await HTTPHandler.patch(`/menus/generate/${localData.menu.id}`, {
        ...updatedMenu
      })
        .then(() => {
          queryClient.invalidateQueries('menu')
          alert.success('Meny sparad')
        })
        .catch(() => {
          alert.error('Fel vid uppdatering av meny')
          setPageIsLoading(false)
        })

      setHasUpdates.off()
    } else {
      setPageIsLoading(true)
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
          const currentWeekMenu = { menu: response.data }
          setLocalData({ ...currentWeekMenu })
          queryClient.invalidateQueries('menu')
          alert.success('Meny skapad')
        })
        .catch((error) => {
          const msg =
            error.response.data.details === 'generate.menu.error.not.enough.dishes'
              ? 'No dishes information found'
              : 'Fel vid menygenerering'
          alert.error(msg)
          setPageIsLoading(false)
        })
    }
  }

  const clearMenu = async () => {
    const menuId = localData?.menu.id
    if (!menuId.includes('empty')) {
      setPageIsLoading(true)
      await HTTPHandler.delete(`menus/${localData?.menu.id}`)
        .then(() => {
          queryClient.invalidateQueries('menu')
          alert.success('Meny raderad')
        })
        .catch(() => {
          alert.error('Fel vid radering av menyn')
          setPageIsLoading(false)
        })
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
        <Flex mb="8" justifyContent="center">
          <Heading size="lg" fontWeight="normal">
            Veckomeny
          </Heading>
        </Flex>
        {pageIsLoading ? (
          <Flex justifyContent="center">
            <Spinner size="lg" color="gray.500" ml="4" />
          </Flex>
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
                    localData?.menu.dishes.map((menuDish, i) => (
                      <Flex
                        key={menuDish.id ? menuDish.id?.toString() : i}
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
                <Droppable droppableId={`menu-${localData?.menu.id}`}>
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
                              data={localData}
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
                              data={localData}
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
              <HStack spacing="4">
                {hasUpdates && (
                  <Button aria-label="spara" type="submit" mr="2" colorScheme="oxblood">
                    Spara
                  </Button>
                )}
                <Button
                  aria-label="Generera Veckomeny"
                  onClick={() => clearMenu()}
                  mr="2"
                  disabled={enableGenerateBtn}
                >
                  klar
                </Button>
                <Button
                  colorScheme="blue"
                  aria-label="Generera Veckomeny"
                  onClick={() => generateMenu()}
                  disabled={!enableGenerateBtn}
                >
                  Generera Veckomeny
                </Button>
              </HStack>
            </Flex>
          </>
        )}
      </Box>
    </PageWrapper>
  )
}
