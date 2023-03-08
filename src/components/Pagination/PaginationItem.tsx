import { Button } from '@chakra-ui/react'

interface PaginationItemProps {
  number: number
  isCurrent?: boolean
  onClick?: () => void
}

export function PaginationItem({
  number,
  isCurrent = false,

  onClick
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        bg="gray"
        color="white"
        disabled
        _hover={{
          bg: 'gray'
        }}
        _disabled={{
          cursor: 'default'
        }}
        aria-label={`you are on page ${number}`}
      >
        {number}
      </Button>
    )
  }

  return (
    <Button
      aria-label={`go to page ${number}`}
      size="sm"
      fontSize="xs"
      width="4"
      colorScheme="oxblood"
      onClick={onClick}
    >
      {number}
    </Button>
  )
}
