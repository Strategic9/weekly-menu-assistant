import { Box, Flex, Heading, Divider, VStack, HStack, SimpleGrid, Button } from '@chakra-ui/react'
import Link from 'next/link'

import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useMutation } from 'react-query'

import { Input } from '../../components/Form/Input'
import { api } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import { useRouter } from 'next/router'
import PageWrapper from '../page-wrapper'

type CreateCategoryFormData = {
  name: string
  category: string
}

const createCategoryFormSchema = yup.object({
  name: yup.string().required('Name is required')
})

export default function CreateCategory() {
  const router = useRouter()
  const alert = useAlert()
  const createCategory = useMutation(
    async (category: CreateCategoryFormData) => {
      await api
        .post('categories', {
          ...category
        })
        .then(() => {
          alert.success('Category added with success')
          router.push('.')
        })
        .catch(({ response }) => {
          alert.error(response.data.message)
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories')
      }
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createCategoryFormSchema)
  })

  const handleCreateCategory: SubmitHandler<CreateCategoryFormData> = async (values) => {
    await createCategory.mutateAsync(values)
  }

  return (
    <PageWrapper>
      <Box
        as="form"
        flex="1"
        borderRadius={8}
        bg="grain"
        p={['6', '8']}
        onSubmit={handleSubmit(handleCreateCategory)}
      >
        <Heading size="lg" fontWeight="normal">
          Create category
        </Heading>

        <Divider my="6" borderColor="gray.700" />

        <VStack spacing="8">
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input name="name" label="Name" error={errors.name} {...register('name')} />
          </SimpleGrid>
        </VStack>

        <Flex mt="8" justify="flex-end">
          <HStack spacing="4">
            <Link href="/categories" passHref>
              <Button colorScheme="gray">Cancel</Button>
            </Link>
            <Button type="submit" colorScheme="oxblood">
              Save
            </Button>
          </HStack>
        </Flex>
      </Box>
    </PageWrapper>
  )
}
