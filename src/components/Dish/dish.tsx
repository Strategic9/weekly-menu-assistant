import {
  Box,
  Text,
  Flex,
  Heading,
  Button,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Tooltip,
  Tbody,
  Td,
  useBreakpointValue,
  HStack,
  Spinner
} from '@chakra-ui/react'
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import TooltipButton from '../TooltipButton'
import Link from 'next/link'
export default function Dish({
  dish,
  dishIngredient,
  onMouseEnter,
  isWideVersion,
  handleDeleteDish
}) {
  return (
    <Tr>
      <Td>
        <Box display="flex" onMouseEnter={onMouseEnter}>
          {!!dish.image && <img src={dish?.image} width="45px" height="45px" alt="dish-image" />}
          <Text ml="4" fontWeight="bold" textTransform="capitalize">
            {dish.name}
          </Text>
        </Box>
      </Td>
      {isWideVersion && <Td>{dishIngredient}</Td>}
      {isWideVersion && (
        <Td>
          <HStack>
            <Tooltip label="Remove" bg="red.200" color="white" placement="top-start">
              <Button
                size="sm"
                bg="red.100"
                color="white"
                justifyContent="center"
                leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                iconSpacing="0"
                _hover={{ bg: 'red.200' }}
                onClick={handleDeleteDish}
              />
            </Tooltip>
            <Link href={`/dishes/edit/${dish.id}`} passHref>
              <TooltipButton
                tooltipLabel="Edit"
                size="sm"
                bg="gray.200"
                leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                iconSpacing="0"
              />
            </Link>
          </HStack>
        </Td>
      )}
    </Tr>
  )
}
