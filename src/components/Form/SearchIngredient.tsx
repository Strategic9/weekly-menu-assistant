import { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react'
import {
  InputProps as ChakraInputProps,
  useDisclosure,
  Box,
  Spinner,
  Button,
  ButtonProps,
  Icon
} from '@chakra-ui/react'
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react'
import { BiPlus } from 'react-icons/bi'
import { FieldError } from 'react-hook-form'
import { GetGroceriesResponse, Grocery, useGroceries } from '../../services/hooks/useGroceries'
import { Input } from './Input'
import { GroceryFormModal } from './GroceryForm'
import Modal from '../Modal'

interface SearchIngredientProps extends ChakraInputProps {
  name: string
  label?: string
  error?: FieldError
  onAddIngredient: (ingredient: Grocery) => void
}

const SearchIngredientBase: ForwardRefRenderFunction<HTMLInputElement, SearchIngredientProps> = (
  { name, label, w, minW, error = null, onAddIngredient, ...rest },
  ref
) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [results, setResults] = useState([])
  const [newIngredient, setNewIngredient] = useState()
  const { data: useGroceriesData } = useGroceries(null, {})
  const groceriesData = useGroceriesData as GetGroceriesResponse
  const itemsList = groceriesData?.items

  const filterResults = (e) => {
    const text = e.target.value
    let results = itemsList
    if (text != '') {
      const noMatch = itemsList.every((item) => item.name !== text)
      setNewIngredient(noMatch ? text : '')
      results = itemsList.filter((item) => item.name.toLowerCase().startsWith(text.toLowerCase()))
    }
    setResults(results.slice(0, 10))
  }

  useEffect(() => {
    setResults(itemsList?.slice(0, 10))
  }, [itemsList])

  return (
    <div onBlur={onClose}>
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
            h="53"
            w={w}
            minW={minW}
            name={name}
            label={label}
            error={error}
            placeholder="Search"
            onChange={(e) => filterResults(e)}
          />
        </PopoverTrigger>
        <PopoverContent maxW={['160px', '100%']} borderRadius="none">
          {!!newIngredient && (
            <GroceryFormModal
              buttonProps={{
                width: '100%',
                justifyContent: 'space-between',
                borderRadius: 'none',
                size: 'sm',
                rightIcon: <Icon as={BiPlus} />
              }}
              buttonLabel={newIngredient}
              onAddIngredient={onAddIngredient}
              newIngredient={newIngredient}
            />
          )}
          {results ? (
            results.map((el) => (
              <Box key={el.id}>
                <Button
                  width="100%"
                  justifyContent="left"
                  borderRadius="none"
                  size="sm"
                  fontSize={['sm', 'md']}
                  onClick={() => onAddIngredient(el)}
                >
                  {el.name}
                </Button>
              </Box>
            ))
          ) : (
            <Box py="4" mx="auto">
              <Spinner />
            </Box>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const SearchIngredient = forwardRef(SearchIngredientBase)

////////////////////////////////////////////////////////////////////////

interface SearchIngredientModalProps {
  buttonProps: ButtonProps
  buttonLabel?: string
  onSelectItem: (ingredient: Grocery) => void
}

export function SearchIngredientModal({
  buttonProps,
  buttonLabel,
  onSelectItem
}: SearchIngredientModalProps) {
  const modalDisclosure = useDisclosure()

  return (
    <Modal buttonProps={buttonProps} buttonLabel={buttonLabel} disclosureProps={modalDisclosure}>
      <Box flex="1" borderRadius={8} bg="grain" p={['6', '8']}>
        <SearchIngredient
          w={['9em', '100%']}
          name="ingredients"
          onAddIngredient={(ingredient: Grocery) => {
            onSelectItem(ingredient)
            modalDisclosure.onClose()
          }}
        />
      </Box>
    </Modal>
  )
}
