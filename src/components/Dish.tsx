import { Box, Flex, Text, Button, Icon, HStack, Stack, Heading, Image } from '@chakra-ui/react'
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import Link from 'next/link'
import { placeholderImage } from '../services/utils'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'

export default function Dish({ dish, dishIngredient, onMouseEnter, handleDeleteDish }) {
  const { role } = useContext(AppContext)

  return (
    <Link href={`/dishes/view/${dish.id}`} passHref>
      <Flex
        bg="white"
        mb="15px"
        p="8px"
        borderRadius="10px"
        onMouseEnter={onMouseEnter}
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        aria-label={`${dish.name} dish`}
        tabIndex={0}
        cursor="pointer"
      >
        <Image
          objectFit="cover"
          w={['100%', '180px']}
          src={dish?.image ? dish?.image : placeholderImage}
          maxH={['140px', '140px', '140px']}
          alt={`a close-up photo of ${dish.name} dish`}
          borderRadius={5}
        />

        <Stack ml="10px">
          <Box>
            <Heading py={['8px', '6px']} size={['sm', 'md']}>
              {dish.name}
            </Heading>
            <Flex flexDirection="column">
              <Text fontSize={['15', '18']} fontWeight="600">
                Ingredienser:
              </Text>
              <Flex flexFlow={'wrap'} mb="4px">
                {dishIngredient.reverse().map((ingredient, i, { length }) => (
                  <Text
                    as="span"
                    key={i}
                    _first={{ fontWeight: '600' }}
                    fontSize={['14', '16']}
                    py={['2px', '2px', '2px']}
                  >
                    {length - 1 === i
                      ? ingredient.grocery.name
                      : `${ingredient.grocery.name},\u00A0`}
                  </Text>
                ))}
              </Flex>
            </Flex>
          </Box>

          {role === 'admin' && (
            <Box>
              <HStack>
                <Button
                  aria-label="delete dish"
                  size="sm"
                  bg="red.100"
                  color="white"
                  justifyContent="center"
                  leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
                  iconSpacing="0"
                  _hover={{ bg: 'red.200' }}
                  onClick={handleDeleteDish}
                ></Button>
                <Link href={`/dishes/edit/${dish.id}`} passHref>
                  <Button
                    aria-label="edit dish"
                    size="sm"
                    bg="gray.200"
                    leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                    iconSpacing="0"
                  />
                </Link>
              </HStack>
            </Box>
          )}
        </Stack>
      </Flex>
    </Link>
  )
}
