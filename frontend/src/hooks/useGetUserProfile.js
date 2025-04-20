import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if(data.error) return showToast("Error", data.error, "error")
        if(data.isFrozen) return setUser(null);
        
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error")
      } finally{
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast])
  
  return {loading, user}
}

export default useGetUserProfile