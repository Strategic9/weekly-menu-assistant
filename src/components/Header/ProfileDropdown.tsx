import React, { useContext } from 'react'
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
import { signOut } from 'next-auth/react'
import { UserContext, defaultUser } from '../../contexts/UserContext'
import { localStorage } from '../../services/localstorage'

export const ProfileDropdown = ({ children }) => {
  const { setCurrentUser } = useContext(UserContext)
  const token = localStorage.get('token')

  const handleLogOut = async (token: string) => {
    try {
      await HTTPHandler.post('users/logout', token)
      setCurrentUser(defaultUser)
      localStorage.delete('token')
      localStorage.delete('user-id')
      signOut({ callbackUrl: '/' })
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
