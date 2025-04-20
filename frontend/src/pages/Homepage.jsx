import React, { useEffect, useState, useCallback } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Posts';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/PostsAtom';
import SuggestedUser from '../components/SuggestedUsers.jsx';
import userAtom from '../atoms/userAtom.js';

const Homepage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);

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

  const fetchMorePosts = useCallback(async () => {
    try {
      setFetchingMore(true);
      const res = await fetch("/api/posts/randomPosts");
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setPosts(prev => [...prev, ...data]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setFetchingMore(false);
    }
  }, [setPosts, showToast]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        if (!fetchingMore) fetchMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMorePosts, fetchingMore]);

  return (
    <Flex gap={10} alignItems="flex-start" direction={{ base: "column", md: "row" }}>
      <Box flex={30} order={{ base: 1, md: 2 }} w="full">
        <SuggestedUser />
      </Box>

      <Box flex={70} order={{ base: 2, md: 1 }} w="full">
        {loading ? (
          <Flex justifyContent="center">
            <Spinner size="md" />
          </Flex>
        ) : (
          posts.map((post, idx) => (
            <Post key={idx} post={post} postedBy={post.postedBy} />
          ))
        )}

        {fetchingMore && (
          <Flex justifyContent="center" mt={4}>
            <Spinner size="sm" />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Homepage;
