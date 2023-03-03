import {
  Box,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  UseDisclosureProps,
  Button,
  ButtonProps
} from '@chakra-ui/react'
import { ReactNode } from 'react'

interface ModalProps {
  disclosureProps: UseDisclosureProps
  children: ReactNode
  buttonProps: ButtonProps
  buttonLabel: string
}

export default function Modal({ disclosureProps, children, buttonProps, buttonLabel }: ModalProps) {
  const { isOpen, onOpen, onClose } = disclosureProps

  return (
    <Box>
      <Button aria-label="open modal with information" onClick={onOpen} {...buttonProps}>
        {buttonLabel}
      </Button>
      <ChakraModal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>{children}</ModalContent>
      </ChakraModal>
    </Box>
  )
}
