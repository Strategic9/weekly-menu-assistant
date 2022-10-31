import { Text } from '@chakra-ui/react'

export function Logo() {
  return (
    <Text fontSize={['2xl', '3xl']} fontWeight="bold" letterSpacing="tight" w="64">
      food
      <Text as="span" color="oxblood.300">
        &
      </Text>
      shopping
      <Text as="span" ml="1" color="oxblood.300">
        .
      </Text>
    </Text>
  )
}
