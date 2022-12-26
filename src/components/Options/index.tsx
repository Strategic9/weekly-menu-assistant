import { Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react'

import { FaEllipsisV, FaTrash } from 'react-icons/fa'

export const MenuDishOptions = ({ replace, deleteDish }) => {
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
        {replace}
        <MenuItem
          onClick={() => deleteDish()}
          fontSize="16"
          color="red.100"
          icon={<FaTrash size={16} />}
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
