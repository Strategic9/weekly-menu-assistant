import { Flex, Text, Spinner } from "@chakra-ui/react";

import { SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';

import { api } from "../../../services/api";
import { queryClient } from "../../../services/queryClient";
import { useGrocery } from "../../../services/hooks/useGroceries";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import GroceryForm, { CreateGroceryFormData } from "../../../components/Form/GroceryForm";
import PageWrapper from "../../page-wrapper";


export default function GroceryPage() {
    const router = useRouter();
    const { grocery: grocery_id } = router.query;
    const alert = useAlert();
    const { data, isLoading, error } = useGrocery(grocery_id as string);

    const editGrocery = useMutation(async (grocery: CreateGroceryFormData) => {
        await api.put('groceries', { id: grocery_id, ...grocery })
            .then(() => {
                alert.success("Grocery updated with success");
                router.push('..');
            })
            .catch(({ response }) => {
                alert.error(response.data.message);
            });
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('groceries');
            router.push('..');
        }
    });

    const handleEditGrocery: SubmitHandler<CreateGroceryFormData> = async (values) => {
        await editGrocery.mutateAsync(values);
    }

    return (
        <PageWrapper>
            {isLoading ? (
                <Flex justify="center">
                    <Spinner />
                </Flex>
            ) : error ? (
                <Flex justify="center">
                    <Text>Fail to obtain grocery data.</Text>
                </Flex>
            ) : (
                <GroceryForm handleSubmit={handleEditGrocery} initialData={data?.grocery} />
            )}
        </PageWrapper>
    );
}