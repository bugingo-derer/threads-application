import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import { IoSendSharp } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';
import {
  conversationsAtom,
  selectedConversationAtom
} from '../atoms/conversationsAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg';

const MessageInput = forwardRef(({ setMessages }, ref) => {
  const [messageText, setMessageText] = useState('');
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [sending, setSending] = useState(false);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const replyFocusingMessageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (replyFocusingMessageRef.current && !sending) {
        replyFocusingMessageRef.current.focus();
        replyFocusingMessageRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        const preventFocusSteal = (e) => {
          if (e.target !== replyFocusingMessageRef.current) {
            e.preventDefault();
            replyFocusingMessageRef.current.focus();
          }
        };
        document.addEventListener('focusin', preventFocusSteal);
        setTimeout(() => {
          document.removeEventListener('focusin', preventFocusSteal);
        }, 1000);
        setTimeout(() => {
          if (document.activeElement !== replyFocusingMessageRef.current) {
            replyFocusingMessageRef.current.focus();
          }
        }, 600);
      } else {
        showToast("Error", 'Cannot focus: input is disabled or ref is not available', "error");
      }
    },
  }));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) {
      showToast('Warning', 'Please enter a message or select an image to send.', 'error');
      return;
    }
    if (sending) return;

    setSending(true);

    try {
      const res = await fetch('/api/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receipientId: selectedConversation.userId,
          message: messageText,
          img: imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) return showToast('Error', data.error, 'error');

      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) =>
        prevConvs.map((conversation) =>
          conversation._id === selectedConversation._id
            ? {
                ...conversation,
                lastMessage: { text: messageText, sender: data.sender },
              }
            : conversation
        )
      );

      setMessageText('');
      setImgUrl('');
    } catch (error) {
      showToast('Error', `Failed to send the message: ${error.message}`, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Flex gap={2} alignItems={'center'}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            ref={replyFocusingMessageRef}
            w={'full'}
            placeholder='Type text'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            isDisabled={sending}
          />
          <InputRightElement
            onClick={(e) => {
              e.preventDefault();
              handleSendMessage(e);
            }}
            cursor={'pointer'}
          >
            {sending ? <Spinner /> : <IoSendSharp color='green.500' />}
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex flex={5} cursor={'pointer'}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type={'file'} hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>

      <Modal isOpen={!!imgUrl} onClose={() => { onClose(); setImgUrl(''); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={'full'}>
              <Image src={imgUrl} alt='Preview' />
            </Flex>
            <Flex justifyContent={'flex-end'} my={2}>
              {sending ? (
                <Spinner size={'md'} />
              ) : (
                <IoSendSharp size={24} cursor={'pointer'} onClick={handleSendMessage} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
});

export default MessageInput;
