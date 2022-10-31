import { Flex, Input, Icon } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

export function SearchBox() {
    // const [search, setSearch] = useState(''); // Controlled Component

    const searchInputRef = useRef<HTMLInputElement>(null); // Uncontrolled Component (Imperative)

    return (
        <Flex
            as="label"
            flex="1"
            py="4"
            px="8"
            ml="6"
            maxW={400}
            alignSelf="center"
            color="black"
            position="relative"
            bg="grain"
            borderRadius="full"
            className="header-search"
        >
            <Input
                color="black"
                variant="unstyled"
                px="4"
                mr="4"
                placeholder="Search"
                _placeholder={{ color: 'gray' }}
                ref={searchInputRef}
            />
            <Icon as={RiSearch2Line} fontSize="20" />
        </Flex>
    );
}