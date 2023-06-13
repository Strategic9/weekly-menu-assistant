import { Flex, Box, Text, Avatar, Image, Button } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import ProfileDropdown from './ProfileDropdown'

interface ProfileProps {
  showProfileData: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    setUsername(currentUser.username)
    setEmail(currentUser.email)
  }, [])

  return (
    <ProfileDropdown>
      <Button variant={'unstyled'}>
        <Flex align="center">
          {showProfileData && (
            <Box mr="4" textAlign="right">
              <Text className="profile-name">{username ? username : 'Gästanvändare'}</Text>
              <Text className="profile-mail" color="gray.600" fontSize="small">
                {email}
              </Text>
            </Box>
          )}
          <Avatar
            className="avatar-img"
            size={['sm', 'md']}
            bg="transparent"
            bgGradient="linear(to-b, tan.400, tan.500)"
            icon={<Image src="/assets/profile.svg" />}
          />
        </Flex>
      </Button>
    </ProfileDropdown>
  )
}
