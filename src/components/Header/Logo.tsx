import { Image, Container, Link } from '@chakra-ui/react'

type LogoProps = {
  linkTo?: string
}

export const Logo = ({ linkTo }: LogoProps) => {
  return (
    <Container alignSelf="center" ml="0" w={['190px', '250px']} me="0" color="white">
      <Link href={linkTo ? linkTo : '/dashboard'}>
        <Image src="/assets/logo.svg" alt="Forkify Logo" />
      </Link>
    </Container>
  )
}
