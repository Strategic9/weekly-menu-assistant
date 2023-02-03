import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'

import { HTTPHandler } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import { useRouter } from 'next/router'
import PageWrapper from '../page-wrapper'
import DishForm from '../../components/Form/DishForm'

type CreateDishFormData = {
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

export default function CreateDish() {
  const router = useRouter()
  const alert = useAlert()
  const createDish = useMutation(
    async (dish: CreateDishFormData) => {
      await HTTPHandler.post('dishes', {
        ...dish
      })
        .then(() => {
          alert.success('Maträtt tillagd')
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

  const handleCreateDish: SubmitHandler<FormData> = async ({
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
    const newDish: CreateDishFormData = {
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
    await createDish.mutateAsync(newDish)
  }

  return (
    <PageWrapper>
      <DishForm title={'Skapa maträtt'} isEdit={false} handleSubmit={handleCreateDish} />
    </PageWrapper>
  )
}
