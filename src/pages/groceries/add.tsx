import { useRouter } from 'next/router'

import { SubmitHandler } from 'react-hook-form'
import { useMutation } from 'react-query'

import { api, HTTPHandler } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import GroceryForm, { CreateGroceryFormData } from '../../components/Form/GroceryForm'
import PageWrapper from '../page-wrapper'

export default function CreateGrocery() {
  const router = useRouter()
  const alert = useAlert()

  const createGrocery = useMutation(
    async (grocery: CreateGroceryFormData) => {
      try {
        await HTTPHandler.post('groceries', {
          name: grocery.name,
          category: {
            id: grocery.categoryId
          }
        })
        alert.success('Ingrediens tillagd')
        router.push('.')
      } catch ({ response }) {
        alert.error(response.data.status && 400 && 'Validate all values are correct')
      }
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
    <PageWrapper>
      <GroceryForm handleSubmit={handleCreateGrocery} />
    </PageWrapper>
  )
}
