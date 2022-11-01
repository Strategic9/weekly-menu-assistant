import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Button,
  Spinner
} from '@chakra-ui/react'
import Link from 'next/link'

import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useMutation } from 'react-query'

import { Input } from '../../../components/Form/Input'
import { api } from '../../../services/api'
import { queryClient } from '../../../services/queryClient'
import { Category, getCategoryById } from '../../../services/hooks/useCategories'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import PageWrapper from '../../page-wrapper'

type CreateCategoryFormData = {
  name: string
}

const createCategoryFormSchema = yup.object({
  name: yup.string().required('Name is required')
})

export default function CategoryPage() {
  const router = useRouter()
  const alert = useAlert()
  const { category: categoryId } = router.query
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState<Category>()
  const [error, setError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(createCategoryFormSchema)
  })

  useEffect(() => {
    const getCategory = async () => {
      setIsLoading(true)
      try {
        const category = await getCategoryById(categoryId as string)
        setCategory(category)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setError(true)
      }
    }

    if (!router.isReady) {
      setIsLoading(true)
    } else {
      getCategory()
    }
  }, [router.isReady, categoryId])

  const editCategory = useMutation(
    async (category: CreateCategoryFormData) => {
      await api
        .patch(`categories/${categoryId}`, { ...category })
        .then(() => {
          alert.success('Category updated with success')
          router.push('..')
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

  const handleEditCategory: SubmitHandler<CreateCategoryFormData> = async (values) => {
    await editCategory.mutateAsync(values)
  }

  useEffect(() => {
    setValue('name', category?.name)
  }, [category, setValue])

  return (
    <PageWrapper>
      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text>Fail to obtain category data.</Text>
        </Flex>
      ) : (
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="grain"
          p={['6', '8']}
          onSubmit={handleSubmit(handleEditCategory)}
        >
          <Heading size="lg" fontWeight="normal">
            Edit category
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
      )}
    </PageWrapper>
  )
}
