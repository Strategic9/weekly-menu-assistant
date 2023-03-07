import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link'
import { cloneElement, ReactElement } from 'react'
import { Box, Flex } from '@chakra-ui/react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  shouldMatchExactHref?: boolean
}

export function ActiveLink({ children, shouldMatchExactHref = false, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter()

  let isActive = false

  if (shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true
  }

  if (
    !shouldMatchExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true
  }

  return (
    <Flex>
      <Link {...rest}>
        {cloneElement(children, {
          color: isActive ? 'oxblood.300' : 'gray.400'
        })}
      </Link>
      {isActive && <Box ml="auto" h="8" borderRight="4px solid" borderColor="oxblood.300" />}
    </Flex>
  )
}
