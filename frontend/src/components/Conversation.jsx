import { Avatar, AvatarBadge, Flex, Stack, Text, useColorModeValue, WrapItem, Image, useColorMode, Box } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom.js'
import { BsCheck2All, BsFillImageFill } from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/conversationsAtom.js';

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation?.participants[0];
  const [currentUser] = useRecoilState(userAtom)
  const lastMessage = conversation?.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const colorMode = useColorMode();

  return (
    <Flex gap={4} alignItems={"center"} p={1} 
      _hover={{cursor:"pointer", bg:useColorModeValue("gray.600","gray.dark"), color:"white"}}
      borderRadius={"md"}
      bg = {selectedConversation?._id === conversation?._id ? (colorMode === "light" ? "gray.600" : "gray.dark") : ""}
      onClick={() => {
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          username: user.username,
          userProfilePic: user.profilePic,
          mock: conversation.mock
        })
      }}
    >
      <WrapItem>
        <Avatar 
          size={{base:"xs", sm:"sm", md:"md"}} 
          src={user?.profilePic}
        >
          {isOnline ? (<AvatarBadge boxSize={"1em"} bg={"green.500"}/>) : ""}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={'sm'} >
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user?.username} &nbsp;<Image src='/verified.png' w={4} h={4}/>
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage?.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16}/>
            </Box>
          ) : ""}
          {lastMessage?.text.length < 15
          ? lastMessage?.text || <BsFillImageFill size={16} /> 
          : lastMessage?.text.slice(0,15) + " ..."}
        </Text>
      </Stack>
    </Flex>
  )
}

export default Conversation