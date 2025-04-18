import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import UserHead from "../components/UserHead.jsx";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Posts.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import useShowToast from "../hooks/useShowToast.js";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/PostsAtom.js";

const Userpage = () => {
  const {user, loading} = useGetUserProfile();
  const {username} = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const showToast = useShowToast()

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

  if(!user && loading) return (
    <Flex justify="center" align="center" height="60vh">
      <Spinner size="md" />
    </Flex>
  )
  
  if(!user && !loading) return(
    <Flex justify="center" align="center" height="60vh">
      <h1>user not found</h1>
    </Flex>
  )
  
  return (
    <>
      <UserHead user={user} />


      {fetchingPosts && (
        <Flex justifyContent={"center"} my={2}>
          <Spinner size={"md"}/>
        </Flex>
      )}

      {!fetchingPosts && posts.length == 0 && (
        <h1 className="text-center p-20 text-xl text-mono text-bold">
          User has no posts.
        </h1>
      )}

      {!fetchingPosts && posts.map(post => {
        return <Post key={post._id} post={post} postedBy={post.postedBy} />
      })}
    </>
  )
}

export default Userpage