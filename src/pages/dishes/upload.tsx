import { Box, Flex, Heading, Divider, VStack, HStack, SimpleGrid, Button } from "@chakra-ui/react";

import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useMutation } from 'react-query';
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import Link from "next/link";
import FileUpload from "../../components/Form/FileUpload";
import PageWrapper from "../page-wrapper";

type UploadDishesFormData = {
    file: FileList
}

const uploadDishesFormSchema = yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string(),
    ingredients: yup.array()
});

export default function UploadDishesFile() {
    const uploadDishes = useMutation(async (dish: UploadDishesFormData) => {
        const response = await api.post('dishes', {
            dish: {
                ...dish,
                created_at: new Date()
            }
        });

        return response.data.dish;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('dishes')
        }
    });

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(uploadDishesFormSchema)
    });

    const handleUploadDish: SubmitHandler<UploadDishesFormData> = async (values) => {
        await uploadDishes.mutateAsync(values);
    }

    return (
        <PageWrapper>
            <Box
                as="form"
                flex="1"
                borderRadius={8}
                bg="grain"
                p={["6", "8"]}
                onSubmit={handleSubmit(handleUploadDish)}
            >
                <Heading size="lg" fontWeight="normal">Upload Dishes File</Heading>

                <Divider my="6" borderColor="gray.700" />

                <VStack spacing="8">
                    <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                        <FileUpload name="dishesFile" placeholder="Your file ..." acceptedFileTypes="text" control={control}>
                            Dishes
                        </FileUpload>
                    </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                    <HStack spacing="4">
                        <Link href="/dishes" passHref>
                            <Button colorScheme="gray">Cancel</Button>
                        </Link>
                        <Button type="submit" colorScheme="oxblood">Save</Button>
                    </HStack>
                </Flex>
            </Box>
        </PageWrapper>
    );
}