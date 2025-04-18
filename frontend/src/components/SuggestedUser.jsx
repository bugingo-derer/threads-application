import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import useFollowing from "../hooks/useFollowing.js";

const SuggestedUser = ({user}) => {
  const {handleFollowing, updating, following} = useFollowing(user);

  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic}/>
        <Box>
          <Text>{user.username}</Text>
          <Text>{user.name}</Text>
        </Box>
      </Flex>
      <Button size={"sm"} color={following ? "black" : "white"} bg={following ? "white" : "blue.400"} isLoading={updating} _hover={{ color: following ? "black" : "white", opacity: ".8"}} onClick={handleFollowing}>
        {following ? "unfollow" : "follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser