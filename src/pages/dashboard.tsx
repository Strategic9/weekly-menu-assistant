import { SimpleGrid, Box } from "@chakra-ui/react";
import PageWrapper from "./page-wrapper";

export default function Dashboard() {
    return (
        <PageWrapper>
            <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
                <Box
                    p={["6", "8"]}
                    bg="grain"
                    borderRadius={8}
                    pb="4"
                >

                </Box>
                <Box
                    p={["6", "8"]}
                    bg="grain"
                    borderRadius={8}
                    pb="4"
                >
                </Box>
            </SimpleGrid>
        </PageWrapper>
    );
}