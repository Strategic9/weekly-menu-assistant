import { Stack, Box, Text } from '@chakra-ui/react'
import { PaginationItem } from './PaginationItem'

interface PaginationProps {
  totalCountOfRegisters: number
  registersPerPage?: number
  currentPage?: number
  onPageChange: (page: number) => void
  setOffset: (prev: any) => any
}

const siblingsCount = 1

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1
    })
    .filter((page) => page > 0)
}

export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 4,
  currentPage = 1,
  onPageChange,
  setOffset
}: PaginationProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage)

  const previousPages =
    currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : []
  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
      : []

  const hasRegisters = totalCountOfRegisters > 0
  const initialRegister = hasRegisters ? (currentPage - 1) * registersPerPage + 1 : 0
  const finalRegister =
    initialRegister +
    (currentPage === lastPage ? totalCountOfRegisters - initialRegister : registersPerPage - 1)

  const onChangeOffset = (action: string) => {
    if (action === 'firstPage') {
      setOffset(0)
    }
    if (action === 'nextPage') {
      setOffset((prev: number) => prev + registersPerPage)
    }
    if (action === 'previousPage') {
      setOffset((prev: number) => prev - registersPerPage)
    } else if (action === 'lastPage') {
      setOffset(totalCountOfRegisters - registersPerPage)
    }
  }
  return (
    <Stack direction={['column', 'row']} mt="8" justify="space-between" align="center" spacing="6">
      <Box>
        <strong> {initialRegister} </strong> - <strong> {finalRegister} </strong> of{' '}
        <strong> {totalCountOfRegisters} </strong>
      </Box>

      <Stack direction="row" spacing="2">
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem
              onClick={() => {
                onPageChange(1)
                onChangeOffset('firstpage')
              }}
              number={1}
            />
            {currentPage > 2 + siblingsCount && (
              <Text color="gray" w="8" textAlign="center">
                ...
              </Text>
            )}
          </>
        )}

        {previousPages.length > 0 &&
          previousPages.map((page) => {
            return (
              <PaginationItem
                onClick={() => {
                  onChangeOffset('previousPage')
                  onPageChange(page)
                }}
                key={page}
                number={page}
              />
            )
          })}

        <PaginationItem number={currentPage} isCurrent />

        {nextPages.length > 0 &&
          nextPages.map((page) => {
            return (
              <PaginationItem
                onClick={() => {
                  onChangeOffset('nextPage')
                  onPageChange(page)
                }}
                key={page}
                number={page}
              />
            )
          })}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Text color="gray" w="8" textAlign="center">
                ...
              </Text>
            )}
            <PaginationItem
              onClick={() => {
                onPageChange(lastPage)
                onChangeOffset('lastPage')
              }}
              number={lastPage}
            />
          </>
        )}
      </Stack>
    </Stack>
  )
}
