import { Flex, Avatar, Image, Text, Box, Divider, Button, Spinner } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions.jsx";
import { useEffect, useState } from "react";
import Comment from "../components/comment.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import useShowToast from "../hooks/useShowToast.js";
import { formatDate } from "../utils/formatData.js";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/PostsAtom.js";

const Postpage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];
  const [originalDeleted, setOriginalDeleted] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPosts();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      showToast("Success", data.message, "success");
      return navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  useEffect(() => {
    const checkOriginal = async () => {
      if (
        currentPost?.originalPostId &&
        currentPost?.originalPostId !== currentPost?._id
      ) {
        try {
          const res = await fetch(`/api/posts/${currentPost.originalPostId}`);
          const data = await res.json();
          if (res.status === 404 || data.error === "Post not found") {
            setOriginalDeleted(true);
          }
        } catch (err) {
          console.error("Error checking original post:", err);
          setOriginalDeleted(true);
        }
      }
    };
    if (currentPost) {
      checkOriginal();
    }
  }, [currentPost]);

  if (loading) {
    return (
      <Flex justifyContent={"center"} alignItems="center" h="100vh">
        <Spinner size={"md"} />
      </Flex>
    );
  }

  if (!currentPost) {
    return (
      <Flex justifyContent={"center"} alignItems="center" h="100vh">
        <Text>No post found</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" w="full" p={4}>
      <Flex w={"full"} alignItems={"center"} gap={3}>
        <Avatar src={user?.profilePic} size={"md"} name="Sun Jin Woo" />
        <Flex flexDir="column">
          <Flex alignItems="center" gap={2}>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
            <Image src="/verified.png" w={4} h={4} />
          </Flex>
          {currentPost.originalPostId && currentPost.originalPostId !== currentPost._id && (
            <Flex alignItems="center" gap={2}>
              <Text fontSize="xs">shared story</Text>
              {originalDeleted && (<Text fontSize="2xs" color="red.400">original story no longer available</Text>)}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Flex gap={4} alignItems={"center"} mt={2}>
        <Text fontSize={"sm"} color={"gray.light"}>
          {formatDate(currentPost?.createdAt)}
        </Text>
        {currentUser?._id === user?._id && user && (<DeleteIcon onClick={handleDeletePost} cursor={"pointer"} />)}
      </Flex>

      <Text my={3}>{currentPost?.text}</Text>

      {currentPost?.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost?.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={6} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>✌️</Text>
          <Text color={"gray.light"}>An app to like, post, reply and chat</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={6} />

      {currentPost.replies?.map((reply) => (<Comment key={reply._id} reply={reply} lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}/>))}
    </Flex>
  );
};

export default Postpage;
