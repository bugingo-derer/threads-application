import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/conversationsAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { useState, useEffect, useRef } from "react";
import messageSound from "../assets/sounds/message.mp3"

const MessageContainer = () => {
  const showToast = useShowToast();
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();

  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const [, setConversations ] = useRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
  
    const handleNewMessage = (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
  
        if (!document.hasFocus()) {
          console.log(document.hasFocus());
          const sound = new Audio(messageSound);
          sound.play();
        }
      }
  
      setConversations(prev =>
        prev.map(conversation =>
          conversation._id === message.conversationId
            ? {
                ...conversation,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              }
            : conversation
        )
      );
    };
  
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, setConversations, selectedConversation]);
  
  
  useEffect(()=> {
    const lastMessageIsFromOtherUser = messages.length && messages[messages.length-1].sender !== currentUser._id 
    if(lastMessageIsFromOtherUser){
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId
      })
    }

    socket.on("messageSeen", ({conversationId}) => {
      if(selectedConversation._id === conversationId){
        setMessages(prev => {
          const updateMessages = prev.map(message => {
            if(!message.seen){
              return {
                ...message,
                seen: true
              }
            }
            return message
          })
          return updateMessages
        })
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    const getMessages = async () => {
      setMessages([]);
      try {
        if (selectedConversation.mock) return;

        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");

        if (isMounted) setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    getMessages();
    return () => {
      isMounted = false;
    };
  }, [selectedConversation.userId]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}
          <Image src="./verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={"2"}
        height={"400px"}
        overflowY={"auto"}
      >
        {loadingMessages &&
          [...Array(50)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

          {!loadingMessages &&
            messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              return (
                <Flex key={message._id} direction="column" ref={isLastMessage ? messageEndRef : null}>
                  <Message message={message} ownMessage={currentUser._id === message.sender}/>
                </Flex>
              );
            })}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
