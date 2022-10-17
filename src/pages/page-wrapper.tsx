import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SidebarDrawerProvider } from "../cotexts/SidebarDrawerContext";

interface PageWrapperProps {
    children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
    return (
        <SidebarDrawerProvider>
            <Box>
                <Header />

                <Flex w="100%" my="6" maxW={1400} mx="auto" px="6">
                    <Sidebar />
                    {children}
                </Flex>
            </Box>
        </SidebarDrawerProvider>
    );
}