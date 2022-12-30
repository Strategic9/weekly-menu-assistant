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
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'
import { Input } from './Input'
import Modal from '../Modal'
import { useDishes, Dish, GetDishesResponse } from '../../services/hooks/useDishes'

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
  const { onOpen, onClose, isOpen } = useDisclosure()
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
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-start"
      autoFocus={false}
      {...rest}
    >
      <PopoverTrigger>
        <Input
          name={name}
          label={label}
          error={error}
          placeholder="Search"
          onChange={(e) => filterResults(e)}
        />
      </PopoverTrigger>
      <PopoverContent borderRadius="none">
        {results ? (
          results.map((el) => (
            <HStack
              width="100%"
              justifyContent="left"
              borderRadius="none"
              onClick={() => onSelectDish(el)}
              key={el.id}
            >
              <Image maxW="90" mb="5px" src={el.image} alt="dish" />

              <Text>{el.name}</Text>
            </HStack>
          ))
        ) : (
          <Box py="4" mx="auto">
            <Spinner />
          </Box>
        )}
      </PopoverContent>
    </Popover>
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
