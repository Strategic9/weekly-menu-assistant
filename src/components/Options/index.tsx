import { Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react'

import { FaEllipsisV, FaEye, FaTrash } from 'react-icons/fa'

export const MenuDishOptions = ({ replace, deleteDish, dishId }) => {
  return (
    <Menu>
      <MenuButton
        size={['xs', 'sm']}
        fontSize={[14, 16]}
        as={IconButton}
        aria-label="Options"
        icon={<FaEllipsisV />}
        variant="outline"
      />
      <MenuList>
        <MenuItem
          as="a"
          _hover={{ background: 'gray.100' }}
          bgColor="white"
          color="gray.700"
          href={`/dishes/view/${dishId}`}
          fontSize="16"
          icon={<FaEye size={16} />}
        >
          Se maträtt
        </MenuItem>
        {replace}
        <MenuItem
          onClick={() => deleteDish()}
          fontSize="16"
          color="red.100"
          icon={<FaTrash size={16} />}
        >
          Ta bort
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
