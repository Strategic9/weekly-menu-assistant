import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  ButtonProps
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { useRef } from 'react'

interface AlertDialogProps {
  header?: string
  body: string
  onConfirm: () => void
  buttonProps: ButtonProps
  buttonLabel?: string
}

export default function AlertDialog({
  header,
  body,
  onConfirm,
  buttonProps,
  buttonLabel
}: AlertDialogProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const ValidateAlertDialog = () => {
    onClose()
    onConfirm()
  }

  return (
    <>
      <Button onClick={onOpen} {...buttonProps}>
        {buttonLabel}
      </Button>
      <ChakraAlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{header}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Nej
            </Button>
            <Button colorScheme="oxblood" ml={3} onClick={onConfirm}>
              Ja
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </ChakraAlertDialog>
    </>
  )
}
