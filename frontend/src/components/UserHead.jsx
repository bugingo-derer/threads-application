import { VStack, Flex, Box, Text, Link, Button, Spinner } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/avatar"
import { Portal } from "@chakra-ui/portal";
import { Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/menu';
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom"
import useShowToast from "../hooks/useShowToast";
import useFollowing from "../hooks/useFollowing";
import {formatNumber} from "../utils/formatData.js";

const UserHead = ({user}) => {
   
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const {handleFollowing, updating, following} = useFollowing(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL)
    .then(() => showToast("URL", 'Copied to clipboard', 'success'))
    .catch(error => console.error("Failed to copy URL: ", error));
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>{user?.name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
              threads.next
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && (<Avatar name={user?.name} src={user?.profilePic} size={{ base: "md", md: "xl" }} />)}
          {!user?.profilePic && <Avatar name="beru beru" src="/avatar.png" size={{ base: "md", md: "xl" }} /> }
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"} _hover={{bg:'gray.light'}}>Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Link>
          <Button size={"sm"}  onClick={handleFollowing} bg={following ? "red.500" : "blue.500"} _hover={{ bg: following ? "red.700" : "blue.700" }} disabled={updating} _disabled={{ opacity: 0.6, cursor: "not-allowed" }}>
            {updating ? <Spinner size="md" /> : (following ? "Unfollow" : "follow")}
          </Button>
        </Link>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>
            {formatNumber(user?.followers.length)} {user?.followers.length > 1 ? ` followers`: ` follower`}
          </Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Text color={"gray.light"}>
            {formatNumber(user?.following.length)} following
          </Text>
        </Flex>

        <Flex>
          <Box className="w-10 h-10 p-2 rounded-full transition-colors duration-300 ease-in-out" _hover={{bg: 'gray.light'}}>
            <BsInstagram size={24} cursor={"pointer"}/>
          </Box>
          <Box className="w-10 h-10 p-2 rounded-full transition-colors duration-300 ease-in-out" _hover={{bg: 'gray.light'}}>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"} p={"10px"}>
                  <MenuItem bg = {"gray.dark"}_hover = {{ bg: "gray.800", border: "1px solid", borderColor: "gray.light", borderRadius: "10px" }} onClick={copyURL}>
                    copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} pb={3} color={"gray.light"} cursor={"pointer"}>
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHead