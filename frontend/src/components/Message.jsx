import { Avatar, Box, Flex, Text, Image, Skeleton, useDisclosure, Button, Spinner } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react'
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedConversationAtom } from '../atoms/conversationsAtom';
import userAtom from '../atoms/userAtom';
import { formatDate } from "../utils/formatData.js";
import { BsCheck2All } from 'react-icons/bs';
import useShowToast from '../hooks/useShowToast.js';

const Message = ({ message, ownMessage }) => {
  const [selectedConversation] = useRecoilState(selectedConversationAtom);
  const [user] = useRecoilState(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const time = formatDate(message?.createdAt).replace(/^about\s/, '');
  const showToast = useShowToast();
  const deletedMessageMessage = "This message was deleted";

  const [deleting, setDeleting] = useState(false);
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    setDeleting(false);

    try {
      const res = await fetch(`/api/messages/delete/${messageId}`, {
        method: "DELETE",
        headers: {"Content-Type":"application/json"},
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);

      showToast("Success", "message deleted successfully", "success");

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Flex 
      direction="column" 
      alignSelf={ownMessage ? 'flex-end' : 'flex-start'} 
      alignItems={ownMessage ? 'flex-end' : 'flex-start'} 
      gap={1} my={2} 
      onDoubleClick={onOpen}
    >
      <Flex gap={2} alignItems="flex-end">
        {!ownMessage && (<Avatar src={selectedConversation.userProfilePic} w="7" h="7" />)}
        <Flex direction="column" alignItems={ownMessage ? 'flex-end' : 'flex-start'}>
          {message.text && (
            <Flex 
              // className={`message-box ${ownMessage ? 'own-message' : 'other-message' }`} 
              className={`relative message-box ${message?.deleted? "" : (ownMessage ? 'own-message' : 'other-message')}`}
              bg={message?.deleted ? 'red.700' : (ownMessage ? 'green.800' : 'gray.400')}
              maxW="350px" p={2} 
              borderRadius="md" 
              color={ownMessage ? 'white' : 'black'} 
              position="relative"
            >
              <Text>
                {message.deleted ? deletedMessageMessage : message.text}
              </Text>
            </Flex>
          )}

          {message.img && (
            <Flex mt={2} maxW="200px">
              {!imgLoaded && !imgError && (<Skeleton w="200px" h="200px" borderRadius="md" />)}
              <Image 
                src={message.img} alt="Message Image" 
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

        {ownMessage && (<Avatar src={user.profilePic} w="7" h="7" />)}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='text-center'>message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex className='flex md:flex-col gap-2 justify-center mx-auto'>
              <Button className='w-[120px]' onClick={() => handleDeleteMessage(message._id)}>
                {deleting ? (<Spinner size={"sm"}/>) : "delete"}
              </Button>
              <Button className='w-[120px]'>reply</Button>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text fontSize="2xs" color="gray.500">{time}</Text>
    </Flex>
  );
};

export default Message;
