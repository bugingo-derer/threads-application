import { Flex, Avatar, Image, Text, Box, Divider, Button, Spinner } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions.jsx";
import { useEffect, useState } from "react";
import Comment from "../components/comment.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import useShowToast from "../hooks/useShowToast.js";
import { formatDistanceToNowStrict } from "date-fns"
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/PostsAtom.js";

const Postpage = () => {
  const {user, loading} = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];
  useEffect(() => {
    const getPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json()
        if(data.error) return showToast("Error", data.error, "error")
        setPosts([data]);
      } catch (error) {
        return showToast("Error", error.message, "error");
      }
    }
    getPosts()
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

  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"md"} />
      </Flex>
    )
  }

  if(!currentPost) return;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Sun Jin Woo"/>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={4}/>
          </Flex>
        </Flex> 

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatDistanceToNowStrict (new Date(currentPost?.createdAt), { addSuffix: true, roundingMethod: "floor" })}
          </Text>
          {currentUser?._id === user?._id && <DeleteIcon onClick={handleDeletePost} cursor={"pointer"} size={20}/>}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost?.text}</Text>

      {currentPost?.img && 
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost?.img} w={"full"}/>
        </Box>
      }

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={6}/>
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>✌️</Text>
          <Text color={"gray.light"}>An app to like, post, reply and chat</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={6}/>

      {currentPost.replies.map(reply => (  
        <Comment key={reply._id} reply={reply} lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} />
      ))}

    </>
  );
};

export default Postpage