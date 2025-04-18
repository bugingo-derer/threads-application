import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggesstedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setSuggesstedUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight="bold">
        Suggested Users
      </Text>
      <Flex direction={{base: "row",md: "column",}} gap={4} overflowX={{base: "auto", md: "visible",}} sx={{scrollbarWidth: "none", "&::-webkit-scrollbar": {display: "none"}}}>
        {!loading &&
          suggestedUsers.map((user, index) => (
            <Box key={index} minW={{ base: "200px", md: "auto" }}>
              <SuggestedUser user={user} />
            </Box>
          ))}

        {loading &&
          Array(4).fill(0).map((_, idx) => (
            <Flex key={idx} gap={2} alignItems="center" p="1" borderRadius="md" minW={{ base: "200px", md: "auto" }}>
              <Box>
                <SkeletonCircle size="10" />
              </Box>
              <Flex w="full" flexDir="column" gap={2}>
                <Skeleton h="8px" w="80px" />
                <Skeleton h="8px" w="90px" />
              </Flex>
              <Flex>
                <Skeleton h="20px" w="60px" />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;