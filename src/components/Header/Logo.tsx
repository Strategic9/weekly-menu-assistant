import { Image, Container } from '@chakra-ui/react'

export function Logo() {
  return (
    <Container ml="0" w="250px" me="0" mr="26px" color="white">
      <Image src="/assets/logo.svg" alt="Forkify Logo" />
    </Container>
  )
}
