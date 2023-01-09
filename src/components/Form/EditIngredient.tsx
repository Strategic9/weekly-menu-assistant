import { Flex, HStack, GridItem, Button } from '@chakra-ui/react'
import { Input } from './Input'

const EditIngredient = ({ register, setShowEditIngredient, errors, addIngredient }) => {
  return (
    <GridItem w={['65%']}>
      <Flex alignItems="flex-end" alignContent="baseline">
        <Input
          w={['9em', '180px']}
          name={'ingredientName'}
          label={'Ingredient'}
          readOnly
          {...register('ingredientName')}
          mr="10px"
        />
        <br />
        <Input
          w={['100%', '25%']}
          minW={['30%', '90px']}
          name={'ingredientQuantity'}
          label={'Qty'}
          {...register('ingredientQuantity')}
          type={'number'}
          error={errors.ingredientQuantity}
        />
        <HStack>
          <Button onClick={() => setShowEditIngredient(false)} mr="2" px="35px">
            Cancel
          </Button>
          <Button onClick={addIngredient} colorScheme="oxblood" px="35px">
            Save
          </Button>
        </HStack>
      </Flex>
    </GridItem>
  )
}

export default EditIngredient
