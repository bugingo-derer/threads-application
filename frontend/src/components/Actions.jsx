import {
  Button, useDisclosure, FormControl, Text,
  Input, Flex, Box,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/PostsAtom.js";
import { LikeSVG, ReplySVG } from "./icons"; 

const RepostSVG = () => (
  <svg aria-label='Repost' color='currentColor' fill='currentColor' height='20' role='img' viewBox='0 0 24 24' width='20'>
    <title>repost</title>
    <path d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'></path>
  </svg>
);

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id));
  const [reply, setReply] = useState("");
  const [isForwarding, setIsForwarding] = useState(false)

  const handleLike = async () => {
    if (!user) return showToast("Error", "You must log in to like a post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      let updatedPosts;
      if (!liked) {
        updatedPosts = posts.map((p) => {
          if (p._id === post._id) return { ...p, likes: [...p.likes, user._id] };
          return p;
        });
      } else {
        updatedPosts = posts.map((p) => {
          if (p._id === post._id) return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          return p;
        });
      }
      setPosts(updatedPosts);
      setLiked(!liked);
    } catch (error) {
      return showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user) return showToast("Error", "You must log in to reply to a post", "error");
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/posts/reply/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply })
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map(p => {
        if (p._id === post._id) return { ...p, replies: [...p.replies, data] };
        return p;
      });
      setPosts(updatedPosts);
      showToast("Success", "Reply sent successfully", "success");
      onClose();
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  const handleForwardPost = async () => {
    try {
      setIsForwarding(true)
      const res = await fetch(`/api/forwardPost/${post._id}`, {
        method: "POST",
        headers: {"Content-Type":"application/json"}
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      
      if(data.postedBy == posts[0].postedBy)setPosts(prev => [...prev, data]);
      
      console.log(posts);
      
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsForwarding(false)
    }
  }

  return (
    <Flex flexDirection={"column"} onClick={e => e.preventDefault()}>
      <Flex gap={3} my={2} cursor={"pointer"}>
        <LikeSVG liked={liked} onClick={handleLike} />
        <ReplySVG onClick={onOpen} />
        <RepostSVG onClick={handleForwardPost} disabled={isForwarding} _hover={{bg: "gray.dark"}}/>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.replies.length} {post.replies.length <= 1 ? "reply" : "replies"}
        </Text>
        <Box borderRadius={"full"} w={1} h={1} bg={"gray.light"} />
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.likes.length} {post.likes.length <= 1 ? "like" : "likes"}
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input type="text" placeholder="Reply goes here..." value={reply} onChange={(e) => setReply(e.target.value)}/>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" size="sm" mr={3} onClick={handleReply} isDisabled={isReplying || !reply.trim()} >
              {isReplying ? <Spinner size="md" /> : "Reply"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;