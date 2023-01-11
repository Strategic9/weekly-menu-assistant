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
  Textarea,
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

export type CreateDishFormData = {
  id?: string
  name: string
  description?: string
  ingredients?: { id: string; name: string; quantity: number }[]
  mainIngredientId?: string
  recipe?: string
  mainIngredientQuantity?: string
}

interface DishFormParams {
  title: string
  handleSubmit: SubmitHandler<CreateDishFormData>
  handleCancel?: () => void
  initialData?: any
  isEdit: boolean
}

const createDishFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  ingredients: yup.array().min(1, 'Ingredients is required'),
  ingredientQuantity: yup.string(),
  mainIngredientId: yup.string().required('Main ingredient is required'),
  mainIngredientQuantity: yup.string().required('Quantity is required'),
  recipe: yup.string()
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
  const mainIngredient: any = props.initialData?.ingredients.find((i: any) => i.isMain)
  const ingredients: any = props.initialData?.ingredients.filter((i: any) => !i.isMain)

  const [ingredientId, setIngredientId] = useState('')
  const [indexIngredient, setIndexIngredient] = useState<number>()

  const [addIngredient, setAddIngredient] = useState<boolean>()
  const [showEditIngredient, setShowEditIngredient] = useState<boolean>()

  const defaultValues = {
    ...props.initialData,
    ...{
      ingredients: ingredients?.map((e: any) => {
        return { id: e.grocery.id, name: e.grocery.name, quantity: e.quantity }
      }),
      mainIngredientId: mainIngredient?.grocery?.id,
      mainIngredientQuantity: mainIngredient?.quantity
    }
  }

  const {
    register,
    control,
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

  const openIngredientTag = (ingredient, index) => {
    setShowEditIngredient(true)
    if (ingredientGroceryId) {
      setIngredientId(ingredientGroceryId[index])
    }

    setValue('ingredientName', ingredient.name)
    setValue('ingredientQuantity', ingredient.quantity)

    setIndexIngredient(index)
  }

  const addIngredientName = (el) => {
    setValue('ingredientName', el.name)
    setValue('ingredientQuantity', el.quantity)
    setIngredientId(el.id)
    setAddIngredient(true)
    setShowEditIngredient(true)
  }

  const addNewIngredient = () => {
    const quantity = getValues('ingredientQuantity')
    const name = getValues('ingredientName')
    const quantityExists = !!quantity && quantity > 0

    if (quantityExists) {
      append({ id: ingredientId, name: name, quantity: quantity })

      setAddIngredient(false)
      setShowEditIngredient(false)
    }
  }

  const updateIngredient = () => {
    const quantity = getValues('ingredientQuantity')
    const name = getValues('ingredientName')
    const quantityExists = !!quantity && quantity > 0

    if (quantityExists) {
      update(indexIngredient, {
        id: ingredientId,
        name: name,
        quantity: quantity
      })
    }

    setShowEditIngredient(false)
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
            <Input name="name" label="Name" error={errors.name} {...register('name')} />
          </Box>
          {useGroceriesData && (
            <HStack spacing="2">
              <Select
                w={['9em', '14em']}
                name="mainIngredientId"
                label={isWideVersion ? 'Main ingredient' : 'Main ingr.'}
                error={errors.mainIngredientId}
                {...register('mainIngredientId')}
              >
                {itemsList?.map((grocery) => (
                  <option key={grocery.id} value={grocery.id}>
                    {grocery.name}
                  </option>
                ))}
              </Select>
              <Input
                w={['100%']}
                name={'mainIngredientQuantity'}
                label={'Qty'}
                type={'number'}
                error={errors.mainIngredientQuantity}
                {...register('mainIngredientQuantity')}
              />
            </HStack>
          )}

          <Box>
            <SearchIngredient
              name="ingredients"
              label="Ingredients"
              onAddIngredient={addIngredientName}
            ></SearchIngredient>
            {showEditIngredient && (
              <EditIngredient
                handleDeleteDish={() => {
                  remove(indexIngredient)
                  setShowEditIngredient(false)
                }}
                register={register}
                setShowEditIngredient={setShowEditIngredient}
                addIngredient={addIngredient ? addNewIngredient : updateIngredient}
                errors={errors}
              />
            )}
            <Wrap mt="15px">
              {fields.map(
                (ingredient: { id: string; name: string; quantity: string }, index: number) => (
                  <Tag
                    p="0.4em"
                    onClick={() => openIngredientTag(ingredient, index)}
                    fontSize={['14px', '18px']}
                    key={ingredient.id}
                    size={['sm', 'lg']}
                    borderRadius="4"
                    variant="solid"
                    colorScheme="gray"
                  >
                    <TagLabel>
                      {ingredient.name} x {ingredient.quantity}
                    </TagLabel>
                    <Icon as={RiEditLine} ml="8px" color="gray.200" fontSize={['14', '16']} />
                  </Tag>
                )
              )}
            </Wrap>
          </Box>
        </Flex>

        <Flex flexDirection="column" gap="15px" flex={['50%']}>
          <Box>
            <Text mb="2">Description</Text>
            <Textarea
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
            <Text mb="2">Recipe</Text>
            <Textarea
              height="8.8em"
              resize="none"
              border="1px solid"
              borderColor="gray.200"
              name="recipe"
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
            <Button colorScheme="gray">Cancel</Button>
          </Link>
          <Button type="submit" colorScheme="oxblood">
            Save
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
          alert.success('Dish added with success')
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
          recipe: '',
          createdAt: null,
          image: null
        }}
        title={''}
        isEdit={false}
      />
    </Modal>
  )
}
