import { Flex, Icon, IconButton, Box } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { Logo } from './Logo';
import { NotificationNav } from './NotificationNav';
import { Profile } from './Profile';
import { SearchBox } from './SearchBox';
import { useSidebarDrawer } from '../../cotexts/SidebarDrawerContext';
import { RiMenuLine } from 'react-icons/ri';

export function Header() {
    const { onOpen } = useSidebarDrawer();

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true
    });

    return (
        <Box
            w="100%"
            bg="white"
        >
            <Flex
                as="header"
                maxW={1400}
                h={["20", "28"]}
                mx="auto"
                py="4"
                px="4"
                align="center"
            >
                {!isWideVersion && (
                    <IconButton
                        aria-label="Open navigation"
                        icon={<Icon as={RiMenuLine} />}
                        fontSize="24"
                        variant="unstyled"
                        onClick={onOpen}
                        mr="2"
                    />
                )}

                <Logo />

                {isWideVersion && <SearchBox />}

                <Flex
                    align="center"
                    ml="auto"
                >
                    {isWideVersion && <NotificationNav />}
                    <Profile showProfileData={isWideVersion} />
                </Flex>
            </Flex>
        </Box>
    );
}