import { Wrap, Flex, Box, Button, Icon, Text } from '@chakra-ui/react'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Input } from './Input'
import { Select } from './Select'

const EditIngredient = ({
  register,
  setIngredientsError,
  setShowEditIngredient,
  addIngredient,
  handleDeleteDish,
  isAdded,
  ingredientsError,
  measurementUnitsData
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
        <Flex pb="14px" alignItems={'flex-end'} flexDirection="column" width="100%">
          <Input
            mr="10px"
            w={'100%'}
            name={'ingredients'}
            label={'Ingrediens'}
            readOnly
            {...register('ingredientName')}
          />
          <Flex flexDirection={'column'} width="100%">
            <Text m={'var(--chakra-space-4) 0 var(--chakra-space-2) 0'}>Antal/volym</Text>
            <Flex
              justifyContent={'center'}
              borderRadius={'var(--chakra-radii-md)'}
              backgroundColor="gray.200"
              alignItems={'flex-start'}
            >
              <Box>
                <Input
                  width={'99%'}
                  display={'flex'}
                  justifyContent={'flex-end'}
                  name={'ingredientQuantity'}
                  {...register('ingredientQuantity')}
                  error={ingredientsError.quantity || ''}
                  type={'number'}
                  backgroundColor={'gray.100'}
                  _placeholder={{ color: 'gray.250' }}
                  border={'none'}
                  borderRadius={'var(--chakra-radii-md) 0 0 var(--chakra-radii-md)'}
                  textAlign="right"
                  autoFocus
                />
                {ingredientsError.quantity && (
                  <p style={{ color: 'red', fontSize: 16 }}>{ingredientsError.quantity}</p>
                )}
              </Box>
              <Box>
                <Select
                  width={'99%'}
                  name="measurementUnitId"
                  {...register('measurementUnitId')}
                  error={ingredientsError.measurement || ''}
                  border={'none'}
                  borderRadius={'0 var(--chakra-radii-md) var(--chakra-radii-md) 0'}
                  textAlign="left"
                >
                  {measurementUnitsData?.items.map((unit) => (
                    <option label={unit.name} key={unit.id} value={unit.id} />
                  ))}
                </Select>
                {ingredientsError.measurement && (
                  <p style={{ color: 'red', fontSize: 16 }}>{ingredientsError.measurement}</p>
                )}
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" w="100%">
          {isAdded ? (
            <Button
              aria-label="delete ingredient"
              size={['sm', 'md']}
              bg="red.100"
              color="white"
              leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
              iconSpacing="0"
              _hover={{ bg: 'red.200' }}
              onClick={() => handleDeleteDish()}
            ></Button>
          ) : (
            <Box />
          )}
          <Box>
            <Button
              aria-label="cancel"
              _hover={{ bg: 'white' }}
              size={['sm', 'md']}
              onClick={() => {
                setIngredientsError({})
                setShowEditIngredient(false)
              }}
              mr="2"
              px="35px"
            >
              Avbryt
            </Button>
            <Button
              aria-label="save ingredient"
              size={['sm', 'md']}
              onClick={async () => addIngredient()}
              colorScheme="oxblood"
              px="35px"
            >
              Spara
            </Button>
          </Box>
        </Flex>
      </Wrap>
    </Box>
  )
}

export default EditIngredient
