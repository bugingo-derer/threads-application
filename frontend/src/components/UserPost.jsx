import { Link } from "react-router-dom";
import { Avatar, Flex, Box, SimpleGrid, Image, Text } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions.jsx";
import { useState } from "react";

const UserPost = ({ likes, replies, postImage, postTitle }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Flex gap={3} mb={4} py={5}>
      {/* Profile Section */}
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar size={"md"} name={"Sun Jin Woo"} src={"/sunjin-avatar.jpg"} />
        <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
        <SimpleGrid columns={3} spacing={0} justifyContent="center">
          <Avatar size={"xs"} name={"haein"} src={"/likes/chahaein.jpg"} m={1} />
          <Avatar size={"xs"} name={"jinah"} src={"/likes/sunjinah.jpg"} m={1} />
          <Avatar size={"xs"} name={"parkkyu"} src={"/likes/Parkkyunghye.jpg"} m={1} />
          <Avatar size={"xs"} name={"beru"} src={"/likes/beru.jpg"} m={1} />
          <Avatar size={"xs"} name={"ilhwan"} src={"/likes/Sungilhwan.jpg"} m={1} />
        </SimpleGrid>
      </Flex>

      {/* Post Content */}
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>sunjinwoo</Text>
            <Image src='/verified.png' w={4} h={4} ml={1} />
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
            <Menu>
              <MenuButton as={Box} cursor={"pointer"}>
                <BsThreeDots />
              </MenuButton>
              <MenuList bg={"gray.dark"} p={2}>
                {["Download", "Create a Copy", "Delete"].map((item) => (
                  <MenuItem key={item} bg={"gray.dark"} _hover={{ bg: "gray.800", border: "1px solid", borderColor: "gray.light", borderRadius: "10px",}}>
                  {item}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Link to={"/sunjinwoo/posts/1"}>
          <Text fontSize={"sm"}>{postTitle}</Text>
          {postImage && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={postImage} w={"full"} />
            </Box>
          )}
        </Link>

        {/* Actions Section */}
        {/* <Flex gap={3} my={1}>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex> */}

        {/* Post Stats */}
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize={"sm"}>{likes + (liked ? 1 : 0 )} likes</Text>
          <Box borderRadius={"full"} w={1} h={1} bg={"gray.light"}></Box>
          <Text color={"gray.light"} fontSize={"sm"}>{replies} posts</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserPost;
