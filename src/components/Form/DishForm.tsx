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
  TagLabel,
  TagCloseButton
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import Link from 'next/link'
import { Input } from './Input'

import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Dish } from '../../services/hooks/useDishes'
import Modal from '../Modal'
import { useMutation } from 'react-query'
import { api } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'
import { SearchIngredient } from './SearchIngredient'
import { Select } from './Select'
import { GetGroceriesResponse, Grocery, useGroceries } from '../../services/hooks/useGroceries'

export type CreateDishFormData = {
  id?: string
  name: string
  description?: string
  ingredients?: { id: string }[]
  mainIngredientId?: string
}

interface DishFormParams {
  title: string
  handleSubmit: SubmitHandler<CreateDishFormData>
  handleCancel?: () => void
  initialData?: Dish
}

const createDishFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  ingredients: yup.array().min(1, 'Ingredients is required'),
  mainIngredientId: yup.string().required('Main ingredient is required')
})

export default function DishForm(props: DishFormParams) {
  const { data: useGroceriesData } = useGroceries(null, {})
  const groceriesData = useGroceriesData as GetGroceriesResponse
  const itemsList = groceriesData?.items
  const mainIngredient: any = props.initialData?.ingredients.find((i) => i.isMain)
  const ingredients: any = props.initialData?.ingredients.filter((i) => !i.isMain)
  const defaultValues = {
    ...props.initialData,
    ...{
      ingredients: ingredients?.map((e: any) => e.grocery),
      mainIngredientId: mainIngredient?.grocery.id
    }
  }
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createDishFormSchema),
    defaultValues
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  })

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
        {props.title} Dish
      </Heading>

      <Divider my={[4, 6]} borderColor="gray.700" />

      <VStack spacing="8">
        <Grid w="100%" templateColumns={['repeat(1, 1fr)', 'repeat(2, 2fr)']} gap={['4', '6']}>
          <GridItem>
            <Input name="name" label="Name" error={errors.name} {...register('name')} />
          </GridItem>
          <GridItem>
            <Input
              name="description"
              label="Description"
              error={errors.description}
              {...register('description')}
            />
          </GridItem>
          <GridItem>
            <SearchIngredient
              name="ingredients"
              label="Ingredients"
              error={errors.ingredients}
              onAddIngredient={(ingredient: Grocery) => append(ingredient)}
            ></SearchIngredient>
          </GridItem>
          <GridItem>
            {useGroceriesData && (
              <Select
                name="mainIngredient"
                label="Main ingredient"
                error={errors.mainIngredientId}
                {...register('mainIngredientId')}
              >
                {itemsList?.map((grocery) => (
                  <option key={grocery.id} value={grocery.id}>
                    {grocery.name}
                  </option>
                ))}
              </Select>
            )}
          </GridItem>
          <GridItem>
            <HStack spacing={2}>
              {fields.map((ingredient: Grocery, index: number) => (
                <Tag
                  key={ingredient.id}
                  index={index}
                  size="lg"
                  borderRadius="4"
                  variant="solid"
                  colorScheme="gray"
                >
                  <TagLabel>{ingredient.name}</TagLabel>
                  <TagCloseButton onClick={() => remove(index)} />
                </Tag>
              ))}
            </HStack>
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
          createdAt: null
        }}
      />
    </Modal>
  )
}
