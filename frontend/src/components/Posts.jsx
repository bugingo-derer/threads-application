import { Link, useNavigate } from "react-router-dom";
import { Avatar, Flex, Box, SimpleGrid, Image, Text } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions.jsx";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { formatDistanceToNowStrict } from "date-fns"
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import postsAtom from "../atoms/PostsAtom.js";

const Post = ({ post, postedBy   }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom)
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          showToast("Error", data.error || "Something went wrong", "error");
        }
      } catch (error) {
        showToast("Error", "Failed to fetch user data", "error");
      }
    };
    getUser();
  }, [postedBy, showToast, post]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      if(!window.confirm("Are you sure you want to delete this post")) return;

      const res = await fetch(`api/posts/${post._id}`, {
        method: "DELETE",
      })

      const data = res.json()
      if(data.error) return showToast("Error", data.error, "error");

      showToast("Success", data.message || "Post deleted successfully", "success");
      setPosts(posts.filter((p) => p._id !== post._id))

    } catch (error) {
      return showToast("Error", message.error, "error")
    }
  }

  return (
    <Link to={`/${user?.username}/posts/${post?._id}`}>
      <Flex gap={3} mb={4} py={5}>
        
        <Flex flexDirection={"column"} alignItems={"center"} onClick={(e) => { e.preventDefault(); if (user) navigate(`/${user.username}`); } }>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic} />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <SimpleGrid columns={post?.replies.length >= 3 ? 3 : (post?.replies.length%3)} spacing={0} justifyContent="center">
            {post?.replies.length === 0 && (<Text textAlign={"center"} fontSize={"2xl"}>😭</Text>)}
            {post?.replies.slice(0, 3).map((reply, index) => (
              <Avatar key={index} size={"xs"} name={reply?.username} src={reply?.userProfilePic} m={1} />
            ))}
          </SimpleGrid>
          
        </Flex>

        {/* Post Content */}
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex alignItems={"center"} mb={"20px"} onClick={(e) => { e.preventDefault(); if (user) navigate(`/${user.username}`); }}>
              <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {formatDistanceToNowStrict (new Date(post?.createdAt), { 
                  addSuffix: true, 
                  roundingMethod: "floor" 
                })}
              </Text>
              {currentUser?._id === user?._id && <DeleteIcon onClick={handleDeletePost}/>}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post?.text}</Text>
          {post?.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={post?.img} w={"full"} />
            </Box>
          )}

          {/* Actions Section */}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;