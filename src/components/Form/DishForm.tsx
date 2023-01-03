import React, { useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  Grid,
  GridItem,
  Button,
  ButtonProps,
  Tag,
  Text,
  Textarea,
  TagLabel,
  TagCloseButton
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

export type CreateDishFormData = {
  id?: string
  name: string
  description?: string
  ingredients?: { id: string; quantity: number }[]
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
  ingredientId: yup.string(),
  mainIngredientId: yup.string().required('Main ingredient is required'),
  recipe: yup.string(),
  mainIngredientQuantity: yup.string().required('Quantity is required'),
  ingredientQuantity: yup.string()
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

  const defaultValues = {
    ...props.initialData,
    ...{
      ingredients: ingredients?.map((e: any) => {
        return { groceryId: e.grocery.id, quantity: e.quantity }
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
    resetField
  } = useForm({
    resolver: yupResolver(createDishFormSchema),
    defaultValues
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  })

  const addIngredient = () => {
    const quantity = getValues('ingredientQuantity')
    if (!!quantity && quantity > 0) {
      append({ groceryId: getValues('ingredientId'), quantity: quantity })
    }

    resetField('ingredientId')
    resetField('ingredientQuantity')
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

      <VStack spacing="8">
        <Grid w="100%" gap={['4', '6']} alignContent={'start'} alignItems={'start'}>
          {!props.isEdit ? (
            <GridItem w={['100%', '50%']}>
              <Input name="name" label="Name" error={errors.name} {...register('name')} />
            </GridItem>
          ) : (
            <></>
          )}
          <GridItem w={['100%', '50%']}>
            <Input
              name="description"
              label="Description"
              error={errors.description}
              {...register('description')}
            />
          </GridItem>
          {useGroceriesData && (
            <>
              <GridItem w={['100%', ' 60%']}>
                <HStack spacing="4">
                  <Select
                    w={['9em', '100%']}
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
                    w={['100%', '25%']}
                    minW={['30%', '50%']}
                    name={'mainIngredientQuantity'}
                    label={'Qty'}
                    type={'number'}
                    error={errors.mainIngredientQuantity}
                    {...register('mainIngredientQuantity')}
                  />
                </HStack>
              </GridItem>

              <GridItem w={['100%', ' 60%']}>
                <HStack spacing="4">
                  <Select
                    w={['9em', '100%']}
                    name="ingredientId"
                    label="Ingredients"
                    error={errors.ingredientId}
                    {...register('ingredientId')}
                  >
                    {itemsList?.map((grocery) => (
                      <option key={grocery.id} value={grocery.id}>
                        {grocery.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    w={['100%', '25%']}
                    minW={['30%', '50%']}
                    name={'ingredientQuantity'}
                    label={'Qty'}
                    type={'number'}
                    error={errors.ingredientQuantity}
                    {...register('ingredientQuantity')}
                  />
                </HStack>
              </GridItem>
              <HStack className="mt-1">
                <Button colorScheme="oxblood" onClick={addIngredient} className="mt-1">
                  + Add
                </Button>
              </HStack>
            </>
          )}

          <GridItem w="100%">
            <HStack spacing={2}>
              {fields.map(
                (
                  ingredient: { id: string; groceryId: string; name: string; quantity: number },
                  index: number
                ) => (
                  <Tag
                    key={ingredient.groceryId}
                    index={index}
                    size="lg"
                    borderRadius="4"
                    variant="solid"
                    colorScheme="gray"
                  >
                    <TagLabel>
                      {itemsList?.find((i) => i.id === ingredient.groceryId)?.name}
                    </TagLabel>
                    <TagCloseButton onClick={() => remove(index)} />
                  </Tag>
                )
              )}
            </HStack>
          </GridItem>
          <GridItem w={['100%', '50%']}>
            <Text mb="2">Recipe</Text>
            <Textarea
              border="1px solid"
              borderColor="gray.200"
              name="recipe"
              error={errors.recipe}
              variant="filled"
              {...register('recipe')}
            />
          </GridItem>
        </Grid>
      </VStack>

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
