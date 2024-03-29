import React, { useState } from 'react'
import { RiEditLine } from 'react-icons/ri'
import {
  Box,
  Flex,
  Heading,
  Divider,
  Wrap,
  HStack,
  Button,
  ButtonProps,
  Tag,
  Text,
  TagLabel,
  Icon
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import Link from 'next/link'
import { Input } from './Input'

import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useBreakpointValue } from '@chakra-ui/media-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Dish } from '../../services/hooks/useDishes'
import Modal from '../Modal'
import { useMutation } from 'react-query'
import { api } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'
import { Select } from './Select'
import { GetGroceriesResponse, useGroceries } from '../../services/hooks/useGroceries'
import { SearchIngredient } from './SearchIngredient'
import EditIngredient from './EditIngredient'
import {
  GetMeasurementUnitsResponse,
  useMeasurementUnits
} from '../../services/hooks/useMeasurementUnit'
import { Textarea } from './TextArea'

export type CreateDishFormData = {
  id?: string
  name: string
  image?: string
  portions?: string
  temperature?: string
  cookingTime?: string
  description?: string
  ingredients?: { id: string; name: string; quantity: number; measurementUnit?: string }[]
  mainIngredientId?: string
  recipe?: string
  mainIngredientQuantity?: string
  mainMeasurementUnitId?: string
}

interface DishFormParams {
  title: string
  handleSubmit: SubmitHandler<CreateDishFormData>
  handleCancel?: () => void
  initialData?: any
  isEdit: boolean
}

const createDishFormSchema = yup.object({
  name: yup.string().required('Namn är obligatoriskt'),
  description: yup.string().required('Beskrivning är obligatorisk'),
  recipe: yup.string().required('recept är obligatorisk'),
  ingredients: yup.array().min(1, 'Ingredienser är obligatoriska'),

  mainIngredientId: yup.string().required('Huvudingrediens är obligatoriskt'),
  mainIngredientQuantity: yup.string().required('Mängd/volym är obligatorisk'),
  mainMeasurementUnitId: yup.string().required('Mängd/volym är obligatorisk'),

  portions: yup.string().nullable(),
  temperature: yup.string().nullable(),
  cookingTime: yup.string().nullable(),
  image: yup.string().nullable()
})

export default function DishForm(props: DishFormParams) {
  const { data: useGroceriesData } = useGroceries(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )
  const groceriesData = useGroceriesData as GetGroceriesResponse
  const itemsList = groceriesData?.items

  const { data: useMeasurementUnitsData } = useMeasurementUnits(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )
  const measurementUnitsData = useMeasurementUnitsData as GetMeasurementUnitsResponse

  const mainIngredient: any = props.initialData?.ingredients.find((i: any) => i.isMain)
  const ingredients: any = props.initialData?.ingredients.filter((i: any) => !i.isMain)

  const [ingredientId, setIngredientId] = useState('')

  const [indexIngredient, setIndexIngredient] = useState<number>()

  const [addIngredient, setAddIngredient] = useState<boolean>()
  const [showEditIngredient, setShowEditIngredient] = useState<boolean>()
  const [ingredientExists, setIngredientExists] = useState<boolean>()

  const [ingredientsError, setIngredientsError] = useState({ quantity: '', measurement: '' })

  const defaultValues = {
    ...props.initialData,
    ...{
      ingredients: ingredients?.map((e: any) => {
        return {
          id: e.grocery.id,
          name: e.grocery.name,
          quantity: e.quantity,
          measurementUnitId: e.measurementUnitId
        }
      }),
      mainIngredientId: mainIngredient?.grocery?.id,
      mainIngredientQuantity: mainIngredient?.quantity,
      mainMeasurementUnitId: mainIngredient?.measurementUnitId,
      temperature: '180'
    }
  }

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm({
    resolver: yupResolver(createDishFormSchema),
    defaultValues
  })

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'ingredients'
  })

  const ingredientGroceryId = ingredients?.map((item) => item.grocery.id)

  const setSelectedMeasurementUnit = (data, id) => {
    const unitName = data?.items.find((item) => item.id === id)
    return unitName?.value
  }

  const openIngredientTag = (ingredient, index) => {
    setShowEditIngredient(true)
    if (ingredientGroceryId) {
      setIngredientId(ingredientGroceryId[index])
    }

    setValue('ingredientName', ingredient.name)
    setValue('ingredientQuantity', ingredient.quantity)
    setValue('measurementUnitId', ingredient.measurementUnitId)
    setIndexIngredient(index)
  }

  const addIngredientName = (el) => {
    setValue('ingredientName', el.name)
    setValue('ingredientQuantity', el.quantity)
    setValue('measurementUnitId', el.measurementUnitId)
    setIngredientId(el.id)
    setAddIngredient(true)
    setShowEditIngredient(true)
    setIndexIngredient(null)
  }

  const addNewIngredient = async () => {
    const quantity = getValues('ingredientQuantity')
    const name = getValues('ingredientName')
    const quantityExists = !!quantity && quantity > 0
    const mUnit = getValues('measurementUnitId')
    if (quantityExists && mUnit) {
      append({ id: ingredientId, name: name, quantity: quantity, measurementUnitId: mUnit })

      setAddIngredient(false)
      setIngredientsError({ quantity: '', measurement: '' })
      setShowEditIngredient(false)
    } else if (!quantityExists || !mUnit) {
      setIngredientsError({
        quantity: !quantityExists ? 'Mängd/volym är obligatorisk' : '',
        measurement: !mUnit ? 'Mängd/volym är obligatorisk' : ''
      })
    }
  }

  const updateIngredient = () => {
    const quantity = getValues('ingredientQuantity')
    const name = getValues('ingredientName')
    const quantityExists = !!quantity && quantity > 0
    const mUnit = getValues('measurementUnitId')

    if (quantityExists && mUnit) {
      update(indexIngredient, {
        id: ingredientId,
        name: name,
        quantity: quantity,
        measurementUnitId: mUnit
      })
      setIngredientsError({ quantity: '', measurement: '' })
      setShowEditIngredient(false)
    } else if (!quantityExists || !mUnit) {
      setIngredientsError({
        quantity: !quantityExists ? 'Mängd/volym är obligatorisk' : '',
        measurement: !mUnit ? 'Mängd/volym är obligatorisk' : ''
      })
    }
  }

  const handleAddorUpdate = (el) => {
    const nameExists = fields.map((item) => item?.id).includes(el.name)

    const index = fields.map((item) => item?.id).indexOf(el.name)

    setIngredientExists(nameExists)
    nameExists ? openIngredientTag(fields[index], index) : addIngredientName(el)
  }

  const isWideVersion = useBreakpointValue(
    {
      base: false,
      lg: true
    },
    {
      fallback: 'lg'
    }
  )

  return (
    <Box
      as="form"
      flex="1"
      borderRadius={8}
      bg="grain"
      p={['4', '8']}
      onSubmit={handleSubmit(props.handleSubmit)}
    >
      <Heading size={['md', 'lg']} fontWeight="normal">
        {props.title}
      </Heading>

      <Divider my={[4, 6]} borderColor="gray.700" />

      <Flex flexDirection={['column', 'column', 'row']} gap="4">
        <Flex flexDirection="column" gap="15px" flex={['50%']}>
          <Box>
            <Input name="name" label="Namn" error={errors.name} {...register('name')} />
          </Box>

          <HStack spacing="2">
            <Input
              w={['100%']}
              name={'portions'}
              label={'portioner'}
              placeholder="4 portioner"
              error={errors.portions}
              {...register('portions')}
            />
            <Input
              w={['100%']}
              name={'cookingTime'}
              label={'tillagningstid'}
              placeholder="40 mins"
              error={errors.cookingTime}
              {...register('cookingTime')}
            />
          </HStack>

          <HStack spacing="2">
            <Input
              w={['100%']}
              name="image"
              label="bildlänk"
              error={errors.name}
              {...register('image')}
            />
          </HStack>

          <Box>
            <SearchIngredient
              name="Sök ingrediens"
              label="Sök Ingrediens"
              onAddIngredient={handleAddorUpdate}
            ></SearchIngredient>
            {showEditIngredient && (
              <EditIngredient
                isAdded={ingredientExists}
                setIngredientsError={setIngredientsError}
                handleDeleteDish={() => {
                  remove(indexIngredient)
                  setShowEditIngredient(false)
                }}
                measurementUnitsData={measurementUnitsData}
                ingredientsError={ingredientsError}
                register={register}
                // trigger={trigger}
                setShowEditIngredient={setShowEditIngredient}
                addIngredient={addIngredient ? addNewIngredient : updateIngredient}
                // errors={errors}
              />
            )}
            <Wrap mt="15px">
              {fields.map(
                (ingredient: {
                  id: string
                  name: string
                  quantity: string
                  measurementUnitId: string
                }) => (
                  <Tag
                    p="0.4em"
                    onClick={() => handleAddorUpdate(ingredient)}
                    cursor="pointer"
                    fontSize={['14px', '18px']}
                    key={ingredient.id}
                    size={['sm', 'lg']}
                    borderRadius="4"
                    variant="solid"
                    colorScheme="gray"
                  >
                    <TagLabel>
                      {ingredient.name} x {ingredient.quantity}
                      {setSelectedMeasurementUnit(
                        measurementUnitsData,
                        ingredient?.measurementUnitId
                      )}
                    </TagLabel>
                    <Icon as={RiEditLine} ml="8px" color="gray.200" fontSize={['14', '16']} />
                  </Tag>
                )
              )}
              <Flex flexDirection={'column'} bgColor="grain">
                <Select
                  w={'100%'}
                  name="mainIngredientId"
                  label={isWideVersion ? 'Huvudingrediens' : 'H ingr.'}
                  error={errors.mainIngredientId}
                  {...register('mainIngredientId')}
                >
                  {fields?.map(
                    (ingredient) => (
                      (ingredient.id = crypto.randomUUID()),
                      (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
                        </option>
                      )
                    )
                  )}
                </Select>
                <Text m={'var(--chakra-space-4) 0 var(--chakra-space-2) 0'}>Antal/volym</Text>
                <Flex
                  justifyContent="center"
                  backgroundColor="grain"
                  borderRadius={'var(--chakra-radii-md)'}
                  alignItems={'flex-start'}
                >
                  <Input
                    display={'flex'}
                    justifyContent={'flex-end'}
                    name={'mainIngredientQuantity'}
                    {...register('mainIngredientQuantity')}
                    type={'number'}
                    error={errors.mainIngredientQuantity}
                    backgroundColor={'gray.100'}
                    _placeholder={{ color: 'gray.250' }}
                    borderRadius={'var(--chakra-radii-md) 0 0 var(--chakra-radii-md)'}
                    textAlign="right"
                  />
                  <Select
                    name="mainMeasurementUnitId"
                    error={errors.mainMeasurementUnitId}
                    {...register('mainMeasurementUnitId')}
                    borderRadius={'0 var(--chakra-radii-md) var(--chakra-radii-md) 0'}
                    textAlign="left"
                  >
                    {measurementUnitsData?.items.map((unit) => (
                      <option label={unit.name} key={unit.id} value={unit.id} />
                    ))}
                  </Select>
                </Flex>
              </Flex>
            </Wrap>
          </Box>
        </Flex>

        <Flex flexDirection="column" gap="15px" flex={['50%']}>
          <Box>
            <Textarea
              label="Information"
              height="8.8em"
              resize="none"
              border="1px solid"
              borderColor="gray.200"
              name="description"
              error={errors.description}
              variant="filled"
              {...register('description')}
            />
          </Box>
          <Box>
            <Textarea
              label="Recept"
              height="9.5em"
              resize="none"
              border="1px solid"
              borderColor="gray.200"
              name="recept"
              error={errors.recipe}
              variant="filled"
              {...register('recipe')}
            />
          </Box>
        </Flex>
      </Flex>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          <Link href="/dishes" passHref>
            <Button aria-label="cancel changes" colorScheme="gray">
              Avbryt
            </Button>
          </Link>
          <Button aria-label="save changes" type="submit" colorScheme="oxblood">
            Spara
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

interface DishFormModalProps {
  buttonProps: ButtonProps
  buttonLabel: string
  onAddDish: (dish: Dish) => void
  newDish?: string
}

export function DishFormModal({
  buttonProps,
  buttonLabel,
  onAddDish,
  newDish
}: DishFormModalProps) {
  const modalDisclosure = useDisclosure()
  const alert = useAlert()

  const createDish = useMutation(
    async (grocery: CreateDishFormData) => {
      await api
        .post('groceries', {
          ...grocery
        })
        .then((response) => {
          const { dish } = response.data
          alert.success('Maträtt tillagd')
          onAddDish(dish)
          modalDisclosure.onClose()
        })
        .catch(({ response }) => {
          alert.error(response.data.message)
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dishes')
      }
    }
  )

  const handleCreateGrocery: SubmitHandler<CreateDishFormData> = async (values) => {
    await createDish.mutateAsync(values)
  }

  return (
    <Modal disclosureProps={modalDisclosure} buttonProps={buttonProps} buttonLabel={buttonLabel}>
      <DishForm
        handleSubmit={handleCreateGrocery}
        handleCancel={modalDisclosure.onClose}
        initialData={{
          id: '',
          name: newDish,
          description: '',
          ingredients: [],
          mainIngredient: null,
          mainMeasurementUnitId: null,
          recipe: '',
          createdAt: null,
          image: null,
          temperature: '180'
        }}
        title={''}
        isEdit={false}
      />
    </Modal>
  )
}
