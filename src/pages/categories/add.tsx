import { Box, Flex, Heading, Divider, VStack, HStack, SimpleGrid, Button } from '@chakra-ui/react'
import Link from 'next/link'

import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useMutation } from 'react-query'

import { Input } from '../../components/Form/Input'
import { HTTPHandler } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import { useRouter } from 'next/router'
import PageWrapper from '../page-wrapper'
import Head from 'next/head'

type CreateCategoryFormData = {
  name: string
}

const createCategoryFormSchema = yup.object({
  name: yup.string().required('Name is required')
})

export default function CreateCategory() {
  const router = useRouter()
  const alert = useAlert()
  const createCategory = useMutation(
    async (category: CreateCategoryFormData) => {
      await HTTPHandler.post('categories', {
        ...category
      })
        .then(() => {
          alert.success('Kategori skapad')
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
      <Head>
        <title>Lägg till kategori | Forkify</title>
      </Head>
      <Box
        as="form"
        flex="1"
        borderRadius={8}
        bg="grain"
        p={['6', '8']}
        onSubmit={handleSubmit(handleCreateCategory)}
      >
        <Heading size="lg" fontWeight="normal">
          Skapa kategori
        </Heading>

        <Divider my="6" borderColor="gray.700" />

        <VStack spacing="8">
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Input name="name" label="Namn" error={errors.name} {...register('name')} />
          </SimpleGrid>
        </VStack>

        <Flex mt="8" justify="flex-end">
          <HStack spacing="4">
            <Link href="/categories" passHref>
              <Button aria-label="Avbryt" colorScheme="gray">
                Avbryt
              </Button>
            </Link>
            <Button aria-label="Spara" type="submit" colorScheme="oxblood">
              Spara
            </Button>
          </HStack>
        </Flex>
      </Box>
    </PageWrapper>
  )
}
