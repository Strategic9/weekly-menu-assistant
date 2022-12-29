import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'

import { HTTPHandler } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import { Grocery } from '../../services/hooks/useGroceries'
import { useRouter } from 'next/router'
import PageWrapper from '../page-wrapper'
import DishForm from '../../components/Form/DishForm'

type CreateDishFormData = {
  name: string
  description: string
  image: string
  ingredients: { id: string; quantity: number }[]
  mainIngredient: { id: string; quantity: number }
}

type FormData = {
  name: string
  description: string
  ingredients: Grocery[]
  mainIngredientId: string
}

export default function CreateDish() {
  const router = useRouter()
  const alert = useAlert()
  const createDish = useMutation(
    async (dish: CreateDishFormData) => {
      await HTTPHandler.post('dishes', {
        ...dish
      })
        .then(() => {
          alert.success('Dish added with success')
          router.push('.')
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

  // const { errors } = formState;

  const handleCreateDish: SubmitHandler<FormData> = async ({
    name,
    description,
    ingredients,
    mainIngredientId
  }) => {
    const newDish: CreateDishFormData = {
      name,
      description,
      image:
        'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGZvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      ingredients: ingredients
        .filter((i) => i.id !== mainIngredientId)
        .map(({ id }) => ({ id, quantity: 1 })),

      mainIngredient: { id: mainIngredientId, quantity: 1 }
    }
    await createDish.mutateAsync(newDish)
  }

  return (
    <PageWrapper>
      <DishForm title={'Edit'} handleSubmit={handleCreateDish} />
    </PageWrapper>
  )
}
