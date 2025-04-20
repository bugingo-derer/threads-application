import React, { useEffect, useState } from 'react'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Posts'
import { useRecoilState, useRecoilValue } from 'recoil'
import postsAtom from '../atoms/PostsAtom'
import SuggestedUser from '../components/SuggestedUsers.jsx'
import userAtom from '../atoms/userAtom.js'

const Homepage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getRandomPosts = async () => {

      try {
        const res1 = await fetch(`/api/users/profile/${currentUser._id}`);
        const user = await res1.json();
  
        if (user.error) return showToast("Error", user.error, "error");
        if (user.following.length > 0) return;
        
        const res2 = await fetch("/api/posts/randomPosts");
        const data = await res2.json();
        
        if(data.error) throw new Error(data.error);

        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
  
    getRandomPosts();
  }, [currentUser, showToast]);

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
