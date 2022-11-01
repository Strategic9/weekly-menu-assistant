import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'

import { api } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import { Grocery } from '../../services/hooks/useGroceries'
import { useRouter } from 'next/router'
import PageWrapper from '../page-wrapper'
import DishForm from '../../components/Form/DishForm'

type CreateDishFormData = {
  name: string
  description: string
  ingredients: Grocery[]
}

export default function CreateDish() {
  const router = useRouter()
  const alert = useAlert()
  const createDish = useMutation(
    async (dish: CreateDishFormData) => {
      await api
        .post('dishes', {
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

  const handleCreateDish: SubmitHandler<CreateDishFormData> = async (values) => {
    await createDish.mutateAsync(values)
  }

  return (
    <PageWrapper>
      <DishForm handleSubmit={handleCreateDish} />
    </PageWrapper>
  )
}
