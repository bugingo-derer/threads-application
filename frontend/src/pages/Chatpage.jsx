import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import { GiConversation } from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/conversationsAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'

const Chatpage = () => {
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchingConversation, setSearchingConversation] = useState(false);

  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  const {socket, onlineUsers} = useSocket();
  
  useEffect(() => {
    socket?.on("messageSeen", ({conversationId}) => {
      setConversations(prev => {
        const updatedConversations = prev.map(conversation => {
          if(conversation._id === conversationId){
            return {
              ...conversation,
              lastMessage:{
                ...conversation.lastMessage,
                seen: true
              }
            }
          }
          return conversation
        })
        return updatedConversations
      })
    })
  }, [socket, setConversations])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/");
        const data = await res.json();

        if(data.error)
          return showToast("Error", data.error, "error")
        
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setLoadingConversations(false);
      }
    };
    
    getConversations();
  }, [showToast, setConversations]);
  
  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingConversation(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();

      if(searchedUser.error) return showToast("Error", searchedUser.error, "error");

      const messagingYourself = searchedUser._id === currentUser._id
      if(messagingYourself) 
        return showToast("Error", "You can't message yourself", "error");
      
			const conversationAlreadyExists = conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id);
			if (conversationAlreadyExists) 
        return setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});

      const mockConversation = {
        mock: true,
        _id:Date.now(),
        lastMessage: {
          text: "",
          sender: ""
        },
        participants: [{
          _id: searchedUser._id,
          username: searchedUser.username,
          profilePic: searchedUser.profilePic,
        }]
      }

      // setSearchText("");
      setConversations(prevConvs => [...prevConvs, mockConversation]);

    } catch (error) {
      showToast("Error", error.message, "error")
    } finally {
      setSearchingConversation(false)
    }
  }

  return (
    <Box position={"absolute"} left={"50%"} p={4} w={{ base: "100%", md: "80%", lg: "750px"}} transform={"translateX(-50%)"}>
      <Flex gap={4} flexDirection={{base:"column", md:"row"}} maxW={{sm:"400px", md:"full"}} mx={"auto"}>
        <Flex flex={30} gap={2} flexDirection={"column"} maxW={{sm:"250px", md:"full"}} mx={"auto"}>
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input 
              placeholder='Search for a user'
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
              <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingConversation}>
                <SearchIcon/>
              </Button>
            </Flex>
          </form>

          {loadingConversations && 
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

            {!loadingConversations && (
              conversations.map((conversation, idx) => (
                <Conversation 
                  key={idx} 
                  conversation={conversation}
                  isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                />
              ))
            )}
        </Flex>

        {!selectedConversation._id && (          
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100}/>
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && (
          <MessageContainer />
        )}       
    
      </Flex>
    </Box>
  )
}

export default Chatpage