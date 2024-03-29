import { Image, Container, Link } from '@chakra-ui/react'

type LogoProps = {
  linkTo?: string
}

export const Logo = ({ linkTo }: LogoProps) => {
  return (
    <Container
      id="header-logo"
      alignSelf="center"
      ml="0"
      w={['190px', '250px']}
      me="0"
      color="white"
    >
      <Link href={linkTo ? linkTo : '/menu'}>
        <Image src="/assets/logo.svg" alt="Welcome to Forkify" />
      </Link>
    </Container>
  )
}
