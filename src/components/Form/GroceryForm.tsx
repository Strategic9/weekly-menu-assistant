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
import {
  GetMeasurementUnitsResponse,
  useMeasurementUnits
} from '../../services/hooks/useMeasurementUnit'
import { useEffect } from 'react'
import { Grocery } from '../../services/hooks/useGroceries'
import Modal from '../Modal'
import { useMutation } from 'react-query'
import { HTTPHandler } from '../../services/api'
import { useAlert } from 'react-alert'
import { queryClient } from '../../services/queryClient'

export type CreateGroceryFormData = {
  id?: string
  name: string
  categoryId: string
  measurementUnitId: string
}

interface GroceryFormParams {
  handleSubmit: SubmitHandler<CreateGroceryFormData>
  handleCancel?: () => void
  initialData?: Grocery
  handleOpenSearchInput: (arg: boolean) => void
}

const createGroceryFormSchema = yup.object({
  name: yup.string().required('Namn måste anges'),
  categoryId: yup.string().required('En kategori måste väljas'),
  measurementUnitId: yup.string().required('En måttenhet måste väljas')
})

export default function GroceryForm(props: GroceryFormParams) {
  const { data: useCategoriesData } = useCategories(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )
  const categoryData = useCategoriesData as GetCategoriesResponse

  const { data: useMeasurementUnitsData } = useMeasurementUnits(
    null,
    {},
    {
      'page[limit]': 1000,
      'page[offset]': 0
    }
  )
  const measurementUnitsData = useMeasurementUnitsData as GetMeasurementUnitsResponse

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
      setValue('categoryId', data?.category?.id)
      setValue(
        'measurementUnitId',
        data?.measurementUnits && data?.measurementUnits[0]?.measurementUnit.id
      )
    }
  }, [props.initialData, setValue])

  const handleSubmitGroceryForm = (e: any) => {
    e.stopPropagation()
    handleSubmit(props.handleSubmit)(e)
  }

  return (
    <Box
      onBlur={(e) => e.relatedTarget === null && props.handleOpenSearchInput(false)}
      as="form"
      flex="1"
      borderRadius={8}
      bg="grain"
      p={['6', '8']}
      onSubmit={handleSubmitGroceryForm}
    >
      <Heading size="lg" fontWeight="normal">
        {`${props.initialData ? 'Ändra' : 'Skapa'}`} Ingrediens
      </Heading>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
          <Input name="name" label="Namn" error={errors.name} {...register('name')} />
          <Select
            name="Kategori"
            label="Kategori"
            error={errors.categoryId}
            {...register('categoryId')}
          >
            {categoryData?.items.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            name="Measurement Unit"
            label="Måttenhet"
            error={errors.measurementUnitId}
            {...register('measurementUnitId')}
          >
            {measurementUnitsData?.items.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.value}
              </option>
            ))}
          </Select>
        </SimpleGrid>
      </VStack>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          {props.handleCancel ? (
            <Button colorScheme="gray" onClick={props.handleCancel}>
              Avbryt
            </Button>
          ) : (
            <Link href="/groceries" passHref>
              <Button colorScheme="gray">Avbryt</Button>
            </Link>
          )}
          <Button type="submit" colorScheme="oxblood">
            Spara
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
  handleOpenSearchInput: (arg: boolean) => void
}

export function GroceryFormModal({
  buttonProps,
  buttonLabel,
  onAddIngredient,
  newIngredient,
  handleOpenSearchInput
}: GroceryFormModalProps) {
  const modalDisclosure = useDisclosure()
  const alert = useAlert()

  const createGrocery = useMutation(
    async (grocery: CreateGroceryFormData) => {
      await HTTPHandler.post('groceries', {
        name: grocery.name,
        category: {
          id: grocery.categoryId
        },
        measurementUnits: [
          {
            id: grocery.measurementUnitId
          }
        ]
      })
        .then((response) => {
          onAddIngredient(response.data)
          alert.success('Ingrediens tillagd')

          handleOpenSearchInput(false)
          modalDisclosure.onClose()
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
          handleOpenSearchInput={handleOpenSearchInput}
          handleSubmit={handleCreateGrocery}
          handleCancel={() => {
            modalDisclosure.onClose()
            handleOpenSearchInput(false)
          }}
          initialData={{
            id: '',
            name: newIngredient,
            measurementUnits: null,
            category: null,
            createdAt: null
          }}
        />
      </Modal>
    </>
  )
}
