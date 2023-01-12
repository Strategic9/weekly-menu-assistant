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
  id?: string
  name: string
  description: string
  ingredients: string[]
}

type FormData = {
  id?: string
  name: string
  description: string
  ingredients: any[]
  mainIngredientId: string
  mainIngredientQuantity: string
  recipe: string
}

export default function DishPage() {
  const router = useRouter()
  const { dish: dish_id } = router.query
  const alert = useAlert()
  const { data, isFetching, isLoading } = useDish(dish_id as string)

  const editDish = useMutation(
    async (dish: FormData) => {
      const { name, description, mainIngredientId, mainIngredientQuantity, recipe } = dish
      const updatedDish = {
        name,
        description,
        ingredients: dish.ingredients
          .filter((i) => i.id !== mainIngredientId)
          .map(({ id, quantity }) => ({ id: id, quantity: quantity })),
        mainIngredient: { id: mainIngredientId, quantity: mainIngredientQuantity },
        recipe
      }
      await HTTPHandler.patch(`dishes/${dish.id}`, {
        ...updatedDish
      })
        .then(() => {
          alert.success('Dish updated with success')
          router.push('..')
        })
        .catch(({ response }) => {
          alert.error(response.data.message)
        })
    },
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries(['dishes'])
          .then(() => queryClient.invalidateQueries(['dish', dish_id]))
      }
    }
  )

  const handleEditDish: SubmitHandler<FormData> = async (values) => {
    await editDish.mutateAsync(values)
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
