import { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react'
import {
  InputProps as ChakraInputProps,
  useDisclosure,
  Box,
  Spinner,
  ButtonProps,
  Text,
  Image,
  HStack
} from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'
import { Input } from './Input'
import Modal from '../Modal'
import { useDishes, Dish, GetDishesResponse } from '../../services/hooks/useDishes'
import { placeholderImage } from '../../services/utils'

interface SearchDishProps extends ChakraInputProps {
  name: string
  label?: string
  error?: FieldError
  onSelectDish: (dish: Dish) => void
}

const SearchDishBase: ForwardRefRenderFunction<HTMLInputElement, SearchDishProps> = (
  { name, label, error = null, onSelectDish, ...rest },
  ref
) => {
  const [openSearchInput, handleOpenSearchInput] = useState(false)
  const [results, setResults] = useState([])
  const { data: useDishesData } = useDishes(null, {})
  const dishesData = useDishesData as GetDishesResponse
  const itemsList = dishesData?.dishes

  const filterResults = (e) => {
    const text = e.target.value
    let results = itemsList
    if (text != '') {
      results = itemsList.filter((item) => item.name.toLowerCase().startsWith(text.toLowerCase()))
    }
    setResults(results.slice(0, 10))
  }

  useEffect(() => {
    setResults(itemsList?.slice(0, 10))
  }, [itemsList])

  return (
    <Box>
      <Input
        name={name}
        label={label}
        error={error}
        onBlur={(e) => e.relatedTarget === null && handleOpenSearchInput(false)}
        placeholder="Sök maträtt"
        onChange={(e) => {
          handleOpenSearchInput(true)
          filterResults(e)
        }}
      />
      {openSearchInput && (
        <Box bg="white">
          {results ? (
            results.map((el) => (
              <HStack
                width="100%"
                justifyContent="left"
                borderRadius="none"
                onClick={() => onSelectDish(el)}
                key={el.id}
                _hover={{ bgColor: 'gray.200' }}
                cursor="pointer"
              >
                <Image
                  w="70px"
                  borderRadius={6}
                  m={2}
                  h="50"
                  mb="5px"
                  src={el.image || placeholderImage}
                  alt="dish"
                  objectFit="cover"
                />

                <Text>{el.name}</Text>
              </HStack>
            ))
          ) : (
            <Box py="4" mx="auto">
              <Spinner />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export const SearchDish = forwardRef(SearchDishBase)

interface SearchDishModalProps {
  buttonProps: ButtonProps
  buttonLabel?: string
  onSelectItem: (dish: Dish) => void
}

export function SearchDishModal({ buttonProps, buttonLabel, onSelectItem }: SearchDishModalProps) {
  const modalDisclosure = useDisclosure()

  return (
    <Modal buttonProps={buttonProps} buttonLabel={buttonLabel} disclosureProps={modalDisclosure}>
      <Box as="form" flex="1" borderRadius={8} bg="grain" p={['6', '8']}>
        <SearchDish
          name="dishes"
          label="Dishes"
          onSelectDish={(dish: Dish) => {
            onSelectItem(dish)
            modalDisclosure.onClose()
          }}
        />
      </Box>
    </Modal>
  )
}
