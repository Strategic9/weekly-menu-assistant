import { Link as ChakraLink, Icon, Text, LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { ElementType } from 'react'
import { ActiveLink } from '../ActiveLink'

interface NavLinkProps extends ChakraLinkProps {
  icon?: ElementType
  children: string
  href: string
}

export function NavLink({ icon, href, className, children, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref shouldMatchExactHref>
      <ChakraLink display="flex" alignItems="center" lineHeight="8" {...rest}>
        {icon && <Icon as={icon} fontSize="20" />}
        <Text className={className} ml="4" fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  )
}
