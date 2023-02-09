import { Spinner, Flex, Image, Container } from '@chakra-ui/react'
import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'
import { HTTPHandler } from '../../../services/api'
import { queryClient } from '../../../services/queryClient'
import { useAlert } from 'react-alert'
import { useRouter } from 'next/router'
import { useDish } from '../../../services/hooks/useDishes'
import PageWrapper from '../../page-wrapper'
import DishForm from '../../../components/Form/DishForm'
import React from 'react'

type UpdateDishFormData = {
  name: string
  image?: string
  portions?: string
  temperature?: string
  cookingTime?: string
  ingredients: { id: string; quantity: string }[]
  mainIngredient: { id: string; quantity: string; measurementUnitId: string }
  recipe: string
  description: string
}

type FormData = {
  name: string
  description: string
  ingredients: any[]
  mainIngredientId: string
  mainIngredientQuantity: string
  mainMeasurementUnitId: string
  recipe: string
  image?: string
  portions?: string
  temperature?: string
  cookingTime?: string
}

export default function DishPage() {
  const router = useRouter()
  const { dish: dish_id } = router.query
  const alert = useAlert()
  const { data, isFetching, isLoading } = useDish(dish_id as string)

  const updateDish = useMutation(
    async (dish: UpdateDishFormData) => {
      await HTTPHandler.patch(`dishes/${dish_id}`, {
        ...dish
      })
        .then(() => {
          alert.success('Maträtt tillagd')
          router.push(`/dishes/view/${dish_id}`)
        })
        .catch(({ response }) => {
          alert.error(response.data.message)
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/dishes/view/${dish_id}`)
      }
    }
  )

  const handleEditDish: SubmitHandler<FormData> = async ({
    name,
    description,
    ingredients,
    mainIngredientId,
    mainIngredientQuantity,
    mainMeasurementUnitId,
    recipe,
    image,
    cookingTime,
    portions,
    temperature
  }) => {
    const newDish: UpdateDishFormData = {
      name,
      description,
      image: image || '',
      ingredients: ingredients
        .filter((i) => i.id !== mainIngredientId)
        .map(({ id, quantity, measurementUnitId }) => ({
          id: id,
          quantity: quantity,
          measurementUnitId: measurementUnitId
        })),
      mainIngredient: {
        id: mainIngredientId,
        quantity: mainIngredientQuantity,
        measurementUnitId: mainMeasurementUnitId
      },
      recipe: recipe || '',
      cookingTime: cookingTime || '',
      portions: portions || '',
      temperature: temperature || ''
    }
    await updateDish.mutateAsync(newDish)
  }

  return (
    <PageWrapper>
      {isFetching || isLoading ? (
        <Flex w="100%" h={40} m="auto">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Container
            id="header-logo"
            alignSelf="center"
            w={['190px', '250px']}
            color="white"
            alignItems="center"
          >
            <Image src="/assets/dish-placeholder.png" alt="Dish Image Placeholder" />
          </Container>
          <DishForm
            title={data.dish?.name}
            isEdit={true}
            handleSubmit={handleEditDish}
            initialData={data.dish}
          />
        </>
      )}
    </PageWrapper>
  )
}
