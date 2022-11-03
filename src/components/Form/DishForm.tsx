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
import { useEffect } from 'react'
import { Dish } from '../../services/hooks/useDishes'
import Modal from '../Modal'
import { useMutation } from 'react-query'
import { api } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'
import { SearchIngredient } from './SearchIngredient'
import { Grocery } from '../../services/hooks/useGroceries'

export type CreateDishFormData = {
  id?: string
  name: string
  description?: string
  ingredients?: {id: string}[];
}

interface DishFormParams {
  title: string;
  handleSubmit: SubmitHandler<CreateDishFormData>
  handleCancel?: () => void
  initialData?: Dish
}

const createDishFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  ingredients: yup.array()
})

export default function DishForm(props: DishFormParams) {
  const defaultValues = { ...props.initialData, ...{ ingredients: props.initialData?.ingredients.map((e: any) => e.grocery)}}
  const {
    register,
    control,
    reset,
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
      p={['6', '8']}
      onSubmit={handleSubmit(props.handleSubmit)}
    >
      <Heading size="lg" fontWeight="normal">
        {props.title} Dish
      </Heading>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <Grid w="100%" columns={[1, 2]} gap={['4', '6']}>
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
              onAddIngredient={(ingredient: Grocery) => append(ingredient)}
            ></SearchIngredient>
          </GridItem>
          <GridItem colSpan={2} rowSpan={2}>
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
          <Button colorScheme="gray" onClick={() => reset()}>
            Reset
          </Button>
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
          createdAt: null
        }}
      />
    </Modal>
  )
}
