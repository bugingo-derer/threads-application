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
import { LikeSVG, ReplySVG, RepostSVG, ShareSVG } from "./icons"; 

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id));
  const [reply, setReply] = useState("");

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
    if (!user) return showToast("Error", "You must log in to reply a post", "error");
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
      return setReply("");
    } catch (error) {
      return showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Flex flexDirection={"column"} onClick={e => e.preventDefault()}>
      <Flex gap={3} my={2} cursor={"pointer"}>
        <LikeSVG liked={liked} onClick={handleLike} />
        <ReplySVG onClick={onOpen} />
        <RepostSVG />
        <ShareSVG />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>{post.replies.length}{post.replies.length <= 1 ? " reply" : " replies"}</Text>
        <Box borderRadius={"full"} w={1} h={1} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>{post.likes.length}{post.likes.length <= 1 ? " like" : " likes"}</Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input type="text" placeholder="Reply goes here..." value={reply} onChange={(e) => setReply(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" size="sm" mr={3} onClick={handleReply} isDisabled={isReplying}>
              {isReplying ? <Spinner size="md" /> : "Reply"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;