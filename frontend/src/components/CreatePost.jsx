import { AddIcon } from "@chakra-ui/icons";
import { Button, useBreakpointValue, useColorModeValue, useDisclosure,
  FormControl, Textarea, Text, Input, Flex, Image, CloseButton, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs"
import usePreviewImg from "../hooks/usePreviewImg";
import userAtom from "../atoms/userAtom.js"
import { useRecoilState, useRecoilValue } from 'recoil'
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/PostsAtom.js";
import { useParams } from "react-router-dom";


const MAX_CHAR = 500;

const CreatePost = () => {
  const showText = useBreakpointValue({ base: false, md: true });
  const showIcon = useBreakpointValue({ base: true, md: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState('');
  const { handleImageChange, imgUrl, setImgUrl}  = usePreviewImg();
  const imgRef = useRef(null);
  const [remainingChars, setRemainingChars] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams()

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if(inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChars(0);
    } else {
      setPostText(inputText);
      setRemainingChars(MAX_CHAR - inputText.length);
    }
  }

  const handleCreatePost = async () => {
    try {
      setIsPosting(true);      
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl})
      });
  
      const data = await res.json();
      if(data.error) return showToast("Error", data.error, "error");
  
      showToast("Success", "Post created successfully", "success");
      if(username === user.username){
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText("");
      setImgUrl("")
    } catch (error) {
      showToast("Error", error,"error");
    } finally {
      setIsPosting(false);
    }
  }
  
  return (
    <>
      <Button 
        onClick={onOpen} position={"fixed"} right={10} bottom={10} size={"lg"} 
        rightIcon={showIcon ? <AddIcon /> : null} bg={useColorModeValue("gray.300", "gray.dark")}
      >
        {showText && <span>create post</span>}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          
          <ModalHeader>Create a Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea placeholder="Post content goes here..." onChange={handleTextChange} value={postText} />
              <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.800"}>
                {remainingChars}/{MAX_CHAR}
              </Text>
              <Input type="file" hidden ref={imgRef} onChange={handleImageChange}/>
              <BsFillImageFill style={{marginLeft:"50px", cursor: "pointer"}} size={16} onClick={() => imgRef.current.click()}/>
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected Image" objectFit="cover" w="full" h="full" />
                <CloseButton onClick={() => {setImgUrl("");}} bg={"gray.800"} position={"absolute"} top={2} right={2}/>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost}>
              {isPosting ? <Spinner size="xl" /> :"Post"}
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
