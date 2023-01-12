import { Wrap, Flex, Box, Button, Icon } from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Input } from './Input'

const EditIngredient = ({
  register,
  setShowEditIngredient,
  errors,
  addIngredient,
  handleDeleteDish
}) => {
  return (
    <Box
      mb="8px"
      mt="15px"
      borderRadius="8px"
      p="14px"
      backgroundColor="gray.200"
      w={['100%', '65%', '100%']}
    >
      <Wrap maxWidth={['400px', '100%']}>
        <Flex pb="14px">
          <Input
            mr="10px"
            w={['7.5em', '90%', '14rem']}
            name={'ingredientName'}
            label={'Ingredient'}
            readOnly
            {...register('ingredientName')}
          />

          <Input
            w={['100%']}
            name={'ingredientQuantity'}
            label={'Qty'}
            {...register('ingredientQuantity')}
            type={'number'}
            error={errors.ingredientQuantity}
          />
        </Flex>
        <Flex justifyContent="space-between" w="100%">
          <Button
            size={['sm', 'md']}
            bg="red.100"
            color="white"
            leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
            iconSpacing="0"
            _hover={{ bg: 'red.200' }}
            onClick={() => handleDeleteDish()}
          ></Button>
          <Box>
            <Button
              _hover={{ bg: 'white' }}
              size={['sm', 'md']}
              onClick={() => setShowEditIngredient(false)}
              mr="2"
              px="35px"
            >
              Cancel
            </Button>
            <Button size={['sm', 'md']} onClick={addIngredient} colorScheme="oxblood" px="35px">
              Save
            </Button>
          </Box>
        </Flex>
      </Wrap>
    </Box>
  )
}

export default EditIngredient
