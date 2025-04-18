import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useFollowing = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();

  const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
  const [updating, setUpdating] = useState(false);

  const handleFollowing = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch(`/api/users/followUnfollow/${user?._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (result.error) return showToast("Error", result.error, "error");

      showToast("Success", result.message, "success");

      if (following) {
        user.followers = user.followers.filter(id => id !== currentUser._id);
      } else {
        user.followers = [...user.followers, currentUser._id];
      }

      setFollowing(!following);
    } catch (error) {
      showToast("Error", error.message || "Something went wrong", "error");
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowing, updating, following };
};

export default useFollowing;
