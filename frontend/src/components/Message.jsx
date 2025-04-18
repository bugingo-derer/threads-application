import { Avatar, Box, Flex, Text, Image, Skeleton } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { selectedConversationAtom } from '../atoms/conversationsAtom'
import userAtom from '../atoms/userAtom'
import { formatDistanceToNow } from 'date-fns'
import { BsCheck2All } from 'react-icons/bs'

const Message = ({ message, ownMessage }) => {
  const [selectedConversation] = useRecoilState(selectedConversationAtom)
  const [user] = useRecoilState(userAtom)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const time = formatDistanceToNow(message.createdAt, {
    addSuffix: true,
  }).replace(/^about\s/, '')

  return (
    <Flex
      direction="column"
      alignSelf={ownMessage ? 'flex-end' : 'flex-start'}
      alignItems={ownMessage ? 'flex-end' : 'flex-start'}
      gap={1}
      my={2}
    >
      <Flex gap={2} alignItems="flex-end">
        {/* Left Avatar for received message */}
        {!ownMessage && (
          <Avatar src={selectedConversation.userProfilePic} w="7" h="7" />
        )}

        <Flex direction="column" alignItems={ownMessage ? 'flex-end' : 'flex-start'}>
          {/* Text Message */}
          {message.text && (
            <Flex
              bg={ownMessage ? 'green.800' : 'gray.400'}
              maxW="350px"
              p={2}
              borderRadius="md"
              color={ownMessage ? 'white' : 'black'}
              position="relative"
            >
              <Text>{message.text}</Text>
            </Flex>
          )}

          {/* Image Message */}
          {message.img && (
            <Flex mt={2} maxW="200px">
              {!imgLoaded && !imgError && (
                <Skeleton w="200px" h="200px" borderRadius="md" />
              )}
              <Image
                src={message.img}
                alt="Message Image"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                display={imgLoaded && !imgError ? 'block' : 'none'}
                borderRadius="md"
                border="2px solid"
                borderColor={ownMessage ? 'green.800' : 'gray.400'}
                maxW="200px"
                transition="transform 0.3s ease"
                _hover={{ transform: 'scale(1.02)' }}
              />
            </Flex>
          )}

          {/* Read Check (for own message only, outside bubble) */}
          {ownMessage && (
            <Box
              alignSelf="flex-end"
              ml={1}
              color={message.seen ? 'blue.400' : 'gray.300'}
              fontWeight="bold"
            >
              <BsCheck2All size={16} />
            </Box>
          )}
        </Flex>

        {/* Right Avatar for own message */}
        {ownMessage && <Avatar src={user.profilePic} w="7" h="7" />}
      </Flex>

      <Text fontSize="2xs" color="gray.500">
        {time}
      </Text>
    </Flex>
  )
}

export default Message
