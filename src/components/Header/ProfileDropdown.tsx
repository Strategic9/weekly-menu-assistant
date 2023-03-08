import React from 'react'
import {
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverBody,
  PopoverArrow
} from '@chakra-ui/react'
import { HTTPHandler } from '../../services/api'
import { localStorage } from '../../services/localstorage'
import { signOut } from 'next-auth/react'

export const ProfileDropdown = ({ children }) => {
  const token = localStorage.get('token')

  const handleLogOut = async (token: string) => {
    try {
      await HTTPHandler.post('users/logout', token)
      localStorage.delete('token')
      localStorage.delete('username')
      localStorage.delete('email')
      localStorage.delete('user-id')
      signOut()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Popover offset={[0, 12]}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <Portal>
        <PopoverContent width={'150px'}>
          <PopoverArrow />
          <PopoverBody alignContent={'center'}>
            <Button
              aria-label="logga ut"
              onClick={() => handleLogOut(token)}
              variant="unstyled"
              color="red.200"
            >
              Logga ut
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default ProfileDropdown
