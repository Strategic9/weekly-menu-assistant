import { Box, Flex, Text, Button, Icon, HStack, Stack, Heading, Image } from '@chakra-ui/react'
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import Link from 'next/link'

export default function Dish({ dish, dishIngredient, onMouseEnter, handleDeleteDish }) {
  return (
    <Flex
      bg="white"
      mb="15px"
      p="8px"
      borderRadius="10px"
      onMouseEnter={onMouseEnter}
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
    >
      {!!dish.image && (
        <Image
          objectFit="cover"
          maxW={['100%', '180px']}
          src={dish.image}
          maxH="140px"
          alt="dish"
        />
      )}

      <Stack ml="10px">
        <Box>
          <Heading mt={['6px', '2px']} size={['sm', 'md']}>
            {dish.name}
          </Heading>
          <HStack>
            <Text fontSize={['15', '18']} fontWeight="600">
              Ingredients:
            </Text>
            <Text fontSize={['14', '16']} py="2">
              {dishIngredient} {dish.recipe}
            </Text>
          </HStack>
        </Box>

        <Box>
          <HStack>
            <Button
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
                size="sm"
                bg="gray.200"
                leftIcon={<Icon as={RiEditLine} fontSize="16" />}
                iconSpacing="0"
              />
            </Link>
          </HStack>
        </Box>
      </Stack>
    </Flex>
  )
}
