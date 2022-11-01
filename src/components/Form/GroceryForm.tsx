import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  ButtonProps
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import Link from 'next/link'
import { Input } from './Input'
import { Select } from './Select'

import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { GetCategoriesResponse, useCategories } from '../../services/hooks/useCategories'
import { useEffect, useState } from 'react'
import { Grocery } from '../../services/hooks/useGroceries'
import Modal from '../Modal'
import { useMutation } from 'react-query'
import { api } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'

export type CreateGroceryFormData = {
  id?: string
  name: string
  categoryId: string
}

interface GroceryFormParams {
  handleSubmit: SubmitHandler<CreateGroceryFormData>
  handleCancel?: () => void
  initialData?: Grocery
}

const createGroceryFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  categoryId: yup.string().required('A category must be selected')
})

export default function GroceryForm(props: GroceryFormParams) {
  const { data: useCategoriesData } = useCategories(null, {})
  const categoryData = useCategoriesData as GetCategoriesResponse

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(createGroceryFormSchema)
  })

  useEffect(() => {
    const data = props.initialData
    if (data) {
      setValue('id', data.id)
      setValue('name', data.name)
      setValue('categoryId', data.category?.id)
    }
  }, [props.initialData, setValue])

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
        {`${props.initialData ? 'Edit' : 'Create'}`} grocery
      </Heading>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Input name="name" label="Name" error={errors.name} {...register('name')} />
          <Select
            name="category"
            label="Category"
            error={errors.categoryId}
            {...register('categoryId')}
          >
            {categoryData?.items.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </SimpleGrid>
      </VStack>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          {props.handleCancel ? (
            <Button colorScheme="gray" onClick={props.handleCancel}>
              Cancel
            </Button>
          ) : (
            <Link href="/groceries" passHref>
              <Button colorScheme="gray">Cancel</Button>
            </Link>
          )}
          <Button type="submit" colorScheme="oxblood">
            Save
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

interface GroceryFormModalProps {
  buttonProps: ButtonProps
  buttonLabel: string
  onAddIngredient: (ingredient: Grocery) => void
  newIngredient?: string
}

export function GroceryFormModal({
  buttonProps,
  buttonLabel,
  onAddIngredient,
  newIngredient
}: GroceryFormModalProps) {
  const modalDisclosure = useDisclosure()
  const alert = useAlert()

  const createGrocery = useMutation(
    async (grocery: CreateGroceryFormData) => {
      await api
        .post('groceries', {
          name: grocery.name,
          category: {
            id: grocery.categoryId
          }
        })
        .catch(({ response }) => {
          alert.error(response.data.message)
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groceries')
      }
    }
  )

  const handleCreateGrocery: SubmitHandler<CreateGroceryFormData> = async (values) => {
    await createGrocery.mutateAsync(values)
  }

  return (
    <>
      <Modal disclosureProps={modalDisclosure} buttonProps={buttonProps} buttonLabel={buttonLabel}>
        <GroceryForm
          handleSubmit={handleCreateGrocery}
          handleCancel={modalDisclosure.onClose}
          initialData={{
            id: '',
            name: newIngredient,
            category: null,
            createdAt: null
          }}
        />
      </Modal>
    </>
  )
}
