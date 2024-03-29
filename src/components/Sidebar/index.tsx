import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody
} from '@chakra-ui/react'
import { useBreakpointValue } from '@chakra-ui/media-query'
import { SidebarNav } from './SidebarNav'
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext'

export function Sidebar() {
  const { isOpen, onClose } = useSidebarDrawer()

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false
  })

  if (isDrawerSidebar) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg="gray.100" p="4">
            <DrawerCloseButton mt="6" />
            <DrawerHeader>Navigeringsmeny</DrawerHeader>
            <DrawerBody>
              <SidebarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    )
  }

  return (
    <Box as="aside" w="72" mr="6">
      <SidebarNav />
    </Box>
  )
}
