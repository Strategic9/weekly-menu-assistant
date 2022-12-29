import { Spinner, Flex } from '@chakra-ui/react'
import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'

import { api, HTTPHandler } from '../../../services/api'
import { queryClient } from '../../../services/queryClient'
import { useAlert } from 'react-alert'
import { useRouter } from 'next/router'
import { useDish } from '../../../services/hooks/useDishes'
import { Grocery } from '../../../services/hooks/useGroceries'
import PageWrapper from '../../page-wrapper'
import DishForm from '../../../components/Form/DishForm'

type UpdateDishFormData = {
  id?: string
  name: string
  description: string
  image: string
  ingredients: string[]
}

type FormData = {
  id?: string
  name: string
  description: string
  ingredients: Grocery[]
  mainIngredientId: string
}

export default function DishPage() {
  const router = useRouter()
  const { dish: dish_id } = router.query
  const alert = useAlert()
  const { data, isFetching, isLoading } = useDish(dish_id as string)

  const editDish = useMutation(
    async (dish: FormData) => {
      const { name, description, mainIngredientId } = dish
      const updatedDish = {
        name,
        description,
        image:
          'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGZvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
        ingredients: dish.ingredients
          .filter((i) => i.id !== mainIngredientId)
          .map(({ id }) => ({ id, quantity: 1 })),
        mainIngredient: { id: mainIngredientId, quantity: 1 }
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
        queryClient.invalidateQueries('dishes')
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
        <DishForm title={'Edit'} handleSubmit={handleEditDish} initialData={data.dish} />
      )}
    </PageWrapper>
  )
}
