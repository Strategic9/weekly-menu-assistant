import { Box, Flex, Text, Stack, Icon, Collapse, Link as ChakraLink } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ElementType, ReactNode, useState } from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { ActiveSection } from '../ActiveSection'

interface NavSectionProps {
  title: string
  icon: ElementType
  activePath: string
  children: ReactNode
}

export function NavSection({ title, icon, activePath, children }: NavSectionProps) {
  const { asPath } = useRouter()

  let isActive = false

  if (asPath.startsWith(String(activePath))) {
    isActive = true
  }

  const [toggle, setToggle] = useState(isActive)

  return (
    <Box w="100%">
      <ActiveSection isActive={isActive}>
        <ChakraLink onClick={() => setToggle(!toggle)}>
          <Flex>
            <Icon as={icon} fontSize="20" />
            <Text className="sidebar-text" ml="4" fontWeight="medium">
              {title}
            </Text>
            <Icon
              as={toggle ? MdOutlineKeyboardArrowUp : MdOutlineKeyboardArrowDown}
              ml="auto"
              mr="4"
            />
          </Flex>
        </ChakraLink>
      </ActiveSection>

      <Collapse in={toggle} animateOpacity>
        <Stack
          spacing="4"
          mt="4"
          py="4"
          pl="4"
          align="stretch"
          bg="grain"
          borderRadius={4}
          lineHeight="8"
        >
          {children}
        </Stack>
      </Collapse>
    </Box>
  )
}
