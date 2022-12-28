import { Box, Flex, Heading, Divider, VStack, HStack, SimpleGrid, Button } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import { HTTPHandler } from '../../services/api'
import { queryClient } from '../../services/queryClient'
import { useAlert } from 'react-alert'
import PageWrapper from '../page-wrapper'
import Link from 'next/link'
import React from 'react'

type UploadDishData = {
  dishFile: File
}

export default function UploadDish() {
  const alert = useAlert()

  const { handleSubmit, control } = useForm()

  const handleUploadFile = async (values: UploadDishData) => {
    const formData = new FormData()
    formData.append('file', values.dishFile, values.dishFile.name)
    await HTTPHandler.postBlob(`dishes/upload`, formData, 'plain/text')
      .then(() => {
        queryClient.invalidateQueries('dishes')
        alert.success('Dishes saved with success')
      })
      .catch(() => {
        alert.error('Fail to upload dishes')
      })
  }

  return (
    <PageWrapper>
      <Box
        as="form"
        flex="1"
        borderRadius={8}
        bg="grain"
        p={['6', '8']}
        onSubmit={handleSubmit(handleUploadFile)}
      >
        <Heading size="lg" fontWeight="normal">
          Upload Dish
        </Heading>

        <Divider my="6" borderColor="gray.700" />

        <VStack spacing="8">
          <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
            <Controller
              name="dishFile"
              control={control}
              defaultValue={[]}
              render={({ field }) => {
                return (
                  <input
                    type="file"
                    accept="text/plain"
                    name="files"
                    multiple={false}
                    {...field}
                    onChange={(event) => {
                      return field.onChange(event.target.files[0])
                    }}
                    value={field.value.filename}
                  />
                )
              }}
            />
          </SimpleGrid>
        </VStack>

        <Flex mt="8" justify="flex-end">
          <HStack spacing="4">
            <Link href="/dishes" passHref>
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
