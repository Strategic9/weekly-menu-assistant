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
  ingredients: string[]
}

type FormData = {
  id?: string
  name: string
  description: string
  ingredients: Grocery[]
}

export default function DishPage() {
  const router = useRouter();
  const { dish: dish_id } = router.query;
  const alert = useAlert();
  const { data, isFetching, isLoading } = useDish(dish_id as string);

  const editDish = useMutation(
    async (dish: FormData) => {
      const { name, description } = dish;
      const updatedDish = {
        name,
        description,
        ingredients: dish.ingredients.map(({ id }) => ({ id }))
      }
      await HTTPHandler.patch(`dishes/${dish.id}`, {
        ...updatedDish
      }).then(() => {
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
