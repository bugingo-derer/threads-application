import React, { useEffect, useState } from 'react'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Posts'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/PostsAtom'
import SuggestedUser from '../components/SuggestedUsers.jsx'

const Homepage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      try {
        setLoading(true);
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if (data.error) return showToast("Error", data.error, "error");
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems="flex-start" direction={{base: "column", md: "row"}}>
      <Box flex={30} order={{ base: 1, md: 2 }} w="full">
        <SuggestedUser />
      </Box>

      <Box flex={70} order={{ base: 2, md: 1 }} w="full">
        {!loading && posts.length === 0 && <h1>Follow some users to see feed</h1>}
        {loading && (
          <Flex justifyContent="center">
            <Spinner size="md" />
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
    </Flex>
  )
}

export default Homepage
